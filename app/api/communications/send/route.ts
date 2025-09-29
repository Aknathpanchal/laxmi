import { NextRequest, NextResponse } from 'next/server';
import { communicationService } from '@/backend/services/communication-service';

// POST - Send message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, subject, body: messageBody, priority, templateId, variables, scheduledAt } = body;

    // Validate required fields
    if (!type || !to || (!messageBody && !templateId)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let message;

    if (templateId) {
      // Send using template
      message = await communicationService.sendWithTemplate(
        templateId,
        to,
        variables || {},
        { priority, scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined }
      );
    } else {
      // Send regular message
      message = await communicationService.sendMessage({
        type,
        to,
        subject,
        body: messageBody,
        status: 'queued',
        priority: priority || 'normal',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined
      });
    }

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    );
  }
}