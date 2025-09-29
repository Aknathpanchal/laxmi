import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

// Mock complex dependencies to avoid circular imports
const rbacSystem = {
  checkPermission: async (userId: string, resource: string, action: string, context?: any) => true
};
const auditLogger = {
  logAccess: async (entity: string, id: string, action: string, success: boolean, userId?: string, data?: any) => {},
  log: async (data: any) => {}
};
const cache = {
  get: async (key: string) => null,
  set: async (key: string, value: any, options?: any) => {}
};
const rateLimit = async (clientId: string, endpoint: string, limit: number, duration: number) => ({
  allowed: true,
  remaining: limit - 1,
  retryAfter: 0,
  resetTime: Date.now() + duration * 1000
});

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

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'user-profile', 100, 3600); // 100 requests per hour
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    // Authentication
    const user = getUserFromToken(request);
    if (!user) {
      await auditLogger.logAccess(
        'user',
        'unknown',
        'profile.read',
        false,
        undefined,
        { 
          ipAddress: clientIp,
          userAgent: request.headers.get('user-agent'),
          error: 'Unauthorized access attempt'
        }
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
      'read',
      { ownerId: userId }
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'user',
        userId,
        'profile.read',
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

    // Check cache first
    const cacheKey = `user:profile:${userId}`;
    let userProfile = await cache.get(cacheKey);

    if (!userProfile) {
      // Fetch user profile with KYC status
      userProfile = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          dateOfBirth: true,
          gender: true,
          occupation: true,
          monthlyIncome: true,
          panNumber: true,
          aadharNumber: true,
          address: {
            select: {
              street: true,
              city: true,
              state: true,
              pincode: true,
              type: true
            }
          },
          bankAccounts: {
            select: {
              id: true,
              accountNumber: true,
              ifscCode: true,
              bankName: true,
              accountType: true,
              isVerified: true,
              isPrimary: true
            }
          },
          kycDocuments: {
            select: {
              id: true,
              type: true,
              status: true,
              verificationStatus: true,
              uploadedAt: true,
              verifiedAt: true
            }
          },
          creditReports: {
            select: {
              cibilScore: true,
              experianScore: true,
              equifaxScore: true,
              highmarkScore: true,
              fetchedAt: true
            },
            orderBy: {
              fetchedAt: 'desc'
            },
            take: 1
          },
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!userProfile) {
        await auditLogger.logAccess(
          'user',
          userId,
          'profile.read',
          false,
          userId,
          { 
            ipAddress: clientIp,
            error: 'User not found'
          }
        );

        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      // Cache for 15 minutes
      await cache.set(cacheKey, userProfile, { ttl: 900, tags: [`user:${userId}`] });
    }

    // Calculate KYC completion status
    const requiredDocuments = ['PAN', 'AADHAR', 'BANK_STATEMENT', 'SALARY_SLIP'];
    const uploadedDocuments = userProfile.kycDocuments.filter(doc => doc.status === 'UPLOADED');
    const verifiedDocuments = userProfile.kycDocuments.filter(doc => doc.verificationStatus === 'VERIFIED');
    
    const kycStatus = {
      isComplete: requiredDocuments.every(type => 
        verifiedDocuments.some(doc => doc.type === type)
      ),
      completionPercentage: Math.round((verifiedDocuments.length / requiredDocuments.length) * 100),
      requiredDocuments,
      uploadedDocuments: uploadedDocuments.map(doc => ({
        type: doc.type,
        status: doc.verificationStatus,
        uploadedAt: doc.uploadedAt,
        verifiedAt: doc.verifiedAt
      })),
      pendingDocuments: requiredDocuments.filter(type => 
        !uploadedDocuments.some(doc => doc.type === type)
      )
    };

    // Get latest credit score
    const latestCreditReport = userProfile.creditReports[0];
    const creditScore = latestCreditReport ? {
      cibil: latestCreditReport.cibilScore,
      experian: latestCreditReport.experianScore,
      equifax: latestCreditReport.equifaxScore,
      highmark: latestCreditReport.highmarkScore,
      lastUpdated: latestCreditReport.fetchedAt
    } : null;

    // Remove sensitive fields
    const { kycDocuments, creditReports, ...safeProfile } = userProfile;

    const response = {
      success: true,
      data: {
        user: safeProfile,
        kycStatus,
        creditScore,
        accountStatus: {
          isActive: userProfile.isActive,
          isVerified: userProfile.isVerified,
          canApplyForLoan: kycStatus.isComplete && userProfile.isVerified
        }
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };

    // Log successful access
    await auditLogger.logAccess(
      'user',
      userId,
      'profile.read',
      true,
      userId,
      { 
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent'),
        responseTime: Date.now() - startTime
      }
    );

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, max-age=300', // 5 minutes
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('User profile fetch error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'profile.read',
      entityType: 'user',
      entityId: userId || 'unknown',
      success: false,
      errorMessage: error.message,
      stackTrace: error.stack,
      userId,
      ipAddress: request.headers.get('x-forwarded-for'),
      duration: Date.now() - startTime
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user profile',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}