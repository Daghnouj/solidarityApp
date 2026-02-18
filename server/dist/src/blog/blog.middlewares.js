"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommentData = exports.validateArticleData = exports.isArticleAuthorOrAdmin = exports.canCreateArticle = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const blog_model_1 = __importDefault(require("./blog.model"));
const canCreateArticle = async (req, res, next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }
        const admin = await admin_model_1.default.findById(userId);
        if (admin) {
            req.user.role = 'admin';
            return next();
        }
        const user = await user_model_1.default.findById(userId);
        if (user && user.role === 'professional') {
            req.user.role = 'professional';
            return next();
        }
        return res.status(403).json({
            message: 'Accès refusé. Seuls les administrateurs et les professionnels peuvent créer des articles.'
        });
    }
    catch (error) {
        console.error('Erreur dans canCreateArticle:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.canCreateArticle = canCreateArticle;
const isArticleAuthorOrAdmin = async (req, res, next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const articleId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }
        const admin = await admin_model_1.default.findById(userId);
        if (admin) {
            return next();
        }
        const article = await blog_model_1.default.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        if (article.author.toString() === userId) {
            return next();
        }
        return res.status(403).json({
            message: 'Accès refusé. Vous n\'êtes pas l\'auteur de cet article.'
        });
    }
    catch (error) {
        console.error('Erreur dans isArticleAuthorOrAdmin:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.isArticleAuthorOrAdmin = isArticleAuthorOrAdmin;
const validateArticleData = (req, res, next) => {
    const { title, content, excerpt, category } = req.body;
    const errors = [];
    if (!title || title.trim().length === 0) {
        errors.push('Le titre est requis');
    }
    else if (title.length > 200) {
        errors.push('Le titre ne peut pas dépasser 200 caractères');
    }
    if (!content || content.trim().length === 0) {
        errors.push('Le contenu est requis');
    }
    if (!excerpt || excerpt.trim().length === 0) {
        errors.push('L\'extrait est requis');
    }
    else if (excerpt.length > 300) {
        errors.push('L\'extrait ne peut pas dépasser 300 caractères');
    }
    if (!category) {
        errors.push('La catégorie est requise');
    }
    else {
        const validCategories = [
            'Bien-être Mental',
            'Gestion du Stress',
            'Thérapies et Coaching',
            'Relations Sociales',
            'Développement Personnel',
            'Actualités',
            'Témoignages'
        ];
        if (!validCategories.includes(category)) {
            errors.push('Catégorie invalide');
        }
    }
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Données invalides', errors });
    }
    next();
};
exports.validateArticleData = validateArticleData;
const validateCommentData = (req, res, next) => {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: 'Le texte du commentaire est requis' });
    }
    if (text.length > 1000) {
        return res.status(400).json({ message: 'Le commentaire ne peut pas dépasser 1000 caractères' });
    }
    next();
};
exports.validateCommentData = validateCommentData;
//# sourceMappingURL=blog.middlewares.js.map