import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { AvailabilityService } from './availability.service';
import { ProtectedRequest } from './availability.types';

export class AvailabilityController {
  static async addAvailability(req: ProtectedRequest, res: Response): Promise<void> {
    try {
      const professional = req.user;
      
      if (!professional) {
        res.status(400).json({ message: 'Professionnel non trouvé' });
        return;
      }

      const savedAvailability = await AvailabilityService.createAvailability(
        req.body,
        new Types.ObjectId(professional._id)
      );
      
      res.status(201).json(savedAvailability);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAvailabilities(req: ProtectedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      const { professionalId } = req.query;
      
      const formattedEvents = await AvailabilityService.getAvailabilities(
        { professionalId: professionalId as string },
        user
      );
      
      res.json(formattedEvents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateAvailability(req: ProtectedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const updatedAvailability = await AvailabilityService.updateAvailability(id, req.body);
      
      if (!updatedAvailability) {
        res.status(404).json({ message: 'Disponibilité non trouvée' });
        return;
      }

      res.json(updatedAvailability);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteAvailability(req: ProtectedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const deletedAvailability = await AvailabilityService.deleteAvailability(id);
      
      if (!deletedAvailability) {
        res.status(404).json({ message: 'Disponibilité non trouvée' });
        return;
      }

      res.json({ message: 'Disponibilité supprimée avec succès' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

//   static async getColorOptions(req: ProtectedRequest, res: Response): Promise<void> {
//     const colorOptions = AvailabilityService.getColorOptions();
//     res.json(colorOptions);
//   }

  static async getProfessionals(req: ProtectedRequest, res: Response): Promise<void> {
    try {
      const professionals = await AvailabilityService.getProfessionals();
      res.json(professionals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}