"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFavorite = void 0;
const favorites_service_1 = require("./favorites.service");
const toggleFavorite = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;
    try {
        const result = await favorites_service_1.FavorisService.toggleFavorite(postId, userId);
        res.json(result);
    }
    catch (error) {
        console.error('Erreur toggle favori:', error);
        const status = error.message === 'Post non trouvé' ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
exports.toggleFavorite = toggleFavorite;
//# sourceMappingURL=favorites.controller.js.map