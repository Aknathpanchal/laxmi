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
    const rateLimitResult = await rateLimit(clientIp, 'emi-schedule', 50, 3600); // 50 requests per hour
    
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
        'unauthorized_emi_schedule_access',
        'medium',
        { ipAddress: clientIp, userAgent: request.headers.get('user-agent') }
      );

      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = user.userId;

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const loanId = searchParams.get('loanId');
    const format = searchParams.get('format') || 'detailed'; // detailed, summary, downloadable
    const includeTransactions = searchParams.get('includeTransactions') === 'true';
    const includeProjections = searchParams.get('includeProjections') === 'true';
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const status = searchParams.get('status'); // PAID, PENDING, OVERDUE

    if (!loanId) {
      return NextResponse.json(
        { success: false, error: 'Loan ID is required' },
        { status: 400 }
      );
    }

    // Validate loan ID format
    if (typeof loanId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid loan ID format' },
        { status: 400 }
      );
    }

    // Authorization - check if user can access this loan
    const hasPermission = await rbacSystem.checkPermission(
      userId,
      'loans',
      'read',
      { loanId }
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'loan',
        loanId,
        'schedule.read',
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
    const cacheKey = `emi-schedule:${loanId}:${format}:${includeTransactions}:${includeProjections}:${status || 'all'}:${fromDate || ''}:${toDate || ''}`;
    let scheduleData = await cache.get(cacheKey);

    if (!scheduleData) {
      // Get loan details
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
              category: true,
              type: true
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

      // Check if user has access to this loan
      if (loan.userId !== userId) {
        const canViewOthers = await rbacSystem.checkPermission(
          userId,
          'loans',
          'read',
          { 
            branchId: loan.branchId,
            regionId: loan.regionId
          }
        );

        if (!canViewOthers) {
          return NextResponse.json(
            { success: false, error: 'Access denied' },
            { status: 403 }
          );
        }
      }

      // Build EMI schedule query
      const scheduleWhere: any = {
        loanId
      };

      if (status) {
        scheduleWhere.status = status;
      }

      if (fromDate || toDate) {
        scheduleWhere.dueDate = {};
        if (fromDate) {
          scheduleWhere.dueDate.gte = new Date(fromDate);
        }
        if (toDate) {
          scheduleWhere.dueDate.lte = new Date(toDate);
        }
      }

      // Fetch EMI schedule
      const emiSchedule = await prisma.eMISchedule.findMany({
        where: scheduleWhere,
        include: includeTransactions ? {
          transactions: {
            where: {
              type: 'REPAYMENT'
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        } : false,
        orderBy: {
          emiNumber: 'asc'
        }
      });

      // Process schedule data based on format
      let processedSchedule: any;
      
      switch (format) {
        case 'summary':
          processedSchedule = processSummarySchedule(emiSchedule, loan);
          break;
        case 'downloadable':
          processedSchedule = processDownloadableSchedule(emiSchedule, loan);
          break;
        default:
          processedSchedule = processDetailedSchedule(emiSchedule, loan, includeTransactions);
      }

      // Add projections if requested
      let projections = null;
      if (includeProjections) {
        projections = generateScheduleProjections(emiSchedule, loan);
      }

      scheduleData = {
        loan: {
          id: loan.id,
          amount: loan.amount,
          interestRate: loan.interestRate,
          tenure: loan.tenure,
          emiAmount: loan.emiAmount,
          outstandingAmount: loan.outstandingAmount,
          status: loan.status,
          disbursedAt: loan.disbursedAt,
          product: loan.product,
          user: loan.user
        },
        schedule: processedSchedule,
        projections,
        summary: generateScheduleSummary(emiSchedule, loan),
        filters: {
          format,
          includeTransactions,
          includeProjections,
          status,
          fromDate,
          toDate
        }
      };

      // Cache for 30 minutes
      await cache.set(cacheKey, scheduleData, { 
        ttl: 1800, 
        tags: [`loan:${loanId}`, 'emi-schedule'] 
      });
    }

    // Log successful access
    await auditLogger.logAccess(
      'emi_schedule',
      loanId,
      'read',
      true,
      userId,
      { 
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent'),
        format,
        filters: { status, fromDate, toDate },
        resultCount: scheduleData.schedule.length || scheduleData.schedule.emis?.length || 0
      }
    );

    const response = {
      success: true,
      data: scheduleData,
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1',
        format
      }
    };

    // Set appropriate headers based on format
    const headers: Record<string, string> = {
      'Cache-Control': 'private, max-age=1800', // 30 minutes
      'X-Response-Time': `${Date.now() - startTime}ms`,
      'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
    };

    if (format === 'downloadable') {
      headers['Content-Disposition'] = `attachment; filename="loan_${loanId}_schedule.json"`;
    }

    return NextResponse.json(response, { headers });

  } catch (error: any) {
    console.error('EMI schedule fetch error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'loans.schedule',
      entityType: 'emi_schedule',
      entityId: request.nextUrl.searchParams.get('loanId') || 'unknown',
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
        error: 'Failed to fetch EMI schedule',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

// Helper functions for processing different schedule formats
function processDetailedSchedule(emiSchedule: any[], loan: any, includeTransactions: boolean) {
  const currentDate = new Date();
  
  return emiSchedule.map(emi => {
    const daysUntilDue = Math.ceil((emi.dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = emi.status === 'PENDING' && emi.dueDate < currentDate;
    const daysOverdue = isOverdue ? Math.abs(daysUntilDue) : 0;

    const processedEmi: any = {
      id: emi.id,
      emiNumber: emi.emiNumber,
      dueDate: emi.dueDate,
      amount: emi.amount,
      principalAmount: emi.principalAmount,
      interestAmount: emi.interestAmount,
      outstandingPrincipal: emi.outstandingPrincipal,
      status: isOverdue ? 'OVERDUE' : emi.status,
      paidDate: emi.paidDate,
      paidAmount: emi.paidAmount,
      partialPayments: emi.partialPayments || 0,
      daysUntilDue: Math.max(0, daysUntilDue),
      daysOverdue,
      isOverdue,
      lateFee: emi.lateFee || 0,
      bounceCharges: emi.bounceCharges || 0,
      totalPayable: emi.amount + (emi.lateFee || 0) + (emi.bounceCharges || 0)
    };

    if (includeTransactions && emi.transactions) {
      processedEmi.transactions = emi.transactions.map((txn: any) => ({
        id: txn.id,
        amount: txn.amount,
        status: txn.status,
        channel: txn.channel,
        referenceNumber: txn.referenceNumber,
        createdAt: txn.createdAt,
        remarks: txn.remarks
      }));
    }

    return processedEmi;
  });
}

function processSummarySchedule(emiSchedule: any[], loan: any) {
  const paidEmis = emiSchedule.filter(emi => emi.status === 'PAID');
  const pendingEmis = emiSchedule.filter(emi => emi.status === 'PENDING');
  const overdueEmis = emiSchedule.filter(emi => 
    emi.status === 'PENDING' && emi.dueDate < new Date()
  );

  const nextEmi = pendingEmis.sort((a, b) => 
    a.dueDate.getTime() - b.dueDate.getTime()
  )[0];

  return {
    totalEmis: emiSchedule.length,
    paidEmis: paidEmis.length,
    pendingEmis: pendingEmis.length,
    overdueEmis: overdueEmis.length,
    completionPercentage: Math.round((paidEmis.length / emiSchedule.length) * 100),
    totalPaid: paidEmis.reduce((sum, emi) => sum + (emi.paidAmount || emi.amount), 0),
    totalPending: pendingEmis.reduce((sum, emi) => sum + emi.amount, 0),
    totalOverdue: overdueEmis.reduce((sum, emi) => sum + emi.amount, 0),
    nextEmi: nextEmi ? {
      emiNumber: nextEmi.emiNumber,
      dueDate: nextEmi.dueDate,
      amount: nextEmi.amount,
      daysUntilDue: Math.ceil((nextEmi.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    } : null,
    lastPaidEmi: paidEmis.length > 0 ? {
      emiNumber: paidEmis[paidEmis.length - 1].emiNumber,
      paidDate: paidEmis[paidEmis.length - 1].paidDate,
      amount: paidEmis[paidEmis.length - 1].paidAmount || paidEmis[paidEmis.length - 1].amount
    } : null
  };
}

function processDownloadableSchedule(emiSchedule: any[], loan: any) {
  return {
    loanDetails: {
      loanId: loan.id,
      amount: loan.amount,
      interestRate: loan.interestRate,
      tenure: loan.tenure,
      emiAmount: loan.emiAmount,
      generatedAt: new Date().toISOString()
    },
    emis: emiSchedule.map(emi => ({
      emiNumber: emi.emiNumber,
      dueDate: emi.dueDate.toISOString().split('T')[0],
      amount: emi.amount,
      principalAmount: emi.principalAmount,
      interestAmount: emi.interestAmount,
      outstandingPrincipal: emi.outstandingPrincipal,
      status: emi.status,
      paidDate: emi.paidDate?.toISOString().split('T')[0] || null,
      paidAmount: emi.paidAmount || null
    }))
  };
}

function generateScheduleSummary(emiSchedule: any[], loan: any) {
  const currentDate = new Date();
  const paidEmis = emiSchedule.filter(emi => emi.status === 'PAID');
  const pendingEmis = emiSchedule.filter(emi => emi.status === 'PENDING');
  const overdueEmis = emiSchedule.filter(emi => 
    emi.status === 'PENDING' && emi.dueDate < currentDate
  );

  const totalPrincipalPaid = paidEmis.reduce((sum, emi) => sum + emi.principalAmount, 0);
  const totalInterestPaid = paidEmis.reduce((sum, emi) => sum + emi.interestAmount, 0);
  const totalAmountPaid = totalPrincipalPaid + totalInterestPaid;

  const remainingPrincipal = pendingEmis.reduce((sum, emi) => sum + emi.principalAmount, 0);
  const remainingInterest = pendingEmis.reduce((sum, emi) => sum + emi.interestAmount, 0);
  const totalRemainingPayment = remainingPrincipal + remainingInterest;

  return {
    loan: {
      originalAmount: loan.amount,
      currentOutstanding: loan.outstandingAmount,
      totalInterest: (loan.emiAmount * loan.tenure) - loan.amount,
      totalCost: loan.emiAmount * loan.tenure
    },
    payment: {
      totalPaid: totalAmountPaid,
      principalPaid: totalPrincipalPaid,
      interestPaid: totalInterestPaid,
      remainingPayment: totalRemainingPayment,
      remainingPrincipal,
      remainingInterest
    },
    progress: {
      completionPercentage: Math.round((totalAmountPaid / (loan.emiAmount * loan.tenure)) * 100),
      timeBased: Math.round((paidEmis.length / emiSchedule.length) * 100),
      amountBased: Math.round((totalPrincipalPaid / loan.amount) * 100)
    },
    performance: {
      onTimePayments: calculateOnTimePayments(paidEmis),
      averageDelayDays: calculateAverageDelay(paidEmis),
      paymentReliabilityScore: calculateReliabilityScore(paidEmis, overdueEmis)
    }
  };
}

function generateScheduleProjections(emiSchedule: any[], loan: any) {
  const paidEmis = emiSchedule.filter(emi => emi.status === 'PAID');
  const pendingEmis = emiSchedule.filter(emi => emi.status === 'PENDING');
  
  if (paidEmis.length === 0) {
    return null;
  }

  // Calculate average payment behavior
  const averageDelayDays = calculateAverageDelay(paidEmis);
  const onTimePercentage = calculateOnTimePayments(paidEmis);

  // Project remaining schedule based on payment behavior
  const projectedSchedule = pendingEmis.map(emi => {
    const projectedPaymentDate = new Date(emi.dueDate);
    projectedPaymentDate.setDate(projectedPaymentDate.getDate() + averageDelayDays);

    return {
      emiNumber: emi.emiNumber,
      dueDate: emi.dueDate,
      projectedPaymentDate,
      expectedDelay: averageDelayDays,
      riskLevel: calculatePaymentRisk(emi, onTimePercentage)
    };
  });

  // Calculate projected completion date
  const lastProjectedPayment = projectedSchedule[projectedSchedule.length - 1];
  const projectedCompletionDate = lastProjectedPayment?.projectedPaymentDate;
  const scheduledCompletionDate = pendingEmis[pendingEmis.length - 1]?.dueDate;
  
  const delayInCompletion = projectedCompletionDate && scheduledCompletionDate ?
    Math.ceil((projectedCompletionDate.getTime() - scheduledCompletionDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return {
    projectedSchedule: projectedSchedule.slice(0, 6), // Next 6 EMIs
    insights: {
      averageDelayDays,
      onTimePercentage,
      projectedCompletionDate,
      delayInCompletion,
      riskFactors: identifyRiskFactors(paidEmis, pendingEmis)
    },
    recommendations: generatePaymentRecommendations(averageDelayDays, onTimePercentage)
  };
}

// Helper functions
function calculateOnTimePayments(paidEmis: any[]): number {
  if (paidEmis.length === 0) return 100;
  
  const onTimeCount = paidEmis.filter(emi => 
    emi.paidDate && emi.paidDate <= emi.dueDate
  ).length;
  
  return Math.round((onTimeCount / paidEmis.length) * 100);
}

function calculateAverageDelay(paidEmis: any[]): number {
  if (paidEmis.length === 0) return 0;
  
  const delays = paidEmis
    .filter(emi => emi.paidDate && emi.paidDate > emi.dueDate)
    .map(emi => {
      const delayDays = Math.ceil((emi.paidDate.getTime() - emi.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(0, delayDays);
    });
  
  return delays.length > 0 ? Math.round(delays.reduce((sum, delay) => sum + delay, 0) / delays.length) : 0;
}

function calculateReliabilityScore(paidEmis: any[], overdueEmis: any[]): number {
  const totalEmis = paidEmis.length + overdueEmis.length;
  if (totalEmis === 0) return 100;
  
  const onTimePayments = calculateOnTimePayments(paidEmis);
  const overdueImpact = Math.min(50, overdueEmis.length * 10); // Max 50 point deduction
  
  return Math.max(0, onTimePayments - overdueImpact);
}

function calculatePaymentRisk(emi: any, onTimePercentage: number): string {
  const daysUntilDue = Math.ceil((emi.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (onTimePercentage >= 90) return 'LOW';
  if (onTimePercentage >= 70) return 'MEDIUM';
  return 'HIGH';
}

function identifyRiskFactors(paidEmis: any[], pendingEmis: any[]): string[] {
  const factors = [];
  
  const onTimePercentage = calculateOnTimePayments(paidEmis);
  if (onTimePercentage < 70) {
    factors.push('Frequent late payments');
  }
  
  const overdueCount = pendingEmis.filter(emi => emi.dueDate < new Date()).length;
  if (overdueCount > 0) {
    factors.push(`${overdueCount} overdue EMI(s)`);
  }
  
  if (factors.length === 0) {
    factors.push('No significant risk factors identified');
  }
  
  return factors;
}

function generatePaymentRecommendations(averageDelay: number, onTimePercentage: number): string[] {
  const recommendations = [];
  
  if (averageDelay > 5) {
    recommendations.push('Set up auto-debit to avoid payment delays');
  }
  
  if (onTimePercentage < 80) {
    recommendations.push('Consider setting payment reminders');
    recommendations.push('Review your cash flow management');
  }
  
  if (averageDelay === 0 && onTimePercentage >= 95) {
    recommendations.push('Excellent payment record! Consider prepayment for interest savings');
  }
  
  return recommendations;
}