"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOverviewController = void 0;
const adminOverview_service_1 = require("./adminOverview.service");
class AdminOverviewController {
    static async getOverview(req, res) {
        try {
            const overviewData = await adminOverview_service_1.AdminOverviewService.getOverviewData();
            res.status(200).json(overviewData);
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Erreur lors de la récupération des données de l\'aperçu',
                error: error.message
            });
        }
    }
    static async search(req, res) {
        try {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                return res.status(400).json({ message: 'Le paramètre de requête est requis et doit être une chaîne.' });
            }
            const searchResult = await adminOverview_service_1.AdminOverviewService.searchAll(query);
            res.status(200).json(searchResult);
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Erreur lors de la recherche',
                error: error.message
            });
        }
    }
}
exports.AdminOverviewController = AdminOverviewController;
//# sourceMappingURL=adminOverview.controller.js.map