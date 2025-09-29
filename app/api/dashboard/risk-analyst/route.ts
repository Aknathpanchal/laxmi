import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for risk analyst dashboard
    const mockData = {
      overview: {
        portfolioRisk: 7.3,
        modelAccuracy: 94.2,
        fraudAlerts: 8,
        activeModels: 12,
        dataQuality: 98.5,
        riskAdjustedReturn: 15.8
      },
      modelPerformance: [
        {
          id: 'MODEL_001',
          name: 'Credit Risk Scoring Model',
          type: 'CREDIT_RISK',
          accuracy: 94.2,
          precision: 91.8,
          recall: 89.5,
          f1Score: 90.6,
          lastUpdated: '2024-01-10',
          status: 'ACTIVE',
          performance: 'EXCELLENT'
        },
        {
          id: 'MODEL_002',
          name: 'Fraud Detection Model',
          type: 'FRAUD_DETECTION',
          accuracy: 97.5,
          precision: 96.2,
          recall: 94.8,
          f1Score: 95.5,
          lastUpdated: '2024-01-12',
          status: 'ACTIVE',
          performance: 'EXCELLENT'
        },
        {
          id: 'MODEL_003',
          name: 'Collection Propensity Model',
          type: 'COLLECTION',
          accuracy: 88.7,
          precision: 85.3,
          recall: 87.1,
          f1Score: 86.2,
          lastUpdated: '2024-01-08',
          status: 'RETRAINING',
          performance: 'GOOD'
        }
      ],
      riskAlerts: [
        {
          id: 'ALERT_001',
          type: 'PORTFOLIO_CONCENTRATION',
          severity: 'HIGH',
          description: 'Geographic concentration risk in Mumbai region exceeds 35%',
          timestamp: '2024-01-15T09:30:00Z',
          affectedAmount: 450000000,
          status: 'OPEN',
          assignedTo: 'Risk Team Alpha'
        },
        {
          id: 'ALERT_002',
          type: 'FRAUD_PATTERN',
          severity: 'CRITICAL',
          description: 'Unusual application pattern detected from specific IP range',
          timestamp: '2024-01-15T08:15:00Z',
          affectedApplications: 12,
          status: 'INVESTIGATING',
          assignedTo: 'Fraud Investigation Unit'
        },
        {
          id: 'ALERT_003',
          type: 'CREDIT_DETERIORATION',
          severity: 'MEDIUM',
          description: 'Early warning signals for segment: Young Professionals',
          timestamp: '2024-01-15T07:45:00Z',
          affectedAccounts: 89,
          status: 'MONITORING',
          assignedTo: 'Credit Risk Team'
        }
      ],
      stressTestResults: [
        {
          scenario: 'Economic Downturn',
          type: 'MACRO_STRESS',
          portfolioLoss: 2.8,
          defaultRate: 5.2,
          capitalRequirement: 12.8,
          passStatus: 'PASS',
          lastRun: '2024-01-10'
        },
        {
          scenario: 'Interest Rate Shock',
          type: 'MARKET_STRESS',
          portfolioLoss: 1.9,
          defaultRate: 3.8,
          capitalRequirement: 11.2,
          passStatus: 'PASS',
          lastRun: '2024-01-10'
        },
        {
          scenario: 'Sector Concentration',
          type: 'CONCENTRATION_STRESS',
          portfolioLoss: 3.5,
          defaultRate: 6.1,
          capitalRequirement: 14.2,
          passStatus: 'MARGINAL',
          lastRun: '2024-01-10'
        }
      ],
      riskTrends: {
        creditRisk: [
          { month: 'Aug', value: 7.1 },
          { month: 'Sep', value: 7.0 },
          { month: 'Oct', value: 7.2 },
          { month: 'Nov', value: 7.5 },
          { month: 'Dec', value: 7.3 },
          { month: 'Jan', value: 7.3 }
        ],
        fraudRate: [
          { month: 'Aug', value: 0.8 },
          { month: 'Sep', value: 0.6 },
          { month: 'Oct', value: 0.9 },
          { month: 'Nov', value: 0.7 },
          { month: 'Dec', value: 0.5 },
          { month: 'Jan', value: 0.8 }
        ]
      },
      portfolioMetrics: {
        var95: 125000000, // Value at Risk 95%
        expectedShortfall: 180000000,
        probabilityOfDefault: 2.1,
        lossGivenDefault: 35.2,
        exposureAtDefault: 2.8,
        riskWeightedAssets: 8500000000
      }
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Risk analyst dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch risk analyst dashboard data' },
      { status: 500 }
    );
  }
}