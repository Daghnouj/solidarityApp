"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartenaireService = void 0;
const partners_model_1 = require("./partners.model");
const cloudinary_1 = require("../../config/cloudinary/cloudinary");
class PartenaireService {
    async createPartenaire(data, file) {
        const existing = await partners_model_1.Partenaire.findOne({ email: data.email.toLowerCase() });
        if (existing) {
            throw new Error('Un partenaire avec cet email existe déjà.');
        }
        const partenaireData = { ...data };
        if (file && file.path) {
            const result = await cloudinary_1.cloudinary.uploader.upload(file.path, {
                folder: 'partenaires/logos',
                transformation: [
                    { width: 300, height: 300, crop: 'limit', quality: 'auto' }
                ]
            });
            partenaireData.logo = {
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                width: result.width,
                height: result.height
            };
        }
        const partenaire = new partners_model_1.Partenaire(partenaireData);
        return await partenaire.save();
    }
    async getAllPartenaires() {
        return await partners_model_1.Partenaire.find().sort({ createdAt: -1 });
    }
    async getPartenaireById(id) {
        return await partners_model_1.Partenaire.findById(id);
    }
    async updatePartenaire(id, data, file) {
        var _a;
        const partenaire = await partners_model_1.Partenaire.findById(id);
        if (!partenaire) {
            throw new Error('Partenaire non trouvé');
        }
        if (file && file.path) {
            if ((_a = partenaire.logo) === null || _a === void 0 ? void 0 : _a.public_id) {
                await cloudinary_1.cloudinary.uploader.destroy(partenaire.logo.public_id);
            }
            const result = await cloudinary_1.cloudinary.uploader.upload(file.path, {
                folder: 'partenaires/logos',
                transformation: [
                    { width: 300, height: 300, crop: 'limit', quality: 'auto' }
                ]
            });
            data.logo = {
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                width: result.width,
                height: result.height
            };
        }
        return await partners_model_1.Partenaire.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
    }
    async deletePartenaire(id) {
        var _a;
        const partenaire = await partners_model_1.Partenaire.findById(id);
        if (!partenaire) {
            throw new Error('Partenaire non trouvé');
        }
        if ((_a = partenaire.logo) === null || _a === void 0 ? void 0 : _a.public_id) {
            await cloudinary_1.cloudinary.uploader.destroy(partenaire.logo.public_id);
        }
        return await partners_model_1.Partenaire.findByIdAndDelete(id);
    }
}
exports.PartenaireService = PartenaireService;
//# sourceMappingURL=partners.service.js.map