"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminNotificationService = void 0;
const adminNotification_model_1 = __importDefault(require("./adminNotification.model"));
class AdminNotificationService {
    static async createNotification({ type, title, message, data, io }) {
        try {
            const notification = new adminNotification_model_1.default({
                type,
                title,
                message,
                data
            });
            await notification.save();
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
        }
        catch (error) {
            console.error('Error creating admin notification:', error);
            throw error;
        }
    }
    static async getNotifications(limit = 50) {
        return await adminNotification_model_1.default.find()
            .sort('-createdAt')
            .limit(limit);
    }
    static async getUnreadCount() {
        return await adminNotification_model_1.default.countDocuments({ read: false });
    }
    static async markAsRead(notificationId) {
        await adminNotification_model_1.default.findByIdAndUpdate(notificationId, { read: true });
    }
    static async markAllAsRead() {
        await adminNotification_model_1.default.updateMany({ read: false }, { read: true });
    }
    static async deleteNotification(notificationId) {
        await adminNotification_model_1.default.findByIdAndDelete(notificationId);
    }
}
exports.AdminNotificationService = AdminNotificationService;
//# sourceMappingURL=adminNotification.service.js.map