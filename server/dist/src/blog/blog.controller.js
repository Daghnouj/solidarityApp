"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blog_service_1 = __importDefault(require("./blog.service"));
const user_model_1 = __importDefault(require("../user/user.model"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
class BlogController {
    async createArticle(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const data = req.body;
            let author;
            let authorRole;
            const admin = await admin_model_1.default.findById(userId);
            if (admin) {
                author = admin;
                authorRole = 'admin';
            }
            else {
                author = await user_model_1.default.findById(userId);
                authorRole = 'professional';
            }
            if (!author) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            const authorName = author.nom;
            const authorPhoto = author.photo || 'default.png';
            const article = await blog_service_1.default.createArticle(data, userId, authorName, authorPhoto, authorRole);
            res.status(201).json({
                message: 'Article créé avec succès',
                article
            });
        }
        catch (error) {
            console.error('Erreur lors de la création de l\'article:', error);
            res.status(500).json({
                message: 'Erreur lors de la création de l\'article',
                error: error.message
            });
        }
    }
    async getArticles(req, res) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                category: req.query.category,
                tag: req.query.tag,
                search: req.query.search,
                status: req.query.status || 'published',
                featured: req.query.featured === 'true' ? true : undefined,
                sortBy: req.query.sortBy || 'recent',
                author: req.query.author
            };
            const result = await blog_service_1.default.getArticles(options);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des articles:', error);
            res.status(500).json({
                message: 'Erreur lors de la récupération des articles',
                error: error.message
            });
        }
    }
    async getArticleBySlug(req, res) {
        var _a;
        try {
            const { slug } = req.params;
            const article = await blog_service_1.default.getArticleBySlug(slug);
            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const ip = req.ip || req.connection.remoteAddress || 'unknown';
            const device = req.headers['user-agent'] || 'unknown';
            await blog_service_1.default.incrementViews(article._id.toString(), {
                type: userId ? 'user' : 'anon',
                id: userId,
                ip,
                device
            });
            res.status(200).json(article);
        }
        catch (error) {
            console.error('Erreur lors de la récupération de l\'article:', error);
            res.status(500).json({
                message: 'Erreur lors de la récupération de l\'article',
                error: error.message
            });
        }
    }
    async getArticleById(req, res) {
        try {
            const { id } = req.params;
            const article = await blog_service_1.default.getArticleById(id);
            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }
            res.status(200).json(article);
        }
        catch (error) {
            console.error('Erreur lors de la récupération de l\'article:', error);
            res.status(500).json({
                message: 'Erreur lors de la récupération de l\'article',
                error: error.message
            });
        }
    }
    async updateArticle(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const article = await blog_service_1.default.updateArticle(id, data);
            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }
            res.status(200).json({
                message: 'Article mis à jour avec succès',
                article
            });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de l\'article:', error);
            res.status(500).json({
                message: 'Erreur lors de la mise à jour de l\'article',
                error: error.message
            });
        }
    }
    async deleteArticle(req, res) {
        try {
            const { id } = req.params;
            const success = await blog_service_1.default.deleteArticle(id);
            if (!success) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }
            res.status(200).json({ message: 'Article supprimé avec succès' });
        }
        catch (error) {
            console.error('Erreur lors de la suppression de l\'article:', error);
            res.status(500).json({
                message: 'Erreur lors de la suppression de l\'article',
                error: error.message
            });
        }
    }
    async toggleLike(req, res) {
        var _a;
        try {
            const { id } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!userId) {
                return res.status(401).json({ message: 'Non authentifié' });
            }
            const result = await blog_service_1.default.toggleLike(id, userId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Erreur lors du like/unlike:', error);
            res.status(500).json({
                message: 'Erreur lors du like/unlike',
                error: error.message
            });
        }
    }
    async addComment(req, res) {
        var _a;
        try {
            const { id } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const { text, isAnonymous } = req.body;
            if (!userId) {
                return res.status(401).json({ message: 'Non authentifié' });
            }
            const admin = await admin_model_1.default.findById(userId);
            const user = await user_model_1.default.findById(userId);
            const authorDoc = admin || user;
            if (!authorDoc) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            const username = authorDoc.nom;
            const userPhoto = authorDoc.photo || 'default.png';
            const userRole = (authorDoc.role || (admin ? 'admin' : 'patient'));
            const article = await blog_service_1.default.addComment(id, userId, username, userPhoto, userRole, text, isAnonymous || false);
            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }
            res.status(201).json({
                message: 'Commentaire ajouté avec succès',
                article
            });
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout du commentaire:', error);
            res.status(500).json({
                message: 'Erreur lors de l\'ajout du commentaire',
                error: error.message
            });
        }
    }
    async deleteComment(req, res) {
        try {
            const { id, commentId } = req.params;
            const article = await blog_service_1.default.deleteComment(id, commentId);
            if (!article) {
                return res.status(404).json({ message: 'Article ou commentaire non trouvé' });
            }
            res.status(200).json({
                message: 'Commentaire supprimé avec succès',
                article
            });
        }
        catch (error) {
            console.error('Erreur lors de la suppression du commentaire:', error);
            res.status(500).json({
                message: 'Erreur lors de la suppression du commentaire',
                error: error.message
            });
        }
    }
    async getFeaturedArticles(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 3;
            const articles = await blog_service_1.default.getFeaturedArticles(limit);
            res.status(200).json(articles);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des articles en vedette:', error);
            res.status(500).json({
                message: 'Erreur lors de la récupération des articles en vedette',
                error: error.message
            });
        }
    }
    async getSimilarArticles(req, res) {
        try {
            const { id } = req.params;
            const limit = parseInt(req.query.limit) || 3;
            const article = await blog_service_1.default.getArticleById(id);
            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }
            const articles = await blog_service_1.default.getSimilarArticles(id, article.category, limit);
            res.status(200).json(articles);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des articles similaires:', error);
            res.status(500).json({
                message: 'Erreur lors de la récupération des articles similaires',
                error: error.message
            });
        }
    }
    async getArticleStats(req, res) {
        try {
            const { id } = req.params;
            const stats = await blog_service_1.default.getArticleStats(id);
            res.status(200).json(stats);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            res.status(500).json({
                message: 'Erreur lors de la récupération des statistiques',
                error: error.message
            });
        }
    }
    async getCategories(req, res) {
        try {
            const categories = await blog_service_1.default.getCategoriesWithCount();
            res.status(200).json(categories);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
            res.status(500).json({
                message: 'Erreur lors de la récupération des catégories',
                error: error.message
            });
        }
    }
    async getTags(req, res) {
        try {
            const tags = await blog_service_1.default.getTagsWithCount();
            res.status(200).json(tags);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des tags:', error);
            res.status(500).json({
                message: 'Erreur lors de la récupération des tags',
                error: error.message
            });
        }
    }
}
exports.default = new BlogController();
//# sourceMappingURL=blog.controller.js.map