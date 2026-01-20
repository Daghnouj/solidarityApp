import { Request, Response } from 'express';
import { emailService } from '../email/email.service';
import { 
  ForgotPasswordRequest, 
  VerifyOTPRequest, 
  ChangePasswordRequest, 
  PasswordResponse 
} from './password.types';
import { passwordService, PasswordService } from './password.service';

export class PasswordController {
  public forgotPassword = async (req: Request<{}, {}, ForgotPasswordRequest>, res: Response): Promise<void> => {
    try {
      const { email, userType } = req.body;

      if (!email || !userType) {
        res.status(400).json({ 
          success: false, 
          message: "Email et type d'utilisateur requis" 
        });
        return;
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ 
          success: false, 
          message: "Format d'email invalide" 
        });
        return;
      }

      // Validation userType
      if (!['user', 'admin'].includes(userType)) {
        res.status(400).json({ 
          success: false, 
          message: "Type d'utilisateur invalide" 
        });
        return;
      }

      // Vérifier l'utilisateur/admin
      const user = await passwordService.findUserByEmail(email, userType);
      if (!user) {
        // Sécurité : ne pas révéler si l'email existe
        res.json({ 
          success: true, 
          message: "Si l'email existe, un OTP a été envoyé." 
        });
        return;
      }

      // Vérifier OAuth seulement pour les users
      if (userType === 'user' && (user as any).oauthProvider !== 'local') {
        res.status(400).json({ 
          success: false, 
          message: `Ce compte utilise l'authentification ${(user as any).oauthProvider}.` 
        });
        return;
      }

      // Générer et stocker OTP
      const otp = PasswordService.generateOTP();
      await passwordService.storeOTP(user._id.toString(), email, otp, userType);

      // Envoyer email
      await emailService.sendOTPEmail(email, otp, user.nom);

      console.log(`✅ OTP sent to ${email} for ${userType} ${user._id}`);

      res.json({ 
        success: true, 
        message: "Si l'email existe, un OTP a été envoyé.", 
        id: user._id.toString() 
      });

    } catch (error) {
      console.error("❌ Erreur dans forgotPassword:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erreur lors de la demande de réinitialisation" 
      });
    }
  };

  public verifyOTP = async (req: Request<{ id: string }, {}, VerifyOTPRequest>, res: Response): Promise<void> => {
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

      // Validation OTP
      const otpRegex = /^\d{6}$/;
      if (!otpRegex.test(otp)) {
        res.status(400).json({ 
          success: false, 
          message: "L'OTP doit contenir 6 chiffres." 
        });
        return;
      }

      // Validation userType
      if (!['user', 'admin'].includes(userType)) {
        res.status(400).json({ 
          success: false, 
          message: "Type d'utilisateur invalide" 
        });
        return;
      }

      const user = await passwordService.findUserById(id, userType);
      if (!user) {
        res.status(404).json({ 
          success: false, 
          message: "Utilisateur non trouvé." 
        });
        return;
      }

      const result = await passwordService.verifyOTP(id, otp, userType);

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

    } catch (error) {
      console.error("❌ Erreur dans verifyOTP:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erreur lors de la vérification de l'OTP" 
      });
    }
  };

  public changePassword = async (req: Request<{ id: string }, {}, ChangePasswordRequest>, res: Response): Promise<void> => {
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

      // Validation userType
      if (!['user', 'admin'].includes(userType)) {
        res.status(400).json({ 
          success: false, 
          message: "Type d'utilisateur invalide" 
        });
        return;
      }

      const user = await passwordService.findUserById(id, userType);
      if (!user) {
        res.status(404).json({ 
          success: false, 
          message: "Utilisateur non trouvé." 
        });
        return;
      }

      await passwordService.changePassword(id, newPassword, userType);

      console.log(`✅ Password changed successfully for ${userType} ${id}`);

      res.json({ 
        success: true, 
        message: "Mot de passe modifié avec succès." 
      });

    } catch (error: any) {
      console.error("❌ Erreur dans changePassword:", error);
      
      let errorMessage = "Erreur lors du changement du mot de passe";
      if (error.message.includes("Session de changement")) {
        errorMessage = error.message;
      } else if (error.message.includes("différent de l'ancien")) {
        errorMessage = error.message;
      }

      res.status(400).json({ 
        success: false, 
        message: errorMessage 
      });
    }
  };

  public healthCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      const redisHealth = await passwordService.healthCheck();
      const emailHealth = await emailService.verifyConfig();
      
      res.json({
        success: true,
        message: "Password service health check",
        data: {
          redis: redisHealth ? "healthy" : "unhealthy",
          email: emailHealth ? "healthy" : "unhealthy",
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Password service health check failed"
      });
    }
  };
}

export const passwordController = new PasswordController();