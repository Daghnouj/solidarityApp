import BlogArticle from './blog.model';
import { IBlogArticle, BlogQueryOptions, CreateBlogArticleDTO, UpdateBlogArticleDTO } from './blog.types';
import { Types } from 'mongoose';

class BlogService {
    /**
     * Create a new blog article
     */
    async createArticle(data: CreateBlogArticleDTO, authorId: string, authorName: string, authorPhoto: string, authorRole: 'admin' | 'professional'): Promise<IBlogArticle> {
        const article = new BlogArticle({
            ...data,
            author: authorId,
            authorModel: authorRole === 'admin' ? 'Admin' : 'User',
            authorName,
            authorPhoto,
            authorRole,
            status: data.status || 'draft'
        });

        await article.save();
        return article;
    }

    /**
     * Get list of articles with filters and pagination
     */
    async getArticles(options: BlogQueryOptions = {}): Promise<{ articles: IBlogArticle[], total: number, page: number, totalPages: number }> {
        const {
            page = 1,
            limit = 10,
            category,
            tag,
            search,
            status,
            featured,
            sortBy = 'recent',
            author
        } = options;

        // Query construction
        const query: any = {};

        // Filter by status
        // Default to 'published' for public, but allow 'all' or specific status
        if (status && status !== 'all') {
            query.status = status;
        } else if (!status) {
            // Default to 'published' if no status is provided (public default)
            query.status = 'published';
        }
        // If status is 'all', we don't add status to the query (returns all)

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by tag
        if (tag) {
            query.tags = tag;
        }

        // Filter by featured
        if (featured !== undefined) {
            query.featured = featured;
        }

        // Filter by author
        if (author) {
            query.author = author;
        }

        // Text search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting
        let sort: any = {};
        switch (sortBy) {
            case 'popular':
                sort = { views: -1 };
                break;
            case 'mostCommented':
                sort = { 'comments.length': -1 };
                break;
            case 'mostLiked':
                sort = { 'likes.length': -1 };
                break;
            case 'recent':
            default:
                sort = { publishedAt: -1, createdAt: -1 };
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Exécution de la requête
        const [articles, total] = await Promise.all([
            BlogArticle.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('author', 'nom prenom photo role bio specialite')
                .lean(),
            BlogArticle.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            articles: articles as unknown as IBlogArticle[],
            total,
            page,
            totalPages
        };
    }

    /**
     * Get article by slug
     */
    async getArticleBySlug(slug: string): Promise<IBlogArticle | null> {
        const article = await BlogArticle.findOne({ slug, status: 'published' })
            .populate('author', 'nom prenom photo role specialite bio')
            .populate('likes', 'nom prenom photo');

        return article;
    }

    /**
     * Get article by ID (for editing)
     */
    async getArticleById(id: string): Promise<IBlogArticle | null> {
        const article = await BlogArticle.findById(id)
            .populate('author', 'nom prenom photo role specialite bio');

        return article;
    }

    /**
     * Update an article
     */
    async updateArticle(id: string, data: UpdateBlogArticleDTO): Promise<IBlogArticle | null> {
        const article = await BlogArticle.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        return article;
    }

    /**
     * Delete an article
     */
    async deleteArticle(id: string): Promise<boolean> {
        const result = await BlogArticle.findByIdAndDelete(id);
        return !!result;
    }

    /**
     * Increment views of an article
     */
    async incrementViews(articleId: string, viewData: { type: 'user' | 'anon', id?: string, ip: string, device: string }): Promise<void> {
        // Check if this user/IP has already viewed the article
        const article = await BlogArticle.findById(articleId);

        if (!article) return;

        const alreadyViewed = article.viewedBy.some(view => {
            if (viewData.type === 'user' && viewData.id) {
                return view.type === 'user' && view.id === viewData.id;
            }
            return view.ip === viewData.ip;
        });

        if (!alreadyViewed) {
            await BlogArticle.findByIdAndUpdate(articleId, {
                $inc: { views: 1 },
                $push: { viewedBy: { ...viewData, date: new Date() } }
            });
        }
    }

    /**
     * Like/Unlike an article
     */
    async toggleLike(articleId: string, userId: string): Promise<{ liked: boolean, likesCount: number }> {
        const article = await BlogArticle.findById(articleId);

        if (!article) {
            throw new Error('Article not found');
        }

        const userObjectId = new Types.ObjectId(userId);
        const hasLiked = article.likes.some(id => id.equals(userObjectId));

        if (hasLiked) {
            // Remove like
            article.likes = article.likes.filter(id => !id.equals(userObjectId));
        } else {
            // Add like
            article.likes.push(userObjectId);
        }

        await article.save();

        return {
            liked: !hasLiked,
            likesCount: article.likes.length
        };
    }

    /**
     * Add a comment
     */
    async addComment(articleId: string, userId: string, username: string, userPhoto: string, userRole: 'patient' | 'professional' | 'admin', text: string, isAnonymous: boolean = false): Promise<IBlogArticle | null> {
        const article = await BlogArticle.findByIdAndUpdate(
            articleId,
            {
                $push: {
                    comments: {
                        user: userId,
                        username: isAnonymous ? 'Anonymous' : username,
                        userPhoto: isAnonymous ? 'default.png' : userPhoto,
                        userRole,
                        text,
                        date: new Date(),
                        isAnonymous
                    }
                }
            },
            { new: true }
        ).populate('author', 'nom prenom photo role specialite bio');

        return article;
    }

    /**
     * Delete a comment
     */
    async deleteComment(articleId: string, commentId: string): Promise<IBlogArticle | null> {
        const article = await BlogArticle.findByIdAndUpdate(
            articleId,
            {
                $pull: { comments: { _id: commentId } }
            },
            { new: true }
        );

        return article;
    }

    /**
     * Get featured articles
     */
    async getFeaturedArticles(limit: number = 3): Promise<IBlogArticle[]> {
        const articles = await BlogArticle.find({ status: 'published', featured: true })
            .sort({ publishedAt: -1 })
            .limit(limit)
            .populate('author', 'nom prenom photo role specialite bio');

        return articles;
    }

    /**
     * Get similar articles (same category)
     */
    async getSimilarArticles(articleId: string, category: string, limit: number = 3): Promise<IBlogArticle[]> {
        const articles = await BlogArticle.find({
            _id: { $ne: articleId },
            category,
            status: 'published'
        })
            .sort({ publishedAt: -1 })
            .limit(limit)
            .populate('author', 'nom prenom photo role specialite bio');

        return articles;
    }

    /**
     * Get article statistics
     */
    async getArticleStats(articleId: string) {
        const article = await BlogArticle.findById(articleId);

        if (!article) {
            throw new Error('Article not found');
        }

        return {
            views: article.views,
            likes: article.likes.length,
            comments: article.comments.length
        };
    }

    /**
     * Get all categories with article count
     */
    async getCategoriesWithCount() {
        const categories = await BlogArticle.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        return categories;
    }

    /**
     * Get all tags with article count
     */
    async getTagsWithCount() {
        const tags = await BlogArticle.aggregate([
            { $match: { status: 'published' } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);

        return tags;
    }
}

export default new BlogService();
