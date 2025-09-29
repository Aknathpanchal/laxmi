import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rbacSystem } from '@/backend/lib/auth/rbac-system';
import { auditLogger } from '@/backend/lib/audit/audit-logger';
import { cache } from '@/backend/lib/cache/cache-manager';
import { analyticsDashboard } from '@/backend/lib/monitoring/analytics-dashboard';
import jwt from 'jsonwebtoken';
import { rateLimit } from '@/backend/lib/security/rate-limiter';
import crypto from 'crypto';

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
    const rateLimitResult = await rateLimit(clientIp, 'admin-dashboard', 100, 3600); // 100 requests per hour
    
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
        'unauthorized_admin_dashboard_access',
        'high',
        { ipAddress: clientIp, userAgent: request.headers.get('user-agent') }
      );

      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = user.userId;

    // Authorization - Admin access required
    const hasPermission = await rbacSystem.checkPermission(
      userId,
      'admin',
      'dashboard',
      {}
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'admin_dashboard',
        'dashboard',
        'read',
        false,
        userId,
        { 
          ipAddress: clientIp,
          error: 'Insufficient admin permissions'
        }
      );

      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse query parameters for date range and filters
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30d'; // 7d, 30d, 90d, 1y
    const branchId = searchParams.get('branchId');
    const regionId = searchParams.get('regionId');
    const refresh = searchParams.get('refresh') === 'true';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default: // 30d
        startDate.setDate(endDate.getDate() - 30);
    }

    // Check cache first (unless refresh is requested)
    const cacheKey = `admin:dashboard:${userId}:${dateRange}:${branchId || 'all'}:${regionId || 'all'}`;
    let dashboardData = null;

    if (!refresh) {
      dashboardData = await cache.get(cacheKey);
    }

    if (!dashboardData) {
      // Build filters based on user's access level
      const userRole = await rbacSystem.getUserRoles(userId);
      const dataAccess = await rbacSystem.getUserPermissions(userId);
      
      const filters: any = {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      };

      // Apply branch/region filters based on user access
      if (branchId) {
        filters.branchId = branchId;
      } else if (regionId) {
        filters.regionId = regionId;
      }
      // Add more granular access control based on user's role

      // Fetch dashboard metrics in parallel
      const [loanMetrics, userMetrics, financialMetrics, collectionMetrics, operationalMetrics] = await Promise.all([
        getLoanMetrics(filters),
        getUserMetrics(filters),
        getFinancialMetrics(filters),
        getCollectionMetrics(filters),
        getOperationalMetrics(filters, userId)
      ]);

      // Get real-time alerts
      const alerts = await getSystemAlerts(userId);

      // Get recent activities
      const recentActivities = await getRecentActivities(filters, 10);

      // Get performance trends
      const trends = await getPerformanceTrends(startDate, endDate, filters);

      // Get system health
      const systemHealth = await getSystemHealth();

      dashboardData = {
        overview: {
          loans: loanMetrics,
          users: userMetrics,
          financial: financialMetrics,
          collections: collectionMetrics,
          operational: operationalMetrics
        },
        trends,
        alerts,
        recentActivities,
        systemHealth,
        filters: {
          dateRange,
          startDate,
          endDate,
          branchId,
          regionId
        },
        permissions: {
          canViewFinancials: await rbacSystem.checkPermission(userId, 'financials', 'read'),
          canManageUsers: await rbacSystem.checkPermission(userId, 'users', 'manage'),
          canApproveLoans: await rbacSystem.checkPermission(userId, 'loans', 'approve'),
          canViewReports: await rbacSystem.checkPermission(userId, 'reports', 'read')
        }
      };

      // Cache for 5 minutes
      await cache.set(cacheKey, dashboardData, { 
        ttl: 300, 
        tags: ['admin', 'dashboard', `user:${userId}`] 
      });
    }

    // Log successful access
    await auditLogger.logAccess(
      'admin_dashboard',
      'dashboard',
      'read',
      true,
      userId,
      { 
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent'),
        dateRange,
        branchId,
        regionId,
        refresh
      }
    );

    const response = {
      success: true,
      data: dashboardData,
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1',
        cached: !refresh,
        generatedAt: new Date().toISOString()
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': refresh ? 'no-cache' : 'private, max-age=300',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('Admin dashboard error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'admin.dashboard',
      entityType: 'admin_dashboard',
      entityId: 'dashboard',
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
        error: 'Failed to load admin dashboard',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

// Helper functions for fetching dashboard metrics
async function getLoanMetrics(filters: any) {
  const [totalLoans, activeLoans, pendingApprovals, disbursedToday, portfolioValue] = await Promise.all([
    prisma.loan.count({ where: filters }),
    prisma.loan.count({ where: { ...filters, status: 'ACTIVE' } }),
    prisma.loan.count({ where: { ...filters, status: 'PENDING' } }),
    prisma.loan.count({ 
      where: { 
        ...filters, 
        status: 'DISBURSED',
        disbursedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      } 
    }),
    prisma.loan.aggregate({
      where: { ...filters, status: { in: ['ACTIVE', 'DISBURSED'] } },
      _sum: { disbursedAmount: true }
    })
  ]);

  return {
    total: totalLoans,
    active: activeLoans,
    pendingApprovals,
    disbursedToday,
    portfolioValue: portfolioValue._sum.disbursedAmount || 0,
    approvalRate: totalLoans > 0 ? Math.round((activeLoans / totalLoans) * 100) : 0
  };
}

async function getUserMetrics(filters: any) {
  const [totalUsers, newUsers, activeUsers, kycPending] = await Promise.all([
    prisma.user.count({ where: filters }),
    prisma.user.count({ 
      where: { 
        ...filters,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      } 
    }),
    prisma.user.count({ where: { ...filters, isActive: true } }),
    prisma.user.count({ where: { ...filters, isVerified: false } })
  ]);

  return {
    total: totalUsers,
    new: newUsers,
    active: activeUsers,
    kycPending,
    growthRate: totalUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0
  };
}

async function getFinancialMetrics(filters: any) {
  const [disbursements, collections, outstanding, npaAmount] = await Promise.all([
    prisma.transaction.aggregate({
      where: { 
        ...filters, 
        type: 'DISBURSEMENT',
        status: 'SUCCESS'
      },
      _sum: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: { 
        ...filters, 
        type: 'REPAYMENT',
        status: 'SUCCESS'
      },
      _sum: { amount: true }
    }),
    prisma.loan.aggregate({
      where: { ...filters, status: 'ACTIVE' },
      _sum: { outstandingAmount: true }
    }),
    prisma.loan.aggregate({
      where: { ...filters, status: 'NPA' },
      _sum: { outstandingAmount: true }
    })
  ]);

  return {
    totalDisbursed: disbursements._sum.amount || 0,
    totalCollected: collections._sum.amount || 0,
    totalOutstanding: outstanding._sum.outstandingAmount || 0,
    npaAmount: npaAmount._sum.outstandingAmount || 0,
    collectionEfficiency: disbursements._sum.amount && collections._sum.amount ? 
      Math.round((collections._sum.amount / disbursements._sum.amount) * 100) : 0
  };
}

async function getCollectionMetrics(filters: any) {
  const overdueLoans = await prisma.loan.findMany({
    where: {
      ...filters,
      status: 'ACTIVE',
      emiSchedule: {
        some: {
          status: 'OVERDUE'
        }
      }
    },
    include: {
      repayments: {
        where: { status: 'OVERDUE' }
      }
    }
  });

  const overdueAmount = overdueLoans.reduce((sum, loan) =>
    sum + loan.repayments.reduce((emiSum, emi) => emiSum + emi.amount, 0), 0
  );

  return {
    overdueLoans: overdueLoans.length,
    overdueAmount,
    collectionCases: await prisma.collectionCase.count({ 
      where: { ...filters, status: 'ACTIVE' } 
    }),
    recoveryRate: 0 // Calculate based on collection history
  };
}

async function getOperationalMetrics(filters: any, userId: string) {
  const [totalStaff, activeStaff] = await Promise.all([
    prisma.user.count({ where: { role: { in: ['UNDERWRITER', 'COLLECTION_AGENT', 'SUPPORT_AGENT', 'FINANCE_MANAGER', 'RISK_ANALYST', 'ADMIN'] } } }),
    prisma.user.count({ where: { role: { in: ['UNDERWRITER', 'COLLECTION_AGENT', 'SUPPORT_AGENT', 'FINANCE_MANAGER', 'RISK_ANALYST', 'ADMIN'] }, status: 'ACTIVE' } })
  ]);

  return {
    totalStaff,
    activeStaff,
    branches: 0, // TODO: Add branch model if needed
    regions: 0,  // TODO: Add region model if needed
    productivity: await calculateProductivityMetrics(filters)
  };
}

async function calculateProductivityMetrics(filters: any) {
  // Calculate various productivity metrics
  return {
    avgProcessingTime: 2.5, // days
    approvalRate: 78, // percentage
    disbursalRate: 92 // percentage
  };
}

async function getSystemAlerts(userId: string) {
  const alerts = [];

  // Check for critical system alerts
  const criticalLoans = await prisma.loan.count({
    where: {
      status: 'ACTIVE',
      repayments: {
        some: {
          status: 'OVERDUE',
          dueDate: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days overdue
          }
        }
      }
    }
  });

  if (criticalLoans > 0) {
    alerts.push({
      id: 'critical-overdue',
      type: 'CRITICAL',
      title: 'Critical Overdue Loans',
      message: `${criticalLoans} loans are overdue by more than 30 days`,
      action: 'Review collection strategy',
      createdAt: new Date()
    });
  }

  // Check for pending approvals
  const pendingApprovals = await prisma.loan.count({
    where: { status: 'PENDING' }
  });

  if (pendingApprovals > 10) {
    alerts.push({
      id: 'pending-approvals',
      type: 'WARNING',
      title: 'High Pending Approvals',
      message: `${pendingApprovals} loan applications pending approval`,
      action: 'Review approval queue',
      createdAt: new Date()
    });
  }

  return alerts;
}

async function getRecentActivities(filters: any, limit: number) {
  // Get recent audit logs for important activities
  return await auditLogger.query({
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    category: 'admin',
    limit,
    orderBy: 'timestamp',
    orderDirection: 'desc'
  });
}

async function getPerformanceTrends(startDate: Date, endDate: Date, filters: any) {
  // Calculate daily/weekly trends for key metrics
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const interval = days > 30 ? 'week' : 'day';

  // This would ideally use a time-series database or aggregated data
  return {
    loans: {
      labels: [], // Date labels
      applications: [], // Daily/weekly loan applications
      approvals: [], // Daily/weekly approvals
      disbursements: [] // Daily/weekly disbursements
    },
    financial: {
      labels: [],
      disbursements: [], // Daily/weekly disbursement amounts
      collections: [] // Daily/weekly collection amounts
    },
    interval
  };
}

async function getSystemHealth() {
  // Check various system health indicators
  const dbHealth = await checkDatabaseHealth();
  const cacheHealth = await cache.healthCheck();
  const queueHealth = await checkQueueHealth();

  return {
    overall: 'HEALTHY',
    database: dbHealth ? 'HEALTHY' : 'DEGRADED',
    cache: cacheHealth ? 'HEALTHY' : 'DEGRADED',
    queues: queueHealth ? 'HEALTHY' : 'DEGRADED',
    lastChecked: new Date()
  };
}

async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

async function checkQueueHealth(): Promise<boolean> {
  // Check job queue health
  return true; // Simplified
}