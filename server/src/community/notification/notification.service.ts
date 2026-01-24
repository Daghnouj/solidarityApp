import { Types } from 'mongoose';
import Notification from './notification.model';
import { CreateNotificationParams, INotification } from './notification.types';

export class NotificationService {
  static async getUserNotifications(userId: Types.ObjectId): Promise<INotification[]> {
    return await Notification.find({ recipient: userId })
      .sort('-createdAt')
      .populate('sender', 'nom photo')
      .populate('post', 'content')
      .populate('appointment', 'time type status');
  }

  static async markAsRead(userId: Types.ObjectId): Promise<void> {
    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );
  }

  static async createNotification({
    recipientId,
    senderId,
    type,
    postId,
    appointmentId,
    metadata,
    io
  }: CreateNotificationParams): Promise<INotification | null> {
    try {
      if (recipientId.toString() === senderId.toString()) {
        return null;
      }

      const notification = new Notification({
        recipient: recipientId,
        sender: senderId,
        type,
        post: postId || undefined,
        appointment: appointmentId || undefined,
        metadata
      });

      // No need for separate assignment if passed in constructor correctly above, 
      // but keeping logic clean:
      if (postId) notification.post = new Types.ObjectId(postId);
      if (appointmentId) notification.appointment = new Types.ObjectId(appointmentId);

      await notification.save();

      const populated = await Notification.populate(notification, [
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
      } else {
        console.warn('⚠️ Socket.IO non disponible pour notification');
        console.warn('io object:', io);
        console.warn('io.to function:', typeof io?.to);
      }

      return populated;

    } catch (error) {
      console.error('Notification error:', {
        error,
        recipientId,
        senderId
      });
      return null;
    }
  }
}

// Exportez aussi une fonction createNotification pour la compatibilité
export const createNotification = (
  recipientId: Types.ObjectId,
  senderId: Types.ObjectId,
  type: 'like' | 'comment' | 'reply' | 'appointment_request' | 'appointment_confirmed' | 'appointment_cancelled',
  postId: string | undefined, // Make optional
  metadata: any,
  io?: any,
  appointmentId?: string // Add optional param
): Promise<INotification | null> => {
  return NotificationService.createNotification({
    recipientId,
    senderId,
    type,
    postId,
    appointmentId,
    metadata,
    io
  });
};