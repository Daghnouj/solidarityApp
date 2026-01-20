import { Types, Document } from 'mongoose';

export interface IComment extends Document {
  user: Types.ObjectId;
  text: string;
  date: Date;
  edited: boolean;
  replies: IReply[];
}

export interface IReply extends Document {
  user: Types.ObjectId;
  text: string;
  date: Date;
  edited: boolean;
}

export interface IPost extends Document {
  content: string;
  user: Types.ObjectId;
  username: string;
  userPhoto: string;
  userRole: 'patient' | 'professional';
  likes: number;
  likedBy: Types.ObjectId[];
  comments: IComment[];
  favorites: Types.ObjectId[];
  hashtags: string[];
  date: Date;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Méthodes Mongoose
  toObject(): any;
  populate(path: string, select?: string): Promise<IPost>;
}

export interface CreatePostRequest {
  content: string;
}

export interface UpdatePostRequest {
  content: string;
}

export interface LikeRequest {
  postId: string;
}

export interface SearchPostsRequest {
  query: string;
}