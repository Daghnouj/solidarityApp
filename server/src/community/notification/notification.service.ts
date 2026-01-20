import { Types } from 'mongoose';
import Notification from './notification.model';
import { CreateNotificationParams, INotification } from './notification.types';

export class NotificationService {
  static async getUserNotifications(userId: Types.ObjectId): Promise<INotification[]> {
    return await Notification.find({ recipient: userId })
      .sort('-createdAt')
      .populate('sender', 'nom photo')
      .populate('post', 'content');
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
        post: postId,
        metadata
      });

      await notification.save();
      
      const populated = await Notification.populate(notification, [
        { path: 'sender', select: 'nom photo' },
        { path: 'post', select: 'content' }
      ]);

      if (io && typeof io.to === 'function') {
        io.to(recipientId.toString())
          .emit('new_notification', populated);
      } else {
        console.warn('Socket.IO non disponible pour notification');
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
  type: 'like' | 'comment' | 'reply',
  postId: string,
  metadata: any,
  io?: any
): Promise<INotification | null> => {
  return NotificationService.createNotification({
    recipientId,
    senderId,
    type,
    postId,
    metadata,
    io
  });
};