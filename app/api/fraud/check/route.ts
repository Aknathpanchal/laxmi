import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fraudDetector, FraudCheckInput } from '@/backend/services/fraud-detection';
import jwt from 'jsonwebtoken';

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

/**
 * Real-Time Fraud Detection API
 * Multi-layer ML-based fraud prevention system
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Get user from token (optional for some transaction types)
    const user = getUserFromToken(request);
    const body = await request.json();

    // Extract device information from headers
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || 'en';
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     '127.0.0.1';

    // Build fraud check input
    const fraudCheckInput: FraudCheckInput = {
      userId: user?.userId || body.userId,
      sessionId: body.sessionId || crypto.randomUUID(),

      transaction: {
        type: body.transactionType || 'LOAN_APPLICATION',
        amount: body.amount,
        loanId: body.loanId,
        timestamp: new Date().toISOString()
      },

      device: {
        fingerprint: body.deviceFingerprint || generateDeviceFingerprint(userAgent),
        type: detectDeviceType(userAgent),
        os: detectOS(userAgent),
        browser: detectBrowser(userAgent),
        screenResolution: body.screenResolution,
        timezone: body.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: acceptLanguage.split(',')[0],
        plugins: body.plugins || []
      },

      network: {
        ipAddress,
        vpnDetected: body.vpnDetected || false,
        proxyDetected: body.proxyDetected || false,
        tor: body.tor || false,
        geolocation: await getGeolocation(ipAddress)
      },

      behavioral: body.behavioral || {
        mouseMovements: body.mouseMovements,
        keystrokes: body.keystrokes,
        touchPatterns: body.touchPatterns,
        scrollBehavior: body.scrollBehavior
      }
    };

    // Perform fraud detection
    const fraudResult = await fraudDetector.detectFraud(fraudCheckInput);

    // Store fraud check result in database
    if (user?.userId) {
      await prisma.fraudAlert.create({
        data: {
          userId: user.userId,
          alertType: fraudResult.isFraudulent ? 'HIGH_RISK' : 'LOW_RISK',
          riskScore: fraudResult.riskScore / 10, // Convert to 0-100 scale
          details: {
            riskLevel: fraudResult.riskLevel,
            fraudTypes: fraudResult.fraudType,
            signals: fraudResult.signals,
            deviceFingerprint: fraudCheckInput.device.fingerprint,
            ipAddress: fraudCheckInput.network.ipAddress,
            transactionType: fraudCheckInput.transaction.type
          },
          resolved: !fraudResult.requiresManualReview,
          resolvedAt: fraudResult.requiresManualReview ? null : new Date(),
          actionTaken: fraudResult.blockTransaction ? 'BLOCKED' :
                       fraudResult.requiresManualReview ? 'REVIEW' :
                       'ALLOWED'
        }
      });
    }

    // Log the fraud check for analytics
    await logFraudCheck(fraudCheckInput, fraudResult);

    // Prepare response based on risk level
    const response = prepareFraudResponse(fraudResult);

    return NextResponse.json({
      success: true,
      data: response,
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - startTime,
        confidence: fraudResult.metadata.confidence
      }
    }, {
      status: fraudResult.blockTransaction ? 403 : 200,
      headers: {
        'X-Fraud-Score': fraudResult.riskScore.toString(),
        'X-Risk-Level': fraudResult.riskLevel,
        'X-Challenge-Required': fraudResult.challengeRequired || 'none',
        'X-Processing-Time': `${Date.now() - startTime}ms`
      }
    });

  } catch (error: any) {
    console.error('Fraud detection error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform fraud check',
        message: 'System error - defaulting to manual review',
        requiresManualReview: true,
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to fetch fraud alerts for a user
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const searchParams = request.nextUrl.searchParams;
    const targetUserId = searchParams.get('userId');

    // For non-admin users, only show their own alerts
    const userId = user.userType === 'ADMIN' && targetUserId ? targetUserId : user.userId;

    const alerts = await prisma.fraudAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Calculate statistics
    const stats = {
      totalAlerts: alerts.length,
      highRiskAlerts: alerts.filter(a => a.alertType === 'HIGH_RISK').length,
      unresolvedAlerts: alerts.filter(a => !a.resolved).length,
      blockedTransactions: alerts.filter(a =>
        (a.details as any)?.actionTaken === 'BLOCKED'
      ).length,
      averageRiskScore: alerts.length > 0 ?
        alerts.reduce((sum, a) => sum + (a.riskScore || 0), 0) / alerts.length :
        0
    };

    return NextResponse.json({
      success: true,
      data: {
        alerts: alerts.map(alert => ({
          id: alert.id,
          type: alert.alertType,
          riskScore: alert.riskScore,
          details: alert.details,
          resolved: alert.resolved,
          actionTaken: (alert.details as any)?.actionTaken,
          createdAt: alert.createdAt,
          resolvedAt: alert.resolvedAt
        })),
        statistics: stats
      }
    });

  } catch (error) {
    console.error('Fraud alerts fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fraud alerts' },
      { status: 500 }
    );
  }
}

// Helper functions

function generateDeviceFingerprint(userAgent: string): string {
  // Simple fingerprinting - in production use more sophisticated methods
  const hash = Buffer.from(userAgent + Date.now()).toString('base64').substring(0, 16);
  return `FP_${hash}`;
}

function detectDeviceType(userAgent: string): 'mobile' | 'desktop' | 'tablet' {
  if (/Mobile|Android|iPhone/i.test(userAgent)) return 'mobile';
  if (/iPad|Tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

function detectOS(userAgent: string): string {
  if (/Windows/i.test(userAgent)) return 'Windows';
  if (/Mac OS/i.test(userAgent)) return 'macOS';
  if (/Android/i.test(userAgent)) return 'Android';
  if (/iOS|iPhone|iPad/i.test(userAgent)) return 'iOS';
  if (/Linux/i.test(userAgent)) return 'Linux';
  return 'Unknown';
}

function detectBrowser(userAgent: string): string {
  if (/Chrome/i.test(userAgent)) return 'Chrome';
  if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return 'Safari';
  if (/Firefox/i.test(userAgent)) return 'Firefox';
  if (/Edge/i.test(userAgent)) return 'Edge';
  return 'Other';
}

async function getGeolocation(ipAddress: string): Promise<any> {
  // Mock geolocation - in production use IP geolocation service
  if (ipAddress === '127.0.0.1' || ipAddress.startsWith('192.168')) {
    return {
      country: 'IN',
      city: 'Mumbai',
      latitude: 19.0760,
      longitude: 72.8777
    };
  }

  // Simulate different locations
  const locations = [
    { country: 'IN', city: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
    { country: 'IN', city: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
    { country: 'IN', city: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
    { country: 'US', city: 'New York', latitude: 40.7128, longitude: -74.0060 }
  ];

  return locations[Math.floor(Math.random() * locations.length)];
}

function prepareFraudResponse(fraudResult: any): any {
  const response: any = {
    allowed: !fraudResult.blockTransaction,
    riskScore: fraudResult.riskScore,
    riskLevel: fraudResult.riskLevel
  };

  // Add action required for high-risk transactions
  if (fraudResult.blockTransaction) {
    response.action = 'BLOCKED';
    response.message = 'Transaction blocked due to high fraud risk';
    response.reasons = fraudResult.fraudType;
  } else if (fraudResult.requiresManualReview) {
    response.action = 'REVIEW_REQUIRED';
    response.message = 'Transaction requires manual review';
    response.reviewReasons = fraudResult.signals
      .filter(s => s.severity === 'high' || s.severity === 'critical')
      .map(s => s.description);
  } else if (fraudResult.challengeRequired) {
    response.action = 'CHALLENGE_REQUIRED';
    response.challengeType = fraudResult.challengeRequired;
    response.message = `Please complete ${fraudResult.challengeRequired} verification`;
  } else {
    response.action = 'ALLOWED';
    response.message = 'Transaction allowed';
  }

  // Add recommendations for improvement
  if (fraudResult.recommendations.length > 0) {
    response.recommendations = fraudResult.recommendations;
  }

  // Add detailed signals for admin users
  if (fraudResult.signals.length > 0) {
    response.riskFactors = fraudResult.signals.map(s => ({
      type: s.type,
      severity: s.severity,
      description: s.description
    }));
  }

  return response;
}

async function logFraudCheck(input: FraudCheckInput, result: any) {
  try {
    // In production, this would log to a data warehouse or analytics platform
    console.log('Fraud Check Log:', {
      timestamp: new Date().toISOString(),
      transactionType: input.transaction.type,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      blocked: result.blockTransaction,
      fraudTypes: result.fraudType,
      processingTimeMs: result.metadata.processingTimeMs
    });
  } catch (error) {
    console.error('Failed to log fraud check:', error);
  }
}