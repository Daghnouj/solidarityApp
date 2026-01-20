import { Request, Response, NextFunction } from 'express';
import galerieService from './gallery.service'; // Import par défaut

// Middleware pour vérifier si une galerie existe
export const checkGalerieExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const galerie = await galerieService.getGalerieById(id); // Utilisez l'instance
    
    if (!galerie) {
      res.status(404).json({
        success: false,
        message: 'Galerie non trouvée'
      });
      return;
    }
    
    (req as any).galerie = galerie;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Middleware pour valider les données de création
export const validateCreateGalerie = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { titre, desc, video, categorie } = req.body;
  
  if (!titre || !desc || !video || !categorie) {
    res.status(400).json({
      success: false,
      message: 'Tous les champs sont requis'
    });
    return;
  }
  
  next();
};

// Middleware pour valider les données de mise à jour
export const validateUpdateGalerie = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { titre, desc, video, categorie } = req.body;
  
  if (!titre && !desc && !video && !categorie) {
    res.status(400).json({
      success: false,
      message: 'Au moins un champ doit être fourni pour la mise à jour'
    });
    return;
  }
  
  next();
};