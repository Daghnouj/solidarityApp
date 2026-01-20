import { Request } from 'express';
import { Document, ObjectId, Model } from 'mongoose';

export interface IAdmin extends Document {
  _id: ObjectId;
  nom: string;
  email: string;
  mdp: string;
  role: string;
  phone?: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type AdminDocument = IAdmin & IAdminMethods & Document;

// Ajoutez cette interface pour le modèle
export interface AdminModel extends Model<AdminDocument> {
  // Vous pouvez ajouter des méthodes statiques ici si nécessaire
}

// Interface principale pour les requêtes admin
export interface AdminRequest extends Request {
  admin?: {
    id: string;
    role: string;
  };
}

// DTOs
export interface AdminSignupDTO {
  nom: string;
  email: string;
  mdp: string;
  phone?: string;
}

export interface AdminLoginDTO {
  email: string;
  mdp: string;
}

export interface AdminUpdateDTO {
  nom?: string;
  email?: string;
  phone?: string;
}

export interface PasswordChangeDTO {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  admin: {
    id: string;
    nom: string;
    email: string;
    phone?: string;
    photo?: string;
  };
}