import mongoose, { Document, Schema } from 'mongoose';
import { IRequest, RequestDocument } from './request.types';

const requestSchema: Schema<RequestDocument> = new mongoose.Schema({
  professional: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  specialite: { 
    type: String, 
    required: true 
  },
  situation_professionnelle: { type: String },
  intitule_diplome: { type: String },
  nom_etablissement: { type: String },
  date_obtention_diplome: { type: Date },
  biographie: { type: String },
  document: { type: String },
  services: [{ type: String }],
}, { 
  timestamps: true 
});

const Request = mongoose.model<RequestDocument>("Request", requestSchema);

export default Request;