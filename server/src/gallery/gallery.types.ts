import { Document, Types } from 'mongoose';

export interface IGalerie extends Document {
  _id: Types.ObjectId;
  titre: string;
  desc: string;
  video: string;
  categorie: 'Bien-être Mental' | 'Gestion du Stress' | 'Thérapies et Coaching' | 'Relations Sociales' | 'Développement Personnel';
  views: number;
  createdAt: Date;
  viewedBy?: IView[];
  __v?: number;
}

export interface IView {
  type: 'user' | 'anon';
  id?: string;
  ip: string;
  device: string;
  date: Date;
  _id?: Types.ObjectId;
}

export interface CreateGalerieDto {
  titre: string;
  desc: string;
  video: string;
  categorie: IGalerie['categorie'];
}

export interface UpdateGalerieDto extends Partial<CreateGalerieDto> {}

export interface GetGaleriesQuery {
  categorie?: string;
}

export interface TrackViewRequest {
  id: string;
  user?: {
    _id: string;
  };
  ip: string;
  headers: {
    'user-agent': string;
  };
}

export interface GalerieResponse {
  success: boolean;
  message: string;
  data?: any;
  total?: number;
}

// Type pour le document Mongoose avec méthodes
export type GalerieDocument = IGalerie & Document;