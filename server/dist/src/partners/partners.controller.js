"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partenaireController = void 0;
const partners_service_1 = require("./partners.service");
const partenaireService = new partners_service_1.PartenaireService();
exports.partenaireController = {
    createPartenaire: async (req, res) => {
        try {
            const { link, nom, email, telephone, adresse, description, service } = req.body;
            const partenaire = await partenaireService.createPartenaire({ link, nom, email, telephone, adresse, description, service }, req.file);
            res.status(201).json({
                success: true,
                message: 'Partenaire créé avec succès',
                data: partenaire
            });
        }
        catch (error) {
            console.error('Erreur création partenaire:', error);
            res.status(error.message.includes('existe déjà') ? 400 : 500).json({
                success: false,
                message: error.message || 'Erreur lors de la création du partenaire'
            });
        }
    },
    getPartenaires: async (req, res) => {
        try {
            const partenaires = await partenaireService.getAllPartenaires();
            res.status(200).json({
                success: true,
                data: partenaires
            });
        }
        catch (error) {
            console.error('Erreur récupération partenaires:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des partenaires'
            });
        }
    },
    getPartenaireById: async (req, res) => {
        try {
            const { id } = req.params;
            const partenaire = await partenaireService.getPartenaireById(id);
            if (!partenaire) {
                res.status(404).json({
                    success: false,
                    message: 'Partenaire non trouvé'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: partenaire
            });
        }
        catch (error) {
            console.error('Erreur récupération partenaire:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur'
            });
        }
    },
    updatePartenaire: async (req, res) => {
        try {
            const { id } = req.params;
            const { link, nom, email, telephone, adresse, description, service } = req.body;
            const partenaire = await partenaireService.updatePartenaire(id, { link, nom, email, telephone, adresse, description, service }, req.file);
            if (!partenaire) {
                res.status(404).json({
                    success: false,
                    message: 'Partenaire non trouvé'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Partenaire mis à jour avec succès',
                data: partenaire
            });
        }
        catch (error) {
            console.error('Erreur mise à jour partenaire:', error);
            res.status(error.message.includes('non trouvé') ? 404 : 500).json({
                success: false,
                message: error.message || 'Erreur lors de la mise à jour du partenaire'
            });
        }
    },
    deletePartenaire: async (req, res) => {
        try {
            const { id } = req.params;
            const partenaire = await partenaireService.deletePartenaire(id);
            if (!partenaire) {
                res.status(404).json({
                    success: false,
                    message: 'Partenaire non trouvé'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Partenaire supprimé avec succès'
            });
        }
        catch (error) {
            console.error('Erreur suppression partenaire:', error);
            res.status(error.message.includes('non trouvé') ? 404 : 500).json({
                success: false,
                message: error.message || 'Erreur lors de la suppression du partenaire'
            });
        }
    }
};
//# sourceMappingURL=partners.controller.js.map