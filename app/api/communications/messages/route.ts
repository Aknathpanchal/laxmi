import { NextRequest, NextResponse } from 'next/server';

// Mock messages database
const messagesDB = [
  {
    id: 'msg-001',
    type: 'email',
    to: 'customer1@gmail.com',
    from: 'noreply@laxmione.com',
    subject: 'Loan Application Approved',
    body: 'Dear Rajesh Kumar, Congratulations! Your loan application for ₹50,000 has been approved.',
    status: 'delivered',
    priority: 'high',
    templateId: 'tpl-loan-approved',
    sentAt: '2024-01-20T10:30:00Z',
    deliveredAt: '2024-01-20T10:31:00Z',
    readAt: '2024-01-20T11:45:00Z',
    createdAt: '2024-01-20T10:29:00Z'
  },
  {
    id: 'msg-002',
    type: 'sms',
    to: '+919876543210',
    body: 'Your EMI of ₹5,000 is due on 25-Jan-2024. Pay now to avoid late fees.',
    status: 'delivered',
    priority: 'normal',
    templateId: 'tpl-payment-reminder',
    sentAt: '2024-01-20T09:00:00Z',
    deliveredAt: '2024-01-20T09:01:00Z',
    readAt: null,
    createdAt: '2024-01-20T08:59:00Z'
  },
  {
    id: 'msg-003',
    type: 'whatsapp',
    to: '+919876543211',
    body: 'Your LaxmiOne verification code is 456789. Valid for 10 minutes.',
    status: 'read',
    priority: 'urgent',
    templateId: 'tpl-otp',
    sentAt: '2024-01-20T14:15:00Z',
    deliveredAt: '2024-01-20T14:15:05Z',
    readAt: '2024-01-20T14:16:00Z',
    createdAt: '2024-01-20T14:14:50Z'
  },
  {
    id: 'msg-004',
    type: 'email',
    to: 'customer2@gmail.com',
    subject: 'Complete Your KYC',
    body: 'Please upload your Aadhaar card to complete KYC verification.',
    status: 'failed',
    priority: 'normal',
    failureReason: 'Invalid email address',
    retryCount: 3,
    sentAt: '2024-01-19T16:00:00Z',
    createdAt: '2024-01-19T15:59:00Z'
  },
  {
    id: 'msg-005',
    type: 'email',
    to: 'customer3@gmail.com',
    subject: 'Payment Received',
    body: 'We have received your EMI payment of ₹3,500. Thank you!',
    status: 'sent',
    priority: 'normal',
    sentAt: '2024-01-20T12:00:00Z',
    createdAt: '2024-01-20T11:59:00Z'
  }
];

// GET - Fetch message history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const recipient = searchParams.get('recipient');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let messages = [...messagesDB];

    // Apply filters
    if (type) {
      messages = messages.filter(m => m.type === type);
    }

    if (status) {
      messages = messages.filter(m => m.status === status);
    }

    if (priority) {
      messages = messages.filter(m => m.priority === priority);
    }

    if (recipient) {
      messages = messages.filter(m => 
        m.to.toLowerCase().includes(recipient.toLowerCase())
      );
    }

    if (startDate && endDate) {
      messages = messages.filter(m => {
        const messageDate = new Date(m.createdAt);
        return messageDate >= new Date(startDate) && messageDate <= new Date(endDate);
      });
    }

    // Calculate statistics
    const stats = {
      total: messages.length,
      sent: messages.filter(m => m.status === 'sent').length,
      delivered: messages.filter(m => m.status === 'delivered').length,
      read: messages.filter(m => m.status === 'read').length,
      failed: messages.filter(m => m.status === 'failed').length,
      byType: {
        email: messages.filter(m => m.type === 'email').length,
        sms: messages.filter(m => m.type === 'sms').length,
        whatsapp: messages.filter(m => m.type === 'whatsapp').length
      }
    };

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMessages = messages.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      messages: paginatedMessages,
      pagination: {
        page,
        limit,
        total: messages.length,
        totalPages: Math.ceil(messages.length / limit)
      },
      stats
    });

  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// GET message by ID
export async function GET_BY_ID(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID required' },
        { status: 400 }
      );
    }

    const message = messagesDB.find(m => m.id === id);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Fetch message error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

// PUT - Resend failed message
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || action !== 'resend') {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const messageIndex = messagesDB.findIndex(m => m.id === id);
    if (messageIndex === -1) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    const message = messagesDB[messageIndex];
    if (message.status !== 'failed') {
      return NextResponse.json(
        { error: 'Can only resend failed messages' },
        { status: 400 }
      );
    }

    // Mock resend
    message.status = 'sent';
    message.retryCount = (message.retryCount || 0) + 1;
    message.sentAt = new Date().toISOString();
    message.failureReason = undefined;
    messagesDB[messageIndex] = message;

    return NextResponse.json({
      success: true,
      message: 'Message resent successfully',
      data: message
    });

  } catch (error) {
    console.error('Resend message error:', error);
    return NextResponse.json(
      { error: 'Failed to resend message' },
      { status: 500 }
    );
  }
}