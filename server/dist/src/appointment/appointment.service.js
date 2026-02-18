"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const appointment_model_1 = require("./appointment.model");
const mongoose_1 = require("mongoose");
const notification_service_1 = require("../community/notification/notification.service");
const availability_service_1 = require("../availability/availability.service");
class AppointmentService {
    static async createAppointment(data, patientId, io) {
        var _a, _b;
        const appointment = new appointment_model_1.Appointment({
            ...data,
            patient: new mongoose_1.Types.ObjectId(patientId)
        });
        const professionalId = (_a = data.professional) === null || _a === void 0 ? void 0 : _a.toString();
        const requestedTime = new Date(data.time);
        if (!professionalId || isNaN(requestedTime.getTime())) {
            throw new Error("Invalid professional or time");
        }
        const availableSlots = await availability_service_1.AvailabilityService.getAvailableSlots(professionalId, requestedTime.toISOString());
        const isSlotAvailable = availableSlots.some(slot => Math.abs(slot.start.getTime() - requestedTime.getTime()) < 1000);
        if (!isSlotAvailable) {
            throw new Error("Chosen slot is no longer available.");
        }
        const savedAppointment = await appointment.save();
        try {
            const appointmentId = savedAppointment._id.toString();
            const professionalId = (_b = data.professional) === null || _b === void 0 ? void 0 : _b.toString();
            console.log('📅 Creating appointment notification...');
            console.log('Professional ID:', professionalId);
            console.log('Patient ID:', patientId);
            console.log('io available:', !!io);
            if (professionalId) {
                await notification_service_1.NotificationService.createNotification({
                    recipientId: new mongoose_1.Types.ObjectId(professionalId),
                    senderId: new mongoose_1.Types.ObjectId(patientId),
                    type: 'appointment_request',
                    postId: undefined,
                    appointmentId: appointmentId,
                    metadata: {
                        message: 'New Appointment Request'
                    },
                    io: io
                });
                console.log('✅ Appointment notification created');
            }
        }
        catch (err) {
            console.error('❌ Notification error:', err);
        }
        return savedAppointment;
    }
    static async getAppointmentsByProfessional(professionalId, status) {
        const query = { professional: new mongoose_1.Types.ObjectId(professionalId) };
        if (status) {
            if (status === 'upcoming') {
                query.status = 'confirmed';
                const startOfToday = new Date();
                startOfToday.setHours(0, 0, 0, 0);
                query.time = { $gte: startOfToday };
            }
            else if (status === 'pending') {
                query.status = 'pending';
            }
            else {
                query.status = status;
            }
        }
        return await appointment_model_1.Appointment.find(query)
            .populate('patient', 'nom email photo')
            .sort({ time: 1 });
    }
    static async getAppointmentsByPatient(patientId) {
        return await appointment_model_1.Appointment.find({ patient: new mongoose_1.Types.ObjectId(patientId) })
            .populate('professional', 'nom email photo specialite')
            .sort({ time: -1 });
    }
    static async updateAppointmentStatus(appointmentId, status, io) {
        const appointment = await appointment_model_1.Appointment.findById(appointmentId);
        if (!appointment)
            return null;
        const oldStatus = appointment.status;
        appointment.status = status;
        await appointment.save();
        if (status === 'confirmed' || status === 'cancelled') {
            try {
                const type = status === 'confirmed' ? 'appointment_confirmed' : 'appointment_cancelled';
                await notification_service_1.NotificationService.createNotification({
                    recipientId: appointment.patient,
                    senderId: appointment.professional,
                    type: type,
                    postId: undefined,
                    appointmentId: appointment._id.toString(),
                    metadata: {
                        message: `Rendez-vous ${status === 'confirmed' ? 'confirmé' : 'annulé'}`
                    },
                    io: io
                });
            }
            catch (err) {
                console.error('❌ Error creating appointment update notification:', err);
            }
        }
        return appointment;
    }
    static async getAppointmentById(appointmentId) {
        return await appointment_model_1.Appointment.findById(appointmentId)
            .populate('patient', 'nom email photo')
            .populate('professional', 'nom email photo');
    }
    static async getProfessionalStats(professionalId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const totalPatients = await appointment_model_1.Appointment.distinct('patient', { professional: professionalId }).countDocuments();
        const appointmentsToday = await appointment_model_1.Appointment.countDocuments({
            professional: professionalId,
            time: { $gte: today, $lt: tomorrow }
        });
        const appointmentsThisWeek = await appointment_model_1.Appointment.countDocuments({
            professional: professionalId,
            time: { $gte: firstDayOfWeek }
        });
        const appointmentsThisMonth = await appointment_model_1.Appointment.countDocuments({
            professional: professionalId,
            time: { $gte: firstDayOfMonth }
        });
        const completedAppointments = await appointment_model_1.Appointment.find({
            professional: professionalId,
            status: 'completed'
        });
        const totalHours = completedAppointments.length;
        const todaySchedule = await appointment_model_1.Appointment.find({
            professional: professionalId,
            time: { $gte: today, $lt: tomorrow }
        }).populate('patient', 'nom email photo').sort({ time: 1 });
        const recentRequests = await appointment_model_1.Appointment.find({
            professional: professionalId,
            status: 'pending'
        }).populate('patient', 'nom email photo').sort({ createdAt: -1 }).limit(5);
        return {
            totalPatients,
            appointmentsToday,
            appointmentsThisWeek,
            appointmentsThisMonth,
            totalHours,
            rating: 4.8,
            todaySchedule,
            recentRequests
        };
    }
}
exports.AppointmentService = AppointmentService;
//# sourceMappingURL=appointment.service.js.map