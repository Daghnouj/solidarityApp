"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const event_service_1 = require("./event.service");
class EventController {
    static async createEvent(req, res) {
        try {
            if (!req.files || !Array.isArray(req.files) || req.files.length !== 4) {
                res.status(400).json({
                    success: false,
                    message: 'Il faut exactement 4 images.'
                });
                return;
            }
            const { urls: imageUrls } = await event_service_1.EventService.uploadEventImages(req.files);
            const activities = JSON.parse(req.body.activities);
            const event = await event_service_1.EventService.createEvent({
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
        }
        catch (error) {
            console.error('Erreur création événement:', error);
            if (req.files && Array.isArray(req.files)) {
                try {
                }
                catch (cleanupError) {
                    console.error('Erreur lors du nettoyage:', cleanupError);
                }
            }
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur serveur lors de la création de l\'événement'
            });
        }
    }
    static async getEvents(req, res) {
        try {
            const { page = 1, limit = 10, search, category } = req.query;
            const result = await event_service_1.EventService.getEvents(Number(page), Number(limit), search, category);
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
        }
        catch (error) {
            console.error('Erreur récupération événements:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la récupération des événements'
            });
        }
    }
    static async getEventById(req, res) {
        try {
            const event = await event_service_1.EventService.getEventById(req.params.id);
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
        }
        catch (error) {
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
    static async updateEvent(req, res) {
        try {
            const eventId = req.params.id;
            const oldEvent = await event_service_1.EventService.getEventById(eventId);
            if (!oldEvent) {
                res.status(404).json({
                    success: false,
                    message: 'Événement non trouvé.'
                });
                return;
            }
            let imageUrls = oldEvent.images;
            let oldPublicIds = [];
            if (req.files && Array.isArray(req.files) && req.files.length === 4) {
                oldPublicIds = oldEvent.images.map(url => event_service_1.EventService.extractPublicIdFromUrl(url));
                const { urls: newImageUrls } = await event_service_1.EventService.uploadEventImages(req.files);
                imageUrls = newImageUrls;
            }
            const activities = req.body.activities
                ? JSON.parse(req.body.activities)
                : oldEvent.activities;
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
            const updatedEvent = await event_service_1.EventService.updateEvent(eventId, updateData);
            if (oldPublicIds.length > 0) {
                await event_service_1.EventService.deleteCloudinaryImages(oldPublicIds);
            }
            res.json({
                success: true,
                data: updatedEvent,
                message: 'Événement mis à jour avec succès'
            });
        }
        catch (error) {
            console.error('Erreur mise à jour événement:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur serveur lors de la mise à jour de l\'événement'
            });
        }
    }
    static async deleteEvent(req, res) {
        try {
            const eventId = req.params.id;
            const event = await event_service_1.EventService.getEventById(eventId);
            if (!event) {
                res.status(404).json({
                    success: false,
                    message: 'Événement non trouvé.'
                });
                return;
            }
            const publicIds = event.images.map(url => event_service_1.EventService.extractPublicIdFromUrl(url));
            await event_service_1.EventService.deleteEvent(eventId);
            await event_service_1.EventService.deleteCloudinaryImages(publicIds);
            res.json({
                success: true,
                message: 'Événement supprimé avec succès'
            });
        }
        catch (error) {
            console.error('Erreur suppression événement:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la suppression de l\'événement'
            });
        }
    }
}
exports.EventController = EventController;
//# sourceMappingURL=event.controller.js.map