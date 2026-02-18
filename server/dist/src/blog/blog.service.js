"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blog_model_1 = __importDefault(require("./blog.model"));
const mongoose_1 = require("mongoose");
class BlogService {
    async createArticle(data, authorId, authorName, authorPhoto, authorRole) {
        const article = new blog_model_1.default({
            ...data,
            author: authorId,
            authorName,
            authorPhoto,
            authorRole,
            status: data.status || 'draft'
        });
        await article.save();
        return article;
    }
    async getArticles(options = {}) {
        const { page = 1, limit = 10, category, tag, search, status = 'published', featured, sortBy = 'recent', author } = options;
        const query = {};
        if (status) {
            query.status = status;
        }
        if (category) {
            query.category = category;
        }
        if (tag) {
            query.tags = tag;
        }
        if (featured !== undefined) {
            query.featured = featured;
        }
        if (author) {
            query.author = author;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }
        let sort = {};
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
        const skip = (page - 1) * limit;
        const [articles, total] = await Promise.all([
            blog_model_1.default.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('author', 'nom prenom photo role')
                .lean(),
            blog_model_1.default.countDocuments(query)
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            articles: articles,
            total,
            page,
            totalPages
        };
    }
    async getArticleBySlug(slug) {
        const article = await blog_model_1.default.findOne({ slug, status: 'published' })
            .populate('author', 'nom prenom photo role specialite bio')
            .populate('likes', 'nom prenom photo');
        return article;
    }
    async getArticleById(id) {
        const article = await blog_model_1.default.findById(id)
            .populate('author', 'nom prenom photo role');
        return article;
    }
    async updateArticle(id, data) {
        const article = await blog_model_1.default.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
        return article;
    }
    async deleteArticle(id) {
        const result = await blog_model_1.default.findByIdAndDelete(id);
        return !!result;
    }
    async incrementViews(articleId, viewData) {
        const article = await blog_model_1.default.findById(articleId);
        if (!article)
            return;
        const alreadyViewed = article.viewedBy.some(view => {
            if (viewData.type === 'user' && viewData.id) {
                return view.type === 'user' && view.id === viewData.id;
            }
            return view.ip === viewData.ip;
        });
        if (!alreadyViewed) {
            await blog_model_1.default.findByIdAndUpdate(articleId, {
                $inc: { views: 1 },
                $push: { viewedBy: { ...viewData, date: new Date() } }
            });
        }
    }
    async toggleLike(articleId, userId) {
        const article = await blog_model_1.default.findById(articleId);
        if (!article) {
            throw new Error('Article non trouvé');
        }
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const hasLiked = article.likes.some(id => id.equals(userObjectId));
        if (hasLiked) {
            article.likes = article.likes.filter(id => !id.equals(userObjectId));
        }
        else {
            article.likes.push(userObjectId);
        }
        await article.save();
        return {
            liked: !hasLiked,
            likesCount: article.likes.length
        };
    }
    async addComment(articleId, userId, username, userPhoto, userRole, text, isAnonymous = false) {
        const article = await blog_model_1.default.findByIdAndUpdate(articleId, {
            $push: {
                comments: {
                    user: userId,
                    username: isAnonymous ? 'Anonyme' : username,
                    userPhoto: isAnonymous ? 'default.png' : userPhoto,
                    userRole,
                    text,
                    date: new Date(),
                    isAnonymous
                }
            }
        }, { new: true }).populate('author', 'nom prenom photo role');
        return article;
    }
    async deleteComment(articleId, commentId) {
        const article = await blog_model_1.default.findByIdAndUpdate(articleId, {
            $pull: { comments: { _id: commentId } }
        }, { new: true });
        return article;
    }
    async getFeaturedArticles(limit = 3) {
        const articles = await blog_model_1.default.find({ status: 'published', featured: true })
            .sort({ publishedAt: -1 })
            .limit(limit)
            .populate('author', 'nom prenom photo role');
        return articles;
    }
    async getSimilarArticles(articleId, category, limit = 3) {
        const articles = await blog_model_1.default.find({
            _id: { $ne: articleId },
            category,
            status: 'published'
        })
            .sort({ publishedAt: -1 })
            .limit(limit)
            .populate('author', 'nom prenom photo role');
        return articles;
    }
    async getArticleStats(articleId) {
        const article = await blog_model_1.default.findById(articleId);
        if (!article) {
            throw new Error('Article non trouvé');
        }
        return {
            views: article.views,
            likes: article.likes.length,
            comments: article.comments.length
        };
    }
    async getCategoriesWithCount() {
        const categories = await blog_model_1.default.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        return categories;
    }
    async getTagsWithCount() {
        const tags = await blog_model_1.default.aggregate([
            { $match: { status: 'published' } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);
        return tags;
    }
}
exports.default = new BlogService();
//# sourceMappingURL=blog.service.js.map