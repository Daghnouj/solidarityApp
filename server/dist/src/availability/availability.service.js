"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityService = void 0;
const availability_model_1 = require("./availability.model");
const appointment_model_1 = require("../appointment/appointment.model");
const user_model_1 = __importDefault(require("../user/user.model"));
class AvailabilityService {
    static async createAvailability(data, professionalId) {
        const startDate = new Date(data.start);
        const endDate = new Date(data.end);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Format de date invalide');
        }
        if (startDate >= endDate) {
            throw new Error('La fin doit être après le début');
        }
        const newAvailability = new availability_model_1.Availability({
            user: professionalId,
            summary: data.summary || 'Disponibilité',
            description: data.description,
            start: startDate,
            end: endDate
        });
        return await newAvailability.save();
    }
    static async getAvailabilities(queryParams, currentUser) {
        const query = {};
        if (queryParams.professionalId) {
            query.user = queryParams.professionalId;
        }
        else if (currentUser && currentUser.role === 'professional') {
            query.user = currentUser._id;
        }
        const availabilities = await availability_model_1.Availability.find(query)
            .populate('user', 'nom email role')
            .lean();
        return availabilities.map(event => {
            var _a, _b;
            return ({
                id: event._id.toString(),
                summary: event.summary,
                start: event.start.toISOString(),
                end: event.end.toISOString(),
                description: event.description,
                professional: ((_a = event.user) === null || _a === void 0 ? void 0 : _a.nom) || 'Anonyme',
                email: ((_b = event.user) === null || _b === void 0 ? void 0 : _b.email) || ''
            });
        });
    }
    static async updateAvailability(id, data) {
        const updateData = {};
        if (data.summary !== undefined)
            updateData.summary = data.summary;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.start) {
            const startDate = new Date(data.start);
            if (isNaN(startDate.getTime())) {
                throw new Error('Format de date de début invalide');
            }
            updateData.start = startDate;
        }
        if (data.end) {
            const endDate = new Date(data.end);
            if (isNaN(endDate.getTime())) {
                throw new Error('Format de date de fin invalide');
            }
            updateData.end = endDate;
        }
        if (updateData.start && updateData.end && updateData.start >= updateData.end) {
            throw new Error('La fin doit être après le début');
        }
        const updatedAvailability = await availability_model_1.Availability.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        return updatedAvailability;
    }
    static async deleteAvailability(id) {
        return await availability_model_1.Availability.findByIdAndDelete(id);
    }
    static async getProfessionals() {
        const professionals = await user_model_1.default.find({
            role: 'professional',
            is_verified: true
        }).select('nom email telephone').lean();
        return professionals.map(prof => ({
            _id: prof._id,
            nom: prof.nom,
            email: prof.email,
            telephone: prof.telephone
        }));
    }
    static async getAvailableSlots(professionalId, date) {
        const queryDate = new Date(date);
        const startOfDay = new Date(queryDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(queryDate);
        endOfDay.setHours(23, 59, 59, 999);
        const availabilities = await availability_model_1.Availability.find({
            user: professionalId,
            start: { $lte: endOfDay },
            end: { $gte: startOfDay }
        });
        const appointments = await appointment_model_1.Appointment.find({
            professional: professionalId,
            status: { $ne: 'cancelled' },
            time: { $gte: startOfDay, $lte: endOfDay }
        });
        const slots = [];
        const SLOT_DURATION = 30 * 60 * 1000;
        for (const availability of availabilities) {
            let currentSlot = new Date(Math.max(availability.start.getTime(), startOfDay.getTime()));
            const availEnd = new Date(Math.min(availability.end.getTime(), endOfDay.getTime()));
            while (currentSlot.getTime() + SLOT_DURATION <= availEnd.getTime()) {
                const slotEnd = new Date(currentSlot.getTime() + SLOT_DURATION);
                const isBooked = appointments.some(appt => {
                    const apptTime = new Date(appt.time);
                    return Math.abs(apptTime.getTime() - currentSlot.getTime()) < 60000;
                });
                if (!isBooked) {
                    slots.push({
                        id: currentSlot.toISOString(),
                        start: currentSlot,
                        end: slotEnd
                    });
                }
                currentSlot = new Date(currentSlot.getTime() + SLOT_DURATION);
            }
        }
        return slots.sort((a, b) => a.start.getTime() - b.start.getTime());
    }
}
exports.AvailabilityService = AvailabilityService;
//# sourceMappingURL=availability.service.js.map