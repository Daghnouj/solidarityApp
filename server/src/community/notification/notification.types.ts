// notification/notification.types.ts
import { Types } from 'mongoose';

export interface INotification {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: 'like' | 'comment' | 'reply';
  post: Types.ObjectId;
  read: boolean;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationParams {
  recipientId: Types.ObjectId;
  senderId: Types.ObjectId;
  type: 'like' | 'comment' | 'reply';
  postId: string;
  metadata: any;
  io?: any;
}