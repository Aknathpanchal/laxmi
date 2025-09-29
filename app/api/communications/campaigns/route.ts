import { NextRequest, NextResponse } from 'next/server';

// Mock campaigns database
const campaignsDB = [
  {
    id: 'cmp-001',
    name: 'January EMI Reminder',
    type: 'multi-channel',
    status: 'completed',
    targetAudience: ['segment-emi-due'],
    templateId: 'tpl-payment-reminder',
    scheduledAt: '2024-01-05T09:00:00Z',
    startedAt: '2024-01-05T09:00:00Z',
    completedAt: '2024-01-05T11:30:00Z',
    stats: {
      total: 1250,
      sent: 1245,
      delivered: 1230,
      opened: 892,
      clicked: 456,
      failed: 5,
      pending: 0
    },
    createdBy: 'admin@laxmione.com',
    createdAt: '2024-01-04T14:00:00Z'
  },
  {
    id: 'cmp-002',
    name: 'New Year Loan Offer',
    type: 'email',
    status: 'running',
    targetAudience: ['segment-eligible-customers'],
    templateId: 'tpl-marketing',
    scheduledAt: '2024-01-10T10:00:00Z',
    startedAt: '2024-01-10T10:00:00Z',
    completedAt: null,
    stats: {
      total: 5000,
      sent: 3200,
      delivered: 3150,
      opened: 1876,
      clicked: 234,
      failed: 50,
      pending: 1800
    },
    createdBy: 'marketing@laxmione.com',
    createdAt: '2024-01-09T16:00:00Z'
  },
  {
    id: 'cmp-003',
    name: 'KYC Completion Drive',
    type: 'sms',
    status: 'scheduled',
    targetAudience: ['segment-pending-kyc'],
    templateId: 'tpl-kyc-reminder',
    scheduledAt: '2024-01-25T11:00:00Z',
    startedAt: null,
    completedAt: null,
    stats: {
      total: 750,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      failed: 0,
      pending: 750
    },
    createdBy: 'compliance@laxmione.com',
    createdAt: '2024-01-20T10:00:00Z'
  }
];

// GET - Fetch campaigns
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let campaigns = [...campaignsDB];

    if (status) {
      campaigns = campaigns.filter(c => c.status === status);
    }

    if (type) {
      campaigns = campaigns.filter(c => c.type === type);
    }

    if (startDate && endDate) {
      campaigns = campaigns.filter(c => {
        const campaignDate = new Date(c.createdAt);
        return campaignDate >= new Date(startDate) && campaignDate <= new Date(endDate);
      });
    }

    // Calculate summary stats
    const summary = {
      total: campaigns.length,
      running: campaigns.filter(c => c.status === 'running').length,
      scheduled: campaigns.filter(c => c.status === 'scheduled').length,
      completed: campaigns.filter(c => c.status === 'completed').length,
      totalMessagesSent: campaigns.reduce((sum, c) => sum + c.stats.sent, 0),
      totalMessagesDelivered: campaigns.reduce((sum, c) => sum + c.stats.delivered, 0),
      averageDeliveryRate: campaigns.length > 0 
        ? (campaigns.reduce((sum, c) => sum + (c.stats.delivered / Math.max(c.stats.sent, 1)), 0) / campaigns.length * 100).toFixed(2)
        : 0
    };

    return NextResponse.json({
      success: true,
      campaigns,
      summary
    });

  } catch (error) {
    console.error('Fetch campaigns error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST - Create new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, targetAudience, templateId, scheduledAt } = body;

    // Validate required fields
    if (!name || !type || !targetAudience || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newCampaign = {
      id: `cmp-${Date.now()}`,
      name,
      type,
      status: scheduledAt ? 'scheduled' : 'draft',
      targetAudience,
      templateId,
      scheduledAt: scheduledAt || null,
      startedAt: null,
      completedAt: null,
      stats: {
        total: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        failed: 0,
        pending: 0
      },
      createdBy: 'current-user@laxmione.com', // In production, get from auth
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Calculate target audience size
    newCampaign.stats.total = Math.floor(Math.random() * 5000) + 500; // Mock calculation
    newCampaign.stats.pending = newCampaign.stats.total;

    campaignsDB.push(newCampaign);

    return NextResponse.json({
      success: true,
      campaign: newCampaign
    });

  } catch (error) {
    console.error('Create campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

// PUT - Update campaign (start, pause, cancel)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    const campaignIndex = campaignsDB.findIndex(c => c.id === id);
    if (campaignIndex === -1) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const campaign = campaignsDB[campaignIndex];

    switch (action) {
      case 'start':
        if (campaign.status !== 'scheduled' && campaign.status !== 'paused') {
          return NextResponse.json(
            { error: 'Campaign cannot be started' },
            { status: 400 }
          );
        }
        campaign.status = 'running';
        campaign.startedAt = new Date().toISOString();
        break;

      case 'pause':
        if (campaign.status !== 'running') {
          return NextResponse.json(
            { error: 'Campaign is not running' },
            { status: 400 }
          );
        }
        campaign.status = 'paused';
        break;

      case 'cancel':
        if (campaign.status === 'completed') {
          return NextResponse.json(
            { error: 'Cannot cancel completed campaign' },
            { status: 400 }
          );
        }
        campaign.status = 'cancelled';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    campaign.updatedAt = new Date().toISOString();
    campaignsDB[campaignIndex] = campaign;

    return NextResponse.json({
      success: true,
      campaign
    });

  } catch (error) {
    console.error('Update campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE - Delete campaign
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID required' },
        { status: 400 }
      );
    }

    const campaignIndex = campaignsDB.findIndex(c => c.id === id);
    if (campaignIndex === -1) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const campaign = campaignsDB[campaignIndex];
    if (campaign.status === 'running') {
      return NextResponse.json(
        { error: 'Cannot delete running campaign' },
        { status: 400 }
      );
    }

    campaignsDB.splice(campaignIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    console.error('Delete campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}