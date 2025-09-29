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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  let userId: string | undefined;
  const { id: loanId } = await params;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'loan-details', 50, 3600); // 50 requests per hour
    
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
            'X-RateLimit-Limit': '50',
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
        'unauthorized_loan_access',
        'medium',
        { 
          ipAddress: clientIp, 
          userAgent: request.headers.get('user-agent'),
          loanId
        }
      );

      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = user.userId;

    // Validate loan ID format
    if (!loanId || typeof loanId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid loan ID' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `loan:details:${loanId}:${userId}`;
    let loanData = await cache.get(cacheKey);

    if (!loanData) {
      // Fetch loan with comprehensive details
      const loan = await prisma.loan.findUnique({
        where: { id: loanId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              mobile: true
            }
          },
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              category: true,
              type: true,
              features: true,
              terms: true
            }
          },
          emiSchedule: {
            orderBy: {
              emiNumber: 'asc'
            }
          },
          transactions: {
            orderBy: {
              createdAt: 'desc'
            },
            include: {
              metadata: true
            }
          },
          documents: {
            select: {
              id: true,
              type: true,
              status: true,
              fileName: true,
              uploadedAt: true,
              verificationStatus: true
            },
            orderBy: {
              uploadedAt: 'desc'
            }
          },
          collectionCases: {
            include: {
              activities: {
                orderBy: {
                  createdAt: 'desc'
                },
                take: 10
              },
              assignedAgent: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  mobile: true
                }
              }
            }
          },
          approvals: {
            include: {
              approvedBy: {
                select: {
                  id: true,
                  name: true,
                  role: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          bankAccount: {
            select: {
              id: true,
              accountNumber: true,
              ifscCode: true,
              bankName: true,
              accountHolderName: true
            }
          },
          guarantor: {
            select: {
              id: true,
              name: true,
              relationship: true,
              mobile: true,
              email: true
            }
          }
        }
      });

      if (!loan) {
        return NextResponse.json(
          { success: false, error: 'Loan not found' },
          { status: 404 }
        );
      }

      // Authorization - check if user can access this loan
      const hasPermission = await rbacSystem.checkPermission(
        userId,
        'loans',
        'read',
        { 
          ownerId: loan.userId,
          loanId: loan.id,
          branchId: loan.branchId,
          regionId: loan.regionId
        }
      );

      if (!hasPermission) {
        await auditLogger.logAccess(
          'loan',
          loanId,
          'read',
          false,
          userId,
          { 
            ipAddress: clientIp,
            error: 'Insufficient permissions',
            attemptedAccess: 'loan_details'
          }
        );

        return NextResponse.json(
          { success: false, error: 'Forbidden' },
          { status: 403 }
        );
      }

      // Calculate additional loan metrics
      const metrics = calculateLoanMetrics(loan);
      
      // Get related information
      const relatedData = await getRelatedLoanData(loan, userId);

      loanData = {
        loan: {
          ...loan,
          // Remove sensitive fields for non-owners
          user: loan.userId === userId ? loan.user : {
            id: loan.user.id,
            name: loan.user.name
          }
        },
        metrics,
        ...relatedData
      };

      // Cache for 10 minutes
      await cache.set(cacheKey, loanData, { 
        ttl: 600, 
        tags: [`loan:${loanId}`, `user:${userId}`] 
      });
    }

    // Parse query parameters for additional data
    const { searchParams } = new URL(request.url);
    const includeAuditTrail = searchParams.get('includeAuditTrail') === 'true';
    const includePredictions = searchParams.get('includePredictions') === 'true';

    // Add audit trail if requested and user has permission
    if (includeAuditTrail) {
      const canViewAudit = await rbacSystem.checkPermission(
        userId,
        'loans',
        'audit',
        { loanId }
      );

      if (canViewAudit) {
        loanData.auditTrail = await auditLogger.getEntityHistory('loan', loanId);
      }
    }

    // Add AI predictions if requested and user has permission
    if (includePredictions) {
      const canViewPredictions = await rbacSystem.checkPermission(
        userId,
        'analytics',
        'read',
        { loanId }
      );

      if (canViewPredictions) {
        loanData.predictions = await getLoanPredictions(loanId);
      }
    }

    // Log successful access
    await auditLogger.logAccess(
      'loan',
      loanId,
      'read',
      true,
      userId,
      { 
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent'),
        includeAuditTrail,
        includePredictions
      }
    );

    const response = {
      success: true,
      data: loanData,
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1',
        permissions: {
          canEdit: await rbacSystem.checkPermission(userId, 'loans', 'update', { loanId }),
          canApprove: await rbacSystem.checkPermission(userId, 'loans', 'approve', { loanId }),
          canDisburse: await rbacSystem.checkPermission(userId, 'loans', 'disburse', { loanId }),
          canViewAudit: await rbacSystem.checkPermission(userId, 'loans', 'audit', { loanId })
        }
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, max-age=600', // 10 minutes
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('Loan details fetch error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'loan.details',
      entityType: 'loan',
      entityId: loanId,
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
        error: 'Failed to fetch loan details',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate loan metrics
function calculateLoanMetrics(loan: any) {
  const now = new Date();
  
  // Calculate payment statistics
  const successfulPayments = loan.transactions?.filter((t: any) => 
    t.type === 'REPAYMENT' && t.status === 'SUCCESS'
  ) || [];
  
  const totalPaid = successfulPayments.reduce((sum: number, t: any) => sum + t.amount, 0);
  
  // Calculate EMI statistics
  const paidEmis = loan.emiSchedule?.filter((emi: any) => emi.status === 'PAID') || [];
  const pendingEmis = loan.emiSchedule?.filter((emi: any) => emi.status === 'PENDING') || [];
  const overdueEmis = loan.emiSchedule?.filter((emi: any) => 
    emi.status === 'OVERDUE' || (emi.status === 'PENDING' && emi.dueDate < now)
  ) || [];
  
  const nextEmi = pendingEmis.sort((a: any, b: any) => 
    a.dueDate.getTime() - b.dueDate.getTime()
  )[0];
  
  const overdueAmount = overdueEmis.reduce((sum: number, emi: any) => sum + emi.amount, 0);
  
  // Calculate days overdue
  const oldestOverdue = overdueEmis.sort((a: any, b: any) => 
    a.dueDate.getTime() - b.dueDate.getTime()
  )[0];
  
  const daysOverdue = oldestOverdue ? 
    Math.floor((now.getTime() - oldestOverdue.dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  // Calculate completion percentage
  const completionPercentage = loan.amount > 0 ? 
    Math.round((totalPaid / loan.amount) * 100) : 0;
  
  // Calculate payment behavior
  const onTimePayments = paidEmis.filter((emi: any) => {
    const payment = successfulPayments.find((p: any) => p.emiId === emi.id);
    return payment && payment.createdAt <= emi.dueDate;
  }).length;
  
  const paymentReliability = paidEmis.length > 0 ? 
    Math.round((onTimePayments / paidEmis.length) * 100) : 0;
  
  // Determine health status
  let healthStatus = 'HEALTHY';
  if (daysOverdue > 90) {
    healthStatus = 'NPA';
  } else if (daysOverdue > 30) {
    healthStatus = 'CRITICAL';
  } else if (daysOverdue > 0) {
    healthStatus = 'OVERDUE';
  }
  
  return {
    totalPaid,
    remainingAmount: loan.outstandingAmount,
    completionPercentage,
    daysOverdue,
    overdueAmount,
    healthStatus,
    nextEmi: nextEmi ? {
      amount: nextEmi.amount,
      dueDate: nextEmi.dueDate,
      daysUntilDue: Math.ceil((nextEmi.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    } : null,
    emiStats: {
      total: loan.emiSchedule?.length || 0,
      paid: paidEmis.length,
      pending: pendingEmis.length,
      overdue: overdueEmis.length
    },
    paymentStats: {
      totalPayments: successfulPayments.length,
      onTimePayments,
      paymentReliability,
      averagePaymentAmount: successfulPayments.length > 0 ? 
        totalPaid / successfulPayments.length : 0,
      lastPaymentDate: successfulPayments[0]?.createdAt || null
    },
    financials: {
      principal: loan.amount,
      interestRate: loan.interestRate,
      tenure: loan.tenure,
      emiAmount: loan.emiAmount,
      totalInterest: (loan.emiAmount * loan.tenure) - loan.amount,
      processingFee: loan.processingFee,
      totalCost: (loan.emiAmount * loan.tenure) + loan.processingFee
    }
  };
}

// Helper function to get related loan data
async function getRelatedLoanData(loan: any, userId: string) {
  const [similarLoans, userLoanHistory] = await Promise.all([
    // Find similar loans (same product, similar amount)
    prisma.loan.findMany({
      where: {
        productId: loan.productId,
        amount: {
          gte: loan.amount * 0.8,
          lte: loan.amount * 1.2
        },
        status: 'COMPLETED',
        id: { not: loan.id }
      },
      select: {
        id: true,
        amount: true,
        tenure: true,
        interestRate: true,
        status: true,
        completedAt: true
      },
      take: 5
    }),
    
    // Get user's other loans
    prisma.loan.findMany({
      where: {
        userId,
        id: { not: loan.id }
      },
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        product: {
          select: {
            name: true,
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })
  ]);

  return {
    similarLoans,
    userLoanHistory,
    recommendations: generateLoanRecommendations(loan, similarLoans)
  };
}

// Helper function to get AI predictions
async function getLoanPredictions(loanId: string) {
  // This would integrate with AI services
  // For now, return mock predictions
  return {
    prepaymentLikelihood: {
      probability: 0.3,
      confidence: 0.8,
      factors: ['Good payment history', 'Income growth', 'Low utilization']
    },
    defaultRisk: {
      probability: 0.05,
      confidence: 0.9,
      factors: ['Stable employment', 'Regular payments', 'Good credit score']
    },
    optimalPrepaymentTime: {
      month: 18,
      savings: 15000,
      reasoning: 'Interest savings vs opportunity cost analysis'
    }
  };
}

// Helper function to generate recommendations
function generateLoanRecommendations(loan: any, similarLoans: any[]) {
  const recommendations = [];
  
  // Prepayment recommendation
  if (loan.status === 'ACTIVE' && loan.outstandingAmount > 0) {
    const interestSavings = calculatePrepaymentSavings(loan);
    if (interestSavings > 10000) {
      recommendations.push({
        type: 'PREPAYMENT',
        priority: 'HIGH',
        title: 'Consider Prepayment',
        description: `You can save ₹${interestSavings.toLocaleString()} in interest by prepaying now`,
        action: 'Calculate prepayment amount'
      });
    }
  }
  
  // Top-up recommendation
  if (loan.status === 'ACTIVE' && loan.outstandingAmount < loan.amount * 0.5) {
    recommendations.push({
      type: 'TOP_UP',
      priority: 'MEDIUM',
      title: 'Top-up Loan Available',
      description: 'You may be eligible for additional funding at competitive rates',
      action: 'Check top-up eligibility'
    });
  }
  
  return recommendations;
}

// Helper function to calculate prepayment savings
function calculatePrepaymentSavings(loan: any): number {
  // Simplified calculation
  const remainingTenure = loan.emiSchedule?.filter((emi: any) => emi.status === 'PENDING').length || 0;
  const futureInterest = (loan.emiAmount * remainingTenure) - loan.outstandingAmount;
  return Math.max(0, futureInterest * 0.8); // Assuming 20% prepayment penalty
}