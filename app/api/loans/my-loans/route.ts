import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rbacSystem } from '@/backend/lib/auth/rbac-system';
import { auditLogger } from '@/backend/lib/audit/audit-logger';
import { cache } from '@/backend/lib/cache/cache-manager';
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
    const rateLimitResult = await rateLimit(clientIp, 'my-loans', 100, 3600); // 100 requests per hour
    
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
        'unauthorized_loans_access',
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
      'loans',
      'read',
      { ownerId: userId }
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'loan',
        userId,
        'read',
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50); // Max 50 per page
    const includeTransactions = searchParams.get('includeTransactions') === 'true';
    const includeSchedule = searchParams.get('includeSchedule') === 'true';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    // Check cache first
    const cacheKey = `user:loans:${userId}:${status || 'all'}:${page}:${limit}:${includeTransactions}:${includeSchedule}:${sortBy}:${sortOrder}`;
    let loansData = await cache.get(cacheKey);

    if (!loansData) {
      // Build query filters
      const whereClause: any = {
        userId
      };

      if (status) {
        whereClause.status = status;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build order by clause
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;

      // Fetch loans with detailed information
      const [loans, totalCount] = await Promise.all([
        prisma.loan.findMany({
          where: whereClause,
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: true,
                type: true
              }
            },
            emiSchedule: includeSchedule ? {
              orderBy: {
                dueDate: 'asc'
              }
            } : false,
            transactions: includeTransactions ? {
              orderBy: {
                createdAt: 'desc'
              },
              take: 20 // Last 20 transactions
            } : false,
            documents: {
              select: {
                id: true,
                type: true,
                status: true,
                uploadedAt: true
              }
            },
            collectionCases: {
              where: {
                status: 'ACTIVE'
              },
              select: {
                id: true,
                stage: true,
                assignedTo: true,
                createdAt: true
              },
              take: 1
            }
          },
          orderBy,
          skip,
          take: limit
        }),
        prisma.loan.count({ where: whereClause })
      ]);

      // Process loans to add calculated fields
      const processedLoans = loans.map(loan => {
        // Calculate next EMI
        const nextEmi = loan.emiSchedule?.find(emi => emi.status === 'PENDING');
        
        // Calculate total paid amount
        const totalPaid = loan.transactions?.filter(t => 
          t.type === 'REPAYMENT' && t.status === 'SUCCESS'
        ).reduce((sum, t) => sum + t.amount, 0) || 0;

        // Calculate overdue amount
        const overdueEmis = loan.emiSchedule?.filter(emi => 
          emi.status === 'OVERDUE' || 
          (emi.status === 'PENDING' && emi.dueDate < new Date())
        ) || [];
        const overdueAmount = overdueEmis.reduce((sum, emi) => sum + emi.amount, 0);

        // Calculate days overdue
        const oldestOverdue = overdueEmis.sort((a, b) => 
          a.dueDate.getTime() - b.dueDate.getTime()
        )[0];
        const daysOverdue = oldestOverdue ? 
          Math.floor((Date.now() - oldestOverdue.dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

        // Calculate completion percentage
        const completionPercentage = loan.amount > 0 ? 
          Math.round((totalPaid / loan.amount) * 100) : 0;

        // Determine loan health status
        let healthStatus = 'HEALTHY';
        if (daysOverdue > 90) {
          healthStatus = 'NPA';
        } else if (daysOverdue > 30) {
          healthStatus = 'CRITICAL';
        } else if (daysOverdue > 0) {
          healthStatus = 'OVERDUE';
        }

        return {
          ...loan,
          calculated: {
            nextEmi: nextEmi ? {
              amount: nextEmi.amount,
              dueDate: nextEmi.dueDate,
              daysUntilDue: Math.ceil((nextEmi.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            } : null,
            totalPaid,
            remainingAmount: loan.outstandingAmount,
            overdueAmount,
            daysOverdue,
            completionPercentage,
            healthStatus,
            totalEmis: loan.emiSchedule?.length || 0,
            paidEmis: loan.emiSchedule?.filter(emi => emi.status === 'PAID').length || 0,
            pendingEmis: loan.emiSchedule?.filter(emi => emi.status === 'PENDING').length || 0,
            overdueEmis: overdueEmis.length,
            lastPaymentDate: loan.transactions?.find(t => 
              t.type === 'REPAYMENT' && t.status === 'SUCCESS'
            )?.createdAt || null,
            isInCollection: loan.collectionCases && loan.collectionCases.length > 0
          }
        };
      });

      // Calculate summary statistics
      const summary = {
        totalLoans: totalCount,
        activeLoans: processedLoans.filter(l => ['ACTIVE', 'DISBURSED'].includes(l.status)).length,
        completedLoans: processedLoans.filter(l => l.status === 'COMPLETED').length,
        overdueLoans: processedLoans.filter(l => l.calculated.daysOverdue > 0).length,
        totalBorrowed: processedLoans.reduce((sum, l) => sum + l.amount, 0),
        totalOutstanding: processedLoans.reduce((sum, l) => sum + l.outstandingAmount, 0),
        totalOverdue: processedLoans.reduce((sum, l) => sum + l.calculated.overdueAmount, 0),
        nextEmiAmount: processedLoans
          .filter(l => l.calculated.nextEmi)
          .reduce((sum, l) => sum + l.calculated.nextEmi!.amount, 0),
        nextEmiDate: processedLoans
          .filter(l => l.calculated.nextEmi)
          .sort((a, b) => a.calculated.nextEmi!.dueDate.getTime() - b.calculated.nextEmi!.dueDate.getTime())[0]
          ?.calculated.nextEmi?.dueDate || null
      };

      loansData = {
        loans: processedLoans,
        summary,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
        },
        filters: {
          status,
          includeTransactions,
          includeSchedule,
          sortBy,
          sortOrder
        }
      };

      // Cache for 5 minutes
      await cache.set(cacheKey, loansData, { 
        ttl: 300, 
        tags: [`user:${userId}`, 'loans'] 
      });
    }

    // Log successful access
    await auditLogger.logAccess(
      'loan',
      userId,
      'read',
      true,
      userId,
      { 
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent'),
        filters: { status, page, limit, includeTransactions, includeSchedule },
        resultCount: loansData.loans.length
      }
    );

    const response = {
      success: true,
      data: loansData,
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, max-age=300', // 5 minutes
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('My loans fetch error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'loans.my-loans',
      entityType: 'loan',
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
        error: 'Failed to fetch your loans',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}