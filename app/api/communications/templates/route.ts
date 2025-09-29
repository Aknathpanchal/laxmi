import { NextRequest, NextResponse } from 'next/server';

// Mock template database
const templatesDB = [
  {
    id: 'tpl-loan-approved',
    name: 'Loan Approved',
    type: 'email',
    subject: 'Your Loan Application Has Been Approved!',
    body: 'Dear {{customerName}}, Congratulations! Your loan application for ₹{{loanAmount}} has been approved.',
    variables: ['customerName', 'loanAmount', 'loanTerm', 'interestRate', 'emiAmount'],
    category: 'loan-approval',
    isActive: true,
    usageCount: 245,
    lastUsed: '2024-01-15T10:30:00Z'
  },
  {
    id: 'tpl-payment-reminder',
    name: 'Payment Reminder',
    type: 'sms',
    body: 'Dear {{customerName}}, Your EMI of ₹{{emiAmount}} is due on {{dueDate}}. Pay now to avoid late fees.',
    variables: ['customerName', 'emiAmount', 'dueDate'],
    category: 'payment-reminder',
    isActive: true,
    usageCount: 1523,
    lastUsed: '2024-01-20T14:25:00Z'
  },
  {
    id: 'tpl-otp',
    name: 'OTP Verification',
    type: 'whatsapp',
    body: 'Your LaxmiOne verification code is {{otp}}. Valid for 10 minutes.',
    variables: ['otp'],
    category: 'account-security',
    isActive: true,
    usageCount: 3421,
    lastUsed: '2024-01-20T18:45:00Z'
  },
  {
    id: 'tpl-kyc-reminder',
    name: 'KYC Document Reminder',
    type: 'email',
    subject: 'Complete Your KYC Verification',
    body: 'Dear {{customerName}}, Please upload your {{documentType}} to complete KYC verification.',
    variables: ['customerName', 'documentType'],
    category: 'kyc-verification',
    isActive: true,
    usageCount: 156,
    lastUsed: '2024-01-19T11:20:00Z'
  },
  {
    id: 'tpl-welcome',
    name: 'Welcome Message',
    type: 'email',
    subject: 'Welcome to LaxmiOne!',
    body: 'Dear {{customerName}}, Welcome to LaxmiOne. Your account has been successfully created.',
    variables: ['customerName'],
    category: 'general',
    isActive: true,
    usageCount: 892,
    lastUsed: '2024-01-20T09:15:00Z'
  }
];

// GET - Fetch templates
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');

    let templates = [...templatesDB];

    if (type) {
      templates = templates.filter(t => t.type === type);
    }

    if (category) {
      templates = templates.filter(t => t.category === category);
    }

    if (isActive !== null) {
      templates = templates.filter(t => t.isActive === (isActive === 'true'));
    }

    return NextResponse.json({
      success: true,
      templates
    });

  } catch (error) {
    console.error('Fetch templates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST - Create new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newTemplate = {
      id: `tpl-${Date.now()}`,
      ...body,
      usageCount: 0,
      lastUsed: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    templatesDB.push(newTemplate);

    return NextResponse.json({
      success: true,
      template: newTemplate
    });

  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

// PUT - Update template
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const templateIndex = templatesDB.findIndex(t => t.id === id);
    if (templateIndex === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    templatesDB[templateIndex] = {
      ...templatesDB[templateIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      template: templatesDB[templateIndex]
    });

  } catch (error) {
    console.error('Update template error:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

// DELETE - Delete template
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID required' },
        { status: 400 }
      );
    }

    const templateIndex = templatesDB.findIndex(t => t.id === id);
    if (templateIndex === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    templatesDB.splice(templateIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    });

  } catch (error) {
    console.error('Delete template error:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}