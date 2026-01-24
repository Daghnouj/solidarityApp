
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../src/user/user.model';
import { ProtectedRequest } from '../src/types/express';
import { env } from '../config/env';

interface JwtPayload {
  id: string;
  role: string;
}

const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Récupération du token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Accès non autorisé. Token manquant."
      });
      return;
    }

    // Vérification du token
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Récupération de l'utilisateur
    const user = await User.findById(decoded.id).select("-mdp");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Token invalide. Utilisateur non trouvé."
      });
      return;
    }

    // Vérification si le compte est actif
    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Compte désactivé. Contactez l'administrateur."
      });
      return;
    }

    // Ajout de l'utilisateur à la requête
    (req as ProtectedRequest).user = user;
    next();
  } catch (error: any) {
    console.error("❌ Erreur d'authentification:", error);

    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: "Token invalide."
      });
    } else if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: "Token expiré."
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Erreur serveur lors de l'authentification."
      });
    }
  }
};

// Middleware pour gérer les rôles
const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Vérification que l'utilisateur existe (mis par protect)
    if (!(req as ProtectedRequest).user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié"
      });
    }

    if (!roles.includes((req as ProtectedRequest).user.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle ${(req as ProtectedRequest).user.role} n'est pas autorisé à accéder à cette route`
      });
    }
    next();
  };
};

export { protect, authorize };