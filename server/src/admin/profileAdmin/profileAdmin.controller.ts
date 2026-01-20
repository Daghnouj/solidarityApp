import { Response } from 'express';
import { ProfileAdminService } from './profileAdmin.service';
import { AdminRequest, AdminUpdateDTO, PasswordChangeDTO } from '../admin.types';

export class ProfileAdminController {
  static async getAdminProfile(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const admin = await ProfileAdminService.getAdminProfile(req.admin.id);
      res.json(admin);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || 'Erreur serveur',
        error: error.message 
      });
    }
  }

  static async updateAdminProfile(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const updates: AdminUpdateDTO = req.body;
      const admin = await ProfileAdminService.updateAdminProfile(req.admin.id, updates);
      res.json(admin);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || 'Erreur serveur',
        error: error.message 
      });
    }
  }

  static async updateAdminPassword(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const passwordData: PasswordChangeDTO = req.body;
      const result = await ProfileAdminService.updateAdminPassword(req.admin.id, passwordData);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || 'Erreur serveur',
        error: error.message 
      });
    }
  }

  static async deleteAdminAccount(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      const result = await ProfileAdminService.deleteAdminAccount(req.admin.id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || 'Erreur serveur',
        error: error.message 
      });
    }
  }

  static async updateAdminProfilePhoto(req: AdminRequest, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "Aucune image fournie" });
      }

      const result = await ProfileAdminService.updateAdminProfilePhoto(req.admin.id, req.file);
      res.json({ 
        message: "Photo de profil mise à jour avec succès", 
        photo: result.photo 
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || 'Erreur serveur',
        error: error.message 
      });
    }
  }
}