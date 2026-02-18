"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getCurrentUser = exports.getPublicProfessional = exports.getUserById = exports.activateAccount = exports.deactivateAccount = exports.deleteProfile = exports.updateProfilePhoto = exports.updatePassword = exports.updateProfile = exports.unsaveSpecialist = exports.saveSpecialist = exports.getSavedSpecialists = exports.getProfile = void 0;
const user_service_1 = __importDefault(require("./user.service"));
const user_model_1 = __importDefault(require("./user.model"));
const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id.toString();
        const user = await user_service_1.default.getProfile(userId);
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error('Erreur getProfile:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.getProfile = getProfile;
const getSavedSpecialists = async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id.toString();
        const specialists = await user_service_1.default.getSavedSpecialists(userId);
        res.json({ success: true, data: specialists });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getSavedSpecialists = getSavedSpecialists;
const saveSpecialist = async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id.toString();
        const { professionalId } = req.params;
        const list = await user_service_1.default.saveSpecialist(userId, professionalId);
        res.json({ success: true, data: list });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.saveSpecialist = saveSpecialist;
const unsaveSpecialist = async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id.toString();
        const { professionalId } = req.params;
        const list = await user_service_1.default.unsaveSpecialist(userId, professionalId);
        res.json({ success: true, data: list });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.unsaveSpecialist = unsaveSpecialist;
const updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await user_service_1.default.updateProfile(userId, req.body);
        res.json({
            success: true,
            data: user,
            message: "Profil mis à jour avec succès"
        });
    }
    catch (error) {
        console.error("Erreur updateProfile:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateProfile = updateProfile;
const updatePassword = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await user_service_1.default.updatePassword(userId, req.body);
        res.json(result);
    }
    catch (error) {
        console.error("Erreur updatePassword:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.updatePassword = updatePassword;
const updateProfilePhoto = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "Aucune image fournie"
            });
            return;
        }
        const result = await user_service_1.default.updateProfilePhoto(userId, req.file);
        res.json(result);
    }
    catch (error) {
        console.error("Erreur updateProfilePhoto:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateProfilePhoto = updateProfilePhoto;
const deleteProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await user_service_1.default.deleteProfile(userId);
        res.json(result);
    }
    catch (error) {
        console.error("Erreur deleteProfile:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.deleteProfile = deleteProfile;
const deactivateAccount = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await user_service_1.default.deactivateAccount(userId, req.body.password);
        res.json(result);
    }
    catch (error) {
        console.error("Erreur deactivateAccount:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.deactivateAccount = deactivateAccount;
const activateAccount = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await user_service_1.default.activateAccount(userId);
        res.json(result);
    }
    catch (error) {
        console.error("Erreur activateAccount:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.activateAccount = activateAccount;
const getUserById = async (req, res) => {
    try {
        const user = await user_service_1.default.getUserById(req.params.id);
        res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error('[USER] Erreur:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
exports.getUserById = getUserById;
const getPublicProfessional = async (req, res) => {
    try {
        const professional = await user_model_1.default.findById(req.params.id)
            .select('-mdp -__v -stripeCustomerId');
        if (!professional) {
            res.status(404).json({
                success: false,
                message: 'Professional not found'
            });
            return;
        }
        if (professional.role !== 'professional' || !professional.isActive || !professional.is_verified) {
            res.status(404).json({
                success: false,
                message: 'Professional not found'
            });
            return;
        }
        res.json({
            success: true,
            data: professional
        });
    }
    catch (error) {
        console.error('[PUBLIC PROFESSIONAL] Erreur:', error);
        res.status(404).json({
            success: false,
            message: 'Professional not found'
        });
    }
};
exports.getPublicProfessional = getPublicProfessional;
const getCurrentUser = async (req, res) => {
    try {
        const user = await user_service_1.default.getCurrentUser(req.user._id.toString());
        res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error('[CURRENT USER] Erreur:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
exports.getCurrentUser = getCurrentUser;
const getAllUsers = async (req, res) => {
    try {
        const isAdmin = req.isAdmin;
        const { role, page = '1', limit = '12', search = '', specialty = '', sort = 'latest' } = req.query;
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
        const filter = {};
        if (!isAdmin) {
            filter.role = 'professional';
            filter.isActive = true;
            filter.is_verified = true;
        }
        else {
            if (role)
                filter.role = role;
        }
        if (search) {
            filter.$or = [
                { nom: { $regex: search, $options: 'i' } },
                { specialite: { $regex: search, $options: 'i' } }
            ];
        }
        if (specialty) {
            filter.specialite = { $regex: `^${specialty}$`, $options: 'i' };
        }
        let sortBy = { createdAt: -1 };
        if (sort === 'name_asc')
            sortBy = { nom: 1 };
        else if (sort === 'name_desc')
            sortBy = { nom: -1 };
        else if (sort === 'latest')
            sortBy = { createdAt: -1 };
        const [total, users] = await Promise.all([
            user_model_1.default.countDocuments(filter),
            user_model_1.default.find(filter)
                .select('-mdp -__v -stripeCustomerId')
                .sort(sortBy)
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
        ]);
        res.json({
            success: true,
            data: users,
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
        });
    }
    catch (error) {
        console.error('Erreur getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=user.controller.js.map