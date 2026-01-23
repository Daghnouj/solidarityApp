import { Response } from 'express';
import { AdminRequest } from '../admin.types';
import { AdminNotificationService } from './adminNotification.service';

export class AdminNotificationController {
  static async getNotifications(req: AdminRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        res.status(401).json({ message: 'Non authentifié' });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const notifications = await AdminNotificationService.getNotifications(limit);
      
      res.json({
        success: true,
        notifications
      });
    } catch (error: any) {
      console.error('Error fetching admin notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  static async getUnreadCount(req: AdminRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        res.status(401).json({ message: 'Non authentifié' });
        return;
      }

      const count = await AdminNotificationService.getUnreadCount();
      
      res.json({
        success: true,
        count
      });
    } catch (error: any) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  static async markAsRead(req: AdminRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        res.status(401).json({ message: 'Non authentifié' });
        return;
      }

      const { notificationId } = req.params;
      await AdminNotificationService.markAsRead(notificationId);
      
      res.json({
        success: true,
        message: 'Notification marquée comme lue'
      });
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  static async markAllAsRead(req: AdminRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        res.status(401).json({ message: 'Non authentifié' });
        return;
      }

      await AdminNotificationService.markAllAsRead();
      
      res.json({
        success: true,
        message: 'Toutes les notifications ont été marquées comme lues'
      });
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }

  static async deleteNotification(req: AdminRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        res.status(401).json({ message: 'Non authentifié' });
        return;
      }

      const { notificationId } = req.params;
      await AdminNotificationService.deleteNotification(notificationId);
      
      res.json({
        success: true,
        message: 'Notification supprimée'
      });
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
}
