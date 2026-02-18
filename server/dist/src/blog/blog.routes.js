"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = __importDefault(require("./blog.controller"));
const protect_1 = require("../../middlewares/protect");
const optionalProtect_1 = require("../../middlewares/optionalProtect");
const blog_middlewares_1 = require("./blog.middlewares");
const router = (0, express_1.Router)();
router.get('/', optionalProtect_1.optionalProtect, blog_controller_1.default.getArticles);
router.get('/featured', blog_controller_1.default.getFeaturedArticles);
router.get('/categories', blog_controller_1.default.getCategories);
router.get('/tags', blog_controller_1.default.getTags);
router.get('/:slug', optionalProtect_1.optionalProtect, blog_controller_1.default.getArticleBySlug);
router.get('/:id/similar', blog_controller_1.default.getSimilarArticles);
router.get('/:id/stats', blog_controller_1.default.getArticleStats);
router.post('/', protect_1.protect, blog_middlewares_1.canCreateArticle, blog_middlewares_1.validateArticleData, blog_controller_1.default.createArticle);
router.get('/edit/:id', protect_1.protect, blog_controller_1.default.getArticleById);
router.put('/:id', protect_1.protect, blog_middlewares_1.isArticleAuthorOrAdmin, blog_middlewares_1.validateArticleData, blog_controller_1.default.updateArticle);
router.delete('/:id', protect_1.protect, blog_middlewares_1.isArticleAuthorOrAdmin, blog_controller_1.default.deleteArticle);
router.post('/:id/like', protect_1.protect, blog_controller_1.default.toggleLike);
router.post('/:id/comment', protect_1.protect, blog_middlewares_1.validateCommentData, blog_controller_1.default.addComment);
router.delete('/:id/comment/:commentId', protect_1.protect, blog_controller_1.default.deleteComment);
exports.default = router;
//# sourceMappingURL=blog.routes.js.map