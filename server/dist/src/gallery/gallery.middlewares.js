"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateGalerie = exports.validateCreateGalerie = exports.checkGalerieExists = void 0;
const gallery_service_1 = __importDefault(require("./gallery.service"));
const checkGalerieExists = async (req, res, next) => {
    try {
        const { id } = req.params;
        const galerie = await gallery_service_1.default.getGalerieById(id);
        if (!galerie) {
            res.status(404).json({
                success: false,
                message: 'Galerie non trouvée'
            });
            return;
        }
        req.galerie = galerie;
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};
exports.checkGalerieExists = checkGalerieExists;
const validateCreateGalerie = (req, res, next) => {
    const { titre, desc, video, categorie } = req.body;
    if (!titre || !desc || !video || !categorie) {
        res.status(400).json({
            success: false,
            message: 'Tous les champs sont requis'
        });
        return;
    }
    next();
};
exports.validateCreateGalerie = validateCreateGalerie;
const validateUpdateGalerie = (req, res, next) => {
    const { titre, desc, video, categorie } = req.body;
    if (!titre && !desc && !video && !categorie) {
        res.status(400).json({
            success: false,
            message: 'Au moins un champ doit être fourni pour la mise à jour'
        });
        return;
    }
    next();
};
exports.validateUpdateGalerie = validateUpdateGalerie;
//# sourceMappingURL=gallery.middlewares.js.map