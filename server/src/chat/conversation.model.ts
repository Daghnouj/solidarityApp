import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    isGroup: boolean;
    groupName?: string;
    groupId?: mongoose.Types.ObjectId;
    lastMessage: mongoose.Types.ObjectId;
    updatedAt: Date;
}

const ConversationSchema: Schema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

// Index for performance
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ groupId: 1 });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
