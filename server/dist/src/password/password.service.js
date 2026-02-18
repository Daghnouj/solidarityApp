"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordService = exports.PasswordService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const redis_1 = require("../../config/redis");
const user_model_1 = __importDefault(require("../user/user.model"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
class PasswordService {
    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async storeOTP(userId, email, otp, userType) {
        try {
            await redis_1.redisConfig.connect();
            const client = redis_1.redisConfig.getClient();
            const otpData = {
                code: otp,
                createdAt: new Date(),
                attempts: 0,
                email,
                userId,
                userType
            };
            await client.setEx(`otp:${userType}:${userId}`, 600, JSON.stringify(otpData));
            console.log(`✅ OTP stored for ${userType} ${userId}`);
        }
        catch (error) {
            console.error('❌ Error storing OTP in Redis:', error);
            throw new Error('Erreur lors du stockage de l\'OTP');
        }
    }
    async verifyOTP(userId, submittedOTP, userType) {
        try {
            await redis_1.redisConfig.connect();
            const client = redis_1.redisConfig.getClient();
            const stored = await client.get(`otp:${userType}:${userId}`);
            if (!stored) {
                return { isValid: false, message: "OTP expiré ou non trouvé." };
            }
            const otpData = JSON.parse(stored);
            const now = new Date();
            const createdAt = new Date(otpData.createdAt);
            const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
            if (diffInMinutes > 10) {
                await client.del(`otp:${userType}:${userId}`);
                return { isValid: false, message: "OTP expiré." };
            }
            if (otpData.attempts >= 3) {
                await client.del(`otp:${userType}:${userId}`);
                return { isValid: false, message: "Trop de tentatives. OTP invalidé." };
            }
            if (otpData.code !== submittedOTP) {
                otpData.attempts++;
                await client.setEx(`otp:${userType}:${userId}`, Math.max(600 - Math.floor(diffInMinutes * 60), 60), JSON.stringify(otpData));
                return { isValid: false, message: "OTP incorrect." };
            }
            const sessionToken = await bcryptjs_1.default.hash(`${userId}-${Date.now()}`, 8);
            await client.setEx(`pwd_change:${userType}:${userId}`, 300, sessionToken);
            await client.del(`otp:${userType}:${userId}`);
            return {
                isValid: true,
                message: "OTP vérifié avec succès.",
            };
        }
        catch (error) {
            console.error('❌ Error verifying OTP:', error);
            return { isValid: false, message: "Erreur lors de la vérification de l'OTP" };
        }
    }
    async changePassword(userId, newPassword, userType) {
        try {
            await redis_1.redisConfig.connect();
            const client = redis_1.redisConfig.getClient();
            const sessionToken = await client.get(`pwd_change:${userType}:${userId}`);
            if (!sessionToken) {
                throw new Error("Session de changement de mot de passe expirée ou invalide.");
            }
            const user = await this.findUserById(userId, userType);
            if (!user) {
                throw new Error("Utilisateur non trouvé.");
            }
            if (user.mdp && await bcryptjs_1.default.compare(newPassword, user.mdp)) {
                throw new Error("Le nouveau mot de passe doit être différent de l'ancien.");
            }
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
            user.mdp = hashedPassword;
            await user.save();
            await client.del(`pwd_change:${userType}:${userId}`);
            await client.del(`otp:${userType}:${userId}`);
            console.log(`✅ Password changed for ${userType} ${userId}`);
        }
        catch (error) {
            console.error('❌ Error changing password:', error);
            throw error;
        }
    }
    async findUserByEmail(email, userType) {
        if (userType === 'admin') {
            return await admin_model_1.default.findOne({ email });
        }
        return await user_model_1.default.findOne({ email, isActive: true });
    }
    async findUserById(id, userType) {
        if (userType === 'admin') {
            return await admin_model_1.default.findById(id);
        }
        return await user_model_1.default.findById(id);
    }
    async healthCheck() {
        return await redis_1.redisConfig.healthCheck();
    }
}
exports.PasswordService = PasswordService;
exports.passwordService = new PasswordService();
//# sourceMappingURL=password.service.js.map