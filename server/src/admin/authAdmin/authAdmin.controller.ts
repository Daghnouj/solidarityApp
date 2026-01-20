import { Request, Response } from 'express';
import { AuthAdminService } from './authAdmin.service';
import { AdminSignupDTO, AdminLoginDTO, AuthResponse } from '../admin.types';

export class AuthAdminController {
  static async signup(req: Request, res: Response) {
    try {
      const adminData: AdminSignupDTO = req.body;
      const { admin, token } = await AuthAdminService.signup(adminData);

      const response: AuthResponse = {
        token,
        role: 'admin',
        admin: {
          id: admin._id.toString(),
          nom: admin.nom,
          email: admin.email,
          phone: admin.phone,
          photo: admin.photo
        }
      };

      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ 
        message: error.message || 'Erreur lors de l\'inscription',
        error: error.message 
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const loginData: AdminLoginDTO = req.body;
      const { admin, token } = await AuthAdminService.login(loginData);

      const response: AuthResponse = {
        token,
        role: 'admin',
        admin: {
          id: admin._id.toString(),
          nom: admin.nom,
          email: admin.email,
          phone: admin.phone,
          photo: admin.photo
        }
      };

      res.json(response);
    } catch (error: any) {
      res.status(400).json({ 
        message: error.message || 'Erreur lors de la connexion',
        error: error.message 
      });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const result = await AuthAdminService.logout();
      res.clearCookie("token");
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || 'Erreur serveur',
        error: error.message 
      });
    }
  }
}