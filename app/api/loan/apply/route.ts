import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const loanApplicationSchema = z.object({
  loanType: z.enum(['PAYDAY', 'SALARY_ADVANCE', 'EMERGENCY_FUND', 'MEDICAL_EMERGENCY', 'FESTIVAL_ADVANCE', 'TRAVEL_ADVANCE']),
  requestedAmount: z.number().min(1000).max(200000),
  tenure: z.number().min(7).max(90),
  purposeOfLoan: z.string().min(10).max(500),
  employmentId: z.string().uuid().optional(),
  bankAccountId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = loanApplicationSchema.parse(body);

    // Check user eligibility
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        kyc: true,
        creditScore: true,
        loans: {
          where: {
            status: {
              in: ['ACTIVE', 'OVERDUE']
            }
          }
        },
        employmentDetails: true,
        bankAccounts: true,
        profile: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validation checks
    if (!user.kyc || user.kyc.kycStatus !== 'VERIFIED') {
      return NextResponse.json({ error: 'KYC verification required' }, { status: 400 });
    }

    if (!user.emailVerified && !user.mobileVerified) {
      return NextResponse.json({ error: 'Email or mobile verification required' }, { status: 400 });
    }

    if (user.loans.length > 0) {
      return NextResponse.json({ error: 'You have an active loan. Please repay it first.' }, { status: 400 });
    }

    // Use provided employment or get primary employment
    let employment;
    if (validatedData.employmentId) {
      employment = user.employmentDetails.find(e => e.id === validatedData.employmentId);
    } else {
      employment = user.employmentDetails.find(e => e.isCurrentEmployer);
    }

    if (!employment) {
      return NextResponse.json({ error: 'Employment details required' }, { status: 400 });
    }

    // Use provided bank account or get primary account
    let bankAccount;
    if (validatedData.bankAccountId) {
      bankAccount = user.bankAccounts.find(b => b.id === validatedData.bankAccountId);
    } else {
      bankAccount = user.bankAccounts.find(b => b.isPrimary);
    }

    if (!bankAccount) {
      return NextResponse.json({ error: 'Bank account required' }, { status: 400 });
    }

    // Calculate credit score if not exists
    let creditScore = user.creditScore?.internalScore || 650;
    if (!user.creditScore) {
      creditScore = await calculateInitialCreditScore(user, employment);
    }

    // Calculate maximum eligible amount based on salary
    const maxEligibleAmount = employment.monthlyNetSalary * 2;
    if (validatedData.requestedAmount > maxEligibleAmount) {
      return NextResponse.json({
        error: `Maximum eligible amount is ₹${maxEligibleAmount.toLocaleString('en-IN')}`
      }, { status: 400 });
    }

    // Calculate interest and fees
    const interestRate = calculateInterestRate(validatedData.loanType, validatedData.tenure, creditScore);
    const processingFee = validatedData.requestedAmount * 0.02; // 2% processing fee
    const gstOnFees = processingFee * 0.18; // 18% GST
    const totalAmount = validatedData.requestedAmount + (validatedData.requestedAmount * interestRate * validatedData.tenure / 36500);

    // Generate unique loan number
    const loanNumber = `LX${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Auto-approve if credit score is good and amount is within limits
    const autoApprove = creditScore >= 700 && validatedData.requestedAmount <= 50000;

    // Create loan application
    const loan = await prisma.loan.create({
      data: {
        userId: session.user.id,
        loanNumber,
        loanType: validatedData.loanType,
        requestedAmount: validatedData.requestedAmount,
        approvedAmount: autoApprove ? validatedData.requestedAmount : null,
        interestRate,
        processingFee,
        gstOnFees,
        tenure: validatedData.tenure,
        purposeOfLoan: validatedData.purposeOfLoan,
        status: autoApprove ? 'APPROVED' : 'PENDING',
        creditScoreAtApproval: creditScore,
        autoApproved: autoApprove,
        approvalDate: autoApprove ? new Date() : null,
        dueDate: autoApprove ? new Date(Date.now() + validatedData.tenure * 24 * 60 * 60 * 1000) : null
      }
    });

    // Create loan status history
    await prisma.loanStatusHistory.create({
      data: {
        loanId: loan.id,
        previousStatus: 'PENDING',
        newStatus: autoApprove ? 'APPROVED' : 'PENDING',
        changedBy: 'SYSTEM',
        reason: autoApprove ? 'Auto-approved based on credit score' : 'Application submitted'
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        entityType: 'LOAN',
        entityId: loan.id,
        action: 'LOAN_APPLICATION_CREATED',
        newValues: loan,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown'
      }
    });

    // Send notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: autoApprove ? 'LOAN_APPROVED' : 'LOAN_APPROVED',
        channel: 'IN_APP',
        title: autoApprove ? 'Loan Approved!' : 'Application Received',
        message: autoApprove
          ? `Congratulations! Your loan of ₹${validatedData.requestedAmount.toLocaleString('en-IN')} has been approved. Funds will be disbursed shortly.`
          : `Your loan application for ₹${validatedData.requestedAmount.toLocaleString('en-IN')} has been received. Application ID: ${loanNumber}`,
        priority: 'HIGH'
      }
    });

    // If auto-approved, create repayment schedule
    if (autoApprove) {
      await createRepaymentSchedule(loan.id, validatedData.requestedAmount, totalAmount, validatedData.tenure);
    }

    return NextResponse.json({
      success: true,
      loanId: loan.id,
      loanNumber: loan.loanNumber,
      message: autoApprove ? 'Loan approved instantly!' : 'Application submitted successfully',
      status: loan.status,
      approved: autoApprove,
      approvedAmount: loan.approvedAmount,
      interestRate: loan.interestRate,
      processingFee: loan.processingFee,
      totalAmount: autoApprove ? totalAmount : null,
      emi: autoApprove ? Math.ceil(totalAmount / (validatedData.tenure / 30)) : null,
      creditScore,
      nextSteps: autoApprove
        ? ['E-Sign agreement will be sent to your email', 'Funds will be disbursed within 5 minutes']
        : ['Your application is under review', 'You will be notified within 2 hours']
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Loan application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function calculateInitialCreditScore(user: any, employment: any): Promise<number> {
  let score = 650; // Base score

  // Employment score
  if (employment.employmentType === 'PERMANENT') score += 50;
  if (employment.monthlyNetSalary > 50000) score += 30;
  if (employment.monthlyNetSalary > 100000) score += 20;

  // KYC score
  if (user.kyc?.aadharVerified) score += 20;
  if (user.kyc?.panVerified) score += 20;
  if (user.kyc?.videoKYCCompleted) score += 30;

  // Account age
  const accountAge = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (accountAge > 365) score += 30;
  else if (accountAge > 180) score += 20;
  else if (accountAge > 90) score += 10;

  // Verification status
  if (user.emailVerified) score += 10;
  if (user.mobileVerified) score += 10;

  // Cap the score
  return Math.min(850, Math.max(300, score));
}

function calculateInterestRate(loanType: string, tenure: number, creditScore: number): number {
  let baseRate = 12; // 12% base rate

  // Adjust based on loan type
  const loanTypeRates: Record<string, number> = {
    'PAYDAY': 1.5,
    'SALARY_ADVANCE': 1.2,
    'EMERGENCY_FUND': 2.0,
    'MEDICAL_EMERGENCY': 0.8,
    'FESTIVAL_ADVANCE': 1.3,
    'TRAVEL_ADVANCE': 1.5
  };

  baseRate += loanTypeRates[loanType] || 1.5;

  // Adjust based on tenure
  if (tenure <= 15) baseRate += 0.5;
  else if (tenure <= 30) baseRate += 0.3;
  else if (tenure > 60) baseRate += 0.8;

  // Adjust based on credit score
  if (creditScore >= 750) baseRate -= 2;
  else if (creditScore >= 700) baseRate -= 1;
  else if (creditScore >= 650) baseRate -= 0.5;
  else if (creditScore < 600) baseRate += 2;

  return Math.max(baseRate, 8); // Minimum 8% interest
}

async function createRepaymentSchedule(loanId: string, principal: number, totalAmount: number, tenure: number) {
  const numberOfPayments = Math.ceil(tenure / 30); // Monthly payments
  const emiAmount = Math.ceil(totalAmount / numberOfPayments);
  const interestPerPayment = (totalAmount - principal) / numberOfPayments;
  const principalPerPayment = principal / numberOfPayments;

  const repayments = [];
  for (let i = 1; i <= numberOfPayments; i++) {
    const dueDate = new Date(Date.now() + (i * 30 * 24 * 60 * 60 * 1000));
    const repaymentNumber = `RPY${Date.now()}${i}`;

    repayments.push({
      loanId,
      repaymentNumber,
      dueDate,
      amount: emiAmount,
      principalAmount: principalPerPayment,
      interestAmount: interestPerPayment,
      status: 'PENDING'
    });
  }

  await prisma.repayment.createMany({ data: repayments });
}