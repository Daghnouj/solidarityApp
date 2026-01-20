// user.types.ts - CORRIGÉ ET COMPLÉTÉ
import { Document, Model, Types } from 'mongoose';

// Interface principale de l'utilisateur
export interface IUser {
  _id?: Types.ObjectId;
  nom: string;
  email: string;
  mdp?: string;
  dateNaissance?: Date;
  adresse?: string;
  telephone?: string;
  photo?: string;
  role: 'patient' | 'professional';
  isActive: boolean;
  deactivatedAt?: Date;
  isOnline: boolean;
  lastLogin?: Date;
  oauthProvider: 'local' | 'google' | 'facebook';
  oauthId?: string;
  is_verified: boolean;
  specialite?: string;
  stripeCustomerId?: string;
  subscriptionStatus: 'active' | 'inactive' | 'trialing' | 'canceled';
  plan?: 'monthly' | 'yearly' | null;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Méthodes d'instance
export interface IUserMethods {
  canReactivate(): boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Document MongoDB
export type UserDocument = IUser & Document & IUserMethods;

// Modèle Mongoose
export interface UserModel extends Model<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findActiveUsers(): Promise<UserDocument[]>;
}

// Types pour les opérations utilisateur
export interface CreateUserData {
  nom: string;
  email: string;
  mdp: string;
  dateNaissance?: Date;
  adresse?: string;
  telephone?: string;
  role: 'patient' | 'professional';
  specialite?: string;
}

export interface UpdateProfileData {
  email?: string;
  nom?: string;
  dateNaissance?: Date;
  adresse?: string;
  telephone?: string;
  specialite?: string;
}

export interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePhotoResponse {
  success: boolean;
  message: string;
  photo: string | null;
}

export interface DeactivateResponse {
  success: boolean;
  message: string;
  user: UserDocument;
  deactivatedAt: Date;
}

export interface ActivateResponse {
  success: boolean;
  message: string;
  user: UserDocument;
}

export interface UserResponse {
  _id: string;
  nom: string;
  email: string;
  dateNaissance?: Date;
  adresse?: string;
  telephone?: string;
  photo?: string;
  role: 'patient' | 'professional';
  is_verified: boolean;
  specialite?: string;
  isOnline: boolean;
  lastLogin?: Date;
}