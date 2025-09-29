import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rbacSystem } from '@/backend/lib/auth/rbac-system';
import { auditLogger } from '@/backend/lib/audit/audit-logger';
import { cache } from '@/backend/lib/cache/cache-manager';
import { jobQueue } from '@/backend/lib/jobs/job-queue';
import { creditBureauService } from '@/backend/lib/credit-bureau';
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
    const rateLimitResult = await rateLimit(clientIp, 'credit-score', 50, 3600); // 50 requests per hour
    
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
        'unauthorized_credit_score_access',
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
      'credit-reports',
      'read',
      { ownerId: userId }
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'credit_report',
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

    // Check URL parameters
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh') === 'true';
    const includeSummary = searchParams.get('includeSummary') === 'true';
    const includeHistory = searchParams.get('includeHistory') === 'true';

    // Check cache first (unless refresh is requested)
    const cacheKey = `user:credit-score:${userId}`;
    let creditData = null;

    if (!refresh) {
      creditData = await cache.get(cacheKey);
    }

    if (!creditData) {
      // Fetch latest credit reports from database
      const latestReports = await prisma.creditReport.findMany({
        where: { userId },
        orderBy: { fetchedAt: 'desc' },
        take: includeHistory ? 10 : 1,
        select: {
          id: true,
          cibilScore: true,
          experianScore: true,
          equifaxScore: true,
          highmarkScore: true,
          reportData: includeSummary,
          fetchedAt: true,
          createdAt: true
        }
      });

      if (latestReports.length === 0 || refresh) {
        // No reports found or refresh requested - fetch fresh data
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            panNumber: true,
            aadharNumber: true,
            name: true,
            dateOfBirth: true
          }
        });

        if (!user || !user.panNumber) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'PAN number required for credit score fetch. Please complete your KYC.' 
            },
            { status: 400 }
          );
        }

        // Queue credit score fetch job
        await jobQueue.addJob('fetch-credit-score', {
          userId,
          panNumber: user.panNumber,
          name: user.name,
          dateOfBirth: user.dateOfBirth
        }, {
          priority: 3,
          attempts: 3
        });

        // If no existing reports, return pending status
        if (latestReports.length === 0) {
          return NextResponse.json({
            success: true,
            message: 'Credit score fetch initiated. Please check back in a few minutes.',
            data: {
              status: 'PENDING',
              estimatedCompletionTime: '3-5 minutes'
            },
            meta: {
              requestId: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
              version: 'v1'
            }
          });
        }
      }

      const latestReport = latestReports[0];
      
      // Calculate composite score and risk category
      const scores = {
        cibil: latestReport.cibilScore,
        experian: latestReport.experianScore,
        equifax: latestReport.equifaxScore,
        highmark: latestReport.highmarkScore
      };

      const validScores = Object.values(scores).filter(score => score !== null && score !== undefined);
      const averageScore = validScores.length > 0 
        ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
        : null;

      // Determine risk category
      let riskCategory = 'UNKNOWN';
      let eligibilityStatus = 'UNKNOWN';
      
      if (averageScore) {
        if (averageScore >= 750) {
          riskCategory = 'EXCELLENT';
          eligibilityStatus = 'HIGH';
        } else if (averageScore >= 700) {
          riskCategory = 'GOOD';
          eligibilityStatus = 'MEDIUM';
        } else if (averageScore >= 650) {
          riskCategory = 'FAIR';
          eligibilityStatus = 'LOW';
        } else {
          riskCategory = 'POOR';
          eligibilityStatus = 'VERY_LOW';
        }
      }

      creditData = {
        currentScore: {
          composite: averageScore,
          ...scores,
          lastUpdated: latestReport.fetchedAt,
          riskCategory,
          eligibilityStatus
        },
        summary: includeSummary ? latestReport.reportData : null,
        history: includeHistory ? latestReports.map(report => ({
          composite: report.cibilScore || report.experianScore || report.equifaxScore || report.highmarkScore,
          cibil: report.cibilScore,
          experian: report.experianScore,
          equifax: report.equifaxScore,
          highmark: report.highmarkScore,
          fetchedAt: report.fetchedAt
        })) : null,
        insights: {
          scoreImprovement: includeHistory && latestReports.length > 1 ? 
            calculateScoreImprovement(latestReports) : null,
          recommendations: generateRecommendations(averageScore, riskCategory)
        },
        nextUpdateAvailable: new Date(latestReport.fetchedAt.getTime() + 24 * 60 * 60 * 1000) // 24 hours
      };

      // Cache for 6 hours
      await cache.set(cacheKey, creditData, { ttl: 21600, tags: [`user:${userId}`, 'credit-score'] });
    }

    // Log successful access
    await auditLogger.logAccess(
      'credit_report',
      userId,
      'read',
      true,
      userId,
      { 
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent'),
        refresh,
        includeSummary,
        includeHistory
      }
    );

    const response = {
      success: true,
      data: creditData,
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1',
        cached: !refresh
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': refresh ? 'no-cache' : 'private, max-age=3600',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('Credit score fetch error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'credit-score.read',
      entityType: 'credit_report',
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
        error: 'Failed to fetch credit score',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Rate limiting for refresh requests
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'credit-score-refresh', 3, 86400); // 3 refreshes per day
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Daily refresh limit exceeded. You can refresh your credit score 3 times per day.',
          retryAfter: rateLimitResult.retryAfter
        },
        { status: 429 }
      );
    }

    // Authentication
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = user.userId;

    // Authorization
    const hasPermission = await rbacSystem.checkPermission(
      userId,
      'credit-reports',
      'refresh',
      { ownerId: userId }
    );

    if (!hasPermission) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if user has completed KYC
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        panNumber: true,
        name: true,
        dateOfBirth: true,
        isVerified: true
      }
    });

    if (!userProfile || !userProfile.panNumber || !userProfile.isVerified) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Complete KYC verification required for credit score refresh' 
        },
        { status: 400 }
      );
    }

    // Queue fresh credit score fetch
    const job = await jobQueue.addJob('fetch-credit-score', {
      userId,
      panNumber: userProfile.panNumber,
      name: userProfile.name,
      dateOfBirth: userProfile.dateOfBirth,
      forced: true
    }, {
      priority: 2,
      attempts: 3
    });

    // Invalidate cache
    await cache.deleteByPattern(`user:credit-score:${userId}`);

    // Log refresh request
    await auditLogger.logAction(
      'credit-score-refresh-requested',
      'credit_report',
      userId,
      { jobId: job.id },
      userId
    );

    return NextResponse.json({
      success: true,
      message: 'Credit score refresh initiated. Please check back in 3-5 minutes.',
      data: {
        jobId: job.id,
        status: 'PROCESSING',
        estimatedCompletionTime: '3-5 minutes',
        refreshesRemaining: rateLimitResult.remaining - 1
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    }, {
      status: 202,
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': (rateLimitResult.remaining - 1).toString()
      }
    });

  } catch (error: any) {
    console.error('Credit score refresh error:', error);

    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'credit-score.refresh',
      entityType: 'credit_report',
      entityId: userId || 'unknown',
      success: false,
      errorMessage: error.message,
      userId,
      duration: Date.now() - startTime
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initiate credit score refresh',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateScoreImprovement(reports: any[]): any {
  if (reports.length < 2) return null;

  const current = reports[0];
  const previous = reports[1];

  const currentScore = current.cibilScore || current.experianScore || current.equifaxScore || current.highmarkScore;
  const previousScore = previous.cibilScore || previous.experianScore || previous.equifaxScore || previous.highmarkScore;

  if (!currentScore || !previousScore) return null;

  const improvement = currentScore - previousScore;
  const improvementPercentage = Math.round((improvement / previousScore) * 100);

  return {
    pointsChange: improvement,
    percentageChange: improvementPercentage,
    trend: improvement > 0 ? 'IMPROVING' : improvement < 0 ? 'DECLINING' : 'STABLE',
    timePeriod: Math.floor((current.fetchedAt.getTime() - previous.fetchedAt.getTime()) / (1000 * 60 * 60 * 24))
  };
}

function generateRecommendations(score: number | null, riskCategory: string): string[] {
  if (!score) {
    return [
      'Complete your KYC to view credit score',
      'Upload required documents for verification'
    ];
  }

  const recommendations = [];

  if (score < 650) {
    recommendations.push(
      'Pay all bills and EMIs on time to improve your credit score',
      'Keep credit utilization below 30% of your credit limit',
      'Avoid applying for multiple loans or credit cards simultaneously',
      'Check your credit report for errors and dispute if found'
    );
  } else if (score < 700) {
    recommendations.push(
      'Maintain consistent payment history',
      'Consider increasing your credit limit to improve utilization ratio',
      'Keep old credit accounts open to maintain credit history length'
    );
  } else if (score < 750) {
    recommendations.push(
      'Excellent score! Maintain current financial discipline',
      'You may qualify for loans at better interest rates',
      'Consider diversifying your credit portfolio responsibly'
    );
  } else {
    recommendations.push(
      'Outstanding credit score! You have access to the best rates',
      'Continue maintaining your excellent payment history',
      'You can negotiate better terms with lenders'
    );
  }

  return recommendations;
}