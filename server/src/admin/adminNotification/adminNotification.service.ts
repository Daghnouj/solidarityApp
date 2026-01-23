import { Server } from 'socket.io';
import AdminNotification, { IAdminNotification } from './adminNotification.model';

export interface CreateAdminNotificationParams {
  type: 'user_login' | 'user_signup' | 'contact_request' | 'verification_request' | 'verification_update' | 'new_post';
  title: string;
  message: string;
  data: any;
  io?: Server | null;
}

export class AdminNotificationService {
  static async createNotification({
    type,
    title,
    message,
    data,
    io
  }: CreateAdminNotificationParams): Promise<IAdminNotification> {
    try {
      const notification = new AdminNotification({
        type,
        title,
        message,
        data
      });

      await notification.save();

      // Emit to all admins in the admin room
      if (io) {
        io.to('admin-room').emit('admin_notification', {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          read: notification.read,
          createdAt: notification.createdAt
        });
      }

      return notification;
    } catch (error) {
      console.error('Error creating admin notification:', error);
      throw error;
    }
  }

  static async getNotifications(limit: number = 50): Promise<IAdminNotification[]> {
    return await AdminNotification.find()
      .sort('-createdAt')
      .limit(limit);
  }

  static async getUnreadCount(): Promise<number> {
    return await AdminNotification.countDocuments({ read: false });
  }

  static async markAsRead(notificationId: string): Promise<void> {
    await AdminNotification.findByIdAndUpdate(notificationId, { read: true });
  }

  static async markAllAsRead(): Promise<void> {
    await AdminNotification.updateMany({ read: false }, { read: true });
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    await AdminNotification.findByIdAndDelete(notificationId);
  }
}
