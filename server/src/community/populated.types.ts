import { Types } from 'mongoose';

export interface PopulatedUser {
  _id: Types.ObjectId;
  nom: string;
  photo: string;
  role: 'patient' | 'professional';
}

export interface PopulatedComment {
  _id: Types.ObjectId;
  user: PopulatedUser;
  text: string;
  date: Date;
  edited: boolean;
  replies: PopulatedReply[];
}

export interface PopulatedReply {
  _id: Types.ObjectId;
  user: PopulatedUser;
  text: string;
  date: Date;
  edited: boolean;
}

export interface PopulatedPost {
  _id: Types.ObjectId;
  content: string;
  user: PopulatedUser;
  username: string;
  userPhoto: string;
  userRole: 'patient' | 'professional';
  likes: number;
  likedBy: Types.ObjectId[];
  comments: PopulatedComment[];
  favorites: Types.ObjectId[];
  hashtags: string[];
  date: Date;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}