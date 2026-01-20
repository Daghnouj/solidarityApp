// availability.model.ts
import { Schema, model, Model, Types } from 'mongoose';
import { IAvailability } from './availability.types';

const AvailabilitySchema = new Schema<IAvailability>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est obligatoire']
  },
  summary: {
    type: String,
    default: "Disponibilité",
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  start: {
    type: Date,
    required: [true, 'La date de début est obligatoire']
  },
  end: {
    type: Date,
    required: [true, 'La date de fin est obligatoire']
  },
  colorId: {
    type: String,
    default: '7'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour améliorer les performances
AvailabilitySchema.index({ user: 1 });
AvailabilitySchema.index({ start: 1, end: 1 });

// Validation pour s'assurer que start < end
AvailabilitySchema.pre('save', function(next) {
  if (this.start >= this.end) {
    next(new Error('La date de fin doit être après la date de début'));
  }
  next();
});

export const Availability: Model<IAvailability> = model<IAvailability>('Availability', AvailabilitySchema);