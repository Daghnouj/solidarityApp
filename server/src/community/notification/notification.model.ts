import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from './notification.types';

const notificationSchema = new Schema({
  recipient: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'reply'],
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  metadata: Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', notificationSchema);