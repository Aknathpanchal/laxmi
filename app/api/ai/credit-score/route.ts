import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { aiCreditScorer, CreditScoringInput } from '@/backend/services/ai-credit-scoring';
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
 * AI-Powered Credit Scoring API
 * Revolutionary NBFC feature using behavioral analytics and alternative data
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Authentication check
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { loanAmount, tenure, purpose } = body;

    // Fetch user data from database
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        profile: true,
        loans: {
          where: {
            status: { in: ['ACTIVE', 'DISBURSED'] }
          }
        },
        transactions: {
          take: 100,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare data for AI scoring
    const scoringInput: CreditScoringInput = {
      traditionalData: {
        cibilScore: body.cibilScore || Math.floor(Math.random() * 200 + 650), // Mock if not provided
        income: userData.profile?.monthlyIncome || body.monthlyIncome || 30000,
        employmentYears: body.workExperience || 2,
        existingLoans: userData.loans?.length || 0,
        loanAmount: loanAmount || 50000,
        tenure: tenure || 12
      },
      behavioralData: {
        deviceType: request.headers.get('user-agent')?.includes('iPhone') ? 'ios' :
                   request.headers.get('user-agent')?.includes('Android') ? 'android' : 'web',
        appUsageHours: Math.random() * 10 + 2, // Mock data
        financialAppsCount: Math.floor(Math.random() * 5 + 1),
        avgTransactionAmount: userData.transactions?.length ?
          userData.transactions.reduce((sum, t) => sum + (t.amount || 0), 0) / userData.transactions.length :
          5000,
        digitalPaymentFrequency: userData.transactions?.length || 10,
        socialMediaActivity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
      },
      alternativeData: {
        utilityPaymentHistory: Array(6).fill(0).map(() => ({
          onTime: Math.random() > 0.2,
          amount: Math.random() * 5000 + 1000
        })),
        telcoBillPayments: Math.random() * 30 + 70, // 70-100% on-time rate
        ecommerceActivity: {
          purchaseFrequency: Math.floor(Math.random() * 10 + 1),
          avgOrderValue: Math.random() * 10000 + 1000,
          returnRate: Math.random() * 0.2
        },
        gstFilingRegularity: Math.random() > 0.5
      }
    };

    // Calculate AI credit score
    const creditScore = await aiCreditScorer.calculateCreditScore(scoringInput);

    // Store scoring result in database
    await prisma.creditScore.create({
      data: {
        userId: user.userId,
        internalScore: creditScore.score,
        scoreVersion: 'v2.0',
        scoringModel: 'AI_ENSEMBLE',
        scoreFactors: {
          grade: creditScore.grade,
          riskLevel: creditScore.riskLevel,
          factors: creditScore.factors,
          confidence: creditScore.confidence
        },
        dataPoints: {
          ensembleScore: creditScore.ensembleScore,
          approvalProbability: creditScore.approvalProbability,
          processingTimeMs: creditScore.processingTimeMs,
          creditLimit: loanAmount * (creditScore.approvalProbability)
        },
        behavioralScore: creditScore.behavioralScore,
        financialScore: Math.round(creditScore.score * 0.4),
        nextUpdateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    });

    // Calculate recommended loan terms
    const recommendedTerms = calculateRecommendedTerms(creditScore, loanAmount, tenure);

    // Generate personalized insights
    const insights = generatePersonalizedInsights(creditScore, userData);

    return NextResponse.json({
      success: true,
      data: {
        creditScore: {
          score: creditScore.score,
          grade: creditScore.grade,
          approvalProbability: `${Math.round(creditScore.approvalProbability * 100)}%`,
          riskLevel: creditScore.riskLevel
        },
        aiScoring: {
          traditional: Math.round(creditScore.score * 0.4),
          behavioral: creditScore.behavioralScore,
          alternative: creditScore.alternativeScore,
          ensemble: creditScore.ensembleScore,
          confidence: `${Math.round(creditScore.confidence * 100)}%`
        },
        factors: creditScore.factors,
        recommendedTerms,
        insights,
        processingTime: `${creditScore.processingTimeMs}ms`,
        disclaimer: 'This is an AI-generated score using behavioral and alternative data. Final approval subject to verification.'
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        aiVersion: 'v2.0-ensemble',
        modelConfidence: creditScore.confidence
      }
    }, {
      headers: {
        'X-AI-Score': creditScore.score.toString(),
        'X-Processing-Time': `${Date.now() - startTime}ms`,
        'X-Model-Version': 'ensemble-v2'
      }
    });

  } catch (error: any) {
    console.error('AI Credit Scoring error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate AI credit score',
        message: error.message || 'An error occurred during scoring',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to fetch credit score history
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

    const scores = await prisma.creditScore.findMany({
      where: { userId: user.userId },
      orderBy: { lastCalculatedAt: 'desc' },
      take: 10
    });

    return NextResponse.json({
      success: true,
      data: {
        scores: scores.map(score => ({
          id: score.id,
          score: score.internalScore,
          scoringModel: score.scoringModel,
          creditLimit: (score.dataPoints as any)?.creditLimit || 0,
          fetchedAt: score.lastCalculatedAt,
          metadata: {
            scoreFactors: score.scoreFactors,
            dataPoints: score.dataPoints,
            behavioralScore: score.behavioralScore,
            financialScore: score.financialScore
          }
        })),
        averageScore: scores.length ?
          Math.round(scores.reduce((sum, s) => sum + (s.internalScore || 0), 0) / scores.length) :
          null,
        trend: calculateScoreTrend(scores)
      }
    });

  } catch (error) {
    console.error('Credit score fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch credit scores' },
      { status: 500 }
    );
  }
}

function calculateRecommendedTerms(creditScore: any, requestedAmount: number, requestedTenure: number) {
  const baseRate = 12; // Base interest rate
  let interestRate = baseRate;

  // Adjust rate based on credit grade
  switch (creditScore.grade) {
    case 'A+': interestRate -= 3; break;
    case 'A': interestRate -= 2; break;
    case 'B': interestRate -= 1; break;
    case 'C': interestRate += 0; break;
    case 'D': interestRate += 2; break;
    case 'E': interestRate += 4; break;
  }

  // Calculate approved amount based on probability
  const approvedAmount = Math.round(requestedAmount * creditScore.approvalProbability);

  // Calculate EMI
  const monthlyRate = interestRate / 12 / 100;
  const emi = Math.round(
    (approvedAmount * monthlyRate * Math.pow(1 + monthlyRate, requestedTenure)) /
    (Math.pow(1 + monthlyRate, requestedTenure) - 1)
  );

  return {
    approvedAmount,
    interestRate: `${interestRate}% p.a.`,
    tenure: requestedTenure,
    emi,
    processingFee: approvedAmount * 0.02,
    totalPayable: emi * requestedTenure,
    totalInterest: (emi * requestedTenure) - approvedAmount,
    preApproved: creditScore.score >= 750
  };
}

function generatePersonalizedInsights(creditScore: any, userData: any) {
  const insights = [];

  // Score-based insights
  if (creditScore.score >= 800) {
    insights.push({
      type: 'success',
      message: 'Excellent credit profile! You qualify for our premium rates.',
      icon: '🌟'
    });
  } else if (creditScore.score >= 700) {
    insights.push({
      type: 'info',
      message: 'Good credit score. Maintain timely payments to unlock better rates.',
      icon: '✨'
    });
  } else {
    insights.push({
      type: 'warning',
      message: 'Building credit history. Follow our recommendations to improve.',
      icon: '📈'
    });
  }

  // Behavioral insights
  if (creditScore.behavioralScore > 750) {
    insights.push({
      type: 'success',
      message: 'Your digital behavior indicates financial responsibility.',
      icon: '💎'
    });
  }

  // Alternative data insights
  if (creditScore.alternativeScore > 700) {
    insights.push({
      type: 'success',
      message: 'Strong alternative credit indicators boost your eligibility.',
      icon: '🎯'
    });
  }

  // Improvement suggestions
  if (creditScore.factors.suggestions.length > 0) {
    insights.push({
      type: 'tip',
      message: creditScore.factors.suggestions[0],
      icon: '💡'
    });
  }

  return insights;
}

function calculateScoreTrend(scores: any[]): string {
  if (scores.length < 2) return 'stable';

  const recent = scores[0]?.score || 0;
  const previous = scores[1]?.score || 0;

  if (recent > previous + 20) return 'improving';
  if (recent < previous - 20) return 'declining';
  return 'stable';
}