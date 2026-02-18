"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const event_model_1 = require("./event.model");
const cloudinary_1 = require("../../config/cloudinary/cloudinary");
const mongoose_1 = require("mongoose");
class EventService {
    static async createEvent(eventData) {
        try {
            const event = new event_model_1.Event(eventData);
            return await event.save();
        }
        catch (error) {
            throw new Error(`Erreur lors de la création de l'événement: ${error}`);
        }
    }
    static async getEvents(page = 1, limit = 10, search, category) {
        try {
            const query = {};
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
                event_model_1.Event.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                event_model_1.Event.countDocuments(query)
            ]);
            return {
                events,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des événements: ${error}`);
        }
    }
    static async getEventById(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new Error('ID invalide');
            }
            return await event_model_1.Event.findById(id);
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération de l'événement: ${error}`);
        }
    }
    static async updateEvent(id, updateData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new Error('ID invalide');
            }
            const event = await event_model_1.Event.findByIdAndUpdate(id, { ...updateData }, { new: true, runValidators: true });
            return event;
        }
        catch (error) {
            throw new Error(`Erreur lors de la mise à jour de l'événement: ${error}`);
        }
    }
    static async deleteEvent(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new Error('ID invalide');
            }
            const event = await event_model_1.Event.findByIdAndDelete(id);
            if (event && event.images && event.images.length > 0) {
                const publicIds = event.images.map(url => this.extractPublicIdFromUrl(url));
                await this.deleteCloudinaryImages(publicIds);
            }
            return event;
        }
        catch (error) {
            throw new Error(`Erreur lors de la suppression de l'événement: ${error}`);
        }
    }
    static async uploadEventImages(files) {
        try {
            const uploadPromises = files.map(async (file) => {
                const result = await cloudinary_1.cloudinary.uploader.upload(file.path, {
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
        }
        catch (error) {
            throw new Error(`Erreur lors de l'upload des images: ${error}`);
        }
    }
    static async deleteCloudinaryImages(publicIds) {
        try {
            const deletePromises = publicIds.map(publicId => (0, cloudinary_1.deleteCloudinaryFile)(publicId));
            await Promise.all(deletePromises);
        }
        catch (error) {
            throw new Error(`Erreur lors de la suppression des images: ${error}`);
        }
    }
    static extractPublicIdFromUrl(url) {
        const matches = url.match(/\/upload\/v\d+\/(.+?)\.\w+$/);
        if (!matches || matches.length < 2) {
            throw new Error('URL Cloudinary invalide');
        }
        return matches[1];
    }
    static async updateEventImages(eventId, currentImages, newFiles) {
        try {
            let images = [...currentImages];
            if (newFiles && newFiles.length > 0) {
                const uploadResult = await this.uploadEventImages(newFiles);
                images = uploadResult.urls;
                const oldPublicIds = currentImages.map(url => this.extractPublicIdFromUrl(url));
                await this.deleteCloudinaryImages(oldPublicIds);
            }
            return images;
        }
        catch (error) {
            throw new Error(`Erreur lors de la mise à jour des images: ${error}`);
        }
    }
}
exports.EventService = EventService;
//# sourceMappingURL=event.service.js.map