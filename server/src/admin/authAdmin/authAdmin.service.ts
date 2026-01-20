import { Admin, AdminDocument } from '../admin.model';
import { AdminSignupDTO, AdminLoginDTO, AuthResponse } from '../admin.types';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';

export class AuthAdminService {
  static async signup(adminData: AdminSignupDTO): Promise<{ admin: AdminDocument; token: string }> {
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      throw new Error('Admin existe déjà');
    }

    const admin = new Admin(adminData);
    await admin.save();

    const token = this.generateToken(admin);
    return { admin, token };
  }

  static async login(loginData: AdminLoginDTO): Promise<{ admin: AdminDocument; token: string }> {
    const admin = await Admin.findOne({ email: loginData.email });
    if (!admin) {
      throw new Error('Admin non trouvé');
    }

    // Maintenant TypeScript reconnaît comparePassword
    const isMatch = await admin.comparePassword(loginData.mdp);
    if (!isMatch) {
      throw new Error('Mot de passe incorrect');
    }

    const token = this.generateToken(admin);
    return { admin, token };
  }

  static async logout(): Promise<{ message: string }> {
    return { message: 'Déconnexion réussie' };
  }

  private static generateToken(admin: AdminDocument): string {
    return jwt.sign(
      { id: admin._id, role: "admin" }, 
      env.JWT_SECRET, 
      { expiresIn: "7d" }
    );
  }
}