import { Request, Response } from 'express';
import blogService from './blog.service';
import { CreateBlogArticleDTO, UpdateBlogArticleDTO, AddCommentDTO, BlogQueryOptions } from './blog.types';
import User from '../user/user.model';
import Admin from '../admin/admin.model';

class BlogController {
    /**
     * Create a new article
     * POST /api/blog
     */
    async createArticle(req: Request, res: Response) {
        try {
            console.log('--- CREATE ARTICLE REQUEST START ---');
            console.log('Body:', req.body);
            console.log('File:', req.file);
            console.log('User:', req.user);

            const userId = (req.user as any)?._id;
            const data: CreateBlogArticleDTO = req.body;

            // Handle FormData parsing
            // Tags: "tag1, tag2" -> ["tag1", "tag2"]
            if (typeof req.body.tags === 'string') {
                data.tags = req.body.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
            }

            // Featured: "true"/"false" -> boolean
            if (req.body.featured !== undefined) {
                data.featured = String(req.body.featured) === 'true';
            }

            // SEO: Handle flat keys from FormData "seo[metaTitle]"
            if (req.body['seo[metaTitle]'] || req.body['seo[metaDescription]']) {
                data.seo = {
                    metaTitle: req.body['seo[metaTitle]'],
                    metaDescription: req.body['seo[metaDescription]']
                };
            }

            // Handle uploaded cover image
            if (req.file) {
                data.coverImage = (req.file as any).path;
            }

            // Get author information
            let author: any;
            let authorRole: 'admin' | 'professional';

            const admin = await Admin.findById(userId);
            if (admin) {
                author = admin;
                authorRole = 'admin';
            } else {
                author = await User.findById(userId);
                authorRole = 'professional';
            }

            if (!author) {
                return res.status(404).json({ message: 'User not found' });
            }

            const authorName = author.nom;
            const authorPhoto = author.photo || 'default.png';

            const article = await blogService.createArticle(
                data,
                userId!,
                authorName,
                authorPhoto,
                authorRole
            );

            console.log('--- ARTICLE CREATED SUCCESSFULLY ---', article._id);

            res.status(201).json({
                message: 'Article created successfully',
                article
            });
        } catch (error: any) {
            console.error('--- ERROR CREATING ARTICLE ---', error);
            res.status(500).json({
                message: 'Error creating article',
                error: error.message
            });
        }
    }

    /**
     * Get a list of articles
     * GET /api/blog
     */
    async getArticles(req: Request, res: Response) {
        try {
            const statusParam = req.query.status as string;
            // If it's the admin dashboard (often requested with limit=100 or specific filter), 
            // and no status is provided, we might want to default to 'all'.
            // But let's stay safe: the client should specify.
            const options: BlogQueryOptions = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                category: req.query.category as any,
                tag: req.query.tag as string,
                search: req.query.search as string,
                status: statusParam || (req.query.limit === '100' ? 'all' : 'published'),
                featured: req.query.featured === 'true' ? true : undefined,
                sortBy: req.query.sortBy as any || 'recent',
                author: req.query.author as string
            };

            const result = await blogService.getArticles(options);

            res.status(200).json(result);
        } catch (error: any) {
            console.error('Error fetching articles:', error);
            res.status(500).json({
                message: 'Error fetching articles',
                error: error.message
            });
        }
    }

    /**
     * Get article by slug
     * GET /api/blog/:slug
     */
    async getArticleBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const article = await blogService.getArticleBySlug(slug);

            if (!article) {
                return res.status(404).json({ message: 'Article not found' });
            }

            // Increment views
            const userId = req.user?.id;
            const ip = req.ip || req.connection.remoteAddress || 'unknown';
            const device = req.headers['user-agent'] || 'unknown';

            await blogService.incrementViews(article._id.toString(), {
                type: userId ? 'user' : 'anon',
                id: userId,
                ip,
                device
            });

            res.status(200).json(article);
        } catch (error: any) {
            console.error('Error fetching article:', error);
            res.status(500).json({
                message: 'Error fetching article',
                error: error.message
            });
        }
    }

    /**
     * Get article by ID (for editing)
     * GET /api/blog/edit/:id
     */
    async getArticleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const article = await blogService.getArticleById(id);

            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }

            res.status(200).json(article);
        } catch (error: any) {
            console.error('Error fetching article:', error);
            res.status(500).json({
                message: 'Error fetching article',
                error: error.message
            });
        }
    }

    /**
     * Update an article
     * PUT /api/blog/:id
     */
    async updateArticle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data: UpdateBlogArticleDTO = { ...req.body };

            // Handle FormData parsing
            if (typeof req.body.tags === 'string') {
                data.tags = req.body.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
            }

            if (req.body.featured !== undefined) {
                data.featured = String(req.body.featured) === 'true';
            }

            if (req.body['seo[metaTitle]'] || req.body['seo[metaDescription]']) {
                data.seo = {
                    metaTitle: req.body['seo[metaTitle]'] || data.seo?.metaTitle,
                    metaDescription: req.body['seo[metaDescription]'] || data.seo?.metaDescription
                };
            }

            // Handle uploaded cover image
            if (req.file) {
                data.coverImage = (req.file as any).path;
            }

            const article = await blogService.updateArticle(id, data);

            if (!article) {
                return res.status(404).json({ message: 'Article not found' });
            }

            res.status(200).json({
                message: 'Article updated successfully',
                article
            });
        } catch (error: any) {
            console.error('Error updating article:', error);
            res.status(500).json({
                message: 'Error updating article',
                error: error.message
            });
        }
    }

    /**
     * Delete an article
     * DELETE /api/blog/:id
     */
    async deleteArticle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const success = await blogService.deleteArticle(id);

            if (!success) {
                return res.status(404).json({ message: 'Article not found' });
            }

            res.status(200).json({ message: 'Article deleted successfully' });
        } catch (error: any) {
            console.error('Error deleting article:', error);
            res.status(500).json({
                message: 'Error deleting article',
                error: error.message
            });
        }
    }

    /**
     * Like/Unlike an article
     * POST /api/blog/:id/like
     */
    async toggleLike(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req.user as any)?._id;

            if (!userId) {
                return res.status(401).json({ message: 'Not authenticated' });
            }

            const result = await blogService.toggleLike(id, userId);

            res.status(200).json(result);
        } catch (error: any) {
            console.error('Error during like/unlike:', error);
            res.status(500).json({
                message: 'Error during like/unlike',
                error: error.message
            });
        }
    }

    /**
     * Add a comment
     * POST /api/blog/:id/comment
     */
    async addComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req.user as any)?._id;
            const { text, isAnonymous }: AddCommentDTO = req.body;

            if (!userId) {
                return res.status(401).json({ message: 'Not authenticated' });
            }

            const admin = await Admin.findById(userId);
            const user = await User.findById(userId);
            const authorDoc = admin || user;

            if (!authorDoc) {
                return res.status(404).json({ message: 'User not found' });
            }

            const username = authorDoc.nom;
            const userPhoto = authorDoc.photo || 'default.png';
            const userRole = (authorDoc.role || (admin ? 'admin' : 'patient')) as 'patient' | 'professional' | 'admin';

            const article = await blogService.addComment(
                id,
                userId,
                username,
                userPhoto,
                userRole,
                text,
                isAnonymous || false
            );

            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }

            res.status(201).json({
                message: 'Comment added successfully',
                article
            });
        } catch (error: any) {
            console.error('Error adding comment:', error);
            res.status(500).json({
                message: 'Error adding comment',
                error: error.message
            });
        }
    }

    /**
     * Delete a comment
     * DELETE /api/blog/:id/comment/:commentId
     */
    async deleteComment(req: Request, res: Response) {
        try {
            const { id, commentId } = req.params;

            const article = await blogService.deleteComment(id, commentId);

            if (!article) {
                return res.status(404).json({ message: 'Article ou commentaire non trouvé' });
            }

            res.status(200).json({
                message: 'Comment deleted successfully',
                article
            });
        } catch (error: any) {
            console.error('Error deleting comment:', error);
            res.status(500).json({
                message: 'Error deleting comment',
                error: error.message
            });
        }
    }

    /**
     * Get featured articles
     * GET /api/blog/featured
     */
    async getFeaturedArticles(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 3;
            const articles = await blogService.getFeaturedArticles(limit);

            res.status(200).json(articles);
        } catch (error: any) {
            console.error('Error fetching featured articles:', error);
            res.status(500).json({
                message: 'Error fetching featured articles',
                error: error.message
            });
        }
    }

    /**
     * Get similar articles
     * GET /api/blog/:id/similar
     */
    async getSimilarArticles(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const limit = parseInt(req.query.limit as string) || 3;

            const article = await blogService.getArticleById(id);
            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }

            const articles = await blogService.getSimilarArticles(id, article.category, limit);

            res.status(200).json(articles);
        } catch (error: any) {
            console.error('Error fetching similar articles:', error);
            res.status(500).json({
                message: 'Error fetching similar articles',
                error: error.message
            });
        }
    }

    /**
     * Get article statistics
     * GET /api/blog/:id/stats
     */
    async getArticleStats(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const stats = await blogService.getArticleStats(id);

            res.status(200).json(stats);
        } catch (error: any) {
            console.error('Error fetching stats:', error);
            res.status(500).json({
                message: 'Error fetching stats',
                error: error.message
            });
        }
    }

    /**
     * Get all categories with article count
     * GET /api/blog/categories
     */
    async getCategories(req: Request, res: Response) {
        try {
            const categories = await blogService.getCategoriesWithCount();

            res.status(200).json(categories);
        } catch (error: any) {
            console.error('Error fetching categories:', error);
            res.status(500).json({
                message: 'Error fetching categories',
                error: error.message
            });
        }
    }

    /**
     * Get all tags with article count
     * GET /api/blog/tags
     */
    async getTags(req: Request, res: Response) {
        try {
            const tags = await blogService.getTagsWithCount();

            res.status(200).json(tags);
        } catch (error: any) {
            console.error('Error fetching tags:', error);
            res.status(500).json({
                message: 'Error fetching tags',
                error: error.message
            });
        }
    }
}

export default new BlogController();
