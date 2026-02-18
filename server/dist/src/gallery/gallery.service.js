"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalerieService = void 0;
const gallery_model_1 = __importDefault(require("./gallery.model"));
class GalerieService {
    async createGalerie(data) {
        if (!data.video) {
            throw new Error('Un lien YouTube est requis');
        }
        const galerie = new gallery_model_1.default(data);
        const savedGalerie = await galerie.save();
        return savedGalerie.toObject();
    }
    async getGaleriesByCategorie(query) {
        const filter = query.categorie ? { categorie: query.categorie } : {};
        const galeries = await gallery_model_1.default.find(filter)
            .select('titre desc video categorie views createdAt')
            .lean();
        if (!galeries.length) {
            throw new Error('Aucune galerie trouvée');
        }
        return galeries;
    }
    async getGalerieById(id) {
        const galerie = await gallery_model_1.default.findById(id).lean();
        return galerie;
    }
    async updateGalerie(id, data) {
        const galerie = await gallery_model_1.default.findByIdAndUpdate(id, { ...data }, { new: true }).lean();
        return galerie;
    }
    async deleteGalerie(id) {
        const result = await gallery_model_1.default.findByIdAndDelete(id);
        return result !== null;
    }
    async getTotalVideos(categorie) {
        const filter = categorie ? { categorie } : {};
        return await gallery_model_1.default.countDocuments(filter);
    }
    async trackView(data) {
        const { id, user, ip, headers } = data;
        const galerie = await gallery_model_1.default.findById(id);
        if (!galerie) {
            throw new Error('Vidéo non trouvée');
        }
        if (!galerie.viewedBy) {
            galerie.viewedBy = [];
        }
        if (user) {
            const userId = user._id.toString();
            const hasViewed = galerie.viewedBy.some(view => view.type === 'user' && view.id === userId);
            if (!hasViewed) {
                galerie.viewedBy.push({
                    type: 'user',
                    id: userId,
                    ip,
                    device: headers['user-agent'],
                    date: new Date()
                });
                galerie.views += 1;
            }
        }
        else {
            const hasViewed = galerie.viewedBy.some(view => view.type === 'anon' && view.ip === ip && view.device === headers['user-agent']);
            if (!hasViewed) {
                galerie.viewedBy.push({
                    type: 'anon',
                    ip,
                    device: headers['user-agent'],
                    date: new Date()
                });
                galerie.views += 1;
            }
        }
        await galerie.save();
        return galerie.views;
    }
}
exports.GalerieService = GalerieService;
exports.default = new GalerieService();
//# sourceMappingURL=gallery.service.js.map