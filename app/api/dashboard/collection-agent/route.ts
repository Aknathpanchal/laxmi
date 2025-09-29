import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for collection agent dashboard
    const mockData = {
      overview: {
        totalCases: 45,
        todayContacts: 12,
        recoveryRate: 72.3,
        totalOverdue: 2400000, // in rupees
        targetAchievement: 85.6
      },
      collectionQueue: [
        {
          id: 'COL001',
          customerId: 'CUST001',
          customerName: 'Rajesh Kumar',
          phoneNumber: '+91-9876543210',
          loanId: 'LOAN123',
          overdueAmount: 15000,
          daysPastDue: 15,
          bucket: 'BUCKET_0_30',
          lastContactDate: '2024-01-12',
          promiseToPayDate: '2024-01-18',
          contactHistory: 3,
          priority: 'HIGH',
          riskCategory: 'MEDIUM'
        },
        {
          id: 'COL002',
          customerId: 'CUST002',
          customerName: 'Sunita Devi',
          phoneNumber: '+91-9876543211',
          loanId: 'LOAN124',
          overdueAmount: 25000,
          daysPastDue: 45,
          bucket: 'BUCKET_30_60',
          lastContactDate: '2024-01-10',
          promiseToPayDate: null,
          contactHistory: 7,
          priority: 'HIGH',
          riskCategory: 'HIGH'
        },
        {
          id: 'COL003',
          customerId: 'CUST003',
          customerName: 'Amit Sharma',
          phoneNumber: '+91-9876543212',
          loanId: 'LOAN125',
          overdueAmount: 8000,
          daysPastDue: 8,
          bucket: 'BUCKET_0_30',
          lastContactDate: '2024-01-14',
          promiseToPayDate: '2024-01-16',
          contactHistory: 1,
          priority: 'MEDIUM',
          riskCategory: 'LOW'
        }
      ],
      bucketDistribution: {
        'BUCKET_0_30': 18,
        'BUCKET_30_60': 12,
        'BUCKET_60_90': 8,
        'BUCKET_90_PLUS': 7
      },
      performance: {
        dailyTarget: 15,
        achieved: 13,
        recoveryAmount: 125000,
        targetAmount: 150000,
        callsMade: 28,
        connectRate: 67.5,
        promiseToPayRate: 45.2
      },
      fieldVisits: [
        {
          id: 'VISIT001',
          customerId: 'CUST004',
          customerName: 'Mohan Lal',
          address: '123 MG Road, Mumbai',
          scheduledDate: '2024-01-16',
          status: 'SCHEDULED',
          purpose: 'Payment Collection',
          overdueAmount: 35000
        }
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Collection agent dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collection agent dashboard data' },
      { status: 500 }
    );
  }
}