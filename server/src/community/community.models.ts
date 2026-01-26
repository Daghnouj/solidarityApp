import mongoose, { Schema, Document } from 'mongoose';

export interface IHashtag extends Document {
  name: string;
  count: number;
}

const hashtagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  count: {
    type: Number,
    default: 1
  }
});

export interface IGroup extends Document {
  name: string;
  description: string;
  category: string;
  membersCount: number;
  icon?: string;
  color?: string;
}

const groupSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  membersCount: { type: Number, default: 0 },
  icon: { type: String },
  color: { type: String }
}, { timestamps: true });

export const Hashtag = mongoose.model<IHashtag>('Hashtag', hashtagSchema);
export const Group = mongoose.model<IGroup>('Group', groupSchema);
