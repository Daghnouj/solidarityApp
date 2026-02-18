"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("./user.model"));
const request_model_1 = __importDefault(require("../request/request.model"));
const cloudinary_1 = require("../../config/cloudinary/cloudinary");
class UserService {
    async getProfile(userId) {
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new Error("ID utilisateur invalide");
        }
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        return user;
    }
    async updateProfile(userId, updateData) {
        const { email, nom, dateNaissance, adresse, telephone, bio, gender, licenseNumber, languages, education, services, clinicName, clinicAddress } = updateData;
        const user = await user_model_1.default.findByIdAndUpdate(userId, {
            email, nom, dateNaissance, adresse, telephone,
            bio, gender, licenseNumber, languages, education, services, clinicName, clinicAddress
        }, { new: true }).select("-mdp");
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        if (bio !== undefined) {
            try {
                await request_model_1.default.findOneAndUpdate({ professional: userId }, { biographie: bio });
            }
            catch (error) {
                console.error("Error syncing bio to request:", error);
            }
        }
        return user;
    }
    async updatePassword(userId, passwordData) {
        const { oldPassword, newPassword, confirmPassword } = passwordData;
        if (!oldPassword || !newPassword || !confirmPassword) {
            throw new Error("Tous les champs sont requis.");
        }
        if (newPassword !== confirmPassword) {
            throw new Error("Les nouveaux mots de passe ne correspondent pas.");
        }
        if (newPassword.length < 8) {
            throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
        }
        const user = await user_model_1.default.findById(userId).select('+mdp');
        if (!user) {
            throw new Error("Utilisateur non trouvé.");
        }
        const isMatch = await bcryptjs_1.default.compare(oldPassword, user.mdp);
        if (!isMatch) {
            throw new Error("Ancien mot de passe incorrect.");
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await user_model_1.default.findByIdAndUpdate(userId, { mdp: hashedPassword }, { runValidators: false, context: 'query' });
        return {
            success: true,
            message: "Mot de passe mis à jour avec succès."
        };
    }
    async updateProfilePhoto(userId, file) {
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        if (user.photo && user.photo.includes('cloudinary')) {
            try {
                const urlParts = user.photo.split('/');
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExtension.split('.')[0];
                await cloudinary_1.cloudinary.uploader.destroy(`profiles/${publicId}`);
            }
            catch (error) {
                console.error("Erreur lors de la suppression de l'ancienne photo:", error);
            }
        }
        let photoUrl = null;
        if (file) {
            try {
                const result = await cloudinary_1.cloudinary.uploader.upload(file.path, {
                    folder: "profiles",
                    transformation: [
                        { width: 500, height: 500, crop: "limit", quality: "auto" }
                    ]
                });
                photoUrl = result.secure_url;
            }
            catch (uploadError) {
                throw new Error("Erreur lors de l'upload de la photo: " + uploadError.message);
            }
        }
        const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, { photo: photoUrl }, { new: true }).select("-mdp");
        if (!updatedUser) {
            throw new Error("Erreur lors de la mise à jour de la photo");
        }
        return {
            success: true,
            message: "Photo mise à jour",
            photo: updatedUser.photo || null
        };
    }
    async deleteProfile(userId) {
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        if (user.photo && user.photo.includes('cloudinary')) {
            try {
                const urlParts = user.photo.split('/');
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExtension.split('.')[0];
                await cloudinary_1.cloudinary.uploader.destroy(`profiles/${publicId}`);
            }
            catch (error) {
                console.error("Erreur lors de la suppression de la photo:", error);
            }
        }
        await user_model_1.default.findByIdAndDelete(userId);
        return {
            success: true,
            message: "Compte supprimé avec succès"
        };
    }
    async deactivateAccount(userId, password = null) {
        if (password) {
            const user = await user_model_1.default.findById(userId);
            if (!user)
                throw new Error("Utilisateur non trouvé");
            const isMatch = await bcryptjs_1.default.compare(password, user.mdp);
            if (!isMatch)
                throw new Error("Mot de passe incorrect");
        }
        const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, {
            isActive: false,
            deactivatedAt: new Date(),
            isOnline: false
        }, { new: true }).select("-mdp");
        if (!updatedUser)
            throw new Error("Utilisateur non trouvé");
        return {
            success: true,
            message: "Compte désactivé. Vous avez 2 mois pour le réactiver avant suppression définitive.",
            user: updatedUser,
            deactivatedAt: updatedUser.deactivatedAt
        };
    }
    async activateAccount(userId) {
        const user = await user_model_1.default.findByIdAndUpdate(userId, {
            isActive: true,
            deactivatedAt: null
        }, { new: true }).select("-mdp");
        if (!user)
            throw new Error("Utilisateur non trouvé");
        return {
            success: true,
            message: "Compte activé avec succès.",
            user
        };
    }
    async getUserById(userId) {
        var _a, _b, _c;
        const user = await user_model_1.default.findById(userId).select('-mdp -__v');
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return {
            _id: user._id.toString(),
            nom: user.nom,
            email: user.email,
            dateNaissance: user.dateNaissance,
            adresse: user.adresse,
            telephone: user.telephone,
            photo: user.photo,
            role: user.role,
            is_verified: user.is_verified,
            specialite: user.specialite,
            bio: user.bio,
            gender: user.gender,
            licenseNumber: user.licenseNumber,
            languages: user.languages,
            education: user.education,
            services: user.services,
            clinicName: user.clinicName,
            clinicAddress: user.clinicAddress,
            isOnline: user.isOnline,
            lastLogin: user.lastLogin,
            following: (_a = user.following) === null || _a === void 0 ? void 0 : _a.map(id => id.toString()),
            groups: (_b = user.groups) === null || _b === void 0 ? void 0 : _b.map(id => id.toString()),
            saved_specialist: (_c = user.saved_specialist) === null || _c === void 0 ? void 0 : _c.map((id) => id.toString())
        };
    }
    async getCurrentUser(userId) {
        var _a, _b, _c;
        const user = await user_model_1.default.findById(userId)
            .select('-mdp -__v -createdAt -updatedAt');
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return {
            _id: user._id.toString(),
            nom: user.nom,
            email: user.email,
            dateNaissance: user.dateNaissance,
            adresse: user.adresse,
            telephone: user.telephone,
            photo: user.photo || `${process.env.API_BASE_URL}/default-avatar.png`,
            role: user.role,
            is_verified: user.is_verified,
            specialite: user.specialite,
            bio: user.bio,
            gender: user.gender,
            licenseNumber: user.licenseNumber,
            languages: user.languages,
            education: user.education,
            services: user.services,
            clinicName: user.clinicName,
            clinicAddress: user.clinicAddress,
            isOnline: user.isOnline,
            lastLogin: user.lastLogin,
            following: (_a = user.following) === null || _a === void 0 ? void 0 : _a.map(id => id.toString()),
            groups: (_b = user.groups) === null || _b === void 0 ? void 0 : _b.map(id => id.toString()),
            saved_specialist: (_c = user.saved_specialist) === null || _c === void 0 ? void 0 : _c.map((id) => id.toString())
        };
    }
    async getSavedSpecialists(userId) {
        const user = await user_model_1.default.findById(userId)
            .select('role saved_specialist')
            .populate({
            path: 'saved_specialist',
            match: { role: 'professional' },
            select: '-mdp -__v -stripeCustomerId'
        });
        if (!user)
            throw new Error('Utilisateur non trouvé');
        if (user.role !== 'patient')
            throw new Error('Accès réservé aux patients');
        return user.saved_specialist || [];
    }
    async saveSpecialist(userId, professionalId) {
        const prof = await user_model_1.default.findById(professionalId).select('role');
        if (!prof)
            throw new Error('Professionnel introuvable');
        if (prof.role !== 'professional')
            throw new Error('Seuls les professionnels peuvent être sauvegardés');
        const updated = await user_model_1.default.findByIdAndUpdate(userId, { $addToSet: { saved_specialist: prof._id } }, { new: true }).select('saved_specialist role');
        if (!updated)
            throw new Error('Utilisateur non trouvé');
        if (updated.role !== 'patient')
            throw new Error('Accès réservé aux patients');
        return updated.saved_specialist;
    }
    async unsaveSpecialist(userId, professionalId) {
        const updated = await user_model_1.default.findByIdAndUpdate(userId, { $pull: { saved_specialist: professionalId } }, { new: true }).select('saved_specialist role');
        if (!updated)
            throw new Error('Utilisateur non trouvé');
        if (updated.role !== 'patient')
            throw new Error('Accès réservé aux patients');
        return updated.saved_specialist;
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map