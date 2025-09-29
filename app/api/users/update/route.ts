import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rbacSystem } from '@/backend/lib/auth/rbac-system';
import { auditLogger } from '@/backend/lib/audit/audit-logger';
import { cache } from '@/backend/lib/cache/cache-manager';
import jwt from 'jsonwebtoken';
import { rateLimit } from '@/backend/lib/security/rate-limiter';
import crypto from 'crypto';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface UserToken {
  userId: string;
  email: string;
  userType: string;
}

function getUserFromToken(request: NextRequest): UserToken | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as UserToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Validation schema for user updates
const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  mobile: z.string().regex(/^[6-9]\d{9}$/).optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  occupation: z.string().min(2).max(100).optional(),
  monthlyIncome: z.number().min(0).max(10000000).optional(),
  address: z.object({
    street: z.string().min(5).max(200),
    city: z.string().min(2).max(50),
    state: z.string().min(2).max(50),
    pincode: z.string().regex(/^\d{6}$/),
    type: z.enum(['PERMANENT', 'CURRENT'])
  }).optional(),
  emergencyContact: z.object({
    name: z.string().min(2).max(100),
    relationship: z.string().min(2).max(50),
    mobile: z.string().regex(/^[6-9]\d{9}$/),
    email: z.string().email().optional()
  }).optional()
});

export async function PUT(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  let updateData: any;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'user-update', 10, 3600); // 10 updates per hour
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Too many update attempts.',
          retryAfter: rateLimitResult.retryAfter
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    // Authentication
    const user = getUserFromToken(request);
    if (!user) {
      await auditLogger.logSecurity(
        'unauthorized_profile_update_attempt',
        'medium',
        { ipAddress: clientIp, userAgent: request.headers.get('user-agent') }
      );

      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = user.userId;

    // Authorization
    const hasPermission = await rbacSystem.checkPermission(
      userId,
      'profile',
      'update',
      { ownerId: userId }
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'user',
        userId,
        'profile.update',
        false,
        userId,
        { 
          ipAddress: clientIp,
          error: 'Insufficient permissions'
        }
      );

      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    try {
      const body = await request.json();
      updateData = updateUserSchema.parse(body);
    } catch (error: any) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data',
          details: error.errors || error.message
        },
        { status: 400 }
      );
    }

    // Get current user data for audit trail
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        address: true,
        emergencyContact: true
      }
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if mobile number is being changed and if it already exists
    if (updateData.mobile && updateData.mobile !== currentUser.mobile) {
      const existingUser = await prisma.user.findFirst({
        where: {
          mobile: updateData.mobile,
          id: { not: userId }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Mobile number already registered with another account' 
          },
          { status: 409 }
        );
      }

      // Mobile number change requires re-verification
      updateData.isVerified = false;
    }

    // Prepare update data
    const userUpdateData: any = {
      ...updateData,
      updatedAt: new Date()
    };

    // Remove nested objects for user table update
    const { address, emergencyContact, ...userFields } = userUpdateData;

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user record
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: userFields,
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          dateOfBirth: true,
          gender: true,
          occupation: true,
          monthlyIncome: true,
          isVerified: true,
          updatedAt: true
        }
      });

      // Update address if provided
      if (address) {
        if (currentUser.address.length > 0) {
          await tx.address.updateMany({
            where: {
              userId,
              type: address.type
            },
            data: {
              ...address,
              updatedAt: new Date()
            }
          });
        } else {
          await tx.address.create({
            data: {
              ...address,
              userId,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
        }
      }

      // Update emergency contact if provided
      if (emergencyContact) {
        if (currentUser.emergencyContact) {
          await tx.emergencyContact.update({
            where: { userId },
            data: {
              ...emergencyContact,
              updatedAt: new Date()
            }
          });
        } else {
          await tx.emergencyContact.create({
            data: {
              ...emergencyContact,
              userId,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
        }
      }

      return updatedUser;
    });

    // Invalidate user cache
    await cache.deleteByTag(`user:${userId}`);

    // Log the changes
    await auditLogger.logChange(
      'user',
      userId,
      {
        user: currentUser,
        address: currentUser.address,
        emergencyContact: currentUser.emergencyContact
      },
      {
        user: result,
        address: address || currentUser.address,
        emergencyContact: emergencyContact || currentUser.emergencyContact
      },
      userId
    );

    // Send notification if mobile number changed
    if (updateData.mobile && updateData.mobile !== currentUser.mobile) {
      // Queue verification SMS
      // jobQueue.addJob('send-verification-sms', {
      //   userId,
      //   mobile: updateData.mobile
      // });
    }

    const response = {
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: result,
        requiresVerification: updateData.mobile && updateData.mobile !== currentUser.mobile
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };

    return NextResponse.json(response, {
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('User profile update error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'profile.update',
      entityType: 'user',
      entityId: userId || 'unknown',
      success: false,
      errorMessage: error.message,
      stackTrace: error.stack,
      userId,
      ipAddress: request.headers.get('x-forwarded-for'),
      duration: Date.now() - startTime,
      customData: { updateData }
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update user profile',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  // Handle partial updates - same logic as PUT but more lenient validation
  return PUT(request);
}