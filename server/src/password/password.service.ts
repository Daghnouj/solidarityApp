import bcrypt from 'bcryptjs';
import { redisConfig } from '../../config/redis';
import User from '../user/user.model';
import Admin from '../admin/admin.model';
import { PasswordUser, OTPData } from './password.types';

export class PasswordService {
  public static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  public async storeOTP(userId: string, email: string, otp: string, userType: 'user' | 'admin'): Promise<void> {
    try {
      await redisConfig.connect();
      const client = redisConfig.getClient();

      const otpData: OTPData = {
        code: otp,
        createdAt: new Date(),
        attempts: 0,
        email,
        userId,
        userType
      };

      await client.setEx(
        `otp:${userType}:${userId}`,
        600, // 10 minutes
        JSON.stringify(otpData)
      );
      
      console.log(`✅ OTP stored for ${userType} ${userId}`);
    } catch (error) {
      console.error('❌ Error storing OTP in Redis:', error);
      throw new Error('Erreur lors du stockage de l\'OTP');
    }
  }

  public async verifyOTP(userId: string, submittedOTP: string, userType: 'user' | 'admin'): Promise<{ isValid: boolean; message: string }> {
    try {
      await redisConfig.connect();
      const client = redisConfig.getClient();

      const stored = await client.get(`otp:${userType}:${userId}`);
      if (!stored) {
        return { isValid: false, message: "OTP expiré ou non trouvé." };
      }

      const otpData: OTPData = JSON.parse(stored);

      // Vérifier si l'OTP a expiré
      const now = new Date();
      const createdAt = new Date(otpData.createdAt);
      const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
      
      if (diffInMinutes > 10) {
        await client.del(`otp:${userType}:${userId}`);
        return { isValid: false, message: "OTP expiré." };
      }

      // Vérifier les tentatives
      if (otpData.attempts >= 3) {
        await client.del(`otp:${userType}:${userId}`);
        return { isValid: false, message: "Trop de tentatives. OTP invalidé." };
      }

      if (otpData.code !== submittedOTP) {
        // Incrémenter les tentatives
        otpData.attempts++;
        await client.setEx(
          `otp:${userType}:${userId}`,
          Math.max(600 - Math.floor(diffInMinutes * 60), 60),
          JSON.stringify(otpData)
        );
        return { isValid: false, message: "OTP incorrect." };
      }

      // OTP valide - créer un token de session
      const sessionToken = await bcrypt.hash(`${userId}-${Date.now()}`, 8);
      await client.setEx(
        `pwd_change:${userType}:${userId}`,
        300, // 5 minutes pour changer le mot de passe
        sessionToken
      );

      await client.del(`otp:${userType}:${userId}`);
      
      return { 
        isValid: true, 
        message: "OTP vérifié avec succès.",
      };
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      return { isValid: false, message: "Erreur lors de la vérification de l'OTP" };
    }
  }

  public async changePassword(userId: string, newPassword: string, userType: 'user' | 'admin'): Promise<void> {
    try {
      await redisConfig.connect();
      const client = redisConfig.getClient();

      // Vérifier la session de changement de mot de passe
      const sessionToken = await client.get(`pwd_change:${userType}:${userId}`);
      if (!sessionToken) {
        throw new Error("Session de changement de mot de passe expirée ou invalide.");
      }

      const user = await this.findUserById(userId, userType);
      if (!user) {
        throw new Error("Utilisateur non trouvé.");
      }

      // Vérifier si le mot de passe est différent de l'ancien
      if (user.mdp && await bcrypt.compare(newPassword, user.mdp)) {
        throw new Error("Le nouveau mot de passe doit être différent de l'ancien.");
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.mdp = hashedPassword;
      await user.save();

      // Nettoyer les tokens
      await client.del(`pwd_change:${userType}:${userId}`);
      await client.del(`otp:${userType}:${userId}`);

      console.log(`✅ Password changed for ${userType} ${userId}`);
    } catch (error) {
      console.error('❌ Error changing password:', error);
      throw error;
    }
  }

  public async findUserByEmail(email: string, userType: 'user' | 'admin'): Promise<PasswordUser | null> {
    if (userType === 'admin') {
      return await Admin.findOne({ email });
    }
    return await User.findOne({ email, isActive: true });
  }

  public async findUserById(id: string, userType: 'user' | 'admin'): Promise<PasswordUser | null> {
    if (userType === 'admin') {
      return await Admin.findById(id);
    }
    return await User.findById(id);
  }

  public async healthCheck(): Promise<boolean> {
    return await redisConfig.healthCheck();
  }
}

export const passwordService = new PasswordService();