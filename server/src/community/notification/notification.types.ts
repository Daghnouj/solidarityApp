// notification/notification.types.ts
import { Types } from 'mongoose';

export interface INotification {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: 'like' | 'comment' | 'reply' | 'appointment_request' | 'appointment_confirmed' | 'appointment_cancelled';
  post?: Types.ObjectId;
  appointment?: Types.ObjectId;
  read: boolean;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationParams {
  recipientId: Types.ObjectId;
  senderId: Types.ObjectId;
  type: 'like' | 'comment' | 'reply' | 'appointment_request' | 'appointment_confirmed' | 'appointment_cancelled';
  postId?: string;
  appointmentId?: string;
  metadata: any;
  io?: any;
}