import { Request } from 'express';
import { Types, Document } from 'mongoose';

export interface IActivity {
  name: string;
  day: string;
}

export interface IRating {
  user: Types.ObjectId;
  rating: number; // 1-5
  createdAt: Date;
}

export interface IEvent {
  name: string;
  images: string[]; // URLs Cloudinary
  address: string;
  coordinates?: string;
  activities: IActivity[];
  description: string;
  website?: string;
  category?: string;
  phone?: string;
  email?: string;
  participants: string[];
  ratings: IRating[];
  averageRating: number;
  numberOfRatings: number;
}

export interface EventDocument extends IEvent, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les requêtes
export interface CreateEventRequest extends Request {
  body: Omit<IEvent, 'images'> & {
    activities: string; // JSON string
    imageMapping?: string; // JSON string
  };
}

export interface UpdateEventRequest extends Request {
  body: Omit<IEvent, 'images'> & {
    activities: string; // JSON string
    imageMapping?: string; // JSON string
  };
}

// Types pour Cloudinary
export interface CloudinaryEventFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  path: string;
  size: number;
  filename: string;
  url: string;
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
}

export interface MulterFile extends Express.Multer.File {
  url?: string;
  public_id?: string;
  secure_url?: string;
}