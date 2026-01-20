import { Document, Types } from 'mongoose';
import { UserDocument } from '../user/user.types';

export interface IRequest {
  _id?: Types.ObjectId;
  professional: Types.ObjectId | UserDocument;
  specialite: string;
  situation_professionnelle?: string;
  intitule_diplome?: string;
  nom_etablissement?: string;
  date_obtention_diplome?: Date;
  biographie?: string;
  document?: string;
  services?: string[];
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: Types.ObjectId | UserDocument;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RequestDocument = IRequest & Document;

// Types pour les opérations
export interface CreateRequestData {
  professional: Types.ObjectId;
  specialite: string;
  situation_professionnelle?: string;
  intitule_diplome?: string;
  nom_etablissement?: string;
  date_obtention_diplome?: Date;
  biographie?: string;
  document?: string;
  services?: string[];
}

export interface UpdateRequestData {
  specialite?: string;
  situation_professionnelle?: string;
  intitule_diplome?: string;
  nom_etablissement?: string;
  date_obtention_diplome?: Date;
  biographie?: string;
  services?: string[];
  status?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface RequestResponse {
  _id: string;
  professional: {
    _id: string;
    nom: string;
    email: string;
    telephone?: string;
  };
  specialite: string;
  situation_professionnelle?: string;
  intitule_diplome?: string;
  nom_etablissement?: string;
  date_obtention_diplome?: Date;
  biographie?: string;
  document?: string;
  services?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}