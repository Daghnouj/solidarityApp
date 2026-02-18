"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const user_model_1 = __importDefault(require("../../user/user.model"));
const request_model_1 = __importDefault(require("../../request/request.model"));
const email_service_1 = require("../../email/email.service");
class VerificationService {
    static async verifyProfessional(professionalId, io) {
        const user = await user_model_1.default.findByIdAndUpdate(professionalId, {
            is_verified: true,
            verification_status: 'approved',
            rejection_reason: null
        }, { new: true, runValidators: true });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        await email_service_1.emailService.sendVerificationEmail(user.email, user.nom);
        return user;
    }
    static async getUnverifiedProfessionalsRequests() {
        const requests = await request_model_1.default.find()
            .populate({
            path: 'professional',
            match: {
                is_verified: false,
                role: 'professional'
            },
            select: '-mdp'
        })
            .exec();
        return requests.filter(request => request.professional !== null);
    }
    static async getAllRequests() {
        const requests = await request_model_1.default.find()
            .populate({
            path: 'professional',
            match: { role: 'professional' },
            select: '-mdp'
        })
            .sort({ createdAt: -1 })
            .exec();
        return requests.filter(request => request.professional !== null);
    }
    static async getRequestById(requestId) {
        const request = await request_model_1.default.findById(requestId)
            .populate({
            path: 'professional',
            select: '-mdp'
        })
            .exec();
        if (!request) {
            throw new Error('Requête non trouvée');
        }
        return request;
    }
    static async rejectProfessional(professionalId, reason, io) {
        const user = await user_model_1.default.findByIdAndUpdate(professionalId, {
            is_verified: false,
            verification_status: 'rejected',
            rejection_reason: reason
        }, { new: true, runValidators: true });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        await email_service_1.emailService.sendRejectionEmail(user.email, user.nom, reason);
        return user;
    }
    static async getProfessionalDetails(professionalId) {
        const user = await user_model_1.default.findById(professionalId).select('-mdp');
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return user;
    }
}
exports.VerificationService = VerificationService;
//# sourceMappingURL=verification.service.js.map