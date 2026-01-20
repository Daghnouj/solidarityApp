import { Document, Types } from 'mongoose';

export interface IAvailability extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  colorId: string;
  createdAt: Date;
}

export interface IFormattedEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
  professional: string;
  email: string;
}

// export interface IColorOption {
//   value: string;
//   label: string;
//   hex: string;
// }

export interface IProfessional {
  _id: Types.ObjectId;
  nom: string;
  email: string;
  telephone?: string;
}

export interface CreateAvailabilityDto {
  summary?: string;
  description?: string;
  start: string;
  end: string;
}

export interface UpdateAvailabilityDto {
  summary?: string;
  description?: string;
  start?: string;
  end?: string;
}

export interface AvailabilityQueryParams {
  professionalId?: string;
}

// Extension de l'interface Request
import { Request } from 'express';

export interface ProtectedRequest extends Request {
  user: {
    _id: Types.ObjectId;
    nom?: string;
    email: string;
    role: string;
    is_verified?: boolean;
  };
}