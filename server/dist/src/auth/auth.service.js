"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../user/user.model"));
const request_model_1 = __importDefault(require("../request/request.model"));
const env_1 = require("../../config/env");
const adminNotification_service_1 = require("../admin/adminNotification/adminNotification.service");
class AuthService {
    async signup(userData, file = null, io) {
        console.log('📨 Données reçues dans le service:', userData);
        const { nom, email, mdp, dateNaissance, adresse, telephone, role = 'patient', specialite, situation_professionnelle, intitule_diplome, nom_etablissement, date_obtention_diplome, biographie } = userData;
        if (!nom || !email || !mdp) {
            throw new Error("Nom, email et mot de passe sont obligatoires.");
        }
        if (!mdp.trim()) {
            throw new Error("Mot de passe requis.");
        }
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            throw new Error("Un utilisateur avec cet email existe déjà.");
        }
        const hashedPassword = await bcryptjs_1.default.hash(mdp, 12);
        const userPayload = {
            nom,
            email,
            mdp: hashedPassword,
            dateNaissance: dateNaissance ? new Date(dateNaissance) : undefined,
            adresse,
            telephone,
            role,
            is_verified: role === "professional" ? false : true,
        };
        if (role === "professional") {
            if (!specialite) {
                throw new Error("La spécialité est requise pour les professionnels.");
            }
            userPayload.specialite = specialite;
        }
        const user = new user_model_1.default(userPayload);
        await user.save();
        if (io) {
            try {
                await adminNotification_service_1.AdminNotificationService.createNotification({
                    type: 'user_signup',
                    title: 'Nouvel utilisateur inscrit',
                    message: `${nom} (${email}) s'est inscrit en tant que ${role === 'professional' ? 'professionnel' : 'patient'}`,
                    data: {
                        userId: user._id.toString(),
                        userName: nom,
                        userEmail: email,
                        userRole: role
                    },
                    io
                });
            }
            catch (notifError) {
                console.error('Error creating admin notification for signup:', notifError);
            }
        }
        if (role === "professional") {
            if (!file) {
                await user_model_1.default.findByIdAndDelete(user._id);
                throw new Error("Document professionnel requis pour les professionnels.");
            }
            const documentUrl = file.path;
            const requestDoc = new request_model_1.default({
                professional: user._id,
                specialite,
                situation_professionnelle,
                intitule_diplome,
                nom_etablissement,
                date_obtention_diplome: date_obtention_diplome ? new Date(date_obtention_diplome) : undefined,
                biographie,
                document: documentUrl
            });
            await requestDoc.save();
            return {
                success: true,
                message: "Demande soumise avec succès, en attente de validation.",
                userType: 'professional'
            };
        }
        return {
            success: true,
            message: "Compte patient créé avec succès !",
            userType: 'patient'
        };
    }
    async login(loginData, io) {
        const { email, mdp, reactivate } = loginData;
        if (!email || !mdp) {
            throw new Error("Email et mot de passe requis.");
        }
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            throw new Error("Email ou mot de passe incorrect.");
        }
        if (!user.isActive) {
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
            if (user.deactivatedAt && user.deactivatedAt > twoMonthsAgo) {
                if (reactivate) {
                    user.isActive = true;
                    user.deactivatedAt = undefined;
                    await user.save();
                }
                else {
                    throw {
                        message: "Votre compte est désactivé. Souhaitez-vous le réactiver ?",
                        canReactivate: true
                    };
                }
            }
            else {
                throw new Error("Compte désactivé depuis plus de 2 mois. Réactivation impossible.");
            }
        }
        if (!user.mdp) {
            throw new Error("Problème d'authentification. Contactez l'administrateur.");
        }
        const isMatch = await bcryptjs_1.default.compare(mdp, user.mdp);
        if (!isMatch) {
            throw new Error("Email ou mot de passe incorrect.");
        }
        if (user.role === "professional" && !user.is_verified) {
            throw new Error("Votre compte professionnel est en attente de validation par l'administrateur.");
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, env_1.env.JWT_SECRET, { expiresIn: "7d" });
        await user_model_1.default.findByIdAndUpdate(user._id, {
            lastLogin: new Date(),
            isOnline: true
        });
        const userWithoutPassword = await user_model_1.default.findById(user._id).select('-mdp');
        return {
            success: true,
            token,
            role: user.role,
            user: userWithoutPassword
        };
    }
    async submitRequest(requestData, userId, file = null, io) {
        const { specialite, situation_professionnelle, intitule_diplome, nom_etablissement, date_obtention_diplome, biographie } = requestData;
        if (!specialite) {
            throw new Error("La spécialité est requise.");
        }
        const user = await user_model_1.default.findById(userId);
        if (!user || user.role !== "professional") {
            throw new Error("Seuls les professionnels peuvent soumettre une demande.");
        }
        const existingRequest = await request_model_1.default.findOne({ professional: userId });
        if (existingRequest) {
            throw new Error("Une demande a déjà été soumise pour ce professionnel.");
        }
        if (!file) {
            throw new Error("Un document est requis pour la soumission.");
        }
        const documentUrl = file.path;
        const requestDoc = new request_model_1.default({
            professional: userId,
            specialite,
            situation_professionnelle,
            intitule_diplome,
            nom_etablissement,
            date_obtention_diplome: date_obtention_diplome ? new Date(date_obtention_diplome) : undefined,
            biographie,
            document: documentUrl,
        });
        await requestDoc.save();
        return {
            success: true,
            message: "Demande soumise avec succès, en attente de validation par l'administrateur."
        };
    }
    async logout(userId) {
        await user_model_1.default.findByIdAndUpdate(userId, {
            isOnline: false,
            lastLogin: new Date()
        }, { new: true });
        return {
            success: true,
            message: "Déconnexion réussie"
        };
    }
    async getMe(userId) {
        const user = await user_model_1.default.findById(userId)
            .select('-mdp -__v')
            .lean();
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        return {
            ...user,
            _id: user._id.toString()
        };
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map