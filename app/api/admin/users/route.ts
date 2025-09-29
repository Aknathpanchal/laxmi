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

// Validation schemas
const userFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  kycStatus: z.enum(['VERIFIED', 'PENDING', 'REJECTED']).optional(),
  userType: z.enum(['CUSTOMER', 'STAFF', 'ADMIN']).optional(),
  branchId: z.string().uuid().optional(),
  regionId: z.string().uuid().optional(),
  createdFrom: z.string().datetime().optional(),
  createdTo: z.string().datetime().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

const userActionSchema = z.object({
  action: z.enum(['ACTIVATE', 'DEACTIVATE', 'SUSPEND', 'UNSUSPEND', 'RESET_PASSWORD', 'CHANGE_ROLE']),
  userIds: z.array(z.string().uuid()).min(1).max(100),
  reason: z.string().min(5).max(500).optional(),
  newRoleId: z.string().uuid().optional(),
  notifyUsers: z.boolean().default(true)
});

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'admin-users', 100, 3600); // 100 requests per hour
    
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
      await auditLogger.logSecurity(
        'unauthorized_admin_users_access',
        'high',
        { ipAddress: clientIp, userAgent: request.headers.get('user-agent') }
      );

      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = user.userId;

    // Authorization - Admin users management access required
    const hasPermission = await rbacSystem.checkPermission(
      userId,
      'users',
      'read',
      {}
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'admin',
        'users',
        'read',
        false,
        userId,
        { 
          ipAddress: clientIp,
          error: 'Insufficient permissions for user management'
        }
      );

      return NextResponse.json(
        { success: false, error: 'User management access required' },
        { status: 403 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    // Create properly typed parameters
    const queryParams = {
      ...rawParams,
      page: rawParams.page ? parseInt(rawParams.page) : undefined,
      limit: rawParams.limit ? parseInt(rawParams.limit) : undefined
    };

    let filters;
    try {
      filters = userFiltersSchema.parse(queryParams);
    } catch (error: any) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid query parameters',
          details: error.errors
        },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `admin:users:${JSON.stringify(filters)}`;
    let usersData: any = await cache.get(cacheKey);

    if (!usersData) {
      // Build query filters
      const whereClause: any = {};

      // Apply search filter
      if (filters.search) {
        whereClause.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
          { mobile: { contains: filters.search } },
          { panNumber: { contains: filters.search, mode: 'insensitive' } }
        ];
      }

      // Apply status filters
      if (filters.status) {
        if (filters.status === 'ACTIVE') {
          whereClause.isActive = true;
          whereClause.isSuspended = false;
        } else if (filters.status === 'INACTIVE') {
          whereClause.isActive = false;
        } else if (filters.status === 'SUSPENDED') {
          whereClause.isSuspended = true;
        }
      }

      if (filters.kycStatus) {
        if (filters.kycStatus === 'VERIFIED') {
          whereClause.isVerified = true;
        } else if (filters.kycStatus === 'PENDING') {
          whereClause.isVerified = false;
        }
        // Add logic for REJECTED status based on KYC documents
      }

      if (filters.userType) {
        whereClause.userType = filters.userType;
      }

      if (filters.branchId) {
        whereClause.branchId = filters.branchId;
      }

      if (filters.regionId) {
        whereClause.regionId = filters.regionId;
      }

      // Date range filter
      if (filters.createdFrom || filters.createdTo) {
        whereClause.createdAt = {};
        if (filters.createdFrom) {
          whereClause.createdAt.gte = new Date(filters.createdFrom);
        }
        if (filters.createdTo) {
          whereClause.createdAt.lte = new Date(filters.createdTo);
        }
      }

      // Check user's data access permissions
      const userPermissions = await rbacSystem.getUserPermissions(userId);
      // Apply additional filters based on user's access level
      // This would be implemented based on your RBAC data access policies

      // Calculate pagination
      const skip = (filters.page - 1) * filters.limit;

      // Build order by clause
      const orderBy: any = {};
      orderBy[filters.sortBy] = filters.sortOrder;

      // Fetch users and total count
      const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          include: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
                city: true,
                state: true
              }
            },
            kyc: {
              select: {
                kycStatus: true,
                aadharVerified: true,
                panVerified: true
              }
            },
            loans: {
              select: {
                id: true,
                loanNumber: true,
                requestedAmount: true,
                status: true
              },
              take: 5,
              orderBy: {
                createdAt: 'desc'
              }
            }
          },
          orderBy,
          skip,
          take: filters.limit
        }),
        prisma.user.count({ where: whereClause })
      ]);

      // Process users data
      const processedUsers = users.map(user => {
        const kycStatus = user.kyc?.kycStatus || 'PENDING';

        const userStatus = user.status;

        const totalLoanAmount = user.loans.reduce((sum, loan) => sum + loan.requestedAmount, 0);
        const activeLoanCount = user.loans.filter(loan => loan.status === 'ACTIVE').length;

        return {
          id: user.id,
          name: user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Unknown',
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          status: userStatus,
          kycStatus,
          isVerified: user.emailVerified !== null,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt || null,
          city: user.profile?.city || null,
          state: user.profile?.state || null,
          loanSummary: {
            totalAmount: totalLoanAmount,
            activeLoans: activeLoanCount,
            totalLoans: user.loans.length
          },
          kycDocuments: 0, // TODO: Add document relation if needed
          riskScore: 0, // TODO: Implement calculateUserRiskScore
          tags: [] // TODO: Implement generateUserTags
        };
      });

      // Get summary statistics
      const summary = {
        total: totalCount,
        active: users.filter(u => u.status === 'ACTIVE').length,
        inactive: users.filter(u => u.status === 'INACTIVE').length,
        suspended: users.filter(u => u.status === 'SUSPENDED').length,
        verified: users.filter(u => u.emailVerified !== null).length,
        pendingKyc: users.filter(u => u.emailVerified === null).length,
        byUserType: {
          customers: users.filter(u => u.role === 'USER').length,
          staff: users.filter(u => ['UNDERWRITER', 'COLLECTION_AGENT', 'SUPPORT_AGENT', 'FINANCE_MANAGER', 'RISK_ANALYST'].includes(u.role)).length,
          admins: users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length
        }
      };

      usersData = {
        users: processedUsers,
        summary,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / filters.limit),
          hasNext: filters.page < Math.ceil(totalCount / filters.limit),
          hasPrev: filters.page > 1
        },
        filters
      };

      // Cache for 5 minutes
      await cache.set(cacheKey, usersData, { 
        ttl: 300, 
        tags: ['admin', 'users'] 
      });
    }

    // Log successful access
    await auditLogger.logAccess(
      'admin',
      'users',
      'read',
      true,
      userId,
      { 
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent'),
        filters,
        resultCount: usersData.users.length
      }
    );

    const response = {
      success: true,
      data: usersData,
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1',
        permissions: {
          canEdit: await rbacSystem.checkPermission(userId, 'users', 'update'),
          canDelete: await rbacSystem.checkPermission(userId, 'users', 'delete'),
          canChangeRoles: await rbacSystem.checkPermission(userId, 'users', 'change-role'),
          canSuspend: await rbacSystem.checkPermission(userId, 'users', 'suspend')
        }
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, max-age=300',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('Admin users fetch error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'admin.users.read',
      entityType: 'user',
      entityId: 'multiple',
      success: false,
      errorMessage: error.message,
      stackTrace: error.stack,
      userId,
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      duration: Date.now() - startTime
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  let actionData: any;

  try {
    // Rate limiting for bulk actions
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'admin-user-actions', 20, 3600); // 20 actions per hour
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded for user actions',
          retryAfter: rateLimitResult.retryAfter
        },
        { status: 429 }
      );
    }

    // Authentication
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = user.userId;

    // Parse and validate request body
    try {
      const body = await request.json();
      actionData = userActionSchema.parse(body);
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

    // Authorization check based on action
    const requiredPermission = getRequiredPermissionForAction(actionData.action);
    const hasPermission = await rbacSystem.checkPermission(
      userId,
      'users',
      requiredPermission,
      {}
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'admin',
        'users',
        actionData.action.toLowerCase(),
        false,
        userId,
        { 
          ipAddress: clientIp,
          error: `Insufficient permissions for action: ${actionData.action}`
        }
      );

      return NextResponse.json(
        { success: false, error: `Insufficient permissions for ${actionData.action}` },
        { status: 403 }
      );
    }

    // Validate target users exist and current user has access to them
    const targetUsers = await prisma.user.findMany({
      where: {
        id: { in: actionData.userIds }
      },
      include: {
        profile: true,
        kyc: true
      }
    });

    if (targetUsers.length !== actionData.userIds.length) {
      return NextResponse.json(
        { success: false, error: 'Some users not found' },
        { status: 404 }
      );
    }

    // Validate business rules for the action
    const validationResult = await validateUserAction(actionData, targetUsers, userId);
    if (!validationResult.valid) {
      return NextResponse.json(
        { success: false, error: validationResult.error },
        { status: 400 }
      );
    }

    // Execute the action
    const results = await executeUserAction(actionData, targetUsers, userId);

    // Invalidate relevant caches
    await cache.deleteByPattern('admin:users:*');
    await Promise.all(actionData.userIds.map((id: string) =>
      cache.deleteByTag(`user:${id}`)
    ));

    // Log the action
    await auditLogger.logAction(
      `bulk_user_${actionData.action.toLowerCase()}`,
      'user',
      actionData.userIds.join(','),
      {
        action: actionData.action,
        userCount: actionData.userIds.length,
        reason: actionData.reason,
        results
      },
      userId
    );

    const response = {
      success: true,
      data: {
        action: actionData.action,
        processedUsers: actionData.userIds.length,
        results,
        summary: {
          successful: results.filter((r: any) => r.success).length,
          failed: results.filter((r: any) => !r.success).length
        }
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
    console.error('Admin user action error:', error);

    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'admin.users.action',
      entityType: 'user',
      entityId: actionData?.userIds?.join(',') || 'unknown',
      success: false,
      errorMessage: error.message,
      userId,
      duration: Date.now() - startTime,
      customData: actionData
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to execute user action',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getRequiredPermissionForAction(action: string): string {
  const permissionMap: Record<string, string> = {
    'ACTIVATE': 'update',
    'DEACTIVATE': 'update',
    'SUSPEND': 'suspend',
    'UNSUSPEND': 'suspend',
    'RESET_PASSWORD': 'reset-password',
    'CHANGE_ROLE': 'change-role'
  };
  
  return permissionMap[action] || 'update';
}

async function validateUserAction(actionData: any, targetUsers: any[], performerId: string) {
  // Implement validation logic based on action type
  switch (actionData.action) {
    case 'CHANGE_ROLE':
      if (!actionData.newRoleId) {
        return { valid: false, error: 'New role ID required for role change' };
      }
      
      // Validate new role is a valid UserRole enum value
      const validRoles = ['USER', 'ADMIN', 'SUPER_ADMIN', 'COLLECTION_AGENT', 'UNDERWRITER', 'SUPPORT_AGENT', 'FINANCE_MANAGER', 'RISK_ANALYST'];
      if (!validRoles.includes(actionData.newRole)) {
        return { valid: false, error: 'Invalid role specified' };
      }

      // Check if performer can assign this role
      const canAssignRole = await rbacSystem.checkPermission(
        performerId,
        'users',
        'change-role',
        { targetRole: actionData.newRole }
      );
      
      if (!canAssignRole) {
        return { valid: false, error: 'Insufficient permissions to assign this role' };
      }
      
      break;
      
    case 'SUSPEND':
      // Check if any target users are higher level than performer
      const performerRoles = await rbacSystem.getUserRoles(performerId);
      // Implement hierarchy checking logic
      break;
  }
  
  return { valid: true };
}

async function executeUserAction(actionData: any, targetUsers: any[], performerId: string) {
  const results = [];
  
  for (const user of targetUsers) {
    try {
      let updateData: any = {};
      
      switch (actionData.action) {
        case 'ACTIVATE':
          updateData = { status: 'ACTIVE' };
          break;

        case 'DEACTIVATE':
          updateData = { status: 'INACTIVE' };
          break;

        case 'SUSPEND':
          updateData = { status: 'SUSPENDED', lockedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) };
          break;

        case 'UNSUSPEND':
          updateData = { status: 'ACTIVE', lockedUntil: null };
          break;

        case 'RESET_PASSWORD':
          // Generate new temporary password and send via email/SMS
          const tempPassword = generateTempPassword();
          updateData = {
            password: await hashPassword(tempPassword)
          };

          // Queue notification
          // await jobQueue.addJob('send-password-reset', {
          //   userId: user.id,
          //   tempPassword
          // });
          break;

        case 'CHANGE_ROLE':
          updateData = { role: actionData.newRole };
          break;
      }
      
      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: updateData
        });
      }
      
      results.push({
        userId: user.id,
        success: true,
        message: `${actionData.action} completed successfully`
      });
      
    } catch (error: any) {
      results.push({
        userId: user.id,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

function calculateUserRiskScore(user: any): number {
  // Implement risk scoring logic
  let score = 0;
  
  // Add points based on various factors
  if (!user.isVerified) score += 20;
  if (user.loans.some((loan: any) => loan.status === 'OVERDUE')) score += 30;
  if (user.kycDocuments.length === 0) score += 15;
  
  return Math.min(100, score);
}

function generateUserTags(user: any): string[] {
  const tags = [];
  
  if (user.isVerified) tags.push('KYC_VERIFIED');
  if (user.loans.length > 0) tags.push('BORROWER');
  if (user.loans.some((loan: any) => loan.status === 'ACTIVE')) tags.push('ACTIVE_BORROWER');
  if (user.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) tags.push('NEW_USER');
  
  return tags;
}

function generateTempPassword(): string {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}

async function hashPassword(password: string): Promise<string> {
  // Implement password hashing
  const bcrypt = require('bcryptjs');
  return await bcrypt.hash(password, 10);
}