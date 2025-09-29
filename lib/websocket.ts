import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { UserRole } from '@/types/auth';

// Import shared types from client file
export { WS_EVENTS, WSEvent, WSMessage, WSOptions, DEFAULT_WS_OPTIONS } from './websocket-client';

// WebSocket rooms for role-based broadcasting
export const WS_ROOMS = {
  USER: 'room:user',
  ADMIN: 'room:admin',
  UNDERWRITER: 'room:underwriter',
  COLLECTION_AGENT: 'room:collection_agent',
  FINANCE_MANAGER: 'room:finance_manager',
  RISK_ANALYST: 'room:risk_analyst',
  SUPPORT_AGENT: 'room:support_agent',
  GLOBAL: 'room:global'
} as const;

// Mock data generator for real-time updates
export class MockDataGenerator {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  startGenerating(io: SocketServer | null) {
    if (!io) return;

    // Generate dashboard updates every 5 seconds
    this.intervals.set('dashboard', setInterval(() => {
      const dashboardData = this.generateDashboardUpdate();
      io.to(WS_ROOMS.GLOBAL).emit(WS_EVENTS.DASHBOARD_UPDATE, dashboardData);
    }, 5000));

    // Generate role-specific events
    this.intervals.set('underwriter', setInterval(() => {
      const applicationData = this.generateApplicationData();
      io.to(WS_ROOMS.UNDERWRITER).emit(WS_EVENTS.APPLICATION_RECEIVED, applicationData);
    }, 10000));

    this.intervals.set('collection', setInterval(() => {
      const collectionData = this.generateCollectionAlert();
      io.to(WS_ROOMS.COLLECTION_AGENT).emit(WS_EVENTS.COLLECTION_ALERT, collectionData);
    }, 15000));

    this.intervals.set('risk', setInterval(() => {
      const riskData = this.generateRiskAlert();
      io.to(WS_ROOMS.RISK_ANALYST).emit(WS_EVENTS.RISK_ALERT, riskData);
    }, 20000));

    // Generate notifications
    this.intervals.set('notifications', setInterval(() => {
      const notification = this.generateNotification();
      io.to(WS_ROOMS.GLOBAL).emit(WS_EVENTS.NOTIFICATION, notification);
    }, 8000));
  }

  stopGenerating() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }

  private generateDashboardUpdate() {
    return {
      timestamp: new Date().toISOString(),
      metrics: {
        activeLoans: Math.floor(Math.random() * 1000) + 500,
        pendingApplications: Math.floor(Math.random() * 100) + 20,
        todayCollections: Math.floor(Math.random() * 1000000) + 500000,
        riskScore: (Math.random() * 10).toFixed(1),
        onlineUsers: Math.floor(Math.random() * 500) + 100
      }
    };
  }

  private generateApplicationData() {
    const types = ['Personal Loan', 'Business Loan', 'Gold Loan', 'Home Loan'];
    return {
      id: `app_${Date.now()}`,
      type: types[Math.floor(Math.random() * types.length)],
      amount: Math.floor(Math.random() * 5000000) + 100000,
      applicantName: `Customer ${Math.floor(Math.random() * 1000)}`,
      creditScore: Math.floor(Math.random() * 200) + 600,
      priority: Math.random() > 0.7 ? 'HIGH' : 'NORMAL',
      timestamp: new Date().toISOString()
    };
  }

  private generateCollectionAlert() {
    const statuses = ['OVERDUE', 'CRITICAL', 'PENDING_FOLLOWUP'];
    return {
      id: `col_${Date.now()}`,
      loanId: `loan_${Math.floor(Math.random() * 10000)}`,
      customerId: `cust_${Math.floor(Math.random() * 10000)}`,
      overdueAmount: Math.floor(Math.random() * 50000) + 5000,
      daysOverdue: Math.floor(Math.random() * 90) + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: new Date().toISOString()
    };
  }

  private generateRiskAlert() {
    const alertTypes = ['MODEL_DRIFT', 'HIGH_RISK_CONCENTRATION', 'ANOMALY_DETECTED', 'THRESHOLD_BREACH'];
    return {
      id: `risk_${Date.now()}`,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM',
      affectedMetric: ['NPL_RATIO', 'DEFAULT_RATE', 'EXPOSURE'][Math.floor(Math.random() * 3)],
      value: (Math.random() * 20).toFixed(2),
      threshold: 10,
      timestamp: new Date().toISOString()
    };
  }

  private generateNotification() {
    const types = ['INFO', 'SUCCESS', 'WARNING', 'ERROR'] as const;
    const messages = [
      'New loan application received',
      'Payment successfully processed',
      'Risk threshold approaching limit',
      'System maintenance scheduled',
      'Monthly report generated'
    ];

    return {
      id: `notif_${Date.now()}`,
      type: types[Math.floor(Math.random() * types.length)],
      title: 'System Update',
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date().toISOString()
    };
  }
}

// Singleton WebSocket manager
let io: SocketServer | null = null;
let dataGenerator: MockDataGenerator | null = null;

export function initWebSocket(server: HttpServer): SocketServer {
  if (io) return io;

  io = new SocketServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Initialize mock data generator
  dataGenerator = new MockDataGenerator();

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle authentication
    socket.on(WS_EVENTS.AUTH, (data: { userId: string; role: UserRole; token?: string }) => {
      // In production, verify the token
      if (data.userId && data.role) {
        // Join role-specific room
        const room = WS_ROOMS[data.role];
        if (room) {
          socket.join(room);
          socket.join(WS_ROOMS.GLOBAL);

          // Store user data
          socket.data.userId = data.userId;
          socket.data.role = data.role;

          socket.emit(WS_EVENTS.AUTH_SUCCESS, {
            message: 'Authenticated successfully',
            role: data.role
          });

          console.log(`User ${data.userId} (${data.role}) joined rooms`);
        }
      } else {
        socket.emit(WS_EVENTS.AUTH_ERROR, {
          message: 'Authentication failed'
        });
      }
    });

    // Handle user actions
    socket.on(WS_EVENTS.USER_ACTION, (data: any) => {
      console.log('User action:', data);
      // Broadcast to relevant rooms or handle specific actions
    });

    // Handle refresh requests
    socket.on(WS_EVENTS.REQUEST_REFRESH, (data: { type: string }) => {
      console.log(`Refresh requested for: ${data.type}`);
      // Trigger data refresh for specific components
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      if (socket.data.userId) {
        console.log(`User ${socket.data.userId} disconnected`);
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Start generating mock data
  dataGenerator.startGenerating(io);

  // Cleanup on server shutdown
  process.on('SIGTERM', () => {
    if (dataGenerator) {
      dataGenerator.stopGenerating();
    }
    io?.close();
  });

  return io;
}

export function getIO(): SocketServer | null {
  return io;
}