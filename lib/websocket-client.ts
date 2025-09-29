import { UserRole } from '@/types/auth';

// WebSocket event types
export const WS_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Authentication
  AUTH: 'auth',
  AUTH_SUCCESS: 'auth_success',
  AUTH_ERROR: 'auth_error',

  // Data events
  DASHBOARD_UPDATE: 'dashboard_update',
  LOAN_STATUS_CHANGE: 'loan_status_change',
  PAYMENT_UPDATE: 'payment_update',
  NOTIFICATION: 'notification',
  ANALYTICS_UPDATE: 'analytics_update',

  // Role-specific events
  APPLICATION_RECEIVED: 'application_received', // For underwriters
  COLLECTION_ALERT: 'collection_alert', // For collection agents
  COMPLIANCE_ALERT: 'compliance_alert', // For finance managers
  RISK_ALERT: 'risk_alert', // For risk analysts
  TICKET_ASSIGNED: 'ticket_assigned', // For support agents

  // Real-time metrics
  METRICS_UPDATE: 'metrics_update',
  PERFORMANCE_UPDATE: 'performance_update',

  // User actions
  USER_ACTION: 'user_action',
  REQUEST_REFRESH: 'request_refresh'
} as const;

export type WSEvent = typeof WS_EVENTS[keyof typeof WS_EVENTS];

// WebSocket message types
export interface WSMessage<T = any> {
  event: WSEvent;
  data: T;
  timestamp: string;
  userId?: string;
  role?: UserRole;
}

// WebSocket options
export interface WSOptions {
  reconnection: boolean;
  reconnectionDelay: number;
  reconnectionDelayMax: number;
  reconnectionAttempts: number;
  transports: string[];
  auth?: {
    userId?: string;
    role?: UserRole;
    token?: string;
  };
}

export const DEFAULT_WS_OPTIONS: WSOptions = {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling']
};

// Type guards
export const isValidWSEvent = (event: string): event is WSEvent => {
  return Object.values(WS_EVENTS).includes(event as WSEvent);
};

export const isValidWSMessage = (message: any): message is WSMessage => {
  return (
    typeof message === 'object' &&
    message !== null &&
    'event' in message &&
    'data' in message &&
    'timestamp' in message &&
    isValidWSEvent(message.event)
  );
};