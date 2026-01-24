import { Request, Response } from 'express';
import { AppointmentService } from './appointment.service';
import { ProtectedRequest } from '../types/express'; // Assuming this type exists globally or usually referenced

export class AppointmentController {

    static async create(req: any, res: Response): Promise<void> {
        try {
            console.log('📅 Appointment create called');
            console.log('req.io exists:', !!req.io);
            console.log('req.io type:', typeof req.io);

            const patientId = req.user._id;
            const appointment = await AppointmentService.createAppointment(req.body, patientId, req.io);
            res.status(201).json(appointment);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getForProfessional(req: any, res: Response): Promise<void> {
        try {
            const professionalId = req.user._id;
            const { status } = req.query;
            const appointments = await AppointmentService.getAppointmentsByProfessional(
                professionalId,
                status as string
            );
            res.json(appointments);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getForPatient(req: any, res: Response): Promise<void> {
        try {
            const patientId = req.user._id;
            const appointments = await AppointmentService.getAppointmentsByPatient(patientId);
            res.json(appointments);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const appointment = await AppointmentService.updateAppointmentStatus(id, status);

            if (!appointment) {
                res.status(404).json({ message: 'Rendez-vous non trouvé' });
                return;
            }

            res.json(appointment);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getStats(req: any, res: Response): Promise<void> {
        try {
            const professionalId = req.user._id;
            const stats = await AppointmentService.getProfessionalStats(professionalId);
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
