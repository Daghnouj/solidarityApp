import { Request, Response } from 'express';
import GalerieService from './gallery.service';
import { GalerieResponse } from './gallery.types';
import { AdminRequest } from '../admin/admin.types';

export class GalerieController {
  // Créer une galerie (Admin seulement)
  async createGalerie(req: AdminRequest, res: Response): Promise<void> {
    try {
      const galerie = await GalerieService.createGalerie(req.body);
      
      const response: GalerieResponse = {
        success: true,
        message: 'Galerie ajoutée avec succès',
        data: galerie
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      const response: GalerieResponse = {
        success: false,
        message: error.message || 'Erreur serveur'
      };
      res.status(500).json(response);
    }
  }

  // Obtenir les galeries par catégorie (Public)
  async getGaleriesByCategorie(req: Request, res: Response): Promise<void> {
    try {
      const galeries = await GalerieService.getGaleriesByCategorie(req.query);
      
      const response: GalerieResponse = {
        success: true,
        message: 'Galeries récupérées avec succès',
        data: galeries
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: GalerieResponse = {
        success: false,
        message: error.message || 'Erreur serveur'
      };
      const status = error.message === 'Aucune galerie trouvée' ? 404 : 500;
      res.status(status).json(response);
    }
  }

  // Obtenir une galerie par ID (Public)
  async getGalerieById(req: Request, res: Response): Promise<void> {
    try {
      const galerie = await GalerieService.getGalerieById(req.params.id);
      
      if (!galerie) {
        const response: GalerieResponse = {
          success: false,
          message: 'Vidéo non trouvée'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: GalerieResponse = {
        success: true,
        message: 'Galerie récupérée avec succès',
        data: galerie
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: GalerieResponse = {
        success: false,
        message: 'Erreur serveur'
      };
      res.status(500).json(response);
    }
  }

  // Mettre à jour une galerie (Admin seulement)
  async updateGalerie(req: AdminRequest, res: Response): Promise<void> {
    try {
      const galerie = await GalerieService.updateGalerie(req.params.id, req.body);
      
      if (!galerie) {
        const response: GalerieResponse = {
          success: false,
          message: 'Galerie non trouvée'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: GalerieResponse = {
        success: true,
        message: 'Galerie mise à jour avec succès',
        data: galerie
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: GalerieResponse = {
        success: false,
        message: error.message || 'Erreur serveur'
      };
      res.status(500).json(response);
    }
  }

  // Supprimer une galerie (Admin seulement)
  async deleteGalerie(req: AdminRequest, res: Response): Promise<void> {
    try {
      const deleted = await GalerieService.deleteGalerie(req.params.id);
      
      if (!deleted) {
        const response: GalerieResponse = {
          success: false,
          message: 'Galerie non trouvée'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: GalerieResponse = {
        success: true,
        message: 'Galerie supprimée avec succès'
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: GalerieResponse = {
        success: false,
        message: error.message || 'Erreur serveur'
      };
      res.status(500).json(response);
    }
  }

  // Obtenir le nombre total de vidéos (Public)
  async getTotalVideos(req: Request, res: Response): Promise<void> {
    try {
      const total = await GalerieService.getTotalVideos(req.query.categorie as string);
      
      const response: GalerieResponse = {
        success: true,
        message: 'Total récupéré avec succès',
        total
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: GalerieResponse = {
        success: false,
        message: error.message || 'Erreur serveur'
      };
      res.status(500).json(response);
    }
  }

//   // Tracker une vue (Public)
// Tracker une vue (Public)
async trackView(req: Request, res: Response): Promise<void> {
  try {
    const views = await GalerieService.trackView({
      id: req.params.id,
      user: (req as any).user, // Si vous avez un système d'authentification
      ip: req.ip,
      headers: req.headers as { 'user-agent': string }
    });
    
    const response: GalerieResponse = {
      success: true,
      message: 'Vue enregistrée avec succès',
      data: { views }
    };
    
    res.status(200).json(response);
  } catch (error: any) {
    const response: GalerieResponse = {
      success: false,
      message: error.message || 'Erreur serveur'
    };
    const status = error.message === 'Vidéo non trouvée' ? 404 : 500;
    res.status(status).json(response);
  }
}
}

export default new GalerieController();