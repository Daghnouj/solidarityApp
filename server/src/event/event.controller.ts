import { Request, Response } from 'express';
import { EventService } from './event.service';
import { CreateEventRequest, UpdateEventRequest } from './event.types';

export class EventController {
  // CREATE
  static async createEvent(req: CreateEventRequest, res: Response): Promise<void> {
    try {
      // Vérification des fichiers
      if (!req.files || !Array.isArray(req.files) || req.files.length !== 4) {
        res.status(400).json({
          success: false,
          message: 'Il faut exactement 4 images.'
        });
        return;
      }

      // Upload des images vers Cloudinary
      const { urls: imageUrls } = await EventService.uploadEventImages(req.files as Express.Multer.File[]);

      // Parse des activités
      const activities = JSON.parse(req.body.activities);

      // Création de l'événement
      const event = await EventService.createEvent({
        name: req.body.name,
        images: imageUrls,
        address: req.body.address,
        coordinates: req.body.coordinates,
        activities,
        description: req.body.description,
        website: req.body.website,
        category: req.body.category
      });

      res.status(201).json({
        success: true,
        data: event,
        message: 'Événement créé avec succès'
      });
    } catch (error: any) {
      console.error('Erreur création événement:', error);
      
      // Nettoyage des images en cas d'erreur
      if (req.files && Array.isArray(req.files)) {
        try {
          // Si les images ont été uploadées, elles seront nettoyées par Cloudinary plus tard
          // via la politique de conservation
        } catch (cleanupError) {
          console.error('Erreur lors du nettoyage:', cleanupError);
        }
      }
      
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur lors de la création de l\'événement'
      });
    }
  }

  // GET ALL
  static async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search, category } = req.query;
      
      const result = await EventService.getEvents(
        Number(page),
        Number(limit),
        search as string,
        category as string
      );

      res.json({
        success: true,
        data: result.events,
        pagination: {
          page: result.page,
          limit: Number(limit),
          total: result.total,
          totalPages: result.totalPages
        }
      });
    } catch (error: any) {
      console.error('Erreur récupération événements:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des événements'
      });
    }
  }

  // GET BY ID
  static async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const event = await EventService.getEventById(req.params.id);
      
      if (!event) {
        res.status(404).json({
          success: false,
          message: 'Événement non trouvé.'
        });
        return;
      }

      res.json({
        success: true,
        data: event
      });
    } catch (error: any) {
      console.error('Erreur récupération événement:', error);
      
      if (error.message.includes('ID invalide')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération de l\'événement'
      });
    }
  }

  // UPDATE
  static async updateEvent(req: UpdateEventRequest, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      
      // Récupérer l'ancien événement
      const oldEvent = await EventService.getEventById(eventId);
      if (!oldEvent) {
        res.status(404).json({
          success: false,
          message: 'Événement non trouvé.'
        });
        return;
      }

      let imageUrls = oldEvent.images;
      let oldPublicIds: string[] = [];

      // Si de nouvelles images sont uploadées
      if (req.files && Array.isArray(req.files) && req.files.length === 4) {
        // Extraire les public_ids des anciennes images
        oldPublicIds = oldEvent.images.map(url => 
          EventService.extractPublicIdFromUrl(url)
        );

        // Uploader les nouvelles images
        const { urls: newImageUrls } = await EventService.uploadEventImages(
          req.files as Express.Multer.File[]
        );
        imageUrls = newImageUrls;
      }

      // Parse des activités
      const activities = req.body.activities 
        ? JSON.parse(req.body.activities)
        : oldEvent.activities;

      // Mise à jour de l'événement
      const updateData = {
        name: req.body.name || oldEvent.name,
        images: imageUrls,
        address: req.body.address || oldEvent.address,
        coordinates: req.body.coordinates || oldEvent.coordinates,
        activities,
        description: req.body.description || oldEvent.description,
        website: req.body.website || oldEvent.website,
        category: req.body.category || oldEvent.category
      };

      const updatedEvent = await EventService.updateEvent(eventId, updateData);

      // Supprimer les anciennes images de Cloudinary si de nouvelles ont été uploadées
      if (oldPublicIds.length > 0) {
        await EventService.deleteCloudinaryImages(oldPublicIds);
      }

      res.json({
        success: true,
        data: updatedEvent,
        message: 'Événement mis à jour avec succès'
      });
    } catch (error: any) {
      console.error('Erreur mise à jour événement:', error);
      
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur serveur lors de la mise à jour de l\'événement'
      });
    }
  }

  // DELETE
  static async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      
      // Récupérer l'événement avant suppression
      const event = await EventService.getEventById(eventId);
      if (!event) {
        res.status(404).json({
          success: false,
          message: 'Événement non trouvé.'
        });
        return;
      }

      // Extraire les public_ids des images
      const publicIds = event.images.map(url => 
        EventService.extractPublicIdFromUrl(url)
      );

      // Supprimer l'événement de la base de données
      await EventService.deleteEvent(eventId);

      // Supprimer les images de Cloudinary
      await EventService.deleteCloudinaryImages(publicIds);

      res.json({
        success: true,
        message: 'Événement supprimé avec succès'
      });
    } catch (error: any) {
      console.error('Erreur suppression événement:', error);
      
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la suppression de l\'événement'
      });
    }
  }
}