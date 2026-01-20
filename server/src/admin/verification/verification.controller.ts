import { Response } from 'express';
import { VerificationService } from './verification.service';
import { AdminRequest } from '../admin.types';

export class VerificationController {
  static async verifyProfessional(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const { professionalId } = req.params;
      const user = await VerificationService.verifyProfessional(professionalId);
      
      res.json({ 
        message: 'Professionnel validé et email envoyé', 
        user: {
          id: user._id,
          nom: user.nom,
          email: user.email,
          is_verified: user.is_verified
        }
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Erreur lors de la validation du professionnel',
        error: error.message 
      });
    }
  }

  static async getUnverifiedProfessionalsRequests(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const requests = await VerificationService.getUnverifiedProfessionalsRequests();
      res.json({ 
        requests: requests.map(request => ({
          id: request._id,
          professional: request.professional,
          status: request.status,
          createdAt: request.createdAt,
          updatedAt: request.updatedAt
        }))
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des demandes',
        error: error.message 
      });
    }
  }

  static async rejectProfessional(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const { professionalId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({ message: "La raison du refus est requise" });
      }

      const user = await VerificationService.rejectProfessional(professionalId, reason);
      
      res.json({ 
        message: 'Professionnel refusé et email envoyé', 
        user: {
          id: user._id,
          nom: user.nom,
          email: user.email,
          is_verified: user.is_verified
        }
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Erreur lors du refus du professionnel',
        error: error.message 
      });
    }
  }

  static async getProfessionalDetails(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const { professionalId } = req.params;
      const professional = await VerificationService.getProfessionalDetails(professionalId);
      
      res.json({ professional });
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des détails du professionnel',
        error: error.message 
      });
    }
  }
}