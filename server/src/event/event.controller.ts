import { Request, Response } from 'express';
import { ProtectedRequest } from '../types/express';
import { EventService } from './event.service';
import { CreateEventRequest, UpdateEventRequest } from './event.types';
import { Event } from './event.model';

export class EventController {
    // CREATE
    static async createEvent(req: CreateEventRequest, res: Response): Promise<void> {
        try {
            if (!req.files || !Array.isArray(req.files) || req.files.length !== 4) {
                res.status(400).json({
                    success: false,
                    message: 'Veuillez fournir exactement 4 images pour créer un centre.'
                });
                return;
            }

            const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path);
            const eventData = { ...req.body, images: imageUrls };
            if (typeof eventData.activities === 'string') {
                eventData.activities = JSON.parse(eventData.activities);
            }

            const event = await EventService.createEvent(eventData);
            res.status(201).json({
                success: true,
                data: event
            });
        } catch (error: any) {
            console.error('Erreur creation event:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur serveur lors de la création de l\'événement'
            });
        }
    }

    // GET ALL
    static async getEvents(req: Request, res: Response): Promise<void> {
        try {
            const { page, limit, search, category } = req.query;
            const result = await EventService.getEvents(
                Number(page),
                Number(limit),
                search as string,
                category as string
            );
            res.status(200).json({
                success: true,
                data: result.events,
                total: result.total,
                page: result.page,
                totalPages: result.totalPages
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur serveur'
            });
        }
    }

    // GET BY ID
    static async getEventById(req: Request, res: Response): Promise<void> {
        try {
            const event = await EventService.getEventById(req.params.id);
            if (!event) {
                res.status(404).json({ success: false, message: 'Événement non trouvé' });
                return;
            }
            res.json({ success: true, data: event });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // UPDATE
    static async updateEvent(req: UpdateEventRequest, res: Response): Promise<void> {
        try {
            const imageMapping = JSON.parse(req.body.imageMapping || '[]');
            const newFiles = req.files as Express.Multer.File[];
            let newFileIndex = 0;

            const finalImages = imageMapping.map((item: string) => {
                if (item === '__NEW__') {
                    const file = newFiles[newFileIndex++];
                    return file ? file.path : null;
                }
                return item;
            }).filter((img: string | null) => img !== null);

            if (finalImages.length !== 4) {
                res.status(400).json({
                    success: false,
                    message: 'L\'événement doit avoir exactement 4 images.'
                });
                return;
            }

            const updateData = { ...req.body, images: finalImages };
            if (typeof updateData.activities === 'string') {
                updateData.activities = JSON.parse(updateData.activities);
            }

            const event = await EventService.updateEvent(req.params.id, updateData);
            res.status(200).json({ success: true, data: event });
        } catch (error: any) {
            console.error('Erreur mise à jour event:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // DELETE
    static async deleteEvent(req: Request, res: Response): Promise<void> {
        try {
            await EventService.deleteEvent(req.params.id);
            res.status(200).json({ success: true, message: 'Événement supprimé' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // TOGGLE PARTICIPATION
    static async toggleParticipation(req: ProtectedRequest, res: Response): Promise<void> {
        try {
            const eventId = req.params.id;
            const userId = req.user._id;

            const event = await Event.findById(eventId);
            if (!event) {
                res.status(404).json({ success: false, message: 'Événement non trouvé' });
                return;
            }

            if (!event.participants) {
                event.participants = [];
            }

            const isParticipating = event.participants.includes(userId as any);

            if (isParticipating) {
                event.participants = event.participants.filter(p => p.toString() !== userId.toString());
            } else {
                event.participants.push(userId as any);
            }

            await event.save();

            res.json({
                success: true,
                isParticipating: !isParticipating,
                participantCount: event.participants.length
            });
        } catch (error: any) {
            console.error('Erreur toggle participation:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur serveur lors de la participation'
            });
        }
    }

    // GET MEMBERS
    static async getEventMembers(req: Request, res: Response): Promise<void> {
        try {
            const eventId = req.params.id;
            const members = await EventService.getEventMembers(eventId);
            res.json({
                success: true,
                data: members
            });
        } catch (error: any) {
            console.error('Erreur récupération membres:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur serveur lors de la récupération des membres'
            });
        }
    }

    // SUBMIT RATING
    static async submitRating(req: ProtectedRequest, res: Response): Promise<void> {
        try {
            const eventId = req.params.id;
            const userId = req.user._id;
            const { rating } = req.body;

            if (!rating || rating < 1 || rating > 5) {
                res.status(400).json({ success: false, message: 'Note invalide (doit être entre 1 et 5)' });
                return;
            }

            const event = await Event.findById(eventId);
            if (!event) {
                res.status(404).json({ success: false, message: 'Événement non trouvé' });
                return;
            }

            if (!event.ratings) {
                event.ratings = [];
            }

            // Vérifier si l'utilisateur a déjà noté
            const existingRatingIndex = event.ratings.findIndex(r => r.user.toString() === userId.toString());

            if (existingRatingIndex > -1) {
                // Mettre à jour la note existante
                event.ratings[existingRatingIndex].rating = rating;
            } else {
                // Ajouter une nouvelle note
                event.ratings.push({ user: userId as any, rating, createdAt: new Date() });
            }

            // Recalculer la moyenne
            const totalRating = event.ratings.reduce((sum, r) => sum + r.rating, 0);
            event.numberOfRatings = event.ratings.length;
            event.averageRating = Number((totalRating / event.numberOfRatings).toFixed(1));

            await event.save();

            res.json({
                success: true,
                averageRating: event.averageRating,
                numberOfRatings: event.numberOfRatings
            });
        } catch (error: any) {
            console.error('Erreur soumission note:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur serveur lors de la notation'
            });
        }
    }
}
