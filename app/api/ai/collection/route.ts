import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/config';
import { collectionIntelligence, type CollectionCase } from '@/lib/ai/collection-intelligence';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const collectionSchema = z.object({
  loanId: z.string().uuid(),
  action: z.enum(['CREATE_STRATEGY', 'UPDATE_ACTIVITY', 'GET_RECOMMENDATIONS']),
  activityData: z.object({
    activityType: z.enum(['CALL', 'SMS', 'EMAIL', 'WHATSAPP', 'VISIT', 'LETTER', 'LEGAL_NOTICE', 'OTHER']).optional(),
    channel: z.enum(['PHONE', 'SMS', 'EMAIL', 'WHATSAPP', 'FIELD_VISIT', 'LEGAL']).optional(),
    outcome: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user to get role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has collection agent role or is admin
    if (!['COLLECTION_AGENT', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      // Allow users to see their own collection cases
      const body = await req.json();
      const loan = await prisma.loan.findFirst({
        where: {
          id: body.loanId,
          userId: user.id
        }
      });

      if (!loan) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    const body = await req.json();
    const validatedData = collectionSchema.parse(body);

    switch (validatedData.action) {
      case 'CREATE_STRATEGY': {
        // Get loan details
        const loan = await prisma.loan.findUnique({
          where: { id: validatedData.loanId },
          include: { user: true }
        });

        if (!loan) {
          return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
        }

        // Generate AI-powered collection strategy
        const collectionCase: CollectionCase = {
          userId: loan.userId,
          loanId: validatedData.loanId,
          outstandingAmount: loan.outstandingAmount || 0,
          daysOverdue: 0, // TODO: Calculate from loan.dueDate
          previousAttempts: 0, // TODO: Get from collection history
          customerProfile: {} // TODO: Get from user profile
        };
        const strategy = await collectionIntelligence.analyzeCase(collectionCase);

        return NextResponse.json({
          success: true,
          strategy,
          message: 'Collection strategy created successfully'
        });
      }

      case 'UPDATE_ACTIVITY': {
        if (!validatedData.activityData) {
          return NextResponse.json({ error: 'Activity data required' }, { status: 400 });
        }

        // Get collection case
        const collectionCase = await prisma.collectionCase.findFirst({
          where: { loanId: validatedData.loanId }
        });

        if (!collectionCase) {
          return NextResponse.json({ error: 'Collection case not found' }, { status: 404 });
        }

        // Track collection activity
        await collectionIntelligence.trackCollectionActivity(
          validatedData.loanId,
          {
            activityType: validatedData.activityData.activityType!,
            channel: validatedData.activityData.channel!,
            contactPerson: session.user.name || session.user.email || '',
            notes: validatedData.activityData.notes || '',
            outcome: validatedData.activityData.outcome,
            performedBy: user.id,
          }
        );

        // Update case status if needed
        if (validatedData.activityData.outcome?.includes('promise_to_pay')) {
          await prisma.collectionCase.update({
            where: { id: collectionCase.id },
            data: {
              status: 'PROMISE_TO_PAY',
              lastContactDate: new Date(),
              nextFollowUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
          });
        }

        return NextResponse.json({
          success: true,
          message: 'Activity recorded successfully'
        });
      }

      case 'GET_RECOMMENDATIONS': {
        // Get collection case with history
        const collectionCase = await prisma.collectionCase.findFirst({
          where: { loanId: validatedData.loanId },
          include: {
            activities: {
              orderBy: { createdAt: 'desc' },
              take: 10
            },
            loan: {
              include: {
                user: {
                  include: {
                    profile: true,
                    creditScore: true
                  }
                },
                repayments: true
              }
            }
          }
        });

        if (!collectionCase) {
          return NextResponse.json({ error: 'Collection case not found' }, { status: 404 });
        }

        // Get fresh AI recommendations based on current status
        const recommendations = await getAIRecommendations(collectionCase);

        return NextResponse.json({
          success: true,
          recommendations,
          currentStatus: collectionCase.status,
          daysOverdue: collectionCase.daysOverdue,
          totalOutstanding: collectionCase.totalOutstanding,
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Collection API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user to get the actual user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams;
    const loanId = searchParams.get('loanId');

    if (!loanId) {
      // Get all collection cases for the user
      const cases = await prisma.collectionCase.findMany({
        where: {
          userId: user.id,
          status: {
            in: ['ACTIVE', 'PROMISE_TO_PAY']
          }
        },
        include: {
          loan: {
            select: {
              loanNumber: true,
              loanType: true,
              disbursedAmount: true,
              dueDate: true
            }
          },
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        cases,
        totalCases: cases.length,
        totalOutstanding: cases.reduce((sum, c) => sum + c.totalOutstanding, 0)
      });
    }

    // Get specific collection case
    const collectionCase = await prisma.collectionCase.findFirst({
      where: {
        loanId,
        OR: [
          { userId: user.id },
          { assignedTo: user.id }
        ]
      },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' }
        },
        loan: {
          include: {
            user: {
              include: {
                profile: true
              }
            },
            repayments: {
              orderBy: { dueDate: 'desc' }
            }
          }
        }
      }
    });

    if (!collectionCase) {
      return NextResponse.json({ error: 'Collection case not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      case: collectionCase
    });

  } catch (error) {
    console.error('Get collection cases error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getAIRecommendations(collectionCase: any) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || ''
  });

  try {
    const prompt = `
      Analyze this collection case and provide recommendations:

      Case Details:
      - Days Overdue: ${collectionCase.daysOverdue}
      - Outstanding Amount: ₹${collectionCase.totalOutstanding}
      - Current Status: ${collectionCase.status}
      - Last Contact: ${collectionCase.lastContactDate || 'Never'}
      - Previous Activities: ${collectionCase.activities.length} attempts

      Recent Activity Outcomes:
      ${collectionCase.activities.slice(0, 3).map((a: any) =>
        `- ${a.activityType}: ${a.outcome || 'No response'}`
      ).join('\n')}

      Customer Profile:
      - Name: ${collectionCase.loan.user.profile?.firstName || 'Unknown'}
      - Credit Score: ${collectionCase.loan.user.creditScore?.internalScore || 'N/A'}

      Provide 3-5 specific, actionable recommendations for the next steps.
      Consider Indian cultural context and RBI guidelines.

      Format: JSON array of recommendation strings
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: prompt
      }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const recommendations = JSON.parse(content.text);
      return recommendations;
    }
  } catch (error) {
    console.error('AI recommendations error:', error);
  }

  // Fallback recommendations
  return [
    'Contact customer during evening hours (6-8 PM) for better response',
    'Offer one-time settlement with 10-15% discount',
    'Send formal notice if no response in next 48 hours',
    'Consider field visit if amount > ₹50,000',
    'Document all communication attempts for legal compliance'
  ];
}