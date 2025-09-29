import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rbacSystem } from '@/backend/lib/auth/rbac-system';
import { auditLogger } from '@/backend/lib/audit/audit-logger';
import { cache } from '@/backend/lib/cache/cache-manager';
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

// Validation schemas
const notificationFiltersSchema = z.object({
  type: z.enum(['PAYMENT_REMINDER', 'LOAN_UPDATE', 'SYSTEM_ALERT', 'MARKETING', 'ACCOUNT_UPDATE']).optional(),
  status: z.enum(['UNREAD', 'READ', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20)
});

const preferencesSchema = z.object({
  email: z.object({
    enabled: z.boolean(),
    paymentReminders: z.boolean(),
    loanUpdates: z.boolean(),
    systemAlerts: z.boolean(),
    marketing: z.boolean()
  }),
  sms: z.object({
    enabled: z.boolean(),
    paymentReminders: z.boolean(),
    loanUpdates: z.boolean(),
    systemAlerts: z.boolean(),
    marketing: z.boolean()
  }),
  push: z.object({
    enabled: z.boolean(),
    paymentReminders: z.boolean(),
    loanUpdates: z.boolean(),
    systemAlerts: z.boolean(),
    marketing: z.boolean()
  }),
  whatsapp: z.object({
    enabled: z.boolean(),
    paymentReminders: z.boolean(),
    loanUpdates: z.boolean(),
    systemAlerts: z.boolean(),
    marketing: z.boolean()
  }),
  frequency: z.object({
    paymentReminders: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
    digestFrequency: z.enum(['IMMEDIATE', 'DAILY', 'WEEKLY'])
  }),
  quietHours: z.object({
    enabled: z.boolean(),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  })
});

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'notifications', 100, 3600); // 100 requests per hour
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
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
        'unauthorized_notifications_access',
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
      'notifications',
      'read',
      { ownerId: userId }
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'notification',
        userId,
        'read',
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

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Convert numeric parameters
    if (queryParams.page) queryParams.page = parseInt(queryParams.page);
    if (queryParams.limit) queryParams.limit = parseInt(queryParams.limit);
    
    let filters;
    try {
      filters = notificationFiltersSchema.parse(queryParams);
    } catch (error: any) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid query parameters',
          details: error.errors
        },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `notifications:${userId}:${JSON.stringify(filters)}`;
    let notificationsData = await cache.get(cacheKey);

    if (!notificationsData) {
      // Build query filters
      const whereClause: any = {
        userId
      };

      if (filters.type) {
        whereClause.type = filters.type;
      }

      if (filters.status) {
        if (filters.status === 'UNREAD') {
          whereClause.readAt = null;
          whereClause.archivedAt = null;
        } else if (filters.status === 'read') {
          whereClause.readAt = { not: null };
          whereClause.archivedAt = null;
        } else if (filters.status === 'ARCHIVED') {
          whereClause.archivedAt = { not: null };
        }
      }

      if (filters.priority) {
        whereClause.priority = filters.priority;
      }

      // Date range filter
      if (filters.fromDate || filters.toDate) {
        whereClause.createdAt = {};
        if (filters.fromDate) {
          whereClause.createdAt.gte = new Date(filters.fromDate);
        }
        if (filters.toDate) {
          whereClause.createdAt.lte = new Date(filters.toDate);
        }
      }

      // Calculate pagination
      const skip = (filters.page - 1) * filters.limit;

      // Fetch notifications and count
      const [notifications, totalCount, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where: whereClause,
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take: filters.limit
        }),
        prisma.notification.count({ where: whereClause }),
        prisma.notification.count({
          where: {
            userId,
            readAt: null,
            archivedAt: null
          }
        })
      ]);

      // Process notifications
      const processedNotifications = notifications.map(notification => {
        const isRead = notification.readAt !== null;
        const isArchived = notification.archivedAt !== null;
        const timeAgo = getTimeAgo(notification.createdAt);
        
        return {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          isRead,
          isArchived,
          data: notification.data,
          actionUrl: notification.actionUrl,
          actionText: notification.actionText,
          imageUrl: notification.imageUrl,
          createdAt: notification.createdAt,
          readAt: notification.readAt,
          archivedAt: notification.archivedAt,
          timeAgo,
          channels: notification.channels,
          deliveryStatus: notification.deliveryStatus
        };
      });

      // Group notifications by date for better UX
      const groupedNotifications = groupNotificationsByDate(processedNotifications);

      // Get notification summary
      const summary = await getNotificationSummary(userId);

      notificationsData = {
        notifications: processedNotifications,
        grouped: groupedNotifications,
        summary,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / filters.limit),
          hasNext: filters.page < Math.ceil(totalCount / filters.limit),
          hasPrev: filters.page > 1
        },
        counts: {
          total: totalCount,
          unread: unreadCount,
          read: totalCount - unreadCount
        },
        filters
      };

      // Cache for 2 minutes
      await cache.set(cacheKey, notificationsData, { 
        ttl: 120, 
        tags: [`user:${userId}`, 'notifications'] 
      });
    }

    // Log successful access
    await auditLogger.logAccess(
      'notification',
      userId,
      'read',
      true,
      userId,
      { 
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent'),
        filters,
        resultCount: notificationsData.notifications.length
      }
    );

    const response = {
      success: true,
      data: notificationsData,
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, max-age=120', // 2 minutes
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('Notifications fetch error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'notifications.read',
      entityType: 'notification',
      entityId: userId || 'unknown',
      success: false,
      errorMessage: error.message,
      stackTrace: error.stack,
      userId,
      ipAddress: request.headers.get('x-forwarded-for'),
      duration: Date.now() - startTime
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch notifications',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

// POST endpoint for updating notification preferences
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  let preferencesData: any;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'notification-preferences', 10, 3600); // 10 updates per hour
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded for preference updates',
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

    // Authorization
    const hasPermission = await rbacSystem.checkPermission(
      userId,
      'notifications',
      'update-preferences',
      { ownerId: userId }
    );

    if (!hasPermission) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    try {
      const body = await request.json();
      preferencesData = preferencesSchema.parse(body);
    } catch (error: any) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid preferences data',
          details: error.errors || error.message
        },
        { status: 400 }
      );
    }

    // Get current preferences
    const currentPreferences = await prisma.notificationPreference.findUnique({
      where: { userId }
    });

    // Update or create preferences
    const updatedPreferences = await prisma.notificationPreference.upsert({
      where: { userId },
      create: {
        userId,
        preferences: preferencesData,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      update: {
        preferences: preferencesData,
        updatedAt: new Date()
      }
    });

    // Invalidate notification cache
    await cache.deleteByPattern(`notifications:${userId}:*`);

    // Log preferences update
    await auditLogger.logChange(
      'notification_preferences',
      userId,
      currentPreferences?.preferences || {},
      preferencesData,
      userId
    );

    const response = {
      success: true,
      data: {
        preferences: updatedPreferences.preferences,
        updatedAt: updatedPreferences.updatedAt
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };

    return NextResponse.json(response, {
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('Notification preferences update error:', error);

    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'notifications.update-preferences',
      entityType: 'notification_preferences',
      entityId: userId || 'unknown',
      success: false,
      errorMessage: error.message,
      userId,
      duration: Date.now() - startTime,
      customData: preferencesData
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update notification preferences',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function groupNotificationsByDate(notifications: any[]) {
  const groups: Record<string, any[]> = {};
  
  notifications.forEach(notification => {
    const date = notification.createdAt.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
  });
  
  return Object.entries(groups).map(([date, items]) => ({
    date,
    items,
    count: items.length
  }));
}

async function getNotificationSummary(userId: string) {
  const [typeCounts, priorityCounts, recentCount] = await Promise.all([
    prisma.notification.groupBy({
      by: ['type'],
      where: {
        userId,
        readAt: null,
        archivedAt: null
      },
      _count: true
    }),
    prisma.notification.groupBy({
      by: ['priority'],
      where: {
        userId,
        readAt: null,
        archivedAt: null
      },
      _count: true
    }),
    prisma.notification.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    })
  ]);
  
  return {
    byType: Object.fromEntries(typeCounts.map(item => [item.type, item._count])),
    byPriority: Object.fromEntries(priorityCounts.map(item => [item.priority, item._count])),
    recentCount
  };
}