import { Request, Response, NextFunction } from 'express';
import User from '../user/user.model';
import Admin from '../admin/admin.model';
import BlogArticle from './blog.model';

/**
 * Middleware pour vérifier si l'utilisateur peut créer un article
 * Seuls les admins et les professionnels peuvent créer des articles
 */
export const canCreateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as any)?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Vérifier si c'est un admin
        const admin = await Admin.findById(userId);
        if (admin) {
            (req.user as any).role = 'admin';
            return next();
        }

        // Vérifier si c'est un professionnel
        const user = await User.findById(userId);
        if (user && user.role === 'professional') {
            (req.user as any).role = 'professional';
            return next();
        }

        return res.status(403).json({
            message: 'Access denied. Only administrators and professionals can create articles.'
        });
    } catch (error) {
        console.error('Error in canCreateArticle:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Middleware pour vérifier si l'utilisateur est l'auteur de l'article
 * ou un admin
 */
export const isArticleAuthorOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as any)?._id;
        const articleId = req.params.id;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Vérifier si c'est un admin
        const admin = await Admin.findById(userId);
        if (admin) {
            return next();
        }

        // Vérifier si c'est l'auteur de l'article
        const article = await BlogArticle.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (article.author.toString() === userId) {
            return next();
        }

        return res.status(403).json({
            message: 'Access denied. You are not the author of this article.'
        });
    } catch (error) {
        console.error('Error in isArticleAuthorOrAdmin:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Middleware pour valider les données d'un article
 */
export const validateArticleData = (req: Request, res: Response, next: NextFunction) => {
    console.log('--- VALIDATING ARTICLE DATA ---');
    console.log('Body:', req.body);
    const { title, content, excerpt, category } = req.body;

    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
        errors.push('Title is required');
    } else if (title.length > 200) {
        errors.push('Title cannot exceed 200 characters');
    }

    if (!content || content.trim().length === 0) {
        errors.push('Content is required');
    }

    if (!excerpt || excerpt.trim().length === 0) {
        errors.push('Excerpt is required');
    } else if (excerpt.length > 300) {
        errors.push('Excerpt cannot exceed 300 characters');
    }

    if (!category) {
        errors.push('Category is required');
    } else {
        const validCategories = [
            'Mental Well-being',
            'Stress Management',
            'Therapy & Coaching',
            'Social Relations',
            'Personal Development',
            'News',
            'Testimonials'
        ];
        if (!validCategories.includes(category)) {
            errors.push('Invalid category');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Invalid data', errors });
    }

    next();
};

/**
 * Middleware pour valider les données d'un commentaire
 */
export const validateCommentData = (req: Request, res: Response, next: NextFunction) => {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    if (text.length > 1000) {
        return res.status(400).json({ message: 'Comment cannot exceed 1000 characters' });
    }

    next();
};
