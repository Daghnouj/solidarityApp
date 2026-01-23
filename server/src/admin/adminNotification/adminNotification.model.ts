import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminNotification extends Document {
  type: 'user_login' | 'user_signup' | 'contact_request' | 'verification_request' | 'verification_update' | 'new_post';
  title: string;
  message: string;
  data: {
    userId?: string;
    userName?: string;
    userEmail?: string;
    contactId?: string;
    contactName?: string;
    requestId?: string;
    professionalId?: string;
    professionalName?: string;
    postId?: string;
    postContent?: string;
    [key: string]: any;
  };
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const adminNotificationSchema = new Schema({
  type: {
    type: String,
    enum: ['user_login', 'user_signup', 'contact_request', 'verification_request', 'verification_update', 'new_post'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model<IAdminNotification>('AdminNotification', adminNotificationSchema);
