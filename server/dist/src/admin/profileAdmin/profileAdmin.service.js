"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileAdminService = void 0;
const admin_model_1 = require("../admin.model");
const cloudinary_1 = require("../../../config/cloudinary/cloudinary");
class ProfileAdminService {
    static async getAdminProfile(adminId) {
        const admin = await admin_model_1.Admin.findById(adminId);
        if (!admin) {
            throw new Error('Administrateur non trouvé');
        }
        return admin;
    }
    static async updateAdminProfile(adminId, updates) {
        const admin = await admin_model_1.Admin.findByIdAndUpdate(adminId, updates, { new: true, runValidators: true });
        if (!admin) {
            throw new Error('Administrateur non trouvé');
        }
        return admin;
    }
    static async updateAdminPassword(adminId, passwordData) {
        const admin = await admin_model_1.Admin.findById(adminId);
        if (!admin) {
            throw new Error('Administrateur non trouvé');
        }
        const isMatch = await admin.comparePassword(passwordData.oldPassword);
        if (!isMatch) {
            throw new Error('Ancien mot de passe incorrect');
        }
        admin.mdp = passwordData.newPassword;
        await admin.save();
        return { message: 'Mot de passe mis à jour avec succès' };
    }
    static async deleteAdminAccount(adminId) {
        const admin = await admin_model_1.Admin.findByIdAndDelete(adminId);
        if (!admin) {
            throw new Error('Administrateur non trouvé');
        }
        return { message: 'Compte administrateur supprimé avec succès' };
    }
    static async updateAdminProfilePhoto(adminId, imageFile) {
        var _a;
        const admin = await admin_model_1.Admin.findById(adminId);
        if (!admin) {
            throw new Error('Administrateur non trouvé');
        }
        if (admin.photo) {
            const publicId = (_a = admin.photo.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
            if (publicId) {
                await cloudinary_1.cloudinary.uploader.destroy(`admin_profiles/${publicId}`);
            }
        }
        const result = await cloudinary_1.cloudinary.uploader.upload(imageFile.path, {
            folder: 'admin_profiles',
            transformation: [
                { width: 500, height: 500, crop: 'limit', quality: 'auto' }
            ]
        });
        admin.photo = result.secure_url;
        await admin.save();
        return { photo: admin.photo };
    }
}
exports.ProfileAdminService = ProfileAdminService;
//# sourceMappingURL=profileAdmin.service.js.map