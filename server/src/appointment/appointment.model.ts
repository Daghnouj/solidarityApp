import { Schema, model, Document, Types } from 'mongoose';

export interface IAppointment extends Document {
    professional: Types.ObjectId;
    patient: Types.ObjectId;
    time: Date;
    duration?: string;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
    type: string;
    reason?: string;
    summary?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
    professional: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    duration: {
        type: String, // e.g. "1h", "30m"
        default: "1h"
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    type: {
        type: String,
        required: true, // e.g. "Consultation", "Therapy Session"
        default: "Consultation"
    },
    reason: {
        type: String,
        trim: true
    },
    summary: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

AppointmentSchema.index({ professional: 1, status: 1 });
AppointmentSchema.index({ patient: 1 });

export const Appointment = model<IAppointment>('Appointment', AppointmentSchema);
