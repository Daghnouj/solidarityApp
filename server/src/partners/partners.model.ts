import mongoose, { Schema } from 'mongoose';
import { IPartenaire } from './partners.types';

const PartenaireSchema = new Schema<IPartenaire>(
  {
   
    nom: { 
      type: String, 
      required: [true, 'Le nom est obligatoire'] 
    },
    email: { 
      type: String, 
      required: [true, 'L\'email est obligatoire'], 
      unique: true,
      lowercase: true,
      trim: true
    },
    telephone: { 
      type: String 
    },
    adresse: { 
      type: String 
    },
    description: { 
      type: String 
    },
    logo: {
      url: String,
      public_id: String
    },
    service: { 
      type: String 
    },
    link: { 
      type: String, 
      required: [true, 'Le lien est obligatoire'],
      trim: true
    },
  },
  { 
    timestamps: true 
  }
);

// Index pour améliorer les performances
PartenaireSchema.index({ email: 1 });
PartenaireSchema.index({ idpart: 1 });

export const Partenaire = mongoose.model<IPartenaire>('Partenaire', PartenaireSchema);