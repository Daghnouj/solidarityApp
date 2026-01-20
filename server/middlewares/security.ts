// middlewares/security.ts - VERSION CORRIGÉE
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// 1. 🔒 Protection des headers avec Helmet
export const securityHeaders = helmet();

// 2. 🛡️ Limite les tentatives de connexion
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, 
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, réessayez dans 15 minutes'
  }
});

// 3. 📈 Limite générale des requêtes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max
  message: {
    success: false,
    message: 'Trop de requêtes, réessayez plus tard'
  }
});

// 4. 🚫 Protection SIMPLIFIÉE contre les injections NoSQL
export const noSqlInjectionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Nettoyage simple du body seulement (ne touche pas à query et params)
    const sanitizeBody = (body: any): any => {
      if (!body || typeof body !== 'object') return body;
      
      const sanitized: any = Array.isArray(body) ? [] : {};
      
      for (const [key, value] of Object.entries(body)) {
        // Supprime les opérateurs MongoDB dangereux
        if (typeof key === 'string' && key.startsWith('$')) {
          continue; // Ignore les clés qui commencent par $
        }
        
        // Récursivement nettoie les objets imbriqués
        if (value && typeof value === 'object') {
          sanitized[key] = sanitizeBody(value);
        } else {
          sanitized[key] = value;
        }
      }
      
      return sanitized;
    };

    // Applique le nettoyage au body seulement
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeBody(req.body);
    }

    next();
  } catch (error) {
    // En cas d'erreur, on passe simplement au next middleware
    console.warn('⚠️ Erreur lors du nettoyage NoSQL:', error);
    next();
  }
};

// 5. 📏 Limite la taille des données
export const payloadSizeLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const contentLength = parseInt(req.get('Content-Length') || '0');
  
  if (contentLength > 10 * 1024 * 1024) { // 10MB max
    res.status(413).json({
      success: false,
      message: 'Fichier trop volumineux. Maximum 10MB autorisé.'
    });
    return;
  }
  
  next();
};

// 6. 🛡️ Ensemble de sécurité de base
export const basicSecurity = [
  securityHeaders,
  payloadSizeLimiter
  // On retire noSqlInjectionMiddleware de base pour éviter les conflits
];  