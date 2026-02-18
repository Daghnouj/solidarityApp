import mongoose, { Schema, Document } from 'mongoose';
import { IEvent } from './event.types';

export interface IEventDocument extends IEvent, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'activité est requis']
  },
  day: {
    type: String,
    required: [true, 'Le jour de l\'activité est requis']
  }
});

const EventSchema = new Schema<IEventDocument>({
  name: {
    type: String,
    required: [true, 'Le nom de l\'événement est requis'],
    trim: true
  },
  images: {
    type: [String],
    required: [true, 'Les images sont requises'],
    validate: {
      validator: (v: string[]) => v.length === 4,
      message: 'Il faut exactement 4 images.'
    }
  },
  address: {
    type: String,
    required: [true, 'L\'adresse est requise'],
    trim: true
  },
  coordinates: {
    type: String,
    trim: true
  },
  activities: [ActivitySchema],
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  numberOfRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour les recherches
EventSchema.index({ name: 'text', description: 'text', address: 'text' });
EventSchema.index({ category: 1 });
EventSchema.index({ createdAt: -1 });

export const Event = mongoose.model<IEventDocument>('Event', EventSchema);