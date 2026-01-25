import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content: string;
    attachment?: {
        url: string;
        type: 'image' | 'file';
        name: string;
    };
    timestamp: Date;
    read: boolean;
}

const MessageSchema: Schema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, default: '' },
    attachment: {
        url: { type: String },
        type: { type: String, enum: ['image', 'file'] },
        name: { type: String }
    },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);
