import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  nom: string;
  email: string;
  mdp?: string;
  role: string;
  isActive: boolean;
  oauthProvider: string;
  save(): Promise<this>;
}

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  nom: string;
  email: string;
  mdp?: string;
  role: string;
  save(): Promise<this>;
}

export type PasswordUser = IUser | IAdmin;

export interface OTPData {
  code: string;
  createdAt: Date;
  attempts: number;
  email: string;
  userId: string;
  userType: 'user' | 'admin';
}

export interface ForgotPasswordRequest {
  email: string;
  userType: 'user' | 'admin';
}

export interface VerifyOTPRequest {
  otp: string;
  userType: 'user' | 'admin';
}

export interface ChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
  userType: 'user' | 'admin';
}

export interface PasswordResponse {
  success: boolean;
  message: string;
  id?: string;
}