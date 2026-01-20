import mongoose, { Schema, Model } from 'mongoose';
import { IContact } from './contact.types';

const contactSchema: Schema<IContact> = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est obligatoire'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
    trim: true,
    lowercase: true
  },
  city: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Le téléphone est obligatoire'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Le sujet est obligatoire'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Le message est obligatoire'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour améliorer les performances
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

const Contact: Model<IContact> = mongoose.model<IContact>('Contact', contactSchema);
export default Contact;