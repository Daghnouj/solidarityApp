"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileAdminController = void 0;
const profileAdmin_service_1 = require("./profileAdmin.service");
class ProfileAdminController {
    static async getAdminProfile(req, res) {
        try {
            if (!req.admin) {
                return res.status(401).json({ message: "Non authentifié" });
            }
            const admin = await profileAdmin_service_1.ProfileAdminService.getAdminProfile(req.admin.id);
            res.json(admin);
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Erreur serveur',
                error: error.message
            });
        }
    }
    static async updateAdminProfile(req, res) {
        try {
            if (!req.admin) {
                return res.status(401).json({ message: "Non authentifié" });
            }
            const updates = req.body;
            const admin = await profileAdmin_service_1.ProfileAdminService.updateAdminProfile(req.admin.id, updates);
            res.json(admin);
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Erreur serveur',
                error: error.message
            });
        }
    }
    static async updateAdminPassword(req, res) {
        try {
            if (!req.admin) {
                return res.status(401).json({ message: "Non authentifié" });
            }
            const passwordData = req.body;
            const result = await profileAdmin_service_1.ProfileAdminService.updateAdminPassword(req.admin.id, passwordData);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Erreur serveur',
                error: error.message
            });
        }
    }
    static async deleteAdminAccount(req, res) {
        try {
            if (!req.admin) {
                return res.status(401).json({ message: "Non authentifié" });
            }
            const result = await profileAdmin_service_1.ProfileAdminService.deleteAdminAccount(req.admin.id);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Erreur serveur',
                error: error.message
            });
        }
    }
    static async updateAdminProfilePhoto(req, res) {
        try {
            if (!req.admin) {
                return res.status(401).json({ message: "Non authentifié" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "Aucune image fournie" });
            }
            const result = await profileAdmin_service_1.ProfileAdminService.updateAdminProfilePhoto(req.admin.id, req.file);
            res.json({
                message: "Photo de profil mise à jour avec succès",
                photo: result.photo
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Erreur serveur',
                error: error.message
            });
        }
    }
}
exports.ProfileAdminController = ProfileAdminController;
//# sourceMappingURL=profileAdmin.controller.js.map