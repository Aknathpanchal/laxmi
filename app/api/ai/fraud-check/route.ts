import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/config';
import { fraudDetection } from '@/lib/ai/fraud-detection';
import { behaviorAnalytics } from '@/lib/ai/behavior-analytics';
import { z } from 'zod';

const fraudCheckSchema = z.object({
  loanId: z.string().optional(),
  transactionData: z.object({
    amount: z.number(),
    type: z.string(),
    purposeOfLoan: z.string().optional(),
  }),
  deviceInfo: z.object({
    deviceId: z.string(),
    platform: z.string(),
    browser: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = fraudCheckSchema.parse(body);

    const ipAddress = req.headers.get('x-forwarded-for') ||
                     req.headers.get('x-real-ip') ||
                     '127.0.0.1';

    // Get user ID from session
    const userId = (session.user as any).id || session.user.email;

    // Track behavior event
    await behaviorAnalytics.trackEvent(userId, {
      sessionId: req.headers.get('x-session-id') || 'unknown',
      eventType: 'FRAUD_CHECK',
      eventCategory: 'SECURITY',
      eventData: validatedData,
      timestamp: new Date(),
      deviceInfo: validatedData.deviceInfo,
      ipAddress,
      userAgent: req.headers.get('user-agent') || 'unknown',
      pageUrl: '/api/ai/fraud-check',
    });

    // Perform fraud check
    const fraudResult = await fraudDetection.checkFraud({
      userId,
      transactionType: validatedData.transactionData.type,
      amount: validatedData.transactionData.amount,
      deviceInfo: validatedData.deviceInfo,
      behaviorMetrics: {
        rapidClicks: 0,
        ipAddress,
        userAgent: req.headers.get('user-agent') || 'unknown'
      }
    });

    // If fraud detected, create alert and notify
    if (fraudResult.isFraudulent) {
      // Log the fraud attempt
      console.warn('Fraud detected for user:', userId, fraudResult);

      // You might want to block the transaction or require additional verification
      return NextResponse.json({
        success: false,
        requiresVerification: true,
        message: 'Additional verification required',
        fraudScore: fraudResult.riskScore,
        riskLevel: fraudResult.riskLevel,
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      fraudScore: fraudResult.riskScore,
      riskLevel: fraudResult.riskLevel,
      requiresManualReview: fraudResult.riskLevel === 'high',
      recommendations: fraudResult.suggestedActions,
      message: fraudResult.riskLevel === 'high' ?
        'Application will be reviewed by our team' :
        'Verification successful',
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Fraud check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get fraud alerts for the user
    const { prisma } = await import('@/lib/prisma');

    const alerts = await prisma.fraudAlert.findMany({
      where: {
        userId: (session.user as any).id || session.user.email!,
        investigationStatus: {
          in: ['PENDING', 'IN_PROGRESS']
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    return NextResponse.json({
      alerts,
      hasActiveAlerts: alerts.length > 0,
      requiresAction: alerts.some(a => a.severity === 'CRITICAL' || a.severity === 'HIGH')
    });

  } catch (error) {
    console.error('Get fraud alerts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}