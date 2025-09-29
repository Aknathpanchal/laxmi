import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { event, data, timestamp } = await request.json();

    // In production, you would:
    // 1. Validate the data
    // 2. Store in analytics database
    // 3. Send to analytics service (e.g., Google Analytics, Mixpanel)
    // 4. Generate reports

    // For now, we'll just log and return success
    console.log('Analytics Event:', {
      event,
      timestamp,
      userAgent: request.headers.get('user-agent'),
      ip: request.ip || 'unknown',
      data
    });

    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: 'Analytics event recorded successfully'
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to record analytics event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Mock analytics data for dashboard
    const mockData = {
      summary: {
        totalEvents: 1234,
        uniqueUsers: 456,
        avgSessionDuration: 25 * 60 * 1000, // 25 minutes
        bounceRate: 0.32,
        pageViews: 5678
      },
      recentEvents: [
        {
          event: 'page_view',
          path: '/user',
          timestamp: new Date().toISOString(),
          userId: 'user_001'
        },
        {
          event: 'user_action',
          action: 'apply_loan',
          timestamp: new Date().toISOString(),
          userId: 'user_002'
        }
      ],
      topPages: [
        { path: '/user', views: 234 },
        { path: '/apply', views: 189 },
        { path: '/loans', views: 156 }
      ],
      userSegments: {
        new: 123,
        returning: 333,
        churned: 45
      }
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}