"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Availability = void 0;
const mongoose_1 = require("mongoose");
const AvailabilitySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
AvailabilitySchema.index({ user: 1 });
AvailabilitySchema.index({ start: 1, end: 1 });
AvailabilitySchema.pre('save', function (next) {
    if (this.start >= this.end) {
        next(new Error('La date de fin doit être après la date de début'));
    }
    next();
});
exports.Availability = (0, mongoose_1.model)('Availability', AvailabilitySchema);
//# sourceMappingURL=availability.model.js.map