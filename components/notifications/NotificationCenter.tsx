'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, Check, CheckCircle, AlertTriangle, Info,
  AlertCircle, Gift, CreditCard, Calendar, ExternalLink,
  Volume2, VolumeX, Wifi, WifiOff
} from 'lucide-react';
import { useNotifications, Notification } from '@/contexts/NotificationContext';

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    isConnected,
    toggleConnection
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  const getIcon = (type: Notification['type']) => {
    const iconMap = {
      SUCCESS: CheckCircle,
      ERROR: AlertCircle,
      WARNING: AlertTriangle,
      INFO: Info,
      PAYMENT_REMINDER: CreditCard,
      PROMOTION: Gift,
      REWARD: Gift,
      ALERT: AlertTriangle
    };
    return iconMap[type] || Bell;
  };

  const getColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'CRITICAL') return 'text-red-500 bg-red-500/10';

    const colorMap = {
      SUCCESS: 'text-green-500 bg-green-500/10',
      ERROR: 'text-red-500 bg-red-500/10',
      WARNING: 'text-yellow-500 bg-yellow-500/10',
      INFO: 'text-blue-500 bg-blue-500/10',
      PAYMENT_REMINDER: 'text-orange-500 bg-orange-500/10',
      PROMOTION: 'text-purple-500 bg-purple-500/10',
      REWARD: 'text-emerald-500 bg-emerald-500/10',
      ALERT: 'text-red-500 bg-red-500/10'
    };
    return colorMap[type] || 'text-slate-400 bg-slate-400/10';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'critical') return notification.priority === 'CRITICAL';
    return true;
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.actionable && notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-300" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}

        {/* Connection Status Indicator */}
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${
          isConnected ? 'bg-green-500' : 'bg-gray-500'
        }`} />
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-96 bg-slate-800 rounded-xl shadow-xl border border-slate-700 z-50 max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Filter Buttons */}
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      className="text-xs bg-slate-700 text-slate-300 rounded px-2 py-1 border-0"
                    >
                      <option value="all">All</option>
                      <option value="unread">Unread</option>
                      <option value="critical">Critical</option>
                    </select>

                    {/* Connection Toggle */}
                    <button
                      onClick={toggleConnection}
                      className={`p-1 rounded transition-colors ${
                        isConnected ? 'text-green-400 hover:bg-green-400/10' : 'text-gray-400 hover:bg-gray-400/10'
                      }`}
                      title={isConnected ? 'Connected - Click to disconnect' : 'Disconnected - Click to connect'}
                    >
                      {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}

                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No notifications</p>
                    {filter !== 'all' && (
                      <button
                        onClick={() => setFilter('all')}
                        className="text-blue-400 hover:text-blue-300 text-sm mt-2"
                      >
                        View all notifications
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredNotifications.map((notification) => {
                      const Icon = getIcon(notification.type);
                      const colorClasses = getColor(notification.type, notification.priority);

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`p-3 rounded-lg mb-2 cursor-pointer transition-all group ${
                            notification.read
                              ? 'bg-slate-700/50 hover:bg-slate-700'
                              : 'bg-slate-700 hover:bg-slate-600 border border-blue-500/20'
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${colorClasses}`}>
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h4 className={`text-sm font-medium ${
                                  notification.read ? 'text-slate-300' : 'text-white'
                                }`}>
                                  {notification.title}
                                </h4>

                                <div className="flex items-center space-x-2 ml-2">
                                  {notification.priority === 'CRITICAL' && (
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                  )}

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeNotification(notification.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600 rounded transition-all"
                                  >
                                    <X className="w-3 h-3 text-slate-400" />
                                  </button>
                                </div>
                              </div>

                              <p className={`text-xs mt-1 ${
                                notification.read ? 'text-slate-400' : 'text-slate-300'
                              }`}>
                                {notification.message}
                              </p>

                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-slate-500">
                                  {new Date(notification.timestamp).toLocaleTimeString()}
                                </span>

                                {notification.actionable && (
                                  <div className="flex items-center space-x-1 text-blue-400">
                                    <span className="text-xs">{notification.actionText || 'View'}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}