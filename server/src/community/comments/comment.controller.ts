import { Request, Response } from 'express';
import { SocketIORequest } from '../community.types';
import { CommentService } from './comments.service';

export const addComment = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé' });
      return;
    }

    const { postId } = req.params;
    const { comment } = req.body as { comment: string };
    const userId = req.user._id;

    const result = await CommentService.addComment(
      postId, 
      { comment }, 
      userId, 
      req.io
    );

    res.status(201).json({
      success: true,
      comment: result
    });

  } catch (error: any) {
    console.error('Erreur commentaire:', error);
    
    const status = error.message === 'Post non trouvé' ? 404 : 500;
    res.status(status).json({ 
      success: false, 
      message: error.message || 'Erreur serveur' 
    });
  }
};

export const addReply = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    const { postId, commentId } = req.params;
    const { replyText } = req.body;
    const userId = req.user._id;

    const result = await CommentService.addReply(
      postId, 
      commentId, 
      { replyText }, 
      userId, 
      req.io
    );

    res.status(201).json({
      success: true,
      reply: result
    });

  } catch (error: any) {
    console.error('Erreur réponse:', error);
    
    const status = error.message.includes('non trouvé') ? 404 : 500;
    res.status(status).json({ 
      success: false, 
      message: error.message || 'Erreur serveur' 
    });
  }
};

export const updateComment = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    const { postId, commentId } = req.params;
    const { newText } = req.body;
    const userId = req.user._id;

    const result = await CommentService.updateComment(
      postId, 
      commentId, 
      { newText }, 
      userId
    );

    res.json({ 
      success: true,
      comment: result
    });

  } catch (error: any) {
    console.error('Erreur modification commentaire:', error);
    
    const status = error.message === 'Non autorisé' ? 403 : 
                  error.message.includes('non trouvé') ? 404 : 500;
    
    res.status(status).json({ 
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

export const deleteComment = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    await CommentService.deleteComment(postId, commentId, userId);

    res.json({ 
      success: true, 
      message: 'Commentaire supprimé' 
    });

  } catch (error: any) {
    console.error('Erreur suppression commentaire:', error);
    
    const status = error.message === 'Non autorisé' ? 403 : 
                  error.message.includes('non trouvé') ? 404 : 500;
    
    res.status(status).json({ 
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

export const updateReply = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    const { postId, commentId, replyId } = req.params;
    const { newText } = req.body;
    const userId = req.user._id;

    const result = await CommentService.updateReply(
      postId, 
      commentId, 
      replyId, 
      { newText }, 
      userId
    );

    res.json({ 
      success: true,
      reply: result
    });

  } catch (error: any) {
    console.error('Erreur modification réponse:', error);
    
    const status = error.message === 'Non autorisé' ? 403 : 
                  error.message.includes('non trouvé') ? 404 : 500;
    
    res.status(status).json({ 
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

export const deleteReply = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    const { postId, commentId, replyId } = req.params;
    const userId = req.user._id;

    await CommentService.deleteReply(postId, commentId, replyId, userId);

    res.json({ 
      success: true, 
      message: 'Réponse supprimée' 
    });

  } catch (error: any) {
    console.error('Erreur suppression réponse:', error);
    
    const status = error.message === 'Non autorisé' ? 403 : 
                  error.message.includes('non trouvé') ? 404 : 500;
    
    res.status(status).json({ 
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};