"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalerieController = void 0;
const gallery_service_1 = __importDefault(require("./gallery.service"));
class GalerieController {
    async createGalerie(req, res) {
        try {
            const galerie = await gallery_service_1.default.createGalerie(req.body);
            const response = {
                success: true,
                message: 'Galerie ajoutée avec succès',
                data: galerie
            };
            res.status(201).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                message: error.message || 'Erreur serveur'
            };
            res.status(500).json(response);
        }
    }
    async getGaleriesByCategorie(req, res) {
        try {
            const galeries = await gallery_service_1.default.getGaleriesByCategorie(req.query);
            const response = {
                success: true,
                message: 'Galeries récupérées avec succès',
                data: galeries
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                message: error.message || 'Erreur serveur'
            };
            const status = error.message === 'Aucune galerie trouvée' ? 404 : 500;
            res.status(status).json(response);
        }
    }
    async getGalerieById(req, res) {
        try {
            const galerie = await gallery_service_1.default.getGalerieById(req.params.id);
            if (!galerie) {
                const response = {
                    success: false,
                    message: 'Vidéo non trouvée'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                message: 'Galerie récupérée avec succès',
                data: galerie
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                message: 'Erreur serveur'
            };
            res.status(500).json(response);
        }
    }
    async updateGalerie(req, res) {
        try {
            const galerie = await gallery_service_1.default.updateGalerie(req.params.id, req.body);
            if (!galerie) {
                const response = {
                    success: false,
                    message: 'Galerie non trouvée'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                message: 'Galerie mise à jour avec succès',
                data: galerie
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                message: error.message || 'Erreur serveur'
            };
            res.status(500).json(response);
        }
    }
    async deleteGalerie(req, res) {
        try {
            const deleted = await gallery_service_1.default.deleteGalerie(req.params.id);
            if (!deleted) {
                const response = {
                    success: false,
                    message: 'Galerie non trouvée'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                message: 'Galerie supprimée avec succès'
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                message: error.message || 'Erreur serveur'
            };
            res.status(500).json(response);
        }
    }
    async getTotalVideos(req, res) {
        try {
            const total = await gallery_service_1.default.getTotalVideos(req.query.categorie);
            const response = {
                success: true,
                message: 'Total récupéré avec succès',
                total
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                message: error.message || 'Erreur serveur'
            };
            res.status(500).json(response);
        }
    }
    async trackView(req, res) {
        try {
            const views = await gallery_service_1.default.trackView({
                id: req.params.id,
                user: req.user,
                ip: req.ip,
                headers: req.headers
            });
            const response = {
                success: true,
                message: 'Vue enregistrée avec succès',
                data: { views }
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                message: error.message || 'Erreur serveur'
            };
            const status = error.message === 'Vidéo non trouvée' ? 404 : 500;
            res.status(status).json(response);
        }
    }
}
exports.GalerieController = GalerieController;
exports.default = new GalerieController();
//# sourceMappingURL=gallery.controller.js.map