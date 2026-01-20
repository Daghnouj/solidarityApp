import { Document } from 'mongoose';

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: Date;
}

export interface ContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: IContact;
}