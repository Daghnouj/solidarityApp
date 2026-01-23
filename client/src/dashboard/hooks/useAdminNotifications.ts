import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { AdminNotification } from '../services/adminNotification.service';
import { adminNotificationService } from '../services/adminNotification.service';

interface UseAdminNotificationsReturn {
  notifications: AdminNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  isConnected: boolean;
}

export const useAdminNotifications = (): UseAdminNotificationsReturn => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    if (!adminToken || !API_BASE_URL) {
      console.warn('Admin token or API URL not found');
      setLoading(false);
      return;
    }

    // Normalize API_BASE_URL for Socket.IO (remove /api if present, Socket.IO uses root path)
    const socketUrl = API_BASE_URL?.replace(/\/api\/?$/, '') || API_BASE_URL;

    // Create Socket.IO connection
    const socket = io(socketUrl, {
      auth: {
        token: adminToken,
        isAdmin: true,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      autoConnect: true,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ Admin Socket.IO connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Admin Socket.IO disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
      setError('Failed to connect to notification server');
      setIsConnected(false);
    });

    // Listen for new admin notifications
    socket.on('admin_notification', (notification: AdminNotification) => {
      console.log('📬 New admin notification received:', notification);
      
      // Add notification to the beginning of the list
      setNotifications((prev) => {
        // Check if notification already exists (avoid duplicates)
        const exists = prev.some((n) => n._id === notification.id || n._id === notification._id);
        if (exists) return prev;
        
        return [notification, ...prev];
      });

      // Update unread count
      setUnreadCount((prev) => prev + 1);

      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo.png',
          tag: notification._id || notification.id,
        });
      }
    });

    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [notificationsData, unreadCountData] = await Promise.all([
        adminNotificationService.getNotifications(50),
        adminNotificationService.getUnreadCount(),
      ]);

      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const success = await adminNotificationService.markAsRead(id);
      if (success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === id || n.id === id ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const success = await adminNotificationService.markAllAsRead();
      if (success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      const success = await adminNotificationService.deleteNotification(id);
      if (success) {
        setNotifications((prev) =>
          prev.filter((n) => n._id !== id && n.id !== id)
        );
        // Update unread count if notification was unread
        const notification = notifications.find(
          (n) => n._id === id || n.id === id
        );
        if (notification && !notification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: fetchNotifications,
    isConnected,
  };
};
