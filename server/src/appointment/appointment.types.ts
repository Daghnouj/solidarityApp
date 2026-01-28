import { Document, Model, Types } from 'mongoose';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface IAppointment {
  patient: Types.ObjectId; // user (role: patient)
  professional: Types.ObjectId; // user (role: professional)
  date: Date; // start date/time
  durationMinutes?: number; // default 30
  // Patient-provided info
  nom?: string;
  prenom?: string;
  email?: string;
  ville?: string;
  antecedentsMedicaux?: string;
  probleme?: string;
  phone?: string;
  // Professional snapshot
  therapeutename?: string;
  specialite?: string;
  // Workflow
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentDocument extends IAppointment, Document {}

export interface AppointmentModel extends Model<AppointmentDocument> {}
