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

// Validation schema for prepayment calculation
const prepaymentSchema = z.object({
  loanId: z.string().uuid(),
  prepaymentAmount: z.number().min(1000).max(50000000).optional(),
  prepaymentType: z.enum(['PARTIAL', 'FULL']),
  prepaymentDate: z.string().datetime().optional(),
  tenureReduction: z.boolean().optional().default(true)
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  let requestData: any;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'prepayment-calc', 30, 3600); // 30 calculations per hour
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Too many prepayment calculations.',
          retryAfter: rateLimitResult.retryAfter
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '30',
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
        'unauthorized_prepayment_calculation',
        'medium',
        { ipAddress: clientIp, userAgent: request.headers.get('user-agent') }
      );

      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = user.userId;

    // Parse and validate request body
    try {
      const body = await request.json();
      requestData = prepaymentSchema.parse(body);
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

    // Get loan details
    const loan = await prisma.loan.findUnique({
      where: { id: requestData.loanId },
      include: {
        emiSchedule: {
          orderBy: {
            emiNumber: 'asc'
          }
        },
        product: {
          select: {
            prepaymentPolicy: true,
            prepaymentCharges: true,
            allowPartialPrepayment: true,
            minPrepaymentAmount: true
          }
        },
        transactions: {
          where: {
            type: 'REPAYMENT',
            status: 'SUCCESS'
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
        loanId: loan.id
      }
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'loan',
        requestData.loanId,
        'prepayment_calculation',
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

    // Check if loan is eligible for prepayment
    if (!['ACTIVE', 'DISBURSED'].includes(loan.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Loan with status '${loan.status}' is not eligible for prepayment` 
        },
        { status: 400 }
      );
    }

    if (loan.outstandingAmount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Loan has no outstanding amount for prepayment' 
        },
        { status: 400 }
      );
    }

    // Validate prepayment type and amount
    if (requestData.prepaymentType === 'PARTIAL') {
      if (!loan.product.allowPartialPrepayment) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Partial prepayment not allowed for this loan product' 
          },
          { status: 400 }
        );
      }

      if (!requestData.prepaymentAmount) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Prepayment amount is required for partial prepayment' 
          },
          { status: 400 }
        );
      }

      const minAmount = loan.product.minPrepaymentAmount || 10000;
      if (requestData.prepaymentAmount < minAmount) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Minimum prepayment amount is ₹${minAmount.toLocaleString()}` 
          },
          { status: 400 }
        );
      }

      if (requestData.prepaymentAmount >= loan.outstandingAmount) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Prepayment amount cannot be greater than or equal to outstanding amount. Use full prepayment instead.' 
          },
          { status: 400 }
        );
      }
    }

    // Set prepayment date (default to today)
    const prepaymentDate = requestData.prepaymentDate ? 
      new Date(requestData.prepaymentDate) : new Date();

    // Check cache for similar calculation
    const cacheKey = `prepayment:${requestData.loanId}:${requestData.prepaymentType}:${requestData.prepaymentAmount || 'full'}:${prepaymentDate.toDateString()}`;
    let calculationResult = await cache.get(cacheKey);

    if (!calculationResult) {
      // Perform prepayment calculation
      calculationResult = calculatePrepayment(
        loan,
        requestData.prepaymentType,
        prepaymentDate,
        requestData.prepaymentAmount,
        requestData.tenureReduction
      );

      // Cache result for 1 hour
      await cache.set(cacheKey, calculationResult, { 
        ttl: 3600, 
        tags: [`loan:${requestData.loanId}`, 'prepayment'] 
      });
    }

    // Log calculation
    await auditLogger.logAction(
      'prepayment_calculated',
      'loan',
      requestData.loanId,
      {
        prepaymentType: requestData.prepaymentType,
        prepaymentAmount: requestData.prepaymentAmount || loan.outstandingAmount,
        savings: calculationResult.savings.totalSavings,
        newTenure: calculationResult.revisedSchedule?.newTenure
      },
      userId
    );

    const response = {
      success: true,
      data: {
        calculation: calculationResult,
        loan: {
          id: loan.id,
          currentOutstanding: loan.outstandingAmount,
          currentEmi: loan.emiAmount,
          remainingTenure: loan.emiSchedule.filter(emi => emi.status === 'PENDING').length
        },
        recommendations: generatePrepaymentRecommendations(loan, calculationResult),
        nextSteps: getPrepaymentNextSteps(requestData.prepaymentType)
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1',
        calculationDate: prepaymentDate.toISOString()
      }
    };

    return NextResponse.json(response, {
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('Prepayment calculation error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'loan.prepayment-calculation',
      entityType: 'loan',
      entityId: requestData?.loanId || 'unknown',
      success: false,
      errorMessage: error.message,
      stackTrace: error.stack,
      userId,
      ipAddress: request.headers.get('x-forwarded-for'),
      duration: Date.now() - startTime,
      customData: requestData
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate prepayment',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

// Comprehensive prepayment calculation function
function calculatePrepayment(
  loan: any,
  prepaymentType: string,
  prepaymentDate: Date,
  prepaymentAmount?: number,
  tenureReduction: boolean = true
) {
  const currentDate = new Date();
  const pendingEmis = loan.emiSchedule.filter((emi: any) => emi.status === 'PENDING');
  const paidEmis = loan.emiSchedule.filter((emi: any) => emi.status === 'PAID');
  
  // Calculate current outstanding principal
  let outstandingPrincipal = loan.amount;
  for (const emi of paidEmis) {
    outstandingPrincipal -= emi.principalAmount;
  }

  // Calculate prepayment charges
  const prepaymentChargeRate = loan.product.prepaymentCharges || 2; // 2% default
  const actualPrepaymentAmount = prepaymentType === 'FULL' ? 
    outstandingPrincipal : prepaymentAmount!;
  
  const prepaymentCharges = Math.round((actualPrepaymentAmount * prepaymentChargeRate) / 100);
  const netPrepaymentAmount = actualPrepaymentAmount - prepaymentCharges;

  // Calculate current scenario (without prepayment)
  const futureInterest = pendingEmis.reduce((sum: number, emi: any) => sum + emi.interestAmount, 0);
  const totalRemainingPayment = pendingEmis.reduce((sum: number, emi: any) => sum + emi.amount, 0);

  let result: any = {
    prepaymentDetails: {
      type: prepaymentType,
      amount: actualPrepaymentAmount,
      charges: prepaymentCharges,
      chargeRate: prepaymentChargeRate,
      netAmount: netPrepaymentAmount,
      date: prepaymentDate
    },
    currentScenario: {
      outstandingPrincipal,
      remainingEmis: pendingEmis.length,
      futureInterest,
      totalRemainingPayment,
      currentEmi: loan.emiAmount
    },
    savings: {
      interestSavings: 0,
      totalSavings: 0,
      percentageSavings: 0
    }
  };

  if (prepaymentType === 'FULL') {
    // Full prepayment - loan closure
    result.savings = {
      interestSavings: futureInterest,
      totalSavings: futureInterest - prepaymentCharges,
      percentageSavings: futureInterest > 0 ? 
        Math.round(((futureInterest - prepaymentCharges) / futureInterest) * 100) : 0
    };
    
    result.loanClosure = {
      totalPayableAmount: outstandingPrincipal + prepaymentCharges,
      closureDate: prepaymentDate,
      certificateGeneration: 'Available within 7 working days',
      refundAmount: 0 // Any excess amount paid
    };
  } else {
    // Partial prepayment
    const newOutstandingPrincipal = outstandingPrincipal - netPrepaymentAmount;
    const monthlyInterestRate = loan.interestRate / 100 / 12;
    
    let revisedSchedule: any = {};
    
    if (tenureReduction) {
      // Reduce tenure, keep EMI same
      const newTenure = calculateNewTenure(
        newOutstandingPrincipal, 
        loan.emiAmount, 
        monthlyInterestRate
      );
      
      revisedSchedule = {
        type: 'TENURE_REDUCTION',
        newOutstanding: newOutstandingPrincipal,
        newTenure: Math.ceil(newTenure),
        newEmi: loan.emiAmount,
        tenureReduction: pendingEmis.length - Math.ceil(newTenure),
        monthsEarlier: pendingEmis.length - Math.ceil(newTenure)
      };
      
      // Calculate new total interest
      const newTotalInterest = (loan.emiAmount * Math.ceil(newTenure)) - newOutstandingPrincipal;
      const currentTotalInterest = (loan.emiAmount * pendingEmis.length) - outstandingPrincipal;
      
      result.savings = {
        interestSavings: currentTotalInterest - newTotalInterest,
        totalSavings: currentTotalInterest - newTotalInterest - prepaymentCharges,
        percentageSavings: currentTotalInterest > 0 ? 
          Math.round(((currentTotalInterest - newTotalInterest - prepaymentCharges) / currentTotalInterest) * 100) : 0
      };
    } else {
      // Reduce EMI, keep tenure same
      const newEmi = calculateNewEmi(
        newOutstandingPrincipal, 
        pendingEmis.length, 
        monthlyInterestRate
      );
      
      revisedSchedule = {
        type: 'EMI_REDUCTION',
        newOutstanding: newOutstandingPrincipal,
        newTenure: pendingEmis.length,
        newEmi: Math.round(newEmi),
        emiReduction: loan.emiAmount - Math.round(newEmi),
        monthlySavings: loan.emiAmount - Math.round(newEmi)
      };
      
      // Calculate savings
      const newTotalPayment = Math.round(newEmi) * pendingEmis.length;
      const currentTotalPayment = loan.emiAmount * pendingEmis.length;
      
      result.savings = {
        interestSavings: currentTotalPayment - newTotalPayment,
        totalSavings: currentTotalPayment - newTotalPayment - prepaymentCharges,
        percentageSavings: currentTotalPayment > 0 ? 
          Math.round(((currentTotalPayment - newTotalPayment - prepaymentCharges) / currentTotalPayment) * 100) : 0
      };
    }
    
    result.revisedSchedule = revisedSchedule;
  }

  // Calculate break-even analysis
  result.breakEven = {
    months: prepaymentCharges > 0 && result.savings.interestSavings > 0 ? 
      Math.ceil(prepaymentCharges / (result.savings.interestSavings / pendingEmis.length)) : 0,
    recommendation: result.savings.totalSavings > 0 ? 'RECOMMENDED' : 'NOT_RECOMMENDED',
    reasoning: generateBreakEvenReasoning(result.savings, prepaymentCharges)
  };

  return result;
}

// Helper functions
function calculateNewTenure(principal: number, emi: number, monthlyRate: number): number {
  if (monthlyRate === 0) return principal / emi;
  
  return Math.log(1 + (principal * monthlyRate / emi)) / Math.log(1 + monthlyRate);
}

function calculateNewEmi(principal: number, tenure: number, monthlyRate: number): number {
  if (monthlyRate === 0) return principal / tenure;
  
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
         (Math.pow(1 + monthlyRate, tenure) - 1);
}

function generateBreakEvenReasoning(savings: any, charges: number): string {
  if (savings.totalSavings <= 0) {
    return 'Prepayment charges exceed interest savings. Not recommended.';
  }
  
  if (savings.totalSavings > charges * 2) {
    return 'Significant interest savings expected. Highly recommended.';
  }
  
  if (savings.totalSavings > charges) {
    return 'Moderate interest savings expected. Recommended if you have surplus funds.';
  }
  
  return 'Marginal savings expected. Consider opportunity cost of funds.';
}

function generatePrepaymentRecommendations(loan: any, calculation: any) {
  const recommendations = [];
  
  if (calculation.savings.totalSavings > 50000) {
    recommendations.push({
      type: 'HIGH_SAVINGS',
      priority: 'HIGH',
      title: 'Excellent Savings Opportunity',
      description: `You can save ₹${calculation.savings.totalSavings.toLocaleString()} in total`,
      action: 'Proceed with prepayment'
    });
  }
  
  if (calculation.prepaymentDetails.type === 'PARTIAL' && calculation.revisedSchedule?.type === 'TENURE_REDUCTION') {
    recommendations.push({
      type: 'EARLY_CLOSURE',
      priority: 'MEDIUM',
      title: 'Early Loan Closure',
      description: `Complete your loan ${calculation.revisedSchedule.monthsEarlier} months earlier`,
      action: 'Review revised schedule'
    });
  }
  
  if (calculation.savings.percentageSavings < 10) {
    recommendations.push({
      type: 'LOW_SAVINGS',
      priority: 'LOW',
      title: 'Consider Alternative Investments',
      description: 'Low savings percentage. Consider investing surplus funds elsewhere.',
      action: 'Compare investment options'
    });
  }
  
  return recommendations;
}

function getPrepaymentNextSteps(prepaymentType: string) {
  const steps = [
    'Review calculation details carefully',
    'Ensure sufficient funds are available',
    'Contact customer service to initiate prepayment'
  ];
  
  if (prepaymentType === 'FULL') {
    steps.push('Arrange for loan closure documentation');
    steps.push('Request closure certificate');
  } else {
    steps.push('Choose between tenure reduction or EMI reduction');
    steps.push('Review revised EMI schedule');
  }
  
  steps.push('Complete prepayment within validity period');
  
  return steps;
}