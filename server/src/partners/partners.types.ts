import { Request } from 'express';
import { Document } from 'mongoose';
import { CloudinaryFile } from '../../config/cloudinary/cloudinary.types'; 

export interface IPartenaire extends Document {
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  description?: string;
  logo?: {
    url: string;
    public_id: string;
    format?: string;
    width?: number;
    height?: number;
  };
  service?: string;
  link: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePartenaireDto {
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  description?: string;
  service?: string;
  link: string;
}

export interface UpdatePartenaireDto extends Partial<CreatePartenaireDto> {
  logo?: {
    url: string;
    public_id: string;
    format?: string;
    width?: number;
    height?: number;
  };
}

// Solution 1: Utiliser un type intersection
export type PartenaireRequest = Request & {
  file?: CloudinaryFile;
  admin?: {
    id: string;
    role: string;
  };
};