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

  // GET MEMBERS
  static async getEventMembers(id: string): Promise<any[]> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('ID invalide');
      }
      const event = await Event.findById(id).populate({
        path: 'participants',
        select: 'nom email telephone photo'
      });
      return event?.participants || [];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des membres: ${error}`);
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
        const publicIds = event.images
          .map(url => this.extractPublicIdFromUrl(url))
          .filter((id): id is string => id !== null);
        if (publicIds.length > 0) {
          await this.deleteCloudinaryImages(publicIds);
        }
      }

      return event;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'événement: ${error}`);
    }
  }

  static async deleteCloudinaryImages(publicIds: string[]): Promise<void> {
    try {
      const deletePromises = publicIds.map(publicId =>
        deleteCloudinaryFile(publicId)
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error(`Erreur lors de la suppression des images Cloudinary:`, error);
      // Ne pas relancer l'erreur pour ne pas bloquer la suppression
    }
  }

  static extractPublicIdFromUrl(url: string): string | null {
    // Extrait le public_id d'une URL Cloudinary
    // Retourne null si l'URL n'est pas une URL Cloudinary valide
    try {
      const matches = url.match(/\/upload\/v\d+\/(.+?)\.\w+$/);
      if (!matches || matches.length < 2) {
        return null;
      }
      return matches[1];
    } catch {
      return null;
    }
  }
}