import { Appointment, IAppointment } from './appointment.model';
import { Types } from 'mongoose';
import { Server } from 'socket.io';
import User from '../user/user.model';
import { NotificationService } from '../community/notification/notification.service';

export class AppointmentService {

    static async createAppointment(data: Partial<IAppointment>, patientId: string, io?: Server | null): Promise<IAppointment> {
        const appointment = new Appointment({
            ...data,
            patient: new Types.ObjectId(patientId)
        });
        const savedAppointment = await appointment.save();

        // Notify Professional via Socket.IO AND Persistent Notification
        try {
            const appointmentId = savedAppointment._id.toString();
            const professionalId = data.professional?.toString();

            console.log('📅 Creating appointment notification...');
            console.log('Professional ID:', professionalId);
            console.log('Patient ID:', patientId);
            console.log('io available:', !!io);

            if (professionalId) {
                // Create persistent notification
                await NotificationService.createNotification({
                    recipientId: new Types.ObjectId(professionalId),
                    senderId: new Types.ObjectId(patientId),
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
        } catch (err) {
            console.error('❌ Notification error:', err);
        }

        return savedAppointment;
    }

    static async getAppointmentsByProfessional(professionalId: string, status?: string): Promise<IAppointment[]> {
        const query: any = { professional: new Types.ObjectId(professionalId) };
        if (status) {
            if (status === 'upcoming') {
                query.status = 'confirmed';
                // Include appointments from the start of today, or just all confirmed? 
                // User expects to see "Upcoming" (which usually means future), but if they test with old dates it's empty.
                // Better approach: Show all 'confirmed' appointments sorted by date, or at least from 'today' 00:00.
                const startOfToday = new Date();
                startOfToday.setHours(0, 0, 0, 0);
                query.time = { $gte: startOfToday };
            } else if (status === 'pending') {
                query.status = 'pending';
            } else {
                query.status = status;
            }
        }

        return await Appointment.find(query)
            .populate('patient', 'nom email photo')
            .sort({ time: 1 });
    }

    static async getAppointmentsByPatient(patientId: string): Promise<IAppointment[]> {
        return await Appointment.find({ patient: new Types.ObjectId(patientId) })
            .populate('professional', 'nom email photo specialite')
            .sort({ time: -1 });
    }

    static async updateAppointmentStatus(appointmentId: string, status: string): Promise<IAppointment | null> {
        return await Appointment.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        );
    }

    static async getAppointmentById(appointmentId: string): Promise<IAppointment | null> {
        return await Appointment.findById(appointmentId)
            .populate('patient', 'nom email photo')
            .populate('professional', 'nom email photo');
    }

    static async getProfessionalStats(professionalId: string): Promise<any> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

        // Counts
        const totalPatients = await Appointment.distinct('patient', { professional: professionalId }).countDocuments();

        const appointmentsToday = await Appointment.countDocuments({
            professional: professionalId,
            time: { $gte: today, $lt: tomorrow }
        });

        const appointmentsThisWeek = await Appointment.countDocuments({
            professional: professionalId,
            time: { $gte: firstDayOfWeek }
        });

        const appointmentsThisMonth = await Appointment.countDocuments({
            professional: professionalId,
            time: { $gte: firstDayOfMonth }
        });

        // Completed appointments for hours calculation (mock calculation)
        const completedAppointments = await Appointment.find({
            professional: professionalId,
            status: 'completed'
        });
        const totalHours = completedAppointments.length; // Assuming 1 hour per appointment for now

        // Today's schedule
        const todaySchedule = await Appointment.find({
            professional: professionalId,
            time: { $gte: today, $lt: tomorrow }
        }).populate('patient', 'nom email photo').sort({ time: 1 });

        // Recent requests (pending)
        const recentRequests = await Appointment.find({
            professional: professionalId,
            status: 'pending'
        }).populate('patient', 'nom email photo').sort({ createdAt: -1 }).limit(5);

        return {
            totalPatients,
            appointmentsToday,
            appointmentsThisWeek,
            appointmentsThisMonth,
            totalHours,
            rating: 4.8, // Placeholder
            todaySchedule,
            recentRequests
        };
    }
}
