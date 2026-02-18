"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const mongoose_1 = require("mongoose");
const post_model_1 = __importDefault(require("../post/post.model"));
const notification_service_1 = require("../notification/notification.service");
class CommentService {
    static async addComment(postId, data, userId, io) {
        const post = await post_model_1.default.findById(postId);
        if (!post) {
            throw new Error('Post non trouvé');
        }
        const newComment = {
            user: userId,
            text: data.comment.trim(),
            date: new Date(),
            edited: false,
            isAnonymous: data.isAnonymous || false,
            replies: []
        };
        post.comments.push(newComment);
        await post.save();
        if (post.user.toString() !== userId.toString()) {
            console.log('💬 Creating comment notification...');
            console.log('Post owner:', post.user.toString());
            console.log('Commenter:', userId.toString());
            console.log('io available:', !!io);
            await (0, notification_service_1.createNotification)(post.user, userId, 'comment', postId, {
                commentId: post.comments[post.comments.length - 1]._id,
                commentPreview: data.comment.slice(0, 50)
            }, io, undefined, data.isAnonymous);
            console.log('✅ Comment notification created');
        }
        const populatedPost = await post_model_1.default.findById(postId)
            .populate('comments.user', 'nom photo role')
            .populate('comments.replies.user', 'nom photo role');
        return populatedPost.comments[populatedPost.comments.length - 1];
    }
    static async addReply(postId, commentId, data, userId, io) {
        const post = await post_model_1.default.findById(postId);
        if (!post) {
            throw new Error('Post non trouvé');
        }
        const comment = post.comments.find(c => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
        if (!comment) {
            throw new Error('Commentaire non trouvé');
        }
        const newReply = {
            user: userId,
            text: data.replyText.trim(),
            date: new Date(),
            edited: false,
            isAnonymous: data.isAnonymous || false
        };
        comment.replies.push(newReply);
        await post.save();
        const replyId = comment.replies[comment.replies.length - 1]._id;
        if (comment.user.toString() !== userId.toString()) {
            await (0, notification_service_1.createNotification)(comment.user, userId, 'reply', postId, {
                commentId: commentId,
                replyId: replyId,
                replyPreview: data.replyText.slice(0, 50)
            }, io, undefined, data.isAnonymous);
        }
        if (data.notifiedUserId &&
            data.notifiedUserId !== userId.toString() &&
            data.notifiedUserId !== comment.user.toString()) {
            await (0, notification_service_1.createNotification)(new mongoose_1.Types.ObjectId(data.notifiedUserId), userId, 'reply', postId, {
                commentId: commentId,
                replyId: replyId,
                replyPreview: data.replyText.slice(0, 50),
                isNestedReply: true
            }, io, undefined, data.isAnonymous);
        }
        const populatedPost = await post_model_1.default.findById(postId)
            .populate('comments.user', 'nom photo role')
            .populate('comments.replies.user', 'nom photo role');
        const populatedComment = populatedPost.comments.find(c => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
        if (!populatedComment) {
            throw new Error('Commentaire non trouvé après population');
        }
        return populatedComment.replies[populatedComment.replies.length - 1];
    }
    static async updateComment(postId, commentId, data, userId) {
        const post = await post_model_1.default.findById(postId);
        if (!post) {
            throw new Error('Post non trouvé');
        }
        const comment = post.comments.find(c => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
        if (!comment) {
            throw new Error('Commentaire non trouvé');
        }
        if (!comment.user.equals(userId)) {
            throw new Error('Non autorisé à modifier ce commentaire');
        }
        comment.text = data.newText.trim();
        comment.edited = true;
        await post.save();
        return comment;
    }
    static async deleteComment(postId, commentId, userId) {
        const post = await post_model_1.default.findById(postId);
        if (!post) {
            throw new Error('Post non trouvé');
        }
        const comment = post.comments.find(c => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
        if (!comment) {
            throw new Error('Commentaire non trouvé');
        }
        if (!comment.user.equals(userId)) {
            throw new Error('Non autorisé à supprimer ce commentaire');
        }
        post.comments = post.comments.filter(c => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) !== commentId; });
        await post.save();
    }
    static async updateReply(postId, commentId, replyId, data, userId) {
        const post = await post_model_1.default.findById(postId);
        if (!post) {
            throw new Error('Post non trouvé');
        }
        const comment = post.comments.find(c => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
        if (!comment) {
            throw new Error('Commentaire non trouvé');
        }
        const reply = comment.replies.find(r => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toString()) === replyId; });
        if (!reply) {
            throw new Error('Réponse non trouvée');
        }
        if (!reply.user.equals(userId)) {
            throw new Error('Non autorisé à modifier cette réponse');
        }
        reply.text = data.newText.trim();
        reply.edited = true;
        await post.save();
        return reply;
    }
    static async deleteReply(postId, commentId, replyId, userId) {
        const post = await post_model_1.default.findById(postId);
        if (!post) {
            throw new Error('Post non trouvé');
        }
        const comment = post.comments.find(c => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
        if (!comment) {
            throw new Error('Commentaire non trouvé');
        }
        const reply = comment.replies.find(r => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toString()) === replyId; });
        if (!reply) {
            throw new Error('Réponse non trouvée');
        }
        if (!reply.user.equals(userId)) {
            throw new Error('Non autorisé à supprimer cette réponse');
        }
        comment.replies = comment.replies.filter(r => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toString()) !== replyId; });
        await post.save();
    }
}
exports.CommentService = CommentService;
//# sourceMappingURL=comments.service.js.map