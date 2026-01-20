import mongoose, { Schema, Document } from 'mongoose';

export interface IHashtag extends Document {
  name: string;
  count: number;
  toObject(): any;
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

export default mongoose.model<IHashtag>('Hashtag', hashtagSchema);