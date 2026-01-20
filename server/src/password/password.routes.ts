import { Router } from 'express';
import { passwordController } from './password.controller';

const router = Router();

/**
 * @route POST /api/auth/password/forgot-password
 * @description Demander une réinitialisation de mot de passe
 * @body { email: string }
 */
router.post("/forgot-password", passwordController.forgotPassword);

/**
 * @route POST /api/auth/password/verify-otp/:id
 * @description Vérifier l'OTP
 * @param {string} id - ID de l'utilisateur
 * @body { otp: string }
 */
router.post("/verify-otp/:id", passwordController.verifyOTP);

/**
 * @route POST /api/auth/password/change-password/:id
 * @description Changer le mot de passe après vérification OTP
 * @param {string} id - ID de l'utilisateur
 * @body { newPassword: string, confirmPassword: string }
 */
router.post("/change-password/:id", passwordController.changePassword);
 
/**
 * @route GET /api/auth/password/health
 * @description Vérifier la santé du service password
 */
router.get("/health", passwordController.healthCheck);

export default router;