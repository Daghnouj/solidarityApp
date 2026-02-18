"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const mongoose_1 = require("mongoose");
const AppointmentSchema = new mongoose_1.Schema({
    professional: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        default: "1h"
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    type: {
        type: String,
        required: true,
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
exports.Appointment = (0, mongoose_1.model)('Appointment', AppointmentSchema);
//# sourceMappingURL=appointment.model.js.map