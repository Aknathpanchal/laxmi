import { NextRequest, NextResponse } from 'next/server';
import { loanRecommendation } from '@/backend/services/loan-recommendation';
import { withErrorHandler } from '@/backend/lib/utils/error-handler';
import { authenticateRequest } from '@/backend/lib/middleware/auth';
import { createRequestId } from '@/backend/lib/utils/request';

export const GET = withErrorHandler(async (request: NextRequest) => {
    const requestId = createRequestId();

    // Authenticate user
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          requestId
        },
        { status: 401 }
      );
    }

    const userId = authResult.userId!;

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const deviceId = searchParams.get('deviceId');
    const platform = searchParams.get('platform');

    // Build context
    const context = {
      userId,
      currentLocation: lat && lng ? {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
      } : undefined,
      deviceInfo: deviceId ? {
        deviceId,
        platform: platform || 'web',
        appVersion: request.headers.get('x-app-version') || '1.0.0'
      } : undefined,
      sessionContext: {
        timeOfDay: getTimeOfDay(),
        dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        isHoliday: checkIfHoliday(),
        weatherCondition: 'clear' // Would integrate with weather API
      },
      recentActivity: await getRecentActivity(userId)
    };

    // Get recommendations
    const recommendations = await loanRecommendation.getRecommendations(context);

    return NextResponse.json({
      success: true,
      data: recommendations,
      requestId
    });
});

export const POST = withErrorHandler(async (request: NextRequest) => {
    const requestId = createRequestId();

    // Authenticate user
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          requestId
        },
        { status: 401 }
      );
    }

    const userId = authResult.userId!;
    const body = await request.json();

    // Track user interaction with recommendation
    const { recommendationId, productId, action } = body;

    // Log the interaction
    await trackInteraction(userId, recommendationId, productId, action);

    // Return updated recommendations if requested
    if (body.refreshRecommendations) {
      const context = {
        userId,
        ...body.context
      };

      const recommendations = await loanRecommendation.getRecommendations(context);

      return NextResponse.json({
        success: true,
        data: recommendations,
        requestId
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Interaction tracked',
      requestId
    });
});

// Helper functions
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'late_night';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

function checkIfHoliday(): boolean {
  // Check against holiday calendar
  // This is a simplified version
  const today = new Date();
  const holidays = [
    '2024-01-26', // Republic Day
    '2024-03-08', // Holi
    '2024-08-15', // Independence Day
    '2024-10-24', // Diwali
    '2024-11-14', // Bhai Dooj
  ];

  const todayString = today.toISOString().split('T')[0];
  return holidays.includes(todayString);
}

async function getRecentActivity(userId: string): Promise<any> {
  // Get from Redis or database
  // Simplified version
  return {
    searches: [],
    viewedProducts: [],
    abandonedApplications: []
  };
}

async function trackInteraction(
  userId: string,
  recommendationId: string,
  productId: string,
  action: string
): Promise<void> {
  // Track user interaction with recommendations
  // This helps improve future recommendations
  console.log('Tracking interaction:', { userId, recommendationId, productId, action });
}