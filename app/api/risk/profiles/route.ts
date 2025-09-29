import { NextRequest, NextResponse } from 'next/server';

// Mock risk profiles database
const riskProfilesDB = [
  {
    id: 'RISK001',
    loanId: 'LN2024001',
    customerName: 'Rajesh Kumar',
    loanAmount: 500000,
    riskScore: 72,
    riskCategory: 'high',
    pdScore: 0.15, // 15% probability of default
    lgdScore: 0.45, // 45% loss given default
    eadAmount: 450000, // Exposure at default
    expectedLoss: 30375, // PD * LGD * EAD
    factors: {
      creditHistory: 65,
      debtToIncome: 78,
      employmentStability: 55,
      collateralQuality: 70,
      marketConditions: 80
    },
    alerts: [
      'High debt-to-income ratio detected',
      'Employment stability concerns'
    ],
    lastReviewed: '2024-01-15',
    nextReview: '2024-02-15'
  },
  {
    id: 'RISK002',
    loanId: 'LN2024002',
    customerName: 'Priya Sharma',
    loanAmount: 300000,
    riskScore: 35,
    riskCategory: 'low',
    pdScore: 0.03,
    lgdScore: 0.30,
    eadAmount: 280000,
    expectedLoss: 2520,
    factors: {
      creditHistory: 85,
      debtToIncome: 40,
      employmentStability: 90,
      collateralQuality: 88,
      marketConditions: 75
    },
    alerts: [],
    lastReviewed: '2024-01-10',
    nextReview: '2024-03-10'
  },
  {
    id: 'RISK003',
    loanId: 'LN2024003',
    customerName: 'Amit Patel',
    loanAmount: 750000,
    riskScore: 55,
    riskCategory: 'medium',
    pdScore: 0.08,
    lgdScore: 0.40,
    eadAmount: 700000,
    expectedLoss: 22400,
    factors: {
      creditHistory: 70,
      debtToIncome: 60,
      employmentStability: 75,
      collateralQuality: 65,
      marketConditions: 70
    },
    alerts: [
      'Collateral valuation needs review'
    ],
    lastReviewed: '2024-01-18',
    nextReview: '2024-02-18'
  },
  {
    id: 'RISK004',
    loanId: 'LN2024004',
    customerName: 'Sunita Verma',
    loanAmount: 1000000,
    riskScore: 88,
    riskCategory: 'critical',
    pdScore: 0.25,
    lgdScore: 0.60,
    eadAmount: 950000,
    expectedLoss: 142500,
    factors: {
      creditHistory: 45,
      debtToIncome: 85,
      employmentStability: 40,
      collateralQuality: 50,
      marketConditions: 65
    },
    alerts: [
      'Critical risk level - immediate review required',
      'Multiple payment defaults in history',
      'Insufficient collateral coverage'
    ],
    lastReviewed: '2024-01-20',
    nextReview: '2024-01-25'
  },
  {
    id: 'RISK005',
    loanId: 'LN2024005',
    customerName: 'Vikram Singh',
    loanAmount: 200000,
    riskScore: 42,
    riskCategory: 'medium',
    pdScore: 0.05,
    lgdScore: 0.35,
    eadAmount: 185000,
    expectedLoss: 3237.50,
    factors: {
      creditHistory: 75,
      debtToIncome: 50,
      employmentStability: 80,
      collateralQuality: 72,
      marketConditions: 78
    },
    alerts: [],
    lastReviewed: '2024-01-12',
    nextReview: '2024-02-12'
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter') || 'all';

    let profiles = [...riskProfilesDB];

    // Apply filters
    if (filter !== 'all') {
      profiles = profiles.filter(p => p.riskCategory === filter);
    }

    // Sort by risk score (highest first)
    profiles.sort((a, b) => b.riskScore - a.riskScore);

    return NextResponse.json({
      success: true,
      profiles,
      summary: {
        total: profiles.length,
        critical: profiles.filter(p => p.riskCategory === 'critical').length,
        high: profiles.filter(p => p.riskCategory === 'high').length,
        medium: profiles.filter(p => p.riskCategory === 'medium').length,
        low: profiles.filter(p => p.riskCategory === 'low').length,
        totalExposure: profiles.reduce((sum, p) => sum + p.eadAmount, 0),
        totalExpectedLoss: profiles.reduce((sum, p) => sum + p.expectedLoss, 0)
      }
    });
  } catch (error) {
    console.error('Failed to fetch risk profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch risk profiles' },
      { status: 500 }
    );
  }
}