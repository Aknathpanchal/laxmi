import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for user dashboard
    const mockData = {
      profile: {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91-9876543210',
        kycStatus: 'VERIFIED',
        creditScore: 750,
        tier: 'GOLD',
        memberSince: '2023-06-15',
        profileCompletion: 95,
        availableCredit: 325000
      },
      loans: {
        active: [
          {
            id: 'LOAN001',
            type: 'Personal Loan',
            amount: 500000,
            emi: 12500,
            nextDueDate: '2024-02-05',
            remainingAmount: 350000,
            status: 'ACTIVE',
            interestRate: 12.5,
            tenure: 48,
            completedMonths: 18
          },
          {
            id: 'LOAN002',
            type: 'Business Loan',
            amount: 1000000,
            emi: 28000,
            nextDueDate: '2024-02-10',
            remainingAmount: 750000,
            status: 'ACTIVE',
            interestRate: 14.2,
            tenure: 36,
            completedMonths: 8
          }
        ],
        history: [
          {
            id: 'LOAN003',
            type: 'Personal Loan',
            amount: 200000,
            status: 'CLOSED',
            closedDate: '2023-12-15',
            rating: 'EXCELLENT'
          }
        ]
      },
      financials: {
        totalOutstanding: 1100000,
        monthlyEMI: 40500,
        nextPaymentDate: '2024-02-05',
        creditUtilization: 68.5,
        paymentHistory: 98.2,
        totalPaid: 480000
      },
      rewards: {
        totalPoints: 2450,
        tier: 'GOLD',
        expiringPoints: 150,
        expirationDate: '2024-03-15',
        recentEarnings: [
          { date: '2024-01-15', points: 50, reason: 'EMI Payment' },
          { date: '2024-01-10', points: 25, reason: 'App Usage' }
        ]
      },
      notifications: [
        {
          id: 'NOTIF001',
          type: 'PAYMENT_REMINDER',
          title: 'EMI Due Tomorrow',
          message: 'Your EMI of ₹12,500 is due on Feb 5, 2024',
          timestamp: '2024-02-04T09:00:00Z',
          priority: 'HIGH',
          read: false
        },
        {
          id: 'NOTIF002',
          type: 'PROMOTION',
          title: 'Special Offer: Home Loan',
          message: 'Get home loan at 8.5% interest rate. Limited time offer!',
          timestamp: '2024-02-03T10:30:00Z',
          priority: 'MEDIUM',
          read: false
        },
        {
          id: 'NOTIF003',
          type: 'REWARD',
          title: 'Points Earned',
          message: 'You earned 50 reward points for your recent EMI payment',
          timestamp: '2024-02-01T11:15:00Z',
          priority: 'LOW',
          read: true
        }
      ],
      quickActions: [
        {
          id: 'PAY_EMI',
          title: 'Pay EMI',
          description: 'Make your next EMI payment',
          amount: 40500,
          dueDate: '2024-02-05',
          urgent: true
        },
        {
          id: 'APPLY_LOAN',
          title: 'Apply for New Loan',
          description: 'Pre-approved for up to ₹8,00,000',
          preApproved: true
        },
        {
          id: 'VIEW_STATEMENT',
          title: 'Download Statement',
          description: 'Get your loan account statement',
          lastGenerated: '2024-01-31'
        }
      ],
      recentTransactions: [
        {
          id: 'TXN001',
          type: 'EMI_PAYMENT',
          amount: 12500,
          date: '2024-01-05',
          status: 'SUCCESS',
          loanId: 'LOAN001',
          paymentMethod: 'AUTO_DEBIT'
        },
        {
          id: 'TXN002',
          type: 'EMI_PAYMENT',
          amount: 28000,
          date: '2024-01-10',
          status: 'SUCCESS',
          loanId: 'LOAN002',
          paymentMethod: 'UPI'
        },
        {
          id: 'TXN003',
          type: 'PROCESSING_FEE',
          amount: 2500,
          date: '2024-01-08',
          status: 'SUCCESS',
          description: 'Loan processing fee'
        }
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('User dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user dashboard data' },
      { status: 500 }
    );
  }
}