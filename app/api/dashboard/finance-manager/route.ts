import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for finance manager dashboard
    const mockData = {
      overview: {
        totalPortfolio: 12500000000, // 125 Crores
        monthlyRevenue: 850000000, // 8.5 Crores
        netInterestMargin: 8.5,
        returnOnAssets: 12.3,
        capitalAdequacyRatio: 15.2,
        profitAfterTax: 125000000 // 1.25 Crores
      },
      pnlSummary: {
        interestIncome: 950000000,
        interestExpense: 200000000,
        netInterestIncome: 750000000,
        operatingExpenses: 450000000,
        provisioningExpenses: 75000000,
        netProfit: 225000000,
        grossNPA: 2.1,
        netNPA: 1.2
      },
      portfolioBreakdown: [
        {
          product: 'Personal Loans',
          outstandingAmount: 4500000000,
          percentage: 36,
          growthRate: 15.2,
          npaRate: 1.8
        },
        {
          product: 'Business Loans',
          outstandingAmount: 3200000000,
          percentage: 25.6,
          growthRate: 18.5,
          npaRate: 2.5
        },
        {
          product: 'Home Loans',
          outstandingAmount: 2800000000,
          percentage: 22.4,
          growthRate: 12.3,
          npaRate: 0.8
        },
        {
          product: 'Vehicle Loans',
          outstandingAmount: 2000000000,
          percentage: 16,
          growthRate: 8.7,
          npaRate: 1.5
        }
      ],
      compliance: {
        rbiCompliance: 98.5,
        auditScore: 94.2,
        regulatoryIssues: 2,
        complianceAlerts: [
          {
            id: 'COMP001',
            type: 'RBI Guideline',
            severity: 'MEDIUM',
            description: 'Review required for exposure limits',
            dueDate: '2024-01-20'
          },
          {
            id: 'COMP002',
            type: 'Internal Audit',
            severity: 'LOW',
            description: 'Documentation update pending',
            dueDate: '2024-01-25'
          }
        ]
      },
      riskMetrics: {
        creditRisk: 6.8,
        operationalRisk: 4.2,
        marketRisk: 3.5,
        liquidityRatio: 18.5,
        exposureAtDefault: 2.8,
        lossGivenDefault: 35.2
      },
      monthlyTrends: [
        { month: 'Aug', revenue: 780000000, profit: 195000000, npa: 2.3 },
        { month: 'Sep', revenue: 820000000, profit: 210000000, npa: 2.2 },
        { month: 'Oct', revenue: 850000000, profit: 225000000, npa: 2.1 },
        { month: 'Nov', revenue: 870000000, profit: 235000000, npa: 2.0 },
        { month: 'Dec', revenue: 890000000, profit: 245000000, npa: 1.9 },
        { month: 'Jan', revenue: 850000000, profit: 225000000, npa: 2.1 }
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Finance manager dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch finance manager dashboard data' },
      { status: 500 }
    );
  }
}