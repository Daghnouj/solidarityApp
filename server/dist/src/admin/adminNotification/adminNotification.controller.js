"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminNotificationController = void 0;
const adminNotification_service_1 = require("./adminNotification.service");
class AdminNotificationController {
    static async getNotifications(req, res) {
        try {
            if (!req.admin) {
                res.status(401).json({ message: 'Non authentifié' });
                return;
            }
            const limit = parseInt(req.query.limit) || 50;
            const notifications = await adminNotification_service_1.AdminNotificationService.getNotifications(limit);
            res.json({
                success: true,
                notifications
            });
        }
        catch (error) {
            console.error('Error fetching admin notifications:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur',
                error: error.message
            });
        }
    }
    static async getUnreadCount(req, res) {
        try {
            if (!req.admin) {
                res.status(401).json({ message: 'Non authentifié' });
                return;
            }
            const count = await adminNotification_service_1.AdminNotificationService.getUnreadCount();
            res.json({
                success: true,
                count
            });
        }
        catch (error) {
            console.error('Error fetching unread count:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur',
                error: error.message
            });
        }
    }
    static async markAsRead(req, res) {
        try {
            if (!req.admin) {
                res.status(401).json({ message: 'Non authentifié' });
                return;
            }
            const { notificationId } = req.params;
            await adminNotification_service_1.AdminNotificationService.markAsRead(notificationId);
            res.json({
                success: true,
                message: 'Notification marquée comme lue'
            });
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur',
                error: error.message
            });
        }
    }
    static async markAllAsRead(req, res) {
        try {
            if (!req.admin) {
                res.status(401).json({ message: 'Non authentifié' });
                return;
            }
            await adminNotification_service_1.AdminNotificationService.markAllAsRead();
            res.json({
                success: true,
                message: 'Toutes les notifications ont été marquées comme lues'
            });
        }
        catch (error) {
            console.error('Error marking all notifications as read:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur',
                error: error.message
            });
        }
    }
    static async deleteNotification(req, res) {
        try {
            if (!req.admin) {
                res.status(401).json({ message: 'Non authentifié' });
                return;
            }
            const { notificationId } = req.params;
            await adminNotification_service_1.AdminNotificationService.deleteNotification(notificationId);
            res.json({
                success: true,
                message: 'Notification supprimée'
            });
        }
        catch (error) {
            console.error('Error deleting notification:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur',
                error: error.message
            });
        }
    }
}
exports.AdminNotificationController = AdminNotificationController;
//# sourceMappingURL=adminNotification.controller.js.map