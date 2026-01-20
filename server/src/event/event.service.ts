import { Event } from './event.model';
import { IEvent, EventDocument } from './event.types';
import { cloudinary, deleteCloudinaryFile } from '../../config/cloudinary/cloudinary';
import { Types } from 'mongoose';

export class EventService {
  // CREATE
  static async createEvent(
    eventData: Omit<IEvent, 'images'> & { images: string[] }
  ): Promise<EventDocument> {
    try {
      const event = new Event(eventData);
      return await event.save();
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'événement: ${error}`);
    }
  }

  // GET ALL
  static async getEvents(
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string
  ): Promise<{ events: EventDocument[]; total: number; page: number; totalPages: number }> {
    try {
      const query: any = {};
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (category) {
        query.category = category;
      }
      
      const skip = (page - 1) * limit;
      
      const [events, total] = await Promise.all([
        Event.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(), // Retirer .lean() pour obtenir des documents Mongoose complets
        Event.countDocuments(query)
      ]);
      
      return {
        events, // Maintenant ce sont des EventDocument[]
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des événements: ${error}`);
    }
  }

  // GET BY ID
  static async getEventById(id: string): Promise<EventDocument | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('ID invalide');
      }
      return await Event.findById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'événement: ${error}`);
    }
  }

  // UPDATE
  static async updateEvent(
    id: string,
    updateData: Partial<IEvent>
  ): Promise<EventDocument | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('ID invalide');
      }
      
      const event = await Event.findByIdAndUpdate(
        id,
        { ...updateData },
        { new: true, runValidators: true }
      );
      
      return event;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'événement: ${error}`);
    }
  }

  // DELETE
  static async deleteEvent(id: string): Promise<EventDocument | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('ID invalide');
      }
      
      const event = await Event.findByIdAndDelete(id);
      
      // Supprimer les images de Cloudinary si l'événement existe et a des images
      if (event && event.images && event.images.length > 0) {
        const publicIds = event.images.map(url => this.extractPublicIdFromUrl(url));
        await this.deleteCloudinaryImages(publicIds);
      }
      
      return event;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'événement: ${error}`);
    }
  }

  // Cloudinary methods
  static async uploadEventImages(
    files: Express.Multer.File[]
  ): Promise<{ urls: string[]; public_ids: string[] }> {
    try {
      const uploadPromises = files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'events',
          transformation: [
            { width: 1200, height: 800, crop: 'fill', quality: 'auto:good' }
          ]
        });
        return { url: result.secure_url, public_id: result.public_id };
      });

      const results = await Promise.all(uploadPromises);
      
      return {
        urls: results.map(r => r.url),
        public_ids: results.map(r => r.public_id)
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'upload des images: ${error}`);
    }
  }

  static async deleteCloudinaryImages(publicIds: string[]): Promise<void> {
    try {
      const deletePromises = publicIds.map(publicId => 
        deleteCloudinaryFile(publicId)
      );
      await Promise.all(deletePromises);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression des images: ${error}`);
    }
  }

  static extractPublicIdFromUrl(url: string): string {
    // Extrait le public_id d'une URL Cloudinary
    const matches = url.match(/\/upload\/v\d+\/(.+?)\.\w+$/);
    if (!matches || matches.length < 2) {
      throw new Error('URL Cloudinary invalide');
    }
    return matches[1];
  }

  // Méthode pour mettre à jour les images d'un événement
  static async updateEventImages(
    eventId: string,
    currentImages: string[],
    newFiles?: Express.Multer.File[]
  ): Promise<string[]> {
    try {
      let images = [...currentImages];
      
      // Si de nouvelles images sont fournies
      if (newFiles && newFiles.length > 0) {
        // Uploader les nouvelles images
        const uploadResult = await this.uploadEventImages(newFiles);
        images = uploadResult.urls;
        
        // Supprimer les anciennes images de Cloudinary
        const oldPublicIds = currentImages.map(url => this.extractPublicIdFromUrl(url));
        await this.deleteCloudinaryImages(oldPublicIds);
      }
      
      return images;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour des images: ${error}`);
    }
  }
}