import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rbacSystem } from '@/backend/lib/auth/rbac-system';
import { auditLogger } from '@/backend/lib/audit/audit-logger';
import { cache } from '@/backend/lib/cache/cache-manager';
import { fraudDetection } from '@/backend/lib/ai/fraud-detection';
import { razorpayService } from '@/backend/lib/payments/razorpay';
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

// Validation schema for payment initiation
const paymentInitiationSchema = z.object({
  type: z.enum(['EMI_PAYMENT', 'PREPAYMENT', 'PENALTY_PAYMENT', 'PROCESSING_FEE']),
  loanId: z.string().uuid(),
  amount: z.number().min(1).max(10000000),
  emiId: z.string().uuid().optional(),
  paymentMethod: z.enum(['UPI', 'NET_BANKING', 'DEBIT_CARD', 'CREDIT_CARD', 'WALLET']),
  channel: z.enum(['WEB', 'MOBILE', 'USSD', 'BRANCH']).default('WEB'),
  description: z.string().max(200).optional(),
  returnUrl: z.string().url().optional(),
  webhookUrl: z.string().url().optional()
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  let paymentData: any;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'payment-initiate', 50, 3600); // 50 payments per hour
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Too many payment attempts.',
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
        'unauthorized_payment_initiation',
        'high',
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
      paymentData = paymentInitiationSchema.parse(body);
    } catch (error: any) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid payment data',
          details: error.errors || error.message
        },
        { status: 400 }
      );
    }

    // Verify loan ownership and get loan details
    const loan = await prisma.loan.findUnique({
      where: { id: paymentData.loanId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true
          }
        },
        emiSchedule: {
          where: paymentData.emiId ? { id: paymentData.emiId } : undefined,
          orderBy: { emiNumber: 'asc' }
        },
        product: {
          select: {
            name: true,
            processingFeePercent: true
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

    // Authorization check
    const hasPermission = await rbacSystem.checkPermission(
      userId,
      'payments',
      'create',
      { ownerId: loan.userId, loanId: loan.id }
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'payment',
        paymentData.loanId,
        'initiate',
        false,
        userId,
        { 
          ipAddress: clientIp,
          error: 'Insufficient permissions'
        }
      );

      return NextResponse.json(
        { success: false, error: 'Payment access denied' },
        { status: 403 }
      );
    }

    // Validate loan status
    if (!['ACTIVE', 'DISBURSED'].includes(loan.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot make payment for loan with status: ${loan.status}` 
        },
        { status: 400 }
      );
    }

    // Validate payment amount and type
    const validationResult = await validatePaymentDetails(loan, paymentData);
    if (!validationResult.valid) {
      return NextResponse.json(
        { success: false, error: validationResult.error },
        { status: 400 }
      );
    }

    // Fraud detection check
    const fraudCheck = await fraudDetection.checkPaymentTransaction(
      userId,
      {
        amount: paymentData.amount,
        method: paymentData.paymentMethod,
        loanId: paymentData.loanId
      },
      clientIp,
      request.headers.get('user-agent') || 'unknown'
    );

    if (fraudCheck.riskLevel === 'HIGH' || fraudCheck.riskLevel === 'CRITICAL') {
      await auditLogger.logSecurity(
        'high_risk_payment_blocked',
        'critical',
        {
          userId,
          loanId: paymentData.loanId,
          amount: paymentData.amount,
          riskScore: fraudCheck.riskScore,
          reasons: fraudCheck.reasons
        }
      );

      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment blocked for security reasons. Please contact support.',
          errorCode: 'FRAUD_DETECTED'
        },
        { status: 403 }
      );
    }

    // Create payment record
    const paymentId = `PAY_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    
    const payment = await prisma.transaction.create({
      data: {
        id: paymentId,
        userId: loan.userId,
        loanId: loan.id,
        emiId: paymentData.emiId,
        type: paymentData.type,
        amount: paymentData.amount,
        status: 'INITIATED',
        paymentMethod: paymentData.paymentMethod,
        channel: paymentData.channel,
        description: paymentData.description || `${paymentData.type} for loan ${loan.id}`,
        metadata: {
          fraudScore: fraudCheck.riskScore,
          ipAddress: clientIp,
          userAgent: request.headers.get('user-agent'),
          initiatedBy: userId,
          fraudFlags: fraudCheck.flags
        },
        createdAt: new Date()
      }
    });

    // Initiate payment with payment gateway
    let gatewayResponse;
    try {
      gatewayResponse = await razorpayService.createPayment({
        amount: paymentData.amount,
        currency: 'INR',
        receipt: paymentId,
        description: payment.description,
        customer: {
          name: loan.user.name,
          email: loan.user.email,
          contact: loan.user.mobile
        },
        metadata: {
          loanId: loan.id,
          paymentType: paymentData.type,
          emiId: paymentData.emiId
        },
        callback_url: paymentData.returnUrl,
        webhook_url: paymentData.webhookUrl
      });
    } catch (error: any) {
      // Update payment status to failed
      await prisma.transaction.update({
        where: { id: paymentId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          failedAt: new Date()
        }
      });

      throw new Error(`Payment gateway error: ${error.message}`);
    }

    // Update payment with gateway details
    const updatedPayment = await prisma.transaction.update({
      where: { id: paymentId },
      data: {
        gatewayTransactionId: gatewayResponse.id,
        gatewayResponse: gatewayResponse,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes expiry
      }
    });

    // Log payment initiation
    await auditLogger.logAction(
      'payment_initiated',
      'payment',
      paymentId,
      {
        loanId: loan.id,
        amount: paymentData.amount,
        type: paymentData.type,
        method: paymentData.paymentMethod,
        gatewayTransactionId: gatewayResponse.id
      },
      userId
    );

    const response = {
      success: true,
      data: {
        paymentId,
        gatewayTransactionId: gatewayResponse.id,
        amount: paymentData.amount,
        currency: 'INR',
        status: 'PENDING',
        expiresAt: updatedPayment.expiresAt,
        paymentUrl: gatewayResponse.short_url || gatewayResponse.payment_url,
        qrCode: gatewayResponse.qr_code,
        instructions: getPaymentInstructions(paymentData.paymentMethod),
        loan: {
          id: loan.id,
          productName: loan.product.name
        }
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('Payment initiation error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'payment.initiate',
      entityType: 'payment',
      entityId: paymentData?.loanId || 'unknown',
      success: false,
      errorMessage: error.message,
      stackTrace: error.stack,
      userId,
      ipAddress: request.headers.get('x-forwarded-for'),
      duration: Date.now() - startTime,
      customData: paymentData
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initiate payment',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

// Helper functions
async function validatePaymentDetails(loan: any, paymentData: any) {
  switch (paymentData.type) {
    case 'EMI_PAYMENT':
      if (!paymentData.emiId) {
        return { valid: false, error: 'EMI ID required for EMI payment' };
      }
      
      const emi = loan.emiSchedule.find((e: any) => e.id === paymentData.emiId);
      if (!emi) {
        return { valid: false, error: 'EMI not found' };
      }
      
      if (emi.status === 'PAID') {
        return { valid: false, error: 'EMI already paid' };
      }
      
      if (paymentData.amount < emi.amount) {
        return { valid: false, error: 'Payment amount is less than EMI amount' };
      }
      
      break;
      
    case 'PREPAYMENT':
      if (paymentData.amount > loan.outstandingAmount) {
        return { valid: false, error: 'Prepayment amount exceeds outstanding amount' };
      }
      
      const minPrepayment = 10000; // Minimum prepayment amount
      if (paymentData.amount < minPrepayment) {
        return { valid: false, error: `Minimum prepayment amount is ₹${minPrepayment}` };
      }
      
      break;
      
    case 'PROCESSING_FEE':
      const expectedFee = (loan.amount * loan.product.processingFeePercent) / 100;
      if (Math.abs(paymentData.amount - expectedFee) > 1) {
        return { valid: false, error: 'Invalid processing fee amount' };
      }
      
      break;
  }
  
  return { valid: true };
}

function getPaymentInstructions(method: string): string[] {
  const instructions: Record<string, string[]> = {
    'UPI': [
      'Scan the QR code with any UPI app',
      'Enter your UPI PIN to complete payment',
      'Payment will be confirmed instantly'
    ],
    'NET_BANKING': [
      'You will be redirected to your bank\'s website',
      'Login with your net banking credentials',
      'Authorize the payment to complete'
    ],
    'DEBIT_CARD': [
      'Enter your debit card details',
      'Complete OTP verification',
      'Payment will be processed securely'
    ],
    'CREDIT_CARD': [
      'Enter your credit card details',
      'Complete OTP verification',
      'Payment will be processed securely'
    ],
    'WALLET': [
      'Select your preferred wallet',
      'Login to your wallet account',
      'Confirm and complete payment'
    ]
  };
  
  return instructions[method] || [
    'Follow the instructions on the payment page',
    'Complete the payment within 15 minutes',
    'You will receive a confirmation once payment is successful'
  ];
}