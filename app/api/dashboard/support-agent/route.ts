import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for support agent dashboard
    const mockData = {
      overview: {
        activeTickets: 23,
        todayResolved: 8,
        avgResponseTime: 1.2, // minutes
        customerSatisfaction: 4.7,
        slaCompliance: 89.5,
        escalatedTickets: 3
      },
      tickets: [
        {
          id: 'TKT001',
          customerId: 'CUST001',
          customerName: 'Rahul Sharma',
          subject: 'Loan EMI Auto-debit Issue',
          category: 'PAYMENT_ISSUE',
          priority: 'HIGH',
          status: 'OPEN',
          createdAt: '2024-01-15T09:30:00Z',
          assignedTo: 'Deepika Rao',
          lastUpdate: '2024-01-15T10:15:00Z',
          sla: {
            responseTime: 15, // minutes
            resolutionTime: 240, // minutes
            breached: false
          },
          channel: 'PHONE'
        },
        {
          id: 'TKT002',
          customerId: 'CUST002',
          customerName: 'Priya Patel',
          subject: 'Interest Rate Calculation Query',
          category: 'PRODUCT_INQUIRY',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          createdAt: '2024-01-15T08:45:00Z',
          assignedTo: 'Deepika Rao',
          lastUpdate: '2024-01-15T09:30:00Z',
          sla: {
            responseTime: 30,
            resolutionTime: 480,
            breached: false
          },
          channel: 'EMAIL'
        },
        {
          id: 'TKT003',
          customerId: 'CUST003',
          customerName: 'Amit Kumar',
          subject: 'Mobile App Login Issue',
          category: 'TECHNICAL_ISSUE',
          priority: 'LOW',
          status: 'PENDING_CUSTOMER',
          createdAt: '2024-01-15T07:15:00Z',
          assignedTo: 'Deepika Rao',
          lastUpdate: '2024-01-15T08:00:00Z',
          sla: {
            responseTime: 45,
            resolutionTime: 720,
            breached: false
          },
          channel: 'CHAT'
        }
      ],
      categoryStats: {
        'PAYMENT_ISSUE': 8,
        'PRODUCT_INQUIRY': 6,
        'TECHNICAL_ISSUE': 4,
        'DOCUMENTATION': 3,
        'COMPLAINT': 2
      },
      channelStats: {
        'PHONE': 12,
        'EMAIL': 7,
        'CHAT': 3,
        'WEB_FORM': 1
      },
      performance: {
        avgResolutionTime: 4.2, // hours
        firstCallResolution: 78.5,
        escalationRate: 8.2,
        reopenRate: 3.1,
        customerRating: 4.7,
        slaBreaches: 2
      },
      knowledgeBase: [
        {
          id: 'KB001',
          title: 'How to reset mobile banking PIN',
          category: 'MOBILE_BANKING',
          views: 156,
          lastUpdated: '2024-01-10',
          rating: 4.8
        },
        {
          id: 'KB002',
          title: 'EMI calculation and payment schedule',
          category: 'LOAN_SERVICES',
          views: 243,
          lastUpdated: '2024-01-08',
          rating: 4.9
        },
        {
          id: 'KB003',
          title: 'Document upload requirements for KYC',
          category: 'KYC_DOCUMENTATION',
          views: 189,
          lastUpdated: '2024-01-12',
          rating: 4.6
        }
      ],
      recentCalls: [
        {
          id: 'CALL001',
          customerId: 'CUST004',
          customerName: 'Mohan Lal',
          phoneNumber: '+91-9876543210',
          callDuration: 8.5, // minutes
          callTime: '2024-01-15T10:30:00Z',
          purpose: 'Loan Status Inquiry',
          resolution: 'RESOLVED',
          notes: 'Provided loan disbursement timeline'
        },
        {
          id: 'CALL002',
          customerId: 'CUST005',
          customerName: 'Sunita Devi',
          phoneNumber: '+91-9876543211',
          callDuration: 12.3,
          callTime: '2024-01-15T09:45:00Z',
          purpose: 'Payment Gateway Issue',
          resolution: 'ESCALATED',
          notes: 'Technical team intervention required'
        }
      ],
      dailyMetrics: [
        { hour: '09:00', tickets: 2, calls: 5, satisfaction: 4.8 },
        { hour: '10:00', tickets: 4, calls: 8, satisfaction: 4.6 },
        { hour: '11:00', tickets: 3, calls: 6, satisfaction: 4.9 },
        { hour: '12:00', tickets: 5, calls: 4, satisfaction: 4.5 },
        { hour: '13:00', tickets: 2, calls: 3, satisfaction: 4.7 },
        { hour: '14:00', tickets: 4, calls: 7, satisfaction: 4.8 }
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Support agent dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support agent dashboard data' },
      { status: 500 }
    );
  }
}