import { Request, Response, NextFunction } from 'express';

// Gestion centralisée des erreurs
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('💥 Erreur:', error);

  // Erreur de validation
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Données invalides'
    });
    return;
  }

  // Erreur JWT
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
    return;
  }

  // Erreur MongoDB duplicate
  if (error.code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Donnée déjà existante'
    });
    return;
  }

  // Erreur par défaut
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
};

// Route non trouvée
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
};