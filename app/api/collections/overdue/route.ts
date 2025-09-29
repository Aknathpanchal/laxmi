import { NextRequest, NextResponse } from 'next/server';

// Mock overdue accounts database
const overdueAccountsDB = [
  {
    id: 'OVD001',
    loanId: 'LN2024001',
    customerId: 'CUST001',
    customerName: 'Rajesh Kumar',
    phoneNumber: '+919876543210',
    email: 'rajesh.kumar@gmail.com',
    loanAmount: 100000,
    outstandingAmount: 85000,
    emiAmount: 5000,
    daysOverdue: 30,
    lastPaymentDate: '2023-12-25',
    nextActionDate: '2024-01-25',
    priority: 'high',
    lastContactDate: '2024-01-20',
    lastContactMethod: 'phone',
    lastContactResult: 'Promised to pay by month end',
    attempts: 5,
    promiseToPayDate: '2024-01-31',
    collectionStage: 'soft',
    notes: 'Customer facing temporary financial issues'
  },
  {
    id: 'OVD002',
    loanId: 'LN2024002',
    customerId: 'CUST002',
    customerName: 'Priya Sharma',
    phoneNumber: '+919876543211',
    email: 'priya.sharma@gmail.com',
    loanAmount: 50000,
    outstandingAmount: 45000,
    emiAmount: 3000,
    daysOverdue: 60,
    lastPaymentDate: '2023-11-25',
    nextActionDate: '2024-01-23',
    priority: 'high',
    lastContactDate: '2024-01-18',
    lastContactMethod: 'email',
    lastContactResult: 'No response',
    attempts: 8,
    promiseToPayDate: null,
    collectionStage: 'hard',
    notes: 'Multiple attempts, no response'
  },
  {
    id: 'OVD003',
    loanId: 'LN2024003',
    customerId: 'CUST003',
    customerName: 'Amit Patel',
    phoneNumber: '+919876543212',
    email: 'amit.patel@gmail.com',
    loanAmount: 75000,
    outstandingAmount: 70000,
    emiAmount: 4000,
    daysOverdue: 15,
    lastPaymentDate: '2024-01-10',
    nextActionDate: '2024-01-26',
    priority: 'medium',
    lastContactDate: '2024-01-22',
    lastContactMethod: 'whatsapp',
    lastContactResult: 'Will pay next week',
    attempts: 3,
    promiseToPayDate: '2024-01-28',
    collectionStage: 'soft',
    notes: 'Regular customer, first time default'
  },
  {
    id: 'OVD004',
    loanId: 'LN2024004',
    customerId: 'CUST004',
    customerName: 'Sunita Verma',
    phoneNumber: '+919876543213',
    email: 'sunita.verma@gmail.com',
    loanAmount: 200000,
    outstandingAmount: 180000,
    emiAmount: 10000,
    daysOverdue: 90,
    lastPaymentDate: '2023-10-25',
    nextActionDate: '2024-01-24',
    priority: 'high',
    lastContactDate: '2024-01-19',
    lastContactMethod: 'phone',
    lastContactResult: 'Disputed loan terms',
    attempts: 12,
    promiseToPayDate: null,
    collectionStage: 'legal',
    notes: 'Legal notice sent'
  },
  {
    id: 'OVD005',
    loanId: 'LN2024005',
    customerId: 'CUST005',
    customerName: 'Vikram Singh',
    phoneNumber: '+919876543214',
    email: 'vikram.singh@gmail.com',
    loanAmount: 60000,
    outstandingAmount: 55000,
    emiAmount: 3500,
    daysOverdue: 7,
    lastPaymentDate: '2024-01-18',
    nextActionDate: '2024-01-27',
    priority: 'low',
    lastContactDate: null,
    lastContactMethod: null,
    lastContactResult: null,
    attempts: 1,
    promiseToPayDate: null,
    collectionStage: 'soft',
    notes: 'First reminder sent'
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter') || 'all';

    let accounts = [...overdueAccountsDB];

    // Apply filters
    switch (filter) {
      case 'high-priority':
        accounts = accounts.filter(a => a.priority === 'high');
        break;
      case 'pending-contact':
        accounts = accounts.filter(a => {
          const nextAction = new Date(a.nextActionDate);
          const today = new Date();
          return nextAction <= today;
        });
        break;
      case 'promised':
        accounts = accounts.filter(a => a.promiseToPayDate !== null);
        break;
    }

    // Sort by priority and days overdue
    accounts.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.daysOverdue - a.daysOverdue;
    });

    return NextResponse.json({
      success: true,
      accounts,
      summary: {
        total: accounts.length,
        totalOutstanding: accounts.reduce((sum, a) => sum + a.outstandingAmount, 0),
        highPriority: accounts.filter(a => a.priority === 'high').length,
        promisedToPay: accounts.filter(a => a.promiseToPayDate !== null).length,
        legalStage: accounts.filter(a => a.collectionStage === 'legal').length
      }
    });
  } catch (error) {
    console.error('Failed to fetch overdue accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overdue accounts' },
      { status: 500 }
    );
  }
}