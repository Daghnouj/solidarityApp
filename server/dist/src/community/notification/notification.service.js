"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.NotificationService = void 0;
const mongoose_1 = require("mongoose");
const notification_model_1 = __importDefault(require("./notification.model"));
class NotificationService {
    static async getUserNotifications(userId) {
        return await notification_model_1.default.find({ recipient: userId })
            .sort('-createdAt')
            .populate('sender', 'nom photo')
            .populate('post', 'content')
            .populate('appointment', 'time type status');
    }
    static async markAsRead(userId) {
        await notification_model_1.default.updateMany({ recipient: userId, read: false }, { $set: { read: true } });
    }
    static async markOneAsRead(userId, notificationId) {
        await notification_model_1.default.updateOne({ _id: notificationId, recipient: userId }, { $set: { read: true } });
    }
    static async createNotification({ recipientId, senderId, type, postId, appointmentId, metadata, isAnonymous, io }) {
        try {
            if (recipientId.toString() === senderId.toString()) {
                return null;
            }
            const notification = new notification_model_1.default({
                recipient: recipientId,
                sender: senderId,
                type,
                post: postId || undefined,
                appointment: appointmentId || undefined,
                isAnonymous: isAnonymous || false,
                metadata
            });
            if (postId)
                notification.post = new mongoose_1.Types.ObjectId(postId);
            if (appointmentId)
                notification.appointment = new mongoose_1.Types.ObjectId(appointmentId);
            await notification.save();
            const populated = await notification_model_1.default.populate(notification, [
                { path: 'sender', select: 'nom photo' },
                { path: 'post', select: 'content' },
                { path: 'appointment', select: 'time type status' }
            ]);
            if (io && typeof io.to === 'function') {
                console.log(`🔔 Emitting notification to room: ${recipientId.toString()}`);
                console.log(`📧 Notification type: ${type}`);
                console.log(`👤 Sender: ${senderId.toString()}`);
                io.to(recipientId.toString())
                    .emit('new_notification', populated);
                console.log(`✅ Notification emitted successfully`);
            }
            else {
                console.warn('⚠️ Socket.IO non disponible pour notification');
                console.warn('io object:', io);
                console.warn('io.to function:', typeof (io === null || io === void 0 ? void 0 : io.to));
            }
            return populated;
        }
        catch (error) {
            console.error('Notification error:', {
                error,
                recipientId,
                senderId
            });
            return null;
        }
    }
}
exports.NotificationService = NotificationService;
const createNotification = (recipientId, senderId, type, postId, metadata, io, appointmentId, isAnonymous) => {
    return NotificationService.createNotification({
        recipientId,
        senderId,
        type,
        postId,
        appointmentId,
        metadata,
        isAnonymous,
        io
    });
};
exports.createNotification = createNotification;
//# sourceMappingURL=notification.service.js.map