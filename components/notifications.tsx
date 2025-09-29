"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, X, Check, AlertTriangle, Info, CheckCircle,
  Volume2, VolumeX, Settings, Filter, Trash2,
  CreditCard, User, DollarSign, FileText, Shield,
  Clock, Star, Zap
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO' | 'URGENT';
  category: 'LOAN' | 'PAYMENT' | 'DOCUMENT' | 'SYSTEM' | 'SECURITY' | 'PROMOTIONAL';
  isRead: boolean;
  isImportant: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
  userId?: string;
  metadata?: {
    loanId?: string;
    amount?: number;
    customerId?: string;
    applicationId?: string;
  };
}

interface NotificationSettings {
  enableSound: boolean;
  enableDesktop: boolean;
  categories: {
    [key: string]: boolean;
  };
  soundVolume: number;
}

interface NotificationsProps {
  userId?: string;
  userRole?: 'CUSTOMER' | 'ADMIN' | 'STAFF';
  className?: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enableSound: true,
  enableDesktop: true,
  categories: {
    LOAN: true,
    PAYMENT: true,
    DOCUMENT: true,
    SYSTEM: true,
    SECURITY: true,
    PROMOTIONAL: false
  },
  soundVolume: 0.7
};

const NOTIFICATION_TYPES = {
  SUCCESS: { color: 'green', icon: CheckCircle },
  ERROR: { color: 'red', icon: AlertTriangle },
  WARNING: { color: 'yellow', icon: AlertTriangle },
  INFO: { color: 'blue', icon: Info },
  URGENT: { color: 'red', icon: Zap }
};

const CATEGORY_ICONS = {
  LOAN: CreditCard,
  PAYMENT: DollarSign,
  DOCUMENT: FileText,
  SYSTEM: Settings,
  SECURITY: Shield,
  PROMOTIONAL: Star
};

export function Notifications({ userId, userRole = 'CUSTOMER', className = '' }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);

  // WebSocket connection
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Audio for notifications
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mock notifications for development
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Loan Application Approved',
      message: 'Your personal loan application for ₹5,00,000 has been approved!',
      type: 'SUCCESS',
      category: 'LOAN',
      isRead: false,
      isImportant: true,
      createdAt: new Date().toISOString(),
      actionUrl: '/dashboard',
      actionText: 'View Details',
      metadata: { loanId: 'LN001', amount: 500000 }
    },
    {
      id: '2',
      title: 'EMI Due Tomorrow',
      message: 'Your EMI of ₹15,420 is due tomorrow. Pay now to avoid late fees.',
      type: 'WARNING',
      category: 'PAYMENT',
      isRead: false,
      isImportant: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      actionUrl: '/payments',
      actionText: 'Pay Now',
      metadata: { amount: 15420 }
    },
    {
      id: '3',
      title: 'Document Verification Required',
      message: 'Please upload your latest salary slip to complete verification.',
      type: 'INFO',
      category: 'DOCUMENT',
      isRead: true,
      isImportant: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      actionUrl: '/documents',
      actionText: 'Upload Document'
    },
    {
      id: '4',
      title: 'Security Alert',
      message: 'New login detected from Chrome on Windows. If this wasn\'t you, please secure your account.',
      type: 'URGENT',
      category: 'SECURITY',
      isRead: false,
      isImportant: true,
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      actionUrl: '/security',
      actionText: 'Review Activity'
    },
    {
      id: '5',
      title: 'Special Offer: Festival Loan',
      message: 'Get up to ₹2,00,000 at special rates this festive season. Apply now!',
      type: 'INFO',
      category: 'PROMOTIONAL',
      isRead: true,
      isImportant: false,
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      actionUrl: '/apply/festival-loan',
      actionText: 'Apply Now'
    }
  ];

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/sounds/notification.mp3');
    audioRef.current.volume = settings.soundVolume;

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
    if (audioRef.current) {
      audioRef.current.volume = settings.soundVolume;
    }
  }, [settings]);

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (!userId) return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/notifications?userId=${userId}&role=${userRole}`;

      // In development, we'll simulate WebSocket behavior
      if (process.env.NODE_ENV === 'development') {
        // Simulate initial load
        setTimeout(() => {
          setNotifications(mockNotifications);
        }, 1000);

        // Simulate real-time notifications
        const interval = setInterval(() => {
          const newNotification: Notification = {
            id: Date.now().toString(),
            title: 'New Notification',
            message: 'This is a simulated real-time notification',
            type: 'INFO',
            category: 'SYSTEM',
            isRead: false,
            isImportant: false,
            createdAt: new Date().toISOString()
          };

          handleNewNotification(newNotification);
        }, 30000); // Every 30 seconds

        return () => clearInterval(interval);
      }

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts.current = 0;

        // Request initial notifications
        ws.send(JSON.stringify({
          type: 'GET_NOTIFICATIONS',
          limit: 50
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'NOTIFICATIONS_LIST':
              setNotifications(data.notifications);
              break;

            case 'NEW_NOTIFICATION':
              handleNewNotification(data.notification);
              break;

            case 'NOTIFICATION_READ':
              markAsRead(data.notificationId);
              break;

            case 'PING':
              ws.send(JSON.stringify({ type: 'PONG' }));
              break;
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        wsRef.current = null;

        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connectWebSocket();
          }, delay);
        }
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, [userId, userRole]);

  // Handle new notifications
  const handleNewNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);

    // Check if notification should be shown based on settings
    if (!settings.categories[notification.category]) {
      return;
    }

    // Play sound if enabled
    if (settings.enableSound && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }

    // Show desktop notification if enabled and permission granted
    if (settings.enableDesktop && 'Notification' in window && Notification.permission === 'granted') {
      const desktopNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icons/notification-icon.png',
        tag: notification.id,
        requireInteraction: notification.isImportant
      });

      desktopNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        setIsOpen(true);
        desktopNotification.close();
      };

      // Auto-close after 5 seconds for non-important notifications
      if (!notification.isImportant) {
        setTimeout(() => desktopNotification.close(), 5000);
      }
    }

    // Show toast notification (you can integrate with a toast library here)
    showToastNotification(notification);
  }, [settings]);

  const showToastNotification = (notification: Notification) => {
    // This would integrate with your toast notification system
    // For now, we'll just log it
    console.log('Toast notification:', notification.title, notification.message);
  };

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket]);

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ));

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'MARK_READ',
          notificationId
        }));
      } else {
        // Fallback to REST API
        await fetch(`/api/notifications/${notificationId}/read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'MARK_ALL_READ'
        }));
      } else {
        await fetch('/api/notifications/mark-all-read', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'DELETE_NOTIFICATION',
          notificationId
        }));
      } else {
        await fetch(`/api/notifications/${notificationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      setLoading(true);
      setNotifications([]);

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'CLEAR_ALL'
        }));
      } else {
        await fetch('/api/notifications/clear-all', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredNotifications = () => {
    if (filter === 'ALL') return notifications;
    if (filter === 'UNREAD') return notifications.filter(n => !n.isRead);
    if (filter === 'IMPORTANT') return notifications.filter(n => n.isImportant);
    return notifications.filter(n => n.category === filter);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = getFilteredNotifications();

  const getNotificationIcon = (notification: Notification) => {
    const CategoryIcon = CATEGORY_ICONS[notification.category];
    return <CategoryIcon className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    const typeInfo = NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES];
    return typeInfo ? typeInfo.color : 'gray';
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--royal-blue)] focus:ring-offset-2 rounded-full"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="mt-3 flex gap-2 flex-wrap">
                {['ALL', 'UNREAD', 'IMPORTANT', 'LOAN', 'PAYMENT', 'DOCUMENT'].map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      filter === filterOption
                        ? 'bg-[var(--royal-blue)] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption}
                    {filterOption === 'UNREAD' && unreadCount > 0 && (
                      <span className="ml-1">({unreadCount})</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Actions */}
              {filteredNotifications.length > 0 && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    disabled={loading}
                    className="text-xs text-[var(--royal-blue)] hover:text-blue-700 disabled:opacity-50"
                  >
                    Mark all as read
                  </button>
                  <button
                    onClick={clearAllNotifications}
                    disabled={loading}
                    className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-b border-gray-200 overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    <h4 className="font-medium text-gray-900">Notification Settings</h4>

                    {/* Sound Settings */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700">Sound Notifications</label>
                        <button
                          onClick={() => setSettings(prev => ({ ...prev, enableSound: !prev.enableSound }))}
                          className={`p-1 rounded ${settings.enableSound ? 'text-[var(--royal-blue)]' : 'text-gray-400'}`}
                        >
                          {settings.enableSound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </button>
                      </div>

                      {settings.enableSound && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Volume</span>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.soundVolume}
                            onChange={(e) => setSettings(prev => ({ ...prev, soundVolume: Number(e.target.value) }))}
                            className="flex-1"
                          />
                          <span className="text-xs text-gray-500">{Math.round(settings.soundVolume * 100)}%</span>
                        </div>
                      )}
                    </div>

                    {/* Desktop Notifications */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Desktop Notifications</label>
                      <input
                        type="checkbox"
                        checked={settings.enableDesktop}
                        onChange={(e) => setSettings(prev => ({ ...prev, enableDesktop: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                    </div>

                    {/* Category Settings */}
                    <div>
                      <label className="text-sm text-gray-700 block mb-2">Notification Categories</label>
                      <div className="space-y-1">
                        {Object.entries(settings.categories).map(([category, enabled]) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 capitalize">{category.toLowerCase()}</span>
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                categories: { ...prev.categories, [category]: e.target.checked }
                              }))}
                              className="rounded border-gray-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsRead(notification.id);
                        }
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-full flex-shrink-0 bg-${getTypeColor(notification.type)}-100`}>
                          {getNotificationIcon(notification)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium text-gray-900 ${!notification.isRead ? 'font-semibold' : ''}`}>
                              {notification.title}
                              {notification.isImportant && (
                                <Star className="h-3 w-3 text-yellow-500 inline ml-1" />
                              )}
                            </h4>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-gray-500">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 rounded"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>

                          {/* Metadata */}
                          {notification.metadata && (
                            <div className="mt-2 text-xs text-gray-500">
                              {notification.metadata.amount && (
                                <span>Amount: ₹{notification.metadata.amount.toLocaleString()}</span>
                              )}
                              {notification.metadata.loanId && (
                                <span className="ml-2">Loan: {notification.metadata.loanId}</span>
                              )}
                            </div>
                          )}

                          {/* Action Button */}
                          {notification.actionText && notification.actionUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = notification.actionUrl!;
                              }}
                              className="mt-2 text-xs text-[var(--royal-blue)] hover:text-blue-700 font-medium"
                            >
                              {notification.actionText} →
                            </button>
                          )}
                        </div>

                        {/* Unread Indicator */}
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-[var(--royal-blue)] rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to full notifications page
                    window.location.href = '/notifications';
                  }}
                  className="text-sm text-[var(--royal-blue)] hover:text-blue-700 font-medium"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Toast Notification Component (can be used independently)
export function ToastNotification({
  notification,
  onClose
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const TypeIcon = NOTIFICATION_TYPES[notification.type].icon;

  useEffect(() => {
    if (!notification.isImportant) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.isImportant, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto border-l-4 border-${getTypeColor(notification.type)}-500`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <TypeIcon className={`h-6 w-6 text-${getTypeColor(notification.type)}-500`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {notification.message}
            </p>
            {notification.actionText && notification.actionUrl && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    window.location.href = notification.actionUrl!;
                    onClose();
                  }}
                  className={`text-sm font-medium text-${getTypeColor(notification.type)}-600 hover:text-${getTypeColor(notification.type)}-500`}
                >
                  {notification.actionText}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getTypeColor(type: string) {
  const typeInfo = NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES];
  return typeInfo ? typeInfo.color : 'gray';
}