import { NextRequest, NextResponse } from 'next/server';

// Decision history database
const decisionsDB: any[] = [];

// POST - Make underwriting decision
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, decision, notes, conditions } = body;

    // Validate required fields
    if (!applicationId || !decision) {
      return NextResponse.json(
        { error: 'Application ID and decision are required' },
        { status: 400 }
      );
    }

    // Validate decision type
    if (!['approve', 'reject', 'hold', 'conditional-approve'].includes(decision)) {
      return NextResponse.json(
        { error: 'Invalid decision type' },
        { status: 400 }
      );
    }

    // Create decision record
    const decisionRecord = {
      id: `DEC${String(decisionsDB.length + 1).padStart(5, '0')}`,
      applicationId,
      decision,
      notes: notes || '',
      conditions: conditions || [],
      decidedBy: 'underwriter@laxmione.com', // In production, get from auth
      decidedAt: new Date().toISOString(),
      status: 'processed'
    };

    // Add to decisions database
    decisionsDB.push(decisionRecord);

    // Update application status (in production, update actual database)
    // This would trigger notifications to the applicant

    // Calculate decision metrics
    const metrics = calculateDecisionMetrics(decision);

    return NextResponse.json({
      success: true,
      decision: decisionRecord,
      metrics,
      message: `Application ${decision}ed successfully`
    });

  } catch (error) {
    console.error('Decision processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process decision' },
      { status: 500 }
    );
  }
}

// GET - Fetch decision history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const applicationId = searchParams.get('applicationId');
    const decidedBy = searchParams.get('decidedBy');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let decisions = [...decisionsDB];

    // Apply filters
    if (applicationId) {
      decisions = decisions.filter(d => d.applicationId === applicationId);
    }
    if (decidedBy) {
      decisions = decisions.filter(d => d.decidedBy === decidedBy);
    }
    if (startDate && endDate) {
      decisions = decisions.filter(d => {
        const decidedDate = new Date(d.decidedAt);
        return decidedDate >= new Date(startDate) && decidedDate <= new Date(endDate);
      });
    }

    // Calculate statistics
    const stats = {
      totalDecisions: decisionsDB.length,
      approved: decisionsDB.filter(d => d.decision === 'approve').length,
      rejected: decisionsDB.filter(d => d.decision === 'reject').length,
      onHold: decisionsDB.filter(d => d.decision === 'hold').length,
      conditionalApproved: decisionsDB.filter(d => d.decision === 'conditional-approve').length,
      todayDecisions: decisionsDB.filter(d => {
        const today = new Date();
        const decidedDate = new Date(d.decidedAt);
        return decidedDate.toDateString() === today.toDateString();
      }).length,
      avgDecisionTime: '2.3 hours' // Mock value
    };

    return NextResponse.json({
      success: true,
      decisions,
      stats
    });

  } catch (error) {
    console.error('Fetch decisions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch decision history' },
      { status: 500 }
    );
  }
}

// PUT - Update decision (for supervisor review)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { decisionId, supervisorNotes, override, newDecision } = body;

    const decisionIndex = decisionsDB.findIndex(d => d.id === decisionId);
    if (decisionIndex === -1) {
      return NextResponse.json(
        { error: 'Decision not found' },
        { status: 404 }
      );
    }

    // Update decision with supervisor review
    decisionsDB[decisionIndex] = {
      ...decisionsDB[decisionIndex],
      supervisorReview: {
        reviewedBy: 'supervisor@laxmione.com', // In production, get from auth
        reviewedAt: new Date().toISOString(),
        notes: supervisorNotes,
        override: override || false,
        newDecision: newDecision || decisionsDB[decisionIndex].decision
      },
      status: override ? 'overridden' : 'reviewed'
    };

    return NextResponse.json({
      success: true,
      decision: decisionsDB[decisionIndex],
      message: 'Decision review completed'
    });

  } catch (error) {
    console.error('Update decision error:', error);
    return NextResponse.json(
      { error: 'Failed to update decision' },
      { status: 500 }
    );
  }
}

// Helper function to calculate decision metrics
function calculateDecisionMetrics(decision: string) {
  // Mock metrics calculation
  const metrics = {
    processingTime: Math.random() * 5 + 1, // 1-6 hours
    confidenceScore: decision === 'approve' ? Math.random() * 20 + 80 : Math.random() * 30 + 50,
    riskAdjustment: decision === 'reject' ? -Math.random() * 20 : Math.random() * 10,
    complianceCheck: true,
    documentationComplete: Math.random() > 0.1,
    supervisorReviewRequired: decision === 'reject' || Math.random() > 0.8
  };

  return metrics;
}