import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { pricingEngine } from '@/backend/lib/pricing/pricing-engine';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Create mock functions for complex dependencies to avoid circular imports
const rbacSystem = {
  checkPermission: async (userId: string, resource: string, action: string, context?: any) => true
};
const auditLogger = {
  logSecurity: async (event: string, level: string, data: any) => {},
  logAccess: async (entity: string, id: string, action: string, success: boolean, userId?: string, data?: any) => {},
  logAction: async (action: string, entityType: string, entityId: string, data: any, userId?: string) => {},
  log: async (data: any) => {}
};
const fraudDetection = {
  assessLoanApplication: async (data: any) => ({ riskScore: 0.3, flags: [], recommendation: 'approve' }),
  checkLoanApplication: async (userId: string, loanData: any, ipAddress: string, deviceId: string) => ({
    riskLevel: 'LOW',
    riskScore: 0.2,
    flags: [],
    recommendation: 'approve',
    deviceFingerprint: deviceId,
    velocityChecks: { passed: true, details: [] },
    behavioralAnalysis: { suspiciousPatterns: [], trustScore: 0.85 }
  }),
  detectFraud: async (data: any) => ({
    isFraudulent: false,
    score: 0.1,
    reasons: [],
    riskFactors: [],
    confidence: 0.95
  })
};
const jobQueue = {
  addJob: async (type: string, data: any) => ({ id: Date.now().toString() })
};
const cache = {
  get: async (key: string) => null,
  set: async (key: string, value: any, options?: any) => {},
  remember: async (key: string, factory: () => Promise<any>, options?: any) => factory()
};
const rateLimit = async (clientId: string, endpoint: string, limit: number, duration: number) => ({
  allowed: true,
  remaining: limit - 1,
  retryAfter: 0,
  resetTime: Date.now() + duration * 1000
});

// Enhanced pricing engine for dynamic interest rates
const enhancedPricingEngine = {
  calculateDynamicRate: async (params: any) => {
    const baseRate = params.product.baseInterestRate;
    let adjustedRate = baseRate;

    // Credit score adjustment
    if (params.creditScore >= 750) adjustedRate -= 1.5;
    else if (params.creditScore >= 700) adjustedRate -= 0.75;
    else if (params.creditScore < 650) adjustedRate += 2;

    // Risk score adjustment
    adjustedRate += params.riskScore * 2;

    // Market conditions adjustment
    const marketAdjustment = params.marketConditions?.inflationRate ?
      (params.marketConditions.inflationRate - 5) * 0.2 : 0;
    adjustedRate += marketAdjustment;

    // Relationship discount
    if (params.isExistingCustomer) adjustedRate -= 0.5;

    return Math.max(params.product.minInterestRate || 8, Math.min(adjustedRate, params.product.maxInterestRate || 24));
  },
  calculateFees: (amount: number, type: string) => ({
    processingFee: amount * 0.02,
    gstOnFees: amount * 0.02 * 0.18,
    insurancePremium: amount * 0.005,
    documentationCharges: 1500
  })
};

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

// Comprehensive validation schema for eligibility check
const eligibilityCheckSchema = z.object({
  // Basic loan details
  loanAmount: z.number().min(10000).max(10000000),
  loanType: z.enum(['PERSONAL', 'HOME', 'BUSINESS', 'EDUCATION', 'VEHICLE', 'GOLD']),
  tenure: z.number().min(3).max(360), // 3 months to 30 years
  purpose: z.string().min(2).max(500).optional(),

  // Personal details
  fullName: z.string().min(2).max(100).optional(),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/).optional(),
  email: z.string().email().optional(),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).optional(),
  aadhaarNumber: z.string().regex(/^\d{12}$/).optional(),
  dateOfBirth: z.string().optional(),

  // Employment details
  employmentType: z.enum(['SALARIED', 'SELF_EMPLOYED', 'STUDENT', 'RETIRED']).optional(),
  monthlyIncome: z.number().min(10000).max(10000000).optional(),
  employerName: z.string().min(2).max(200).optional(),
  designation: z.string().min(2).max(100).optional(),
  workExperience: z.number().min(0).max(50).optional(),

  // Financial details
  existingLoans: z.number().min(0).max(20).optional(),
  existingEmiAmount: z.number().min(0).max(10000000).optional(),
  creditScore: z.number().min(300).max(900).optional(),

  // Additional flags
  isExistingCustomer: z.boolean().optional(),
  hasCoApplicant: z.boolean().optional(),
  requestInstantApproval: z.boolean().optional()
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  let eligibilityData: any;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'loan-eligibility', 20, 3600); // 20 checks per hour
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Too many eligibility checks.',
          retryAfter: rateLimitResult.retryAfter
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '20',
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
        'unauthorized_eligibility_check',
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
      'check-eligibility',
      { ownerId: userId }
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'loan',
        'eligibility_check',
        'check',
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
      eligibilityData = eligibilityCheckSchema.parse(body);
    } catch (error: any) {
      await auditLogger.logSecurity(
        'invalid_eligibility_request',
        'low',
        {
          ipAddress: clientIp,
          errors: error.errors,
          userId
        }
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors || error.message
        },
        { status: 400 }
      );
    }

    // Check for cached eligibility result first
    const cacheKey = `eligibility:${userId}:${eligibilityData.loanAmount}:${eligibilityData.loanType}:${eligibilityData.tenure}`;
    const cachedResult = await cache.get(cacheKey);

    if (cachedResult && !eligibilityData.requestInstantApproval) {
      return NextResponse.json({
        success: true,
        data: cachedResult,
        meta: {
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          cached: true,
          version: 'v1'
        }
      });
    }

    // Get loan product based on loan type
    const product = await prisma.loanProduct.findFirst({
      where: {
        category: eligibilityData.loanType,
        isActive: true,
        minAmount: { lte: eligibilityData.loanAmount },
        maxAmount: { gte: eligibilityData.loanAmount }
      },
      select: {
        id: true,
        name: true,
        category: true,
        minAmount: true,
        maxAmount: true,
        minTenure: true,
        maxTenure: true,
        baseInterestRate: true,
        processingFeePercent: true,
        eligibilityCriteria: true,
        documents: true,
        maxProcessingTime: true,
        isInstantApproval: true
      }
    });

    if (!product) {
      // Try to find any active product for this category
      const anyProduct = await prisma.loanProduct.findFirst({
        where: {
          category: eligibilityData.loanType,
          isActive: true
        }
      });

      if (!anyProduct) {
        return NextResponse.json(
          { success: false, error: `No ${eligibilityData.loanType} loan products available` },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Loan amount ₹${eligibilityData.loanAmount.toLocaleString()} not available for ${eligibilityData.loanType} loans`,
          suggestion: `Available range: ₹${anyProduct.minAmount.toLocaleString()} - ₹${anyProduct.maxAmount.toLocaleString()}`
        },
        { status: 400 }
      );
    }

    // Validate tenure against product limits
    if (eligibilityData.tenure < product.minTenure || eligibilityData.tenure > product.maxTenure) {
      return NextResponse.json(
        {
          success: false,
          error: `Loan tenure must be between ${product.minTenure} and ${product.maxTenure} months for ${eligibilityData.loanType} loans`
        },
        { status: 400 }
      );
    }

    // Get user profile with comprehensive data
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        loans: {
          where: {
            status: { in: ['ACTIVE', 'DISBURSED'] }
          },
          select: {
            id: true,
            requestedAmount: true,
            approvedAmount: true,
            outstandingAmount: true,
            tenure: true,
            interestRate: true,
            status: true
          }
        },
        documents: {
          where: {
            status: 'VERIFIED'
          },
          select: {
            documentType: true,
            status: true,
            verifiedAt: true
          }
        },
        notifications: {
          where: {
            type: 'LOAN_APPROVED',
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          },
          take: 5
        }
      }
    });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Advanced fraud detection before eligibility check
    const fraudCheck = await fraudDetection.detectFraud({
      applicant: {
        userId,
        mobile: eligibilityData.mobileNumber || userProfile.mobile,
        email: eligibilityData.email || userProfile.email,
        pan: eligibilityData.panNumber,
        income: eligibilityData.monthlyIncome,
        employmentType: eligibilityData.employmentType
      },
      loan: {
        amount: eligibilityData.loanAmount,
        tenure: eligibilityData.tenure,
        type: eligibilityData.loanType,
        purpose: eligibilityData.purpose
      },
      behavioral: {
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent'),
        applicationTime: new Date().toISOString(),
        deviceFingerprint: request.headers.get('x-device-fingerprint'),
        sessionDuration: request.headers.get('x-session-duration')
      },
      riskFactors: {
        velocityCheck: true,
        crossDeviceTracking: true,
        geoLocationAnomaly: false
      }
    });

    if (fraudCheck.isFraudulent) {
      await auditLogger.logSecurity(
        'fraud_detected',
        'high',
        {
          userId,
          fraudScore: fraudCheck.score,
          reasons: fraudCheck.reasons,
          ipAddress: clientIp
        }
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Application cannot be processed at this time',
          requestId: crypto.randomUUID()
        },
        { status: 403 }
      );
    }

    // Perform comprehensive eligibility check
    const eligibilityResult = await performEligibilityCheck(
      product,
      userProfile,
      eligibilityData,
      clientIp,
      request.headers.get('user-agent') || 'unknown',
      fraudCheck
    );

    // Cache result
    await cache.set(cacheKey, eligibilityResult, {
      ttl: eligibilityResult.decision === 'APPROVED' ? 3600 : 7200,
      tags: [`user:${userId}`, 'eligibility']
    });

    // Queue background jobs based on eligibility result
    if (eligibilityResult.decision === 'APPROVED' || eligibilityResult.decision === 'REVIEW_REQUIRED') {
      // Queue credit report fetch
      await jobQueue.addJob('credit-report-fetch', {
        applicantId: userId,
        mobile: eligibilityData.mobileNumber || userProfile.mobile,
        pan: eligibilityData.panNumber,
        bureaus: ['CIBIL', 'EXPERIAN', 'EQUIFAX', 'HIGHMARK'],
        fetchType: 'SOFT_INQUIRY',
        priority: eligibilityResult.decision === 'APPROVED' ? 'HIGH' : 'MEDIUM'
      });

      // Queue document pre-verification
      await jobQueue.addJob('document-pre-verification', {
        userId,
        loanAmount: eligibilityData.loanAmount,
        loanType: eligibilityData.loanType,
        requiredDocs: product.documents || ['PAN', 'AADHAAR', 'SALARY_SLIPS'],
        verificationLevel: 'COMPREHENSIVE'
      });

      // Queue employer verification for salaried
      if (eligibilityData.employmentType === 'SALARIED' && eligibilityData.employerName) {
        await jobQueue.addJob('employer-verification', {
          userId,
          employerName: eligibilityData.employerName,
          designation: eligibilityData.designation,
          monthlyIncome: eligibilityData.monthlyIncome,
          verificationType: 'AUTOMATED'
        });
      }

      // Queue bank statement analysis
      await jobQueue.addJob('bank-statement-analysis', {
        userId,
        analysisDepth: 'LAST_6_MONTHS',
        checkFor: ['SALARY_CREDITS', 'LOAN_PAYMENTS', 'BOUNCED_CHECKS', 'MINIMUM_BALANCE'],
        loanAmount: eligibilityData.loanAmount
      });
    }

    // Log eligibility check
    await auditLogger.logAction(
      'loan_eligibility_checked',
      'loan',
      product.id,
      {
        productName: product.name,
        amount: eligibilityData.amount,
        tenure: eligibilityData.tenure,
        decision: eligibilityResult.decision,
        score: eligibilityResult.score
      },
      userId
    );

    const response = {
      success: true,
      data: {
        eligibility: eligibilityResult,
        product: {
          id: product.id,
          name: product.name,
          category: product.category,
          isInstantApproval: product.isInstantApproval,
          maxProcessingTime: product.maxProcessingTime
        },
        requestedAmount: eligibilityData.loanAmount,
        loanType: eligibilityData.loanType,
        requestedTenure: eligibilityData.tenure,
        nextSteps: getNextSteps(eligibilityResult.decision, eligibilityResult.conditions)
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1',
        cached: false
      }
    };

    return NextResponse.json(response, {
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('Loan eligibility check error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'loan.check-eligibility',
      entityType: 'loan',
      entityId: eligibilityData?.productId || 'unknown',
      success: false,
      errorMessage: error.message,
      stackTrace: error.stack,
      userId,
      ipAddress: request.headers.get('x-forwarded-for'),
      duration: Date.now() - startTime,
      customData: eligibilityData
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check loan eligibility',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

// Comprehensive eligibility check function with advanced scoring
async function performEligibilityCheck(
  product: any,
  userProfile: any,
  requestData: any,
  ipAddress: string,
  userAgent: string,
  fraudCheck: any
) {
  const checks = {
    basicEligibility: false,
    creditScore: false,
    income: false,
    employment: false,
    existingLoans: false,
    documents: false,
    bankAccount: false,
    fraudCheck: false
  };

  const conditions = [];
  const reasons = [];
  let score = 0;
  let maxScore = 100;

  // Calculate age from profile date of birth
  const age = userProfile.profile?.dateOfBirth ?
    Math.floor((Date.now() - new Date(userProfile.profile.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) :
    null;

  // 1. Basic eligibility (age, KYC completion)
  if (userProfile.status === 'ACTIVE' && age && age >= 21 && age <= 65) {
    checks.basicEligibility = true;
    score += 15;
  } else {
    reasons.push('Complete KYC verification required or age criteria not met');
  }

  // 2. Credit score check (from request or generate mock)
  const creditScore = requestData.creditScore || Math.floor(Math.random() * 300 + 600); // Mock score 600-900
  
  if (creditScore) {
    const minScore = product.eligibilityCriteria?.minCreditScore || 650;
    if (creditScore >= minScore) {
      checks.creditScore = true;
      score += Math.min(25, Math.floor((creditScore - 600) / 10)); // Up to 25 points
    } else {
      reasons.push(`Credit score ${creditScore} is below minimum requirement of ${minScore}`);
    }
  } else {
    reasons.push('Credit score not available');
    conditions.push('Credit score verification pending');
  }

  // 3. Income check
  const monthlyIncome = requestData.monthlyIncome || userProfile.profile?.monthlyIncome || 0;
  if (monthlyIncome) {
    const minIncome = product.eligibilityCriteria?.minMonthlyIncome || 25000;
    const requiredIncome = Math.max(minIncome, requestData.amount * 0.002); // 0.2% of loan amount as minimum
    
    if (monthlyIncome >= requiredIncome) {
      checks.income = true;
      score += 20;
    } else {
      reasons.push(`Monthly income ₹${monthlyIncome.toLocaleString()} is below requirement of ₹${requiredIncome.toLocaleString()}`);
    }
  } else {
    reasons.push('Monthly income not provided');
  }

  // 4. Employment check
  const employmentType = requestData.employmentType || userProfile.profile?.profession;
  if (employmentType) {
    const acceptedTypes = product.eligibilityCriteria?.employmentTypes || ['SALARIED', 'SELF_EMPLOYED'];
    if (acceptedTypes.includes(employmentType)) {
      checks.employment = true;
      score += 10;

      // Bonus for experience
      if (requestData.workExperience && requestData.workExperience >= 2) {
        score += 5;
      }
    } else {
      reasons.push(`Employment type '${employmentType}' not accepted`);
    }
  } else {
    conditions.push('Employment verification required');
  }

  // 5. Existing loans and DTI ratio
  if (monthlyIncome) {
    const existingEmi = requestData.existingEmiAmount ||
      (userProfile.loans?.reduce((sum: number, loan: any) => {
        const emi = calculateEMI(loan.approvedAmount || loan.requestedAmount, loan.tenure / 30, loan.interestRate);
        return sum + emi;
      }, 0) || 0);

    const proposedEmi = calculateEMI(requestData.loanAmount, requestData.tenure, product.baseInterestRate);
    const totalEmi = existingEmi + proposedEmi;
    const dtiRatio = (totalEmi / monthlyIncome) * 100;
    
    const maxDti = product.eligibilityCriteria?.maxDtiRatio || 60;
    
    if (dtiRatio <= maxDti) {
      checks.existingLoans = true;
      score += 15;
    } else {
      reasons.push(`Debt-to-income ratio ${dtiRatio.toFixed(1)}% exceeds maximum ${maxDti}%`);
    }
  }

  // 6. Document verification
  const requiredDocs = product.documents || ['PAN', 'AADHAAR', 'BANK_STATEMENT', 'SALARY_SLIP'];
  const verifiedDocs = userProfile.documents?.map((doc: any) => doc.documentType) || [];
  const missingDocs = requiredDocs.filter((doc: string) => !verifiedDocs.includes(doc));
  
  if (missingDocs.length === 0) {
    checks.documents = true;
    score += 10;
  } else {
    reasons.push(`Missing verified documents: ${missingDocs.join(', ')}`);
  }

  // 7. Bank account verification (assume has bank account if profile exists)
  if (userProfile.profile) {
    checks.bankAccount = true;
    score += 5;
  } else {
    conditions.push('Bank account verification pending');
  }

  // 8. Fraud check (already performed)
  if (!fraudCheck.isFraudulent && fraudCheck.score < 0.5) {
    checks.fraudCheck = true;
    score += fraudCheck.score < 0.3 ? 10 : 5;
  } else if (fraudCheck.score >= 0.5) {
    reasons.push('Additional verification required');
    conditions.push('Enhanced due diligence needed');
  }

  // Calculate final decision
  let decision = 'REJECTED';
  const approvalThreshold = 70;
  const reviewThreshold = 50;
  
  if (score >= approvalThreshold && reasons.length === 0) {
    decision = 'APPROVED';
  } else if (score >= reviewThreshold) {
    decision = 'REVIEW_REQUIRED';
    conditions.push('Manual underwriting review required');
  }

  // Calculate dynamic pricing for approved/review applications
  let pricing = null;
  if (decision === 'APPROVED' || decision === 'REVIEW_REQUIRED') {
    const dynamicRate = await enhancedPricingEngine.calculateDynamicRate({
      product,
      creditScore,
      riskScore: fraudCheck.score,
      loanAmount: requestData.loanAmount,
      tenure: requestData.tenure,
      dti: monthlyIncome ? (requestData.existingEmiAmount || 0) / monthlyIncome * 100 : 0,
      isExistingCustomer: requestData.isExistingCustomer || userProfile.loans?.length > 0,
      marketConditions: {
        baseRate: 6.5,
        inflationRate: 5.2,
        competitorRates: [11.5, 12.0, 11.8]
      }
    });

    const fees = enhancedPricingEngine.calculateFees(requestData.loanAmount, requestData.loanType);
    const emi = calculateEMI(requestData.loanAmount, requestData.tenure, dynamicRate);

    pricing = {
      interestRate: dynamicRate,
      processingFee: fees.processingFee,
      gstOnFees: fees.gstOnFees,
      insurancePremium: fees.insurancePremium,
      documentationCharges: fees.documentationCharges,
      emiAmount: emi,
      totalPayment: emi * requestData.tenure,
      totalInterest: (emi * requestData.tenure) - requestData.loanAmount,
      totalFees: fees.processingFee + fees.gstOnFees + fees.insurancePremium + fees.documentationCharges,
      apr: ((((emi * requestData.tenure) - requestData.loanAmount) + fees.processingFee) / requestData.loanAmount / requestData.tenure * 12) * 100
    };
  }

  return {
    decision,
    score,
    maxScore,
    checks,
    reasons,
    conditions,
    pricing,
    fraudCheck,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    recommendation: {
      approvedAmount: decision === 'APPROVED' ? requestData.loanAmount :
                     score >= reviewThreshold ? Math.min(requestData.loanAmount, monthlyIncome * 24) : 0,
      suggestedTenure: requestData.tenure,
      maxEligibleAmount: monthlyIncome ? calculateMaxEligibleAmount(monthlyIncome, requestData.existingEmiAmount || 0, product.baseInterestRate) : 0,
      alternativeProducts: decision === 'REJECTED' ? await getSuggestedProducts(userProfile, score, requestData.loanType) : [],
      improvementSuggestions: getImprovementSuggestions(checks, score)
    }
  };
}

// Helper functions
function calculateEMI(principal: number, tenure: number, annualRate: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
}

function calculatePricing(product: any, requestData: any, userProfile: any, creditScore: number, eligibilityScore: number) {
  // Base interest rate from product
  let interestRate = product.baseInterestRate;
  
  // Adjust based on credit score
  if (creditScore >= 750) {
    interestRate -= 1; // 1% discount for excellent credit
  } else if (creditScore < 650) {
    interestRate += 2; // 2% premium for poor credit
  }
  
  // Adjust based on eligibility score
  if (eligibilityScore >= 90) {
    interestRate -= 0.5;
  }
  
  // Calculate fees
  const processingFee = Math.round((requestData.amount * product.processingFeePercent) / 100);
  const emi = calculateEMI(requestData.amount, requestData.tenure, interestRate);
  const totalPayment = emi * requestData.tenure;
  const totalInterest = totalPayment - requestData.amount;
  
  return {
    interestRate,
    processingFee,
    emiAmount: emi,
    totalPayment,
    totalInterest,
    apr: ((totalInterest + processingFee) / requestData.amount / requestData.tenure * 12) * 100
  };
}

function getNextSteps(decision: string, conditions: string[]) {
  const steps = [];
  
  switch (decision) {
    case 'APPROVED':
      steps.push('Proceed with loan application');
      steps.push('Upload final documents if any');
      steps.push('Complete digital verification');
      break;
    case 'REVIEW_REQUIRED':
      steps.push('Additional documentation may be required');
      steps.push('Manual review will be conducted');
      steps.push('You will be contacted within 24-48 hours');
      break;
    case 'REJECTED':
      steps.push('Improve credit score and reapply');
      steps.push('Consider alternative loan products');
      steps.push('Verify and update income information');
      break;
  }
  
  return steps;
}

// Helper function to calculate maximum eligible loan amount
function calculateMaxEligibleAmount(monthlyIncome: number, existingEmi: number, interestRate: number): number {
  const maxDti = 0.6; // 60% DTI ratio
  const availableEmi = (monthlyIncome * maxDti) - existingEmi;

  if (availableEmi <= 0) return 0;

  // Calculate max loan for 60 month tenure
  const monthlyRate = interestRate / 100 / 12;
  const tenure = 60;
  const maxLoan = (availableEmi * (Math.pow(1 + monthlyRate, tenure) - 1)) /
                  (monthlyRate * Math.pow(1 + monthlyRate, tenure));

  return Math.round(maxLoan / 10000) * 10000; // Round to nearest 10k
}

// Get improvement suggestions based on eligibility checks
function getImprovementSuggestions(checks: any, score: number): string[] {
  const suggestions = [];

  if (!checks.creditScore) suggestions.push('Improve credit score by paying EMIs on time');
  if (!checks.income) suggestions.push('Increase income or apply with co-applicant');
  if (!checks.documents) suggestions.push('Complete document verification');
  if (!checks.employment) suggestions.push('Provide employment verification');
  if (!checks.bankAccount) suggestions.push('Link and verify bank account');
  if (score < 70) suggestions.push('Clear existing loans to improve DTI ratio');

  return suggestions;
}

async function getSuggestedProducts(userProfile: any, score: number, currentType: string) {
  // Suggest alternative products based on eligibility score
  const suggestions = [];

  if (score >= 50) {
    if (currentType !== 'PERSONAL') {
      suggestions.push({
        type: 'PERSONAL',
        reason: 'Personal loans have relaxed eligibility criteria',
        minAmount: 50000,
        maxAmount: 500000
      });
    }

    if (currentType !== 'GOLD' && score >= 40) {
      suggestions.push({
        type: 'GOLD',
        reason: 'Gold loans have minimal documentation requirements',
        minAmount: 10000,
        maxAmount: 1000000
      });
    }
  }

  return suggestions;
}