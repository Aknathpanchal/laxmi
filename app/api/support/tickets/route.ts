import { NextRequest, NextResponse } from 'next/server';

// Mock tickets database
const ticketsDB = [
  {
    id: 'TKT001',
    ticketNumber: '2024012301',
    customerId: 'CUST001',
    customerName: 'Rajesh Kumar',
    customerEmail: 'rajesh@gmail.com',
    customerPhone: '+919876543210',
    subject: 'Unable to upload documents',
    description: 'I am trying to upload my Aadhaar card but getting an error message.',
    category: 'technical',
    priority: 'high',
    status: 'open',
    assignedTo: 'agent1@laxmione.com',
    createdAt: '2024-01-23T10:30:00Z',
    updatedAt: '2024-01-23T10:30:00Z',
    responseTime: null,
    messages: [
      {
        id: 'MSG001',
        sender: 'customer',
        senderName: 'Rajesh Kumar',
        content: 'I am trying to upload my Aadhaar card but getting an error message saying "File size too large" even though my file is only 2MB.',
        timestamp: '2024-01-23T10:30:00Z',
        attachments: []
      }
    ],
    tags: ['document-upload', 'technical-issue']
  },
  {
    id: 'TKT002',
    ticketNumber: '2024012302',
    customerId: 'CUST002',
    customerName: 'Priya Sharma',
    customerEmail: 'priya@gmail.com',
    customerPhone: '+919876543211',
    subject: 'Loan EMI calculation query',
    description: 'Need clarification on how my EMI was calculated.',
    category: 'billing',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'agent2@laxmione.com',
    createdAt: '2024-01-23T09:15:00Z',
    updatedAt: '2024-01-23T11:00:00Z',
    responseTime: 15,
    messages: [
      {
        id: 'MSG002',
        sender: 'customer',
        senderName: 'Priya Sharma',
        content: 'My loan amount is ₹50,000 at 12% interest for 24 months, but the EMI shown is different from what I calculated.',
        timestamp: '2024-01-23T09:15:00Z',
        attachments: []
      },
      {
        id: 'MSG003',
        sender: 'agent',
        senderName: 'Support Agent',
        content: 'Thank you for contacting us. Let me check your loan details and explain the EMI calculation.',
        timestamp: '2024-01-23T09:30:00Z',
        attachments: []
      }
    ],
    tags: ['emi', 'billing-query']
  },
  {
    id: 'TKT003',
    ticketNumber: '2024012303',
    customerId: 'CUST003',
    customerName: 'Amit Patel',
    customerEmail: 'amit@gmail.com',
    customerPhone: '+919876543212',
    subject: 'Application status inquiry',
    description: 'Want to know the status of my loan application.',
    category: 'loan',
    priority: 'low',
    status: 'resolved',
    assignedTo: 'agent1@laxmione.com',
    createdAt: '2024-01-22T14:20:00Z',
    updatedAt: '2024-01-22T15:00:00Z',
    resolvedAt: '2024-01-22T15:00:00Z',
    responseTime: 10,
    messages: [
      {
        id: 'MSG004',
        sender: 'customer',
        senderName: 'Amit Patel',
        content: 'I applied for a personal loan 3 days ago. Application ID: APP2024001',
        timestamp: '2024-01-22T14:20:00Z',
        attachments: []
      },
      {
        id: 'MSG005',
        sender: 'agent',
        senderName: 'Support Agent',
        content: 'Your application has been approved! You will receive the disbursement within 24 hours.',
        timestamp: '2024-01-22T14:30:00Z',
        attachments: []
      },
      {
        id: 'MSG006',
        sender: 'customer',
        senderName: 'Amit Patel',
        content: 'Thank you for the quick response!',
        timestamp: '2024-01-22T14:45:00Z',
        attachments: []
      }
    ],
    tags: ['loan-status', 'resolved']
  },
  {
    id: 'TKT004',
    ticketNumber: '2024012304',
    customerId: 'CUST004',
    customerName: 'Sunita Verma',
    customerEmail: 'sunita@gmail.com',
    customerPhone: '+919876543213',
    subject: 'URGENT: Payment not reflecting',
    description: 'Made EMI payment but not showing in account.',
    category: 'billing',
    priority: 'urgent',
    status: 'open',
    assignedTo: 'agent3@laxmione.com',
    createdAt: '2024-01-23T11:45:00Z',
    updatedAt: '2024-01-23T11:45:00Z',
    responseTime: null,
    messages: [
      {
        id: 'MSG007',
        sender: 'customer',
        senderName: 'Sunita Verma',
        content: 'I made an EMI payment of ₹10,000 through UPI at 10 AM today. Transaction ID: UPI123456789. But it is not reflecting in my account.',
        timestamp: '2024-01-23T11:45:00Z',
        attachments: ['payment_screenshot.jpg']
      }
    ],
    tags: ['payment-issue', 'urgent']
  },
  {
    id: 'TKT005',
    ticketNumber: '2024012305',
    customerId: 'CUST005',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram@gmail.com',
    customerPhone: '+919876543214',
    subject: 'Account access issue',
    description: 'Unable to login to my account.',
    category: 'account',
    priority: 'medium',
    status: 'waiting_customer',
    assignedTo: 'agent2@laxmione.com',
    createdAt: '2024-01-23T08:00:00Z',
    updatedAt: '2024-01-23T10:00:00Z',
    responseTime: 20,
    messages: [
      {
        id: 'MSG008',
        sender: 'customer',
        senderName: 'Vikram Singh',
        content: 'Getting "Invalid credentials" error when trying to login.',
        timestamp: '2024-01-23T08:00:00Z',
        attachments: []
      },
      {
        id: 'MSG009',
        sender: 'agent',
        senderName: 'Support Agent',
        content: 'I have sent a password reset link to your registered email. Please check and follow the instructions.',
        timestamp: '2024-01-23T08:20:00Z',
        attachments: []
      },
      {
        id: 'MSG010',
        sender: 'system',
        senderName: 'System',
        content: 'Waiting for customer response for 2 hours.',
        timestamp: '2024-01-23T10:00:00Z',
        attachments: []
      }
    ],
    tags: ['login-issue', 'account-access']
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter') || 'all';

    let tickets = [...ticketsDB];

    // Apply filters
    switch (filter) {
      case 'open':
        tickets = tickets.filter(t => t.status === 'open');
        break;
      case 'in_progress':
        tickets = tickets.filter(t => t.status === 'in_progress');
        break;
      case 'urgent':
        tickets = tickets.filter(t => t.priority === 'urgent');
        break;
      case 'resolved':
        tickets = tickets.filter(t => t.status === 'resolved');
        break;
    }

    // Sort by priority and creation date
    tickets.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      success: true,
      tickets,
      summary: {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        urgent: tickets.filter(t => t.priority === 'urgent').length,
        averageResponseTime: 15 // minutes
      }
    });
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST - Create new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, subject, description, category, priority } = body;

    const newTicket = {
      id: `TKT${Date.now()}`,
      ticketNumber: `2024${Date.now().toString().slice(-6)}`,
      customerId,
      customerName: 'New Customer', // In production, fetch from user DB
      customerEmail: 'customer@gmail.com',
      customerPhone: '+919999999999',
      subject,
      description,
      category: category || 'general',
      priority: priority || 'medium',
      status: 'open',
      assignedTo: 'agent1@laxmione.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responseTime: null,
      messages: [
        {
          id: `MSG${Date.now()}`,
          sender: 'customer',
          senderName: 'Customer',
          content: description,
          timestamp: new Date().toISOString(),
          attachments: []
        }
      ],
      tags: []
    };

    ticketsDB.push(newTicket);

    return NextResponse.json({
      success: true,
      ticket: newTicket
    });
  } catch (error) {
    console.error('Failed to create ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}