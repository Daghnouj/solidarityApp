import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../src/admin/admin.model';
import { env } from '../config/env';
import { AdminRequest } from '../src/admin/admin.types';

interface AdminJwtPayload {
  id: string;
  role: string;
}

export const protectAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ 
        success: false,
        message: "Accès non autorisé. Token admin manquant." 
      });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as AdminJwtPayload;
    
    if (decoded.role !== 'admin') {
      res.status(403).json({ 
        success: false,
        message: "Accès réservé aux administrateurs." 
      });
      return;
    }

    const admin = await Admin.findById(decoded.id).select("-mdp");
    if (!admin) {
      res.status(401).json({ 
        success: false,
        message: "Token admin invalide. Administrateur non trouvé." 
      });
      return;
    }

    // CORRECTION : Utiliser admin au lieu de adminUser
    (req as AdminRequest).admin = {
      id: admin._id.toString(),
      role: 'admin'
    };
    
    next();
  } catch (error: any) {
    console.error("❌ Erreur d'authentification admin:", error);
    
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ 
        success: false,
        message: "Token admin invalide." 
      });
    } else if (error.name === 'TokenExpiredError') {
      res.status(401).json({ 
        success: false,
        message: "Token admin expiré." 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "Erreur serveur lors de l'authentification admin." 
      });
    }
  }
};