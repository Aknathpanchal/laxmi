'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO' | 'PAYMENT_REMINDER' | 'PROMOTION' | 'REWARD' | 'ALERT';
  title: string;
  message: string;
  timestamp: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  read: boolean;
  actionable?: boolean;
  actionUrl?: string;
  actionText?: string;
  autoHide?: boolean;
  persistency?: 'SESSION' | 'PERMANENT';
  category?: string;
  userId?: string;
  role?: UserRole;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  getNotificationsByType: (type: Notification['type']) => Notification[];
  getNotificationsByPriority: (priority: Notification['priority']) => Notification[];
  isConnected: boolean;
  toggleConnection: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Role-specific notification preferences
const ROLE_NOTIFICATION_CONFIG: Record<UserRole, {
  maxNotifications: number;
  autoHideDelay: number;
  enabledTypes: Notification['type'][];
}> = {
  USER: {
    maxNotifications: 10,
    autoHideDelay: 5000,
    enabledTypes: ['SUCCESS', 'ERROR', 'WARNING', 'INFO', 'PAYMENT_REMINDER', 'PROMOTION', 'REWARD']
  },
  ADMIN: {
    maxNotifications: 50,
    autoHideDelay: 0, // No auto-hide for admin
    enabledTypes: ['SUCCESS', 'ERROR', 'WARNING', 'INFO', 'ALERT']
  },
  UNDERWRITER: {
    maxNotifications: 25,
    autoHideDelay: 8000,
    enabledTypes: ['SUCCESS', 'ERROR', 'WARNING', 'INFO', 'ALERT']
  },
  COLLECTION_AGENT: {
    maxNotifications: 20,
    autoHideDelay: 6000,
    enabledTypes: ['SUCCESS', 'ERROR', 'WARNING', 'INFO', 'ALERT', 'PAYMENT_REMINDER']
  },
  FINANCE_MANAGER: {
    maxNotifications: 30,
    autoHideDelay: 0,
    enabledTypes: ['SUCCESS', 'ERROR', 'WARNING', 'INFO', 'ALERT']
  },
  RISK_ANALYST: {
    maxNotifications: 35,
    autoHideDelay: 0,
    enabledTypes: ['SUCCESS', 'ERROR', 'WARNING', 'INFO', 'ALERT']
  },
  SUPPORT_AGENT: {
    maxNotifications: 15,
    autoHideDelay: 4000,
    enabledTypes: ['SUCCESS', 'ERROR', 'WARNING', 'INFO', 'ALERT']
  },
  SUPER_ADMIN: {
    maxNotifications: 100,
    autoHideDelay: 0,
    enabledTypes: ['SUCCESS', 'ERROR', 'WARNING', 'INFO', 'ALERT']
  }
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const config = user ? ROLE_NOTIFICATION_CONFIG[user.role] : ROLE_NOTIFICATION_CONFIG.USER;

  // Simulate real-time connection
  useEffect(() => {
    if (user && isConnected) {
      // Simulate receiving notifications based on role
      const interval = setInterval(() => {
        const mockNotifications = generateMockNotifications(user.role);
        if (mockNotifications.length > 0) {
          const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
          addNotification(randomNotification);
        }
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user, isConnected]);

  const addNotification = useCallback((
    notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ): string => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const notification: Notification = {
      ...notificationData,
      id,
      timestamp: new Date().toISOString(),
      read: false,
      userId: user?.id,
      role: user?.role
    };

    // Check if notification type is enabled for current role
    if (user && !config.enabledTypes.includes(notification.type)) {
      return id;
    }

    setNotifications(prev => {
      const updated = [notification, ...prev];
      // Limit notifications based on role config
      return updated.slice(0, config.maxNotifications);
    });

    // Auto-hide notification if configured
    if (notification.autoHide !== false && config.autoHideDelay > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, config.autoHideDelay);
    }

    return id;
  }, [user, config]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const getNotificationsByPriority = useCallback((priority: Notification['priority']) => {
    return notifications.filter(n => n.priority === priority);
  }, [notifications]);

  const toggleConnection = useCallback(() => {
    setIsConnected(prev => !prev);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    getNotificationsByType,
    getNotificationsByPriority,
    isConnected,
    toggleConnection
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Mock notification generator for demonstration
function generateMockNotifications(role: UserRole): Omit<Notification, 'id' | 'timestamp' | 'read'>[] {
  const baseNotifications = {
    USER: [
      {
        type: 'PAYMENT_REMINDER' as const,
        title: 'EMI Due Soon',
        message: 'Your EMI payment is due in 2 days',
        priority: 'HIGH' as const,
        category: 'payment',
        actionable: true,
        actionUrl: '/user/payments',
        actionText: 'Pay Now'
      },
      {
        type: 'REWARD' as const,
        title: 'Points Earned',
        message: 'You earned 25 points for your recent payment',
        priority: 'LOW' as const,
        category: 'reward'
      }
    ],
    UNDERWRITER: [
      {
        type: 'ALERT' as const,
        title: 'High Risk Application',
        message: 'Application #APP123 flagged for manual review',
        priority: 'HIGH' as const,
        category: 'risk',
        actionable: true,
        actionUrl: '/underwriter/applications/APP123'
      }
    ],
    COLLECTION_AGENT: [
      {
        type: 'ALERT' as const,
        title: 'Payment Promise Broken',
        message: 'Customer CUST001 missed promised payment date',
        priority: 'HIGH' as const,
        category: 'collection',
        actionable: true,
        actionUrl: '/collection-agent/queue'
      }
    ],
    FINANCE_MANAGER: [
      {
        type: 'WARNING' as const,
        title: 'NPA Threshold Alert',
        message: 'Portfolio NPA approaching regulatory limit',
        priority: 'CRITICAL' as const,
        category: 'compliance'
      }
    ],
    RISK_ANALYST: [
      {
        type: 'ALERT' as const,
        title: 'Model Drift Detected',
        message: 'Credit scoring model showing accuracy decline',
        priority: 'HIGH' as const,
        category: 'model',
        actionable: true,
        actionUrl: '/risk-analyst/models'
      }
    ],
    SUPPORT_AGENT: [
      {
        type: 'INFO' as const,
        title: 'New Ticket Assigned',
        message: 'High priority ticket #TKT456 assigned to you',
        priority: 'MEDIUM' as const,
        category: 'support',
        actionable: true,
        actionUrl: '/support-agent/tickets/TKT456'
      }
    ],
    ADMIN: [
      {
        type: 'WARNING' as const,
        title: 'System Alert',
        message: 'High CPU usage detected on primary server',
        priority: 'HIGH' as const,
        category: 'system'
      }
    ],
    SUPER_ADMIN: [
      {
        type: 'ALERT' as const,
        title: 'Security Alert',
        message: 'Unusual login pattern detected',
        priority: 'CRITICAL' as const,
        category: 'security'
      }
    ]
  };

  return baseNotifications[role] || [];
}