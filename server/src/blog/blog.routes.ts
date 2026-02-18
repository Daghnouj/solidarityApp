import { Router } from 'express';
import blogController from './blog.controller';
import { protect } from '../../middlewares/protect';
import { optionalProtect } from '../../middlewares/optionalProtect';
import {
    canCreateArticle,
    isArticleAuthorOrAdmin,
    validateArticleData,
    validateCommentData
} from './blog.middlewares';
import { uploadBlogImage } from '../../config/cloudinary/cloudinary';

const router = Router();

// ============================================
// Public routes (optional authentication)
// ============================================

/**
 * GET /api/blog
 * Get list of published articles
 */
router.get('/', optionalProtect, blogController.getArticles);

/**
 * GET /api/blog/featured
 * Get featured articles
 */
router.get('/featured', blogController.getFeaturedArticles);

/**
 * GET /api/blog/categories
 * Get all categories with article count
 */
router.get('/categories', blogController.getCategories);

/**
 * GET /api/blog/tags
 * Get all tags with article count
 */
router.get('/tags', blogController.getTags);

/**
 * GET /api/blog/:slug
 * Get article by slug
 */
router.get('/:slug', optionalProtect, blogController.getArticleBySlug);

/**
 * GET /api/blog/:id/similar
 * Get similar articles
 */
router.get('/:id/similar', blogController.getSimilarArticles);

/**
 * GET /api/blog/:id/stats
 * Get article statistics
 */
router.get('/:id/stats', blogController.getArticleStats);

// ============================================
// Private routes (authentication required)
// ============================================

/**
 * POST /api/blog
 * Create a new article (admin/pro only)
 */
router.post(
    '/',
    protect,
    canCreateArticle,
    uploadBlogImage.single('coverImage'),
    validateArticleData,
    blogController.createArticle
);

/**
 * GET /api/blog/edit/:id
 * Get article by ID for editing
 */
router.get('/edit/:id', protect, blogController.getArticleById);

/**
 * PUT /api/blog/:id
 * Update an article (author or admin only)
 */
router.put(
    '/:id',
    protect,
    isArticleAuthorOrAdmin,
    uploadBlogImage.single('coverImage'),
    validateArticleData,
    blogController.updateArticle
);

/**
 * DELETE /api/blog/:id
 * Delete an article (author or admin only)
 */
router.delete(
    '/:id',
    protect,
    isArticleAuthorOrAdmin,
    blogController.deleteArticle
);

/**
 * POST /api/blog/:id/like
 * Like/Unlike an article
 */
router.post('/:id/like', protect, blogController.toggleLike);

/**
 * POST /api/blog/:id/comment
 * Add a comment
 */
router.post(
    '/:id/comment',
    protect,
    validateCommentData,
    blogController.addComment
);

/**
 * DELETE /api/blog/:id/comment/:commentId
 * Delete a comment (comment author or admin)
 */
router.delete(
    '/:id/comment/:commentId',
    protect,
    blogController.deleteComment
);

export default router;
