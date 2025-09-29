import { apiClient, ApiResponse } from './api-client';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'alert';
  category: 'loan' | 'payment' | 'kyc' | 'offer' | 'system' | 'support';
  isRead: boolean;
  isArchived: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: any;
  createdAt: string;
  readAt?: string;
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    categories: string[];
  };
  sms: {
    enabled: boolean;
    categories: string[];
  };
  push: {
    enabled: boolean;
    categories: string[];
  };
  whatsapp: {
    enabled: boolean;
    categories: string[];
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  categories: {
    [key: string]: number;
  };
}

class NotificationsService {
  // Get all notifications
  async getNotifications(filters?: {
    isRead?: boolean;
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    notifications: Notification[];
    total: number;
    unread: number;
    page: number;
    totalPages: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/api/notifications?${queryParams.toString()}`);
  }

  // Get notification by ID
  async getNotificationById(id: string): Promise<ApiResponse<Notification>> {
    return apiClient.get<Notification>(`/api/notifications/${id}`);
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<ApiResponse<any>> {
    return apiClient.patch(`/api/notifications/${notificationId}/read`, {});
  }

  // Mark multiple notifications as read
  async markMultipleAsRead(notificationIds: string[]): Promise<ApiResponse<any>> {
    return apiClient.post('/api/notifications/mark-read', { ids: notificationIds });
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<ApiResponse<any>> {
    return apiClient.post('/api/notifications/mark-all-read', {});
  }

  // Archive notification
  async archiveNotification(notificationId: string): Promise<ApiResponse<any>> {
    return apiClient.patch(`/api/notifications/${notificationId}/archive`, {});
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/api/notifications/${notificationId}`);
  }

  // Get notification statistics
  async getNotificationStats(): Promise<ApiResponse<NotificationStats>> {
    return apiClient.get<NotificationStats>('/api/notifications/stats');
  }

  // Get notification preferences
  async getPreferences(): Promise<ApiResponse<NotificationPreferences>> {
    return apiClient.get<NotificationPreferences>('/api/notifications/preferences');
  }

  // Update notification preferences
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<ApiResponse<any>> {
    return apiClient.put('/api/notifications/preferences', preferences);
  }

  // Subscribe to push notifications
  async subscribePushNotifications(subscription: PushSubscription): Promise<ApiResponse<any>> {
    return apiClient.post('/api/notifications/push/subscribe', subscription);
  }

  // Unsubscribe from push notifications
  async unsubscribePushNotifications(): Promise<ApiResponse<any>> {
    return apiClient.post('/api/notifications/push/unsubscribe', {});
  }

  // Get unread count
  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return apiClient.get<{ count: number }>('/api/notifications/unread-count');
  }

  // Clear all notifications
  async clearAllNotifications(): Promise<ApiResponse<any>> {
    return apiClient.delete('/api/notifications/clear-all');
  }

  // Test notification (for debugging)
  async sendTestNotification(channel: 'email' | 'sms' | 'push' | 'whatsapp'): Promise<ApiResponse<any>> {
    return apiClient.post('/api/notifications/test', { channel });
  }
}

export const notificationsService = new NotificationsService();