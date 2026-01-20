import { Request, Response } from 'express';
import { FavorisService } from './favorites.service';
import { SocketIORequest } from '../community.types';

export const toggleFavorite = async (req: SocketIORequest, res: Response): Promise<void> => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    const result = await FavorisService.toggleFavorite(postId, userId);

    res.json(result);

  } catch (error: any) {
    console.error('Erreur toggle favori:', error);
    
    const status = error.message === 'Post non trouvé' ? 404 : 500;
    res.status(status).json({ 
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

