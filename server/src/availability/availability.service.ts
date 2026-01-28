// availability.service.ts
import { Types } from 'mongoose';
import { Availability } from './availability.model';
import { Appointment } from '../appointment/appointment.model';
import { IUser } from '../user/user.types';
import User from '../user/user.model';
import {
  IAvailability,
  IFormattedEvent,
  //   IColorOption,
  IProfessional,
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  AvailabilityQueryParams
} from './availability.types';

export class AvailabilityService {
  static async createAvailability(data: CreateAvailabilityDto, professionalId: Types.ObjectId): Promise<IAvailability> {
    const startDate = new Date(data.start);
    const endDate = new Date(data.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Format de date invalide');
    }

    if (startDate >= endDate) {
      throw new Error('La fin doit être après le début');
    }

    const newAvailability = new Availability({
      user: professionalId,
      summary: data.summary || 'Disponibilité',
      description: data.description,
      start: startDate,
      end: endDate
    });

    return await newAvailability.save();
  }

  static async getAvailabilities(
    queryParams: AvailabilityQueryParams,
    currentUser?: any
  ): Promise<IFormattedEvent[]> {
    const query: any = {};

    if (queryParams.professionalId) {
      query.user = queryParams.professionalId;
    } else if (currentUser && currentUser.role === 'professional') {
      query.user = currentUser._id;
    }

    const availabilities = await Availability.find(query)
      .populate('user', 'nom email role')
      .lean();

    return availabilities.map(event => ({
      id: event._id.toString(),
      summary: event.summary,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      description: event.description,
      professional: (event.user as any)?.nom || 'Anonyme',
      email: (event.user as any)?.email || ''
    }));
  }

  static async updateAvailability(
    id: string,
    data: UpdateAvailabilityDto
  ): Promise<IAvailability | null> {
    const updateData: any = {};

    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.description !== undefined) updateData.description = data.description;

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

    // Si les deux dates sont fournies, vérifier que start < end
    if (updateData.start && updateData.end && updateData.start >= updateData.end) {
      throw new Error('La fin doit être après le début');
    }

    const updatedAvailability = await Availability.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return updatedAvailability;
  }

  static async deleteAvailability(id: string): Promise<IAvailability | null> {
    return await Availability.findByIdAndDelete(id);
  }

  //   static getColorOptions(): IColorOption[] {
  //     return [
  //       { value: '1', label: 'Lavande', hex: '#7986cb' },
  //       { value: '2', label: 'Sauge', hex: '#33b679' },
  //       { value: '3', label: 'Raisin', hex: '#8e24aa' },
  //       { value: '4', label: 'Paon', hex: '#e67c73' },
  //       { value: '5', label: 'Banane', hex: '#f6bf26' },
  //       { value: '6', label: 'Mandarine', hex: '#f4511e' },
  //       { value: '7', label: 'Canneberge', hex: '#039be5' },
  //       { value: '8', label: 'Flamboyant', hex: '#616161' },
  //       { value: '9', label: 'Océan', hex: '#3f51b5' },
  //       { value: '10', label: 'Basilic', hex: '#0b8043' },
  //       { value: '11', label: 'Mandarine foncée', hex: '#d60000' }
  //     ];
  //   }

  static async getProfessionals(): Promise<IProfessional[]> {
    const professionals = await User.find({
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

  static async getAvailableSlots(professionalId: string, date: string): Promise<any[]> {
    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Get Professional's Availabilities for this day
    const availabilities = await Availability.find({
      user: professionalId,
      start: { $lte: endOfDay },
      end: { $gte: startOfDay }
    });

    // 2. Get Existing Appointments
    const appointments = await Appointment.find({
      professional: professionalId,
      status: { $ne: 'cancelled' },
      time: { $gte: startOfDay, $lte: endOfDay }
    });

    // 3. Generate slots
    const slots: any[] = [];
    const SLOT_DURATION = 30 * 60 * 1000; // 30 minutes

    for (const availability of availabilities) {
      // Clamp availability to the requested day
      let currentSlot = new Date(Math.max(availability.start.getTime(), startOfDay.getTime()));
      const availEnd = new Date(Math.min(availability.end.getTime(), endOfDay.getTime()));

      while (currentSlot.getTime() + SLOT_DURATION <= availEnd.getTime()) {
        const slotEnd = new Date(currentSlot.getTime() + SLOT_DURATION);

        // Check if slot overlaps with any appointment
        const isBooked = appointments.some(appt => {
          const apptTime = new Date(appt.time);
          // Assuming appointments are also 30 mins or we check overlap
          // Simple check: exact match start time
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