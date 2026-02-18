"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityController = void 0;
const mongoose_1 = require("mongoose");
const availability_service_1 = require("./availability.service");
class AvailabilityController {
    static async addAvailability(req, res) {
        try {
            const professional = req.user;
            if (!professional) {
                res.status(400).json({ message: 'Professionnel non trouvé' });
                return;
            }
            const savedAvailability = await availability_service_1.AvailabilityService.createAvailability(req.body, new mongoose_1.Types.ObjectId(professional._id));
            res.status(201).json(savedAvailability);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async getAvailabilities(req, res) {
        try {
            const user = req.user;
            const { professionalId } = req.query;
            const formattedEvents = await availability_service_1.AvailabilityService.getAvailabilities({ professionalId: professionalId }, user);
            res.json(formattedEvents);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async updateAvailability(req, res) {
        try {
            const { id } = req.params;
            const updatedAvailability = await availability_service_1.AvailabilityService.updateAvailability(id, req.body);
            if (!updatedAvailability) {
                res.status(404).json({ message: 'Disponibilité non trouvée' });
                return;
            }
            res.json(updatedAvailability);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async deleteAvailability(req, res) {
        try {
            const { id } = req.params;
            const deletedAvailability = await availability_service_1.AvailabilityService.deleteAvailability(id);
            if (!deletedAvailability) {
                res.status(404).json({ message: 'Disponibilité non trouvée' });
                return;
            }
            res.json({ message: 'Disponibilité supprimée avec succès' });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async getProfessionals(req, res) {
        try {
            const professionals = await availability_service_1.AvailabilityService.getProfessionals();
            res.json(professionals);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getSlots(req, res) {
        try {
            const { professionalId, date } = req.query;
            if (!professionalId || !date) {
                res.status(400).json({ message: 'Professional ID and Date are required' });
                return;
            }
            const slots = await availability_service_1.AvailabilityService.getAvailableSlots(professionalId, date);
            res.json(slots);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.AvailabilityController = AvailabilityController;
//# sourceMappingURL=availability.controller.js.map