"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordController = exports.PasswordController = void 0;
const email_service_1 = require("../email/email.service");
const password_service_1 = require("./password.service");
class PasswordController {
    constructor() {
        this.forgotPassword = async (req, res) => {
            try {
                const { email, userType } = req.body;
                if (!email || !userType) {
                    res.status(400).json({
                        success: false,
                        message: "Email et type d'utilisateur requis"
                    });
                    return;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    res.status(400).json({
                        success: false,
                        message: "Format d'email invalide"
                    });
                    return;
                }
                if (!['user', 'admin'].includes(userType)) {
                    res.status(400).json({
                        success: false,
                        message: "Type d'utilisateur invalide"
                    });
                    return;
                }
                const user = await password_service_1.passwordService.findUserByEmail(email, userType);
                if (!user) {
                    res.json({
                        success: true,
                        message: "Si l'email existe, un OTP a été envoyé."
                    });
                    return;
                }
                if (userType === 'user' && user.oauthProvider !== 'local') {
                    res.status(400).json({
                        success: false,
                        message: `Ce compte utilise l'authentification ${user.oauthProvider}.`
                    });
                    return;
                }
                const otp = password_service_1.PasswordService.generateOTP();
                await password_service_1.passwordService.storeOTP(user._id.toString(), email, otp, userType);
                await email_service_1.emailService.sendOTPEmail(email, otp, user.nom);
                console.log(`✅ OTP sent to ${email} for ${userType} ${user._id}`);
                res.json({
                    success: true,
                    message: "Si l'email existe, un OTP a été envoyé.",
                    id: user._id.toString()
                });
            }
            catch (error) {
                console.error("❌ Erreur dans forgotPassword:", error);
                res.status(500).json({
                    success: false,
                    message: "Erreur lors de la demande de réinitialisation"
                });
            }
        };
        this.verifyOTP = async (req, res) => {
            try {
                const { id } = req.params;
                const { otp, userType } = req.body;
                if (!id || !otp || !userType) {
                    res.status(400).json({
                        success: false,
                        message: "ID, OTP et type d'utilisateur requis."
                    });
                    return;
                }
                const otpRegex = /^\d{6}$/;
                if (!otpRegex.test(otp)) {
                    res.status(400).json({
                        success: false,
                        message: "L'OTP doit contenir 6 chiffres."
                    });
                    return;
                }
                if (!['user', 'admin'].includes(userType)) {
                    res.status(400).json({
                        success: false,
                        message: "Type d'utilisateur invalide"
                    });
                    return;
                }
                const user = await password_service_1.passwordService.findUserById(id, userType);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: "Utilisateur non trouvé."
                    });
                    return;
                }
                const result = await password_service_1.passwordService.verifyOTP(id, otp, userType);
                if (!result.isValid) {
                    res.status(400).json({
                        success: false,
                        message: result.message
                    });
                    return;
                }
                res.json({
                    success: true,
                    message: result.message
                });
            }
            catch (error) {
                console.error("❌ Erreur dans verifyOTP:", error);
                res.status(500).json({
                    success: false,
                    message: "Erreur lors de la vérification de l'OTP"
                });
            }
        };
        this.changePassword = async (req, res) => {
            try {
                const { id } = req.params;
                const { newPassword, confirmPassword, userType } = req.body;
                if (!id || !newPassword || !confirmPassword || !userType) {
                    res.status(400).json({
                        success: false,
                        message: "ID, mot de passe, confirmation et type d'utilisateur requis."
                    });
                    return;
                }
                if (newPassword !== confirmPassword) {
                    res.status(400).json({
                        success: false,
                        message: "Les mots de passe ne correspondent pas."
                    });
                    return;
                }
                if (newPassword.length < 8) {
                    res.status(400).json({
                        success: false,
                        message: "Le mot de passe doit contenir au moins 8 caractères."
                    });
                    return;
                }
                if (!['user', 'admin'].includes(userType)) {
                    res.status(400).json({
                        success: false,
                        message: "Type d'utilisateur invalide"
                    });
                    return;
                }
                const user = await password_service_1.passwordService.findUserById(id, userType);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: "Utilisateur non trouvé."
                    });
                    return;
                }
                await password_service_1.passwordService.changePassword(id, newPassword, userType);
                console.log(`✅ Password changed successfully for ${userType} ${id}`);
                res.json({
                    success: true,
                    message: "Mot de passe modifié avec succès."
                });
            }
            catch (error) {
                console.error("❌ Erreur dans changePassword:", error);
                let errorMessage = "Erreur lors du changement du mot de passe";
                if (error.message.includes("Session de changement")) {
                    errorMessage = error.message;
                }
                else if (error.message.includes("différent de l'ancien")) {
                    errorMessage = error.message;
                }
                res.status(400).json({
                    success: false,
                    message: errorMessage
                });
            }
        };
        this.healthCheck = async (req, res) => {
            try {
                const redisHealth = await password_service_1.passwordService.healthCheck();
                const emailHealth = await email_service_1.emailService.verifyConfig();
                res.json({
                    success: true,
                    message: "Password service health check",
                    data: {
                        redis: redisHealth ? "healthy" : "unhealthy",
                        email: emailHealth ? "healthy" : "unhealthy",
                        timestamp: new Date().toISOString()
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Password service health check failed"
                });
            }
        };
    }
}
exports.PasswordController = PasswordController;
exports.passwordController = new PasswordController();
//# sourceMappingURL=password.controller.js.map