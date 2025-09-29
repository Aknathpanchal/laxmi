import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rbacSystem } from '@/backend/lib/auth/rbac-system';
import { auditLogger } from '@/backend/lib/audit/audit-logger';
import { cache } from '@/backend/lib/cache/cache-manager';
import { jobQueue } from '@/backend/lib/jobs/job-queue';
import { customerSupport } from '@/backend/lib/support/customer-support-system';
import jwt from 'jsonwebtoken';
import { rateLimit } from '@/backend/lib/security/rate-limiter';
import crypto from 'crypto';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface UserToken {
  userId: string;
  email: string;
  userType: string;
}

function getUserFromToken(request: NextRequest): UserToken | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as UserToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Validation schema for support ticket creation
const ticketCreationSchema = z.object({
  subject: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  category: z.enum([
    'LOAN_INQUIRY', 'PAYMENT_ISSUE', 'ACCOUNT_ISSUE', 'TECHNICAL_ISSUE', 
    'COMPLAINT', 'FEEDBACK', 'DOCUMENT_ISSUE', 'EMI_ISSUE', 'OTHER'
  ]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  loanId: z.string().uuid().optional(),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileSize: z.number(),
    mimeType: z.string(),
    url: z.string().url()
  })).optional(),
  contactMethod: z.enum(['EMAIL', 'PHONE', 'WHATSAPP']).default('EMAIL'),
  urgentContact: z.boolean().default(false)
});

// Validation schema for ticket response
const ticketResponseSchema = z.object({
  message: z.string().min(5).max(2000),
  isInternal: z.boolean().default(false),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileSize: z.number(),
    mimeType: z.string(),
    url: z.string().url()
  })).optional(),
  action: z.enum(['NONE', 'ESCALATE', 'CLOSE', 'PENDING_CUSTOMER', 'PENDING_INTERNAL']).optional()
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  let ticketData: any;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'support-ticket', 10, 3600); // 10 tickets per hour
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Too many ticket submissions.',
          retryAfter: rateLimitResult.retryAfter
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    // Authentication
    const user = getUserFromToken(request);
    if (!user) {
      await auditLogger.logSecurity(
        'unauthorized_support_ticket_creation',
        'medium',
        { ipAddress: clientIp, userAgent: request.headers.get('user-agent') }
      );

      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = user.userId;

    // Authorization
    const hasPermission = await rbacSystem.checkPermission(
      userId,
      'support',
      'create',
      { ownerId: userId }
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'support_ticket',
        'create',
        'create',
        false,
        userId,
        { 
          ipAddress: clientIp,
          error: 'Insufficient permissions'
        }
      );

      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    try {
      const body = await request.json();
      ticketData = ticketCreationSchema.parse(body);
    } catch (error: any) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid ticket data',
          details: error.errors || error.message
        },
        { status: 400 }
      );
    }

    // Get user details
    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        userType: true
      }
    });

    if (!userDetails) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate loan ID if provided
    if (ticketData.loanId) {
      const loan = await prisma.loan.findFirst({
        where: {
          id: ticketData.loanId,
          userId: userId
        }
      });

      if (!loan) {
        return NextResponse.json(
          { success: false, error: 'Loan not found or access denied' },
          { status: 404 }
        );
      }
    }

    // Generate ticket number
    const ticketNumber = await generateTicketNumber();
    
    // Create support ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId,
        subject: ticketData.subject,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority,
        status: 'OPEN',
        loanId: ticketData.loanId,
        contactMethod: ticketData.contactMethod,
        urgentContact: ticketData.urgentContact,
        metadata: {
          ipAddress: clientIp,
          userAgent: request.headers.get('user-agent'),
          source: 'API',
          attachments: ticketData.attachments || []
        },
        createdAt: new Date()
      }
    });

    // Auto-assign ticket based on category and priority
    const assignment = await customerSupport.autoAssignTicket(ticket);
    
    if (assignment.agentId) {
      await prisma.supportTicket.update({
        where: { id: ticket.id },
        data: {
          assignedTo: assignment.agentId,
          assignedAt: new Date()
        }
      });
    }

    // Create initial ticket activity
    await prisma.ticketActivity.create({
      data: {
        ticketId: ticket.id,
        type: 'CREATED',
        description: 'Ticket created by customer',
        performedBy: userId,
        createdAt: new Date()
      }
    });

    // Queue notifications
    await Promise.all([
      // Notify customer
      jobQueue.addJob('send-email', {
        to: userDetails.email,
        template: 'ticket-created',
        data: {
          ticketNumber,
          subject: ticketData.subject,
          customerName: userDetails.name,
          estimatedResponse: getEstimatedResponseTime(ticketData.priority)
        }
      }),
      
      // Notify assigned agent if applicable
      ...(assignment.agentId ? [jobQueue.addJob('send-email', {
        to: assignment.agentEmail,
        template: 'ticket-assigned',
        data: {
          ticketNumber,
          subject: ticketData.subject,
          category: ticketData.category,
          priority: ticketData.priority,
          customerName: userDetails.name,
          agentName: assignment.agentName
        }
      })] : []),
      
      // Send SMS for urgent tickets
      ...(ticketData.urgentContact && ticketData.priority === 'URGENT' ? [jobQueue.addJob('send-sms', {
        to: userDetails.mobile,
        message: `Your urgent support ticket #${ticketNumber} has been created. We will contact you within 1 hour.`
      })] : [])
    ]);

    // Log ticket creation
    await auditLogger.logAction(
      'support_ticket_created',
      'support_ticket',
      ticket.id,
      {
        ticketNumber,
        category: ticketData.category,
        priority: ticketData.priority,
        subject: ticketData.subject,
        assignedTo: assignment.agentId
      },
      userId
    );

    const response = {
      success: true,
      data: {
        ticketId: ticket.id,
        ticketNumber,
        status: ticket.status,
        category: ticket.category,
        priority: ticket.priority,
        subject: ticket.subject,
        createdAt: ticket.createdAt,
        estimatedResponse: getEstimatedResponseTime(ticketData.priority),
        assignedAgent: assignment.agentId ? {
          name: assignment.agentName,
          email: assignment.agentEmail
        } : null,
        supportChannels: getSupportChannels(ticketData.category),
        nextSteps: getTicketNextSteps(ticketData.priority, assignment.agentId)
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('Support ticket creation error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'support.ticket.create',
      entityType: 'support_ticket',
      entityId: 'unknown',
      success: false,
      errorMessage: error.message,
      stackTrace: error.stack,
      userId,
      ipAddress: request.headers.get('x-forwarded-for'),
      duration: Date.now() - startTime,
      customData: ticketData
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create support ticket',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch ticket details (for ticket ID)
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'support-ticket-view', 100, 3600);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter
        },
        { status: 429 }
      );
    }

    // Authentication
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = user.userId;

    // Get ticket ID from query parameter
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');
    
    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    // Fetch ticket with related data
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true
          }
        },
        assignedAgent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        loan: {
          select: {
            id: true,
            amount: true,
            status: true,
            product: {
              select: {
                name: true
              }
            }
          }
        },
        activities: {
          include: {
            performedByUser: {
              select: {
                id: true,
                name: true,
                userType: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        responses: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                userType: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Authorization check
    const hasPermission = await rbacSystem.checkPermission(
      userId,
      'support',
      'read',
      { 
        ownerId: ticket.userId,
        ticketId: ticket.id
      }
    );

    if (!hasPermission) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Process ticket data
    const processedTicket = {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      resolution: ticket.resolution,
      contactMethod: ticket.contactMethod,
      urgentContact: ticket.urgentContact,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      resolvedAt: ticket.resolvedAt,
      closedAt: ticket.closedAt,
      user: ticket.user,
      assignedAgent: ticket.assignedAgent,
      loan: ticket.loan,
      activities: ticket.activities.map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        performedBy: activity.performedByUser,
        createdAt: activity.createdAt
      })),
      responses: ticket.responses.filter(response => 
        !response.isInternal || userId === ticket.assignedTo || 
        await rbacSystem.checkPermission(userId, 'support', 'view-internal')
      ).map(response => ({
        id: response.id,
        message: response.message,
        author: response.author,
        isInternal: response.isInternal,
        attachments: response.attachments,
        createdAt: response.createdAt
      })),
      metadata: ticket.metadata,
      sla: calculateSLAMetrics(ticket),
      availableActions: getAvailableActions(ticket, userId)
    };

    // Log ticket access
    await auditLogger.logAccess(
      'support_ticket',
      ticket.id,
      'read',
      true,
      userId,
      { 
        ipAddress: clientIp,
        ticketNumber: ticket.ticketNumber
      }
    );

    const response = {
      success: true,
      data: processedTicket,
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, max-age=300',
        'X-Response-Time': `${Date.now() - startTime}ms`
      }
    });

  } catch (error: any) {
    console.error('Support ticket fetch error:', error);

    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'support.ticket.read',
      entityType: 'support_ticket',
      entityId: request.nextUrl.searchParams.get('ticketId') || 'unknown',
      success: false,
      errorMessage: error.message,
      userId,
      duration: Date.now() - startTime
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch ticket',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

// Helper functions
async function generateTicketNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Get count of tickets created today
  const todayCount = await prisma.supportTicket.count({
    where: {
      createdAt: {
        gte: new Date(today.setHours(0, 0, 0, 0)),
        lt: new Date(today.setHours(23, 59, 59, 999))
      }
    }
  });
  
  const sequence = (todayCount + 1).toString().padStart(4, '0');
  return `TKT${dateStr}${sequence}`;
}

function getEstimatedResponseTime(priority: string): string {
  const responseTimes: Record<string, string> = {
    'URGENT': '1 hour',
    'HIGH': '4 hours',
    'MEDIUM': '24 hours',
    'LOW': '48 hours'
  };
  
  return responseTimes[priority] || '24 hours';
}

function getSupportChannels(category: string): string[] {
  const channels: Record<string, string[]> = {
    'LOAN_INQUIRY': ['Email', 'Phone', 'WhatsApp'],
    'PAYMENT_ISSUE': ['Email', 'Phone', 'WhatsApp', 'Branch'],
    'TECHNICAL_ISSUE': ['Email', 'Live Chat'],
    'URGENT': ['Phone', 'WhatsApp']
  };
  
  return channels[category] || ['Email', 'Phone'];
}

function getTicketNextSteps(priority: string, assignedAgent?: string): string[] {
  const steps = [
    'Your ticket has been created and assigned a unique number',
    'You will receive email updates on ticket progress'
  ];
  
  if (assignedAgent) {
    steps.push('A support agent has been assigned to your case');
  }
  
  if (priority === 'URGENT') {
    steps.push('Our team will contact you within 1 hour');
  }
  
  steps.push('You can reply to this ticket to provide additional information');
  
  return steps;
}

function calculateSLAMetrics(ticket: any) {
  const now = new Date();
  const created = new Date(ticket.createdAt);
  const ageInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  
  const slaTargets: Record<string, number> = {
    'URGENT': 1,
    'HIGH': 4,
    'MEDIUM': 24,
    'LOW': 48
  };
  
  const target = slaTargets[ticket.priority] || 24;
  const breached = ageInHours > target;
  
  return {
    target: `${target} hours`,
    elapsed: `${Math.floor(ageInHours)} hours`,
    breached,
    status: breached ? 'BREACHED' : ageInHours > target * 0.8 ? 'WARNING' : 'ON_TRACK'
  };
}

function getAvailableActions(ticket: any, userId: string): string[] {
  const actions = [];
  
  if (ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') {
    actions.push('ADD_RESPONSE');
    
    if (ticket.userId === userId) {
      actions.push('CLOSE_TICKET');
    }
  }
  
  if (ticket.status === 'RESOLVED' && ticket.userId === userId) {
    actions.push('REOPEN');
    actions.push('CLOSE_TICKET');
  }
  
  return actions;
}