import { Request, Response } from 'express';
import { PostService } from './post.service';
import { SocketIORequest } from '../community.types';
import { getIOInstance } from '../../socket';

export const createPost = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    const { content, isAnonymous, sharedContent } = req.body as {
      content: string,
      isAnonymous?: boolean,
      sharedContent?: any
    };

    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé' });
      return;
    }

    const post = await PostService.createPost({ content, isAnonymous, sharedContent }, req.user, getIOInstance());

    res.status(201).json({
      success: true,
      post: {
        ...post.toObject(),
        user: {
          _id: req.user._id,
          nom: req.user.nom,
          photo: req.user.photo,
          role: req.user.role
        }
      }
    });

  } catch (error: any) {
    console.error('Erreur création de post:', {
      error: error.message,
      user: req.user?._id
    });

    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

export const addLike = async (req: SocketIORequest, res: Response): Promise<void> => {
  const postId = req.params.postId;

  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé' });
      return;
    }

    const userId = req.user._id;

    if (!postId) {
      res.status(400).json({
        success: false,
        message: 'postId est requis dans les paramètres de la requête'
      });
      return;
    }

    const post = await PostService.addLike(postId, userId, getIOInstance());

    res.json({
      success: true,
      post
    });

  } catch (error: any) {
    console.error('[ERREUR LIKE]', {
      error: error.message,
      postId,
      userId: req.user?._id
    });

    const status = error.message === 'Post introuvable' ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await PostService.getAllPosts();
    res.json(posts);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyPosts = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé' });
      return;
    }
    const posts = await PostService.getMyPosts(req.user._id as any);
    res.json(posts);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSavedPosts = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé' });
      return;
    }
    const posts = await PostService.getFavoritePosts(req.user._id as any);
    res.json(posts);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLikedPosts = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé' });
      return;
    }
    const posts = await PostService.getLikedPosts(req.user._id as any);
    res.json(posts);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCommentedPosts = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé' });
      return;
    }
    const posts = await PostService.getCommentedPosts(req.user._id as any);
    res.json(posts);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePost = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé' });
      return;
    }

    const { postId } = req.params;
    const { content } = req.body as { content: string };
    const userId = req.user._id;

    const post = await PostService.updatePost(postId, { content }, userId);

    // Correction : récupérer le post avec les données utilisateur
    const populatedPost = await post.populate('user', 'nom photo role');

    res.json({
      success: true,
      post: populatedPost
    });

  } catch (error: any) {
    console.error('Erreur modification post:', error);

    const status = error.message === 'Post non trouvé' ? 404 :
      error.message === 'Non autorisé' ? 403 : 500;

    res.status(status).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

export const deletePost = async (req: SocketIORequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé' });
      return;
    }

    const { postId } = req.params;
    const userId = req.user._id;

    await PostService.deletePost(postId, userId);

    res.json({
      success: true,
      message: 'Post supprimé avec succès'
    });

  } catch (error: any) {
    console.error('Erreur suppression post:', error);

    const status = error.message === 'Post non trouvé' ? 404 :
      error.message === 'Non autorisé' ? 403 : 500;

    res.status(status).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

export const searchPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query as { query: string };
    if (!query) {
      res.status(400).json({ message: 'Le paramètre query est requis' });
      return;
    }

    const posts = await PostService.searchPosts(query);
    res.json(posts);
  } catch (error: any) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getPopularHashtags = async (req: Request, res: Response): Promise<void> => {
  try {
    const hashtags = await PostService.getPopularHashtags();
    res.json(hashtags);
  } catch (error: any) {
    console.error('Erreur récupération hashtags:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

export const getPostLikers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const likers = await PostService.getPostLikers(postId);
    res.json(likers);
  } catch (error: any) {
    console.error('Erreur récupération likers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const post = await PostService.getPostById(postId);
    if (!post) {
      res.status(404).json({ success: false, message: 'Post non trouvé' });
      return;
    }
    res.json(post);
  } catch (error: any) {
    console.error('Erreur récupération post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};