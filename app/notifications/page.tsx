"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, BellOff, Check, X, Info, AlertTriangle,
  CheckCircle, XCircle, Clock, Filter, Search,
  Archive, Trash2, MoreVertical, RefreshCw,
  Settings, ChevronRight, Mail, MessageSquare,
  Smartphone, Globe
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { notificationsService } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "alert";
  category: "loan" | "payment" | "kyc" | "offer" | "system" | "support";
  isRead: boolean;
  isArchived: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
}

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  alert: Bell
};

const notificationColors = {
  info: "bg-blue-50 border-blue-200 text-blue-700",
  success: "bg-green-50 border-green-200 text-green-700",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
  error: "bg-red-50 border-red-200 text-red-700",
  alert: "bg-purple-50 border-purple-200 text-purple-700"
};

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  const [preferences, setPreferences] = useState({
    email: { enabled: true, frequency: "immediate" as const, categories: ["loan", "payment", "kyc"] },
    sms: { enabled: true, categories: ["payment", "kyc"] },
    push: { enabled: true, categories: ["all"] },
    whatsapp: { enabled: false, categories: [] }
  });

  const categories = [
    { value: "all", label: "All", count: 0 },
    { value: "loan", label: "Loans", count: 0 },
    { value: "payment", label: "Payments", count: 0 },
    { value: "kyc", label: "KYC", count: 0 },
    { value: "offer", label: "Offers", count: 0 },
    { value: "system", label: "System", count: 0 },
    { value: "support", label: "Support", count: 0 }
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, selectedCategory, selectedType, searchQuery]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationsService.getNotifications();

      if (response.success && response.data) {
        setNotifications(response.data.notifications);
      } else {
        // Use mock data if API fails
        setNotifications(getMockNotifications());
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications(getMockNotifications());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockNotifications = (): Notification[] => [
    {
      id: "1",
      title: "Loan Approved!",
      message: "Congratulations! Your personal loan of ₹50,000 has been approved. Funds will be disbursed within 24 hours.",
      type: "success",
      category: "loan",
      isRead: false,
      isArchived: false,
      actionUrl: "/dashboard",
      actionLabel: "View Details",
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      title: "EMI Due Reminder",
      message: "Your EMI of ₹5,420 is due on December 5th. Ensure sufficient balance in your account.",
      type: "warning",
      category: "payment",
      isRead: false,
      isArchived: false,
      actionUrl: "/payments",
      actionLabel: "Pay Now",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "3",
      title: "KYC Verification Pending",
      message: "Complete your KYC verification to access all features and increase your loan eligibility.",
      type: "alert",
      category: "kyc",
      isRead: true,
      isArchived: false,
      actionUrl: "/kyc",
      actionLabel: "Complete KYC",
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  const filterNotifications = () => {
    let filtered = [...notifications];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(n => n.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(n => n.type === selectedType);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleArchive = async (notificationId: string) => {
    try {
      await notificationsService.archiveNotification(notificationId);
      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, isArchived: true } : n
      ));
    } catch (error) {
      console.error("Failed to archive notification:", error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationsService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleBulkAction = async (action: "read" | "archive" | "delete") => {
    const selectedIds = Array.from(selectedNotifications);

    switch (action) {
      case "read":
        await notificationsService.markMultipleAsRead(selectedIds);
        setNotifications(prev => prev.map(n =>
          selectedIds.includes(n.id) ? { ...n, isRead: true } : n
        ));
        break;
      case "archive":
        // Archive selected
        break;
      case "delete":
        // Delete selected
        break;
    }

    setSelectedNotifications(new Set());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-2">Stay updated with your account activity</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => fetchNotifications()}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => {
                    const count = notifications.filter(n =>
                      cat.value === "all" ? true : n.category === cat.value
                    ).length;

                    return (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                          selectedCategory === cat.value
                            ? "bg-blue-50 text-blue-700"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {count > 0 && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    <Check className="w-4 h-4 inline mr-2" />
                    Mark all as read
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <Archive className="w-4 h-4 inline mr-2" />
                    View archived
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    Clear all
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>

                {selectedNotifications.size > 0 && (
                  <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-700">
                      {selectedNotifications.size} selected
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkAction("read")}
                        className="text-sm text-blue-700 hover:text-blue-800"
                      >
                        Mark as read
                      </button>
                      <button
                        onClick={() => handleBulkAction("archive")}
                        className="text-sm text-blue-700 hover:text-blue-800"
                      >
                        Archive
                      </button>
                      <button
                        onClick={() => handleBulkAction("delete")}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {isLoading ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading notifications...</p>
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                      <p className="text-gray-600">You're all caught up!</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => {
                      const Icon = notificationIcons[notification.type];
                      const colorClass = notificationColors[notification.type];

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className={`bg-white rounded-lg shadow p-4 border ${
                            notification.isRead ? "border-gray-200" : "border-blue-300"
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedNotifications.has(notification.id)}
                                onChange={(e) => {
                                  const newSet = new Set(selectedNotifications);
                                  if (e.target.checked) {
                                    newSet.add(notification.id);
                                  } else {
                                    newSet.delete(notification.id);
                                  }
                                  setSelectedNotifications(newSet);
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </div>

                            <div className={`p-2 rounded-lg ${colorClass}`}>
                              <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className={`font-semibold ${
                                    notification.isRead ? "text-gray-700" : "text-gray-900"
                                  }`}>
                                    {notification.title}
                                    {!notification.isRead && (
                                      <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                                    )}
                                  </h4>
                                  <p className="text-gray-600 mt-1">{notification.message}</p>

                                  {notification.actionUrl && (
                                    <a
                                      href={notification.actionUrl}
                                      className="inline-flex items-center mt-3 text-sm text-blue-600 hover:text-blue-700"
                                    >
                                      {notification.actionLabel || "View"}
                                      <ChevronRight className="w-4 h-4 ml-1" />
                                    </a>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                  <span className="text-xs text-gray-500">
                                    {formatDate(notification.createdAt)}
                                  </span>

                                  <div className="relative group">
                                    <button className="p-1 rounded hover:bg-gray-100">
                                      <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>

                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                      {!notification.isRead && (
                                        <button
                                          onClick={() => handleMarkAsRead(notification.id)}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                          Mark as read
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleArchive(notification.id)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      >
                                        Archive
                                      </button>
                                      <button
                                        onClick={() => handleDelete(notification.id)}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Settings Modal */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowSettings(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span>Email Notifications</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.email.enabled}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          email: { ...prev.email, enabled: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                        <span>SMS Notifications</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.sms.enabled}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          sms: { ...prev.sms, enabled: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-gray-400" />
                        <span>Push Notifications</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.push.enabled}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          push: { ...prev.push, enabled: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <span>WhatsApp Notifications</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.whatsapp.enabled}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, enabled: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Save preferences
                        setShowSettings(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
}