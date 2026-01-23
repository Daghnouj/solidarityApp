const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper to get base URL without /api suffix for proper URL construction
const getBaseUrl = (): string => {
  if (!API_BASE_URL) return '';
  // Remove trailing /api if present
  return API_BASE_URL.replace(/\/api\/?$/, '');
};

export interface AdminNotification {
  _id: string;
  id?: string;
  type: 'user_login' | 'user_signup' | 'contact_request' | 'verification_request' | 'verification_update' | 'new_post';
  title: string;
  message: string;
  data: {
    userId?: string;
    userName?: string;
    userEmail?: string;
    contactId?: string;
    contactName?: string;
    requestId?: string;
    professionalId?: string;
    professionalName?: string;
    postId?: string;
    postContent?: string;
    [key: string]: any;
  };
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  notifications: AdminNotification[];
}

export interface UnreadCountResponse {
  success: boolean;
  count: number;
}

class AdminNotificationService {
  private getAuthHeaders(): HeadersInit {
    const adminToken = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(adminToken && { 'Authorization': `Bearer ${adminToken}` }),
    };
  }

  async getNotifications(limit: number = 50): Promise<AdminNotification[]> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/admin/notifications?limit=${limit}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data: NotificationsResponse = await response.json();
      return data.notifications || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/admin/notifications/unread-count`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }

      const data: UnreadCountResponse = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/admin/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: this.getAuthHeaders(),
          credentials: 'include',
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/admin/notifications/mark-all-read`,
        {
          method: 'PATCH',
          headers: this.getAuthHeaders(),
          credentials: 'include',
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error marking all as read:', error);
      return false;
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/admin/notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
          credentials: 'include',
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }
}

export const adminNotificationService = new AdminNotificationService();
