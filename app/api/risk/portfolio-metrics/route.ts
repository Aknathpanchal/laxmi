import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock portfolio-level metrics
    const metrics = {
      totalExposure: 12500000, // ₹12.5M
      expectedLoss: 375000, // ₹375K
      unexpectedLoss: 125000, // ₹125K
      var95: 500000, // Value at Risk 95% confidence
      var99: 750000, // Value at Risk 99% confidence
      averagePD: 0.082, // 8.2% average probability of default
      averageLGD: 0.42, // 42% average loss given default
      concentrationRisk: 0.35, // 35% concentration risk
      portfolioHealth: 'moderate',
      trends: {
        expectedLossChange: 5.2, // +5.2% vs last month
        pdChange: -2.1, // -2.1% vs last month
        exposureChange: 8.5 // +8.5% vs last month
      },
      stressTestResults: {
        mildRecession: {
          expectedLoss: 450000,
          var95: 625000
        },
        severeRecession: {
          expectedLoss: 750000,
          var95: 1125000
        },
        marketCrash: {
          expectedLoss: 1250000,
          var95: 1875000
        }
      }
    };

    return NextResponse.json({
      success: true,
      metrics,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch portfolio metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio metrics' },
      { status: 500 }
    );
  }
}