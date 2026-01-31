import mongoose, { Schema, Document } from 'mongoose';
import { IPost, IComment, IReply } from './post.types';

const replySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  edited: { type: Boolean, default: false },
  isAnonymous: { type: Boolean, default: false },
});

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  edited: { type: Boolean, default: false },
  isAnonymous: { type: Boolean, default: false },
  replies: [replySchema]
});

const postSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  userPhoto: {
    type: String,
    default: 'default.png'
  },
  userRole: {
    type: String,
    enum: ['patient', 'professional'],
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  hashtags: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  },
  edited: {
    type: Boolean,
    default: false
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IPost>('Post', postSchema);