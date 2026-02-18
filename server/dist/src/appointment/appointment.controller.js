"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const appointment_service_1 = require("./appointment.service");
class AppointmentController {
    static async create(req, res) {
        try {
            console.log('📅 Appointment create called');
            console.log('req.io exists:', !!req.io);
            console.log('req.io type:', typeof req.io);
            const patientId = req.user._id;
            const appointment = await appointment_service_1.AppointmentService.createAppointment(req.body, patientId, req.io);
            res.status(201).json(appointment);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async getForProfessional(req, res) {
        try {
            const professionalId = req.user._id;
            const { status } = req.query;
            const appointments = await appointment_service_1.AppointmentService.getAppointmentsByProfessional(professionalId, status);
            res.json(appointments);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getForPatient(req, res) {
        try {
            const patientId = req.user._id;
            const appointments = await appointment_service_1.AppointmentService.getAppointmentsByPatient(patientId);
            res.json(appointments);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const appointment = await appointment_service_1.AppointmentService.updateAppointmentStatus(id, status, req.io);
            if (!appointment) {
                res.status(404).json({ message: 'Rendez-vous non trouvé' });
                return;
            }
            res.json(appointment);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async getStats(req, res) {
        try {
            const professionalId = req.user._id;
            const stats = await appointment_service_1.AppointmentService.getProfessionalStats(professionalId);
            res.json(stats);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.AppointmentController = AppointmentController;
//# sourceMappingURL=appointment.controller.js.map