"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReply = exports.updateReply = exports.deleteComment = exports.updateComment = exports.addReply = exports.addComment = void 0;
const comments_service_1 = require("./comments.service");
const addComment = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Non autorisé' });
            return;
        }
        const { postId } = req.params;
        const { comment, isAnonymous } = req.body;
        const userId = req.user._id;
        console.log('💬 addComment called');
        console.log('req.io exists:', !!req.io);
        console.log('req.io type:', typeof req.io);
        const result = await comments_service_1.CommentService.addComment(postId, { comment, isAnonymous }, userId, req.io);
        res.status(201).json({
            success: true,
            comment: result
        });
    }
    catch (error) {
        console.error('Erreur commentaire:', error);
        const status = error.message === 'Post non trouvé' ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
exports.addComment = addComment;
const addReply = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { replyText, isAnonymous, notifiedUserId } = req.body;
        const userId = req.user._id;
        const result = await comments_service_1.CommentService.addReply(postId, commentId, { replyText, isAnonymous, notifiedUserId }, userId, req.io);
        res.status(201).json({
            success: true,
            reply: result
        });
    }
    catch (error) {
        console.error('Erreur réponse:', error);
        const status = error.message.includes('non trouvé') ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
exports.addReply = addReply;
const updateComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { newText } = req.body;
        const userId = req.user._id;
        const result = await comments_service_1.CommentService.updateComment(postId, commentId, { newText }, userId);
        res.json({
            success: true,
            comment: result
        });
    }
    catch (error) {
        console.error('Erreur modification commentaire:', error);
        const status = error.message === 'Non autorisé' ? 403 :
            error.message.includes('non trouvé') ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user._id;
        await comments_service_1.CommentService.deleteComment(postId, commentId, userId);
        res.json({
            success: true,
            message: 'Commentaire supprimé'
        });
    }
    catch (error) {
        console.error('Erreur suppression commentaire:', error);
        const status = error.message === 'Non autorisé' ? 403 :
            error.message.includes('non trouvé') ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
exports.deleteComment = deleteComment;
const updateReply = async (req, res) => {
    try {
        const { postId, commentId, replyId } = req.params;
        const { newText } = req.body;
        const userId = req.user._id;
        const result = await comments_service_1.CommentService.updateReply(postId, commentId, replyId, { newText }, userId);
        res.json({
            success: true,
            reply: result
        });
    }
    catch (error) {
        console.error('Erreur modification réponse:', error);
        const status = error.message === 'Non autorisé' ? 403 :
            error.message.includes('non trouvé') ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
exports.updateReply = updateReply;
const deleteReply = async (req, res) => {
    try {
        const { postId, commentId, replyId } = req.params;
        const userId = req.user._id;
        await comments_service_1.CommentService.deleteReply(postId, commentId, replyId, userId);
        res.json({
            success: true,
            message: 'Réponse supprimée'
        });
    }
    catch (error) {
        console.error('Erreur suppression réponse:', error);
        const status = error.message === 'Non autorisé' ? 403 :
            error.message.includes('non trouvé') ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
exports.deleteReply = deleteReply;
//# sourceMappingURL=comment.controller.js.map