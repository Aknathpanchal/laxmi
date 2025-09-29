import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for underwriter dashboard
    const mockData = {
      overview: {
        pendingApplications: 27,
        todayProcessed: 8,
        approvalRate: 78.5,
        avgProcessingTime: 2.3, // hours
        riskDistribution: {
          low: 45,
          medium: 35,
          high: 20
        }
      },
      applications: [
        {
          id: 'APP001',
          applicantName: 'Rahul Sharma',
          amount: 500000,
          product: 'Personal Loan',
          submittedAt: '2024-01-15T10:30:00Z',
          riskScore: 7.2,
          riskCategory: 'MEDIUM',
          cibilScore: 720,
          recommendation: 'REVIEW_REQUIRED',
          priority: 'HIGH'
        },
        {
          id: 'APP002',
          applicantName: 'Priya Patel',
          amount: 1000000,
          product: 'Business Loan',
          submittedAt: '2024-01-15T09:15:00Z',
          riskScore: 8.5,
          riskCategory: 'HIGH',
          cibilScore: 680,
          recommendation: 'CONDITIONAL_APPROVAL',
          priority: 'MEDIUM'
        },
        {
          id: 'APP003',
          applicantName: 'Amit Kumar',
          amount: 250000,
          product: 'Personal Loan',
          submittedAt: '2024-01-15T08:45:00Z',
          riskScore: 5.8,
          riskCategory: 'LOW',
          cibilScore: 780,
          recommendation: 'APPROVE',
          priority: 'LOW'
        }
      ],
      riskMetrics: {
        portfolioRisk: 6.8,
        defaultRate: 2.1,
        fraudAlerts: 3,
        modelAccuracy: 94.2
      },
      workload: {
        assigned: 15,
        inProgress: 5,
        completed: 8,
        pending: 12
      }
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Underwriter dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch underwriter dashboard data' },
      { status: 500 }
    );
  }
}