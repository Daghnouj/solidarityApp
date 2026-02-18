"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const post_model_1 = __importDefault(require("./post.model"));
const community_models_1 = require("../community.models");
const hashtagUtils_1 = require("../utils/hashtagUtils");
const notification_service_1 = require("../notification/notification.service");
const adminNotification_service_1 = require("../../admin/adminNotification/adminNotification.service");
class PostService {
    static async createPost(data, user, io) {
        const hashtags = (0, hashtagUtils_1.extractHashtags)(data.content);
        const newPost = new post_model_1.default({
            content: data.content,
            user: user._id,
            username: user.nom,
            userPhoto: user.photo,
            userRole: user.role,
            hashtags,
            isAnonymous: data.isAnonymous || false
        });
        await newPost.save();
        if (io) {
            try {
                await adminNotification_service_1.AdminNotificationService.createNotification({
                    type: 'new_post',
                    title: 'Nouveau post publié',
                    message: `${user.nom} a publié un nouveau post`,
                    data: {
                        postId: newPost._id.toString(),
                        userId: user._id.toString(),
                        userName: user.nom,
                        userRole: user.role,
                        postContent: data.content.substring(0, 100) + (data.content.length > 100 ? '...' : ''),
                        hashtags: hashtags
                    },
                    io
                });
            }
            catch (notifError) {
                console.error('Error creating admin notification for new post:', notifError);
            }
        }
        if (hashtags.length > 0) {
            try {
                const bulkOps = hashtags.map(tag => ({
                    updateOne: {
                        filter: { name: tag },
                        update: { $inc: { count: 1 }, $setOnInsert: { name: tag } },
                        upsert: true
                    }
                }));
                await community_models_1.Hashtag.bulkWrite(bulkOps, { ordered: false });
            }
            catch (error) {
                console.error('Erreur lors de la mise à jour des hashtags:', error.message);
                await community_models_1.Hashtag.deleteMany({ name: null });
            }
        }
        return newPost;
    }
    static async addLike(postId, userId, io) {
        var _a;
        const post = await post_model_1.default.findById(postId);
        if (!post) {
            throw new Error('Post introuvable');
        }
        const isLiking = !post.likedBy.some((id) => id.equals(userId));
        await post_model_1.default.findByIdAndUpdate(postId, {
            $inc: { likes: isLiking ? 1 : -1 },
            [isLiking ? '$addToSet' : '$pull']: { likedBy: userId }
        }, { new: true });
        if (isLiking && post.user.toString() !== userId.toString()) {
            await notification_service_1.NotificationService.createNotification({
                recipientId: post.user,
                senderId: userId,
                type: 'like',
                postId: postId,
                metadata: { postPreview: (_a = post.content) === null || _a === void 0 ? void 0 : _a.slice(0, 50) },
                io: io
            });
        }
        return await post_model_1.default.findById(postId)
            .populate('user', 'nom photo role')
            .populate('likedBy', 'nom photo role')
            .populate({
            path: 'comments.user',
            select: 'nom photo'
        })
            .populate({
            path: 'comments.replies.user',
            select: 'nom photo'
        });
    }
    static async getFavoritePosts(userId) {
        return await post_model_1.default.find({ favorites: userId })
            .populate('user', 'nom photo role')
            .populate('likedBy', 'nom photo role')
            .populate({
            path: 'comments.user',
            select: 'nom photo'
        })
            .populate({
            path: 'comments.replies.user',
            select: 'nom photo'
        })
            .sort({ date: -1 });
    }
    static async getMyPosts(userId) {
        return await post_model_1.default.find({ user: userId })
            .populate('user', 'nom photo role')
            .populate('likedBy', 'nom photo role')
            .populate({
            path: 'comments.user',
            select: 'nom photo role'
        })
            .populate({
            path: 'comments.replies.user',
            select: 'nom photo role'
        })
            .sort({ date: -1 });
    }
    static async getLikedPosts(userId) {
        return await post_model_1.default.find({ likedBy: userId })
            .populate('user', 'nom photo role')
            .populate('likedBy', 'nom photo role')
            .populate({
            path: 'comments.user',
            select: 'nom photo role'
        })
            .populate({
            path: 'comments.replies.user',
            select: 'nom photo role'
        })
            .sort({ date: -1 });
    }
    static async getCommentedPosts(userId) {
        return await post_model_1.default.find({ 'comments.user': userId })
            .populate('user', 'nom photo role')
            .populate('likedBy', 'nom photo role')
            .populate({
            path: 'comments.user',
            select: 'nom photo role'
        })
            .populate({
            path: 'comments.replies.user',
            select: 'nom photo role'
        })
            .sort({ date: -1 });
    }
    static async getAllPosts() {
        return await post_model_1.default.find()
            .populate('user', 'nom photo role')
            .populate('likedBy', 'nom photo role')
            .populate({
            path: 'comments.user',
            select: 'nom photo'
        })
            .populate({
            path: 'comments.replies.user',
            select: 'nom photo'
        })
            .sort({ date: -1 });
    }
    static async updatePost(postId, data, userId) {
        const post = await post_model_1.default.findById(postId);
        if (!post) {
            throw new Error('Post non trouvé');
        }
        if (!post.user.equals(userId)) {
            throw new Error('Non autorisé');
        }
        const oldHashtags = post.hashtags;
        const newHashtags = (0, hashtagUtils_1.extractHashtags)(data.content);
        post.content = data.content;
        post.hashtags = newHashtags;
        post.edited = true;
        await post.save();
        const addedHashtags = newHashtags.filter(tag => !oldHashtags.includes(tag));
        const removedHashtags = oldHashtags.filter(tag => !newHashtags.includes(tag));
        if (addedHashtags.length > 0) {
            const addOps = addedHashtags.map(tag => ({
                updateOne: {
                    filter: { name: tag },
                    update: { $inc: { count: 1 }, $setOnInsert: { name: tag } },
                    upsert: true
                }
            }));
            await community_models_1.Hashtag.bulkWrite(addOps);
        }
        if (removedHashtags.length > 0) {
            const removeOps = removedHashtags.map(tag => ({
                updateOne: {
                    filter: { name: tag },
                    update: { $inc: { count: -1 } }
                }
            }));
            await community_models_1.Hashtag.bulkWrite(removeOps);
            await community_models_1.Hashtag.deleteMany({ count: { $lte: 0 } });
        }
        return post;
    }
    static async deletePost(postId, userId) {
        const post = await post_model_1.default.findById(postId);
        if (!post) {
            throw new Error('Post non trouvé');
        }
        if (!post.user.equals(userId)) {
            throw new Error('Non autorisé');
        }
        const postHashtags = post.hashtags;
        await post_model_1.default.deleteOne({ _id: postId });
        if (postHashtags.length > 0) {
            await community_models_1.Hashtag.updateMany({ name: { $in: postHashtags } }, { $inc: { count: -1 } });
            await community_models_1.Hashtag.deleteMany({ count: { $lte: 0 } });
        }
    }
    static async searchPosts(query) {
        const cleanQuery = query.replace(/#/g, '');
        const searchRegex = new RegExp(cleanQuery, 'i');
        return await post_model_1.default.find({
            $or: [
                { content: searchRegex },
                { hashtags: searchRegex }
            ]
        })
            .populate({
            path: 'user',
            select: 'nom photo role'
        })
            .sort({ date: -1 });
    }
    static async getPopularHashtags() {
        return await post_model_1.default.aggregate([
            { $unwind: "$hashtags" },
            {
                $group: {
                    _id: "$hashtags",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
    }
    static async getPostLikers(postId) {
        const post = await post_model_1.default.findById(postId).populate('likedBy', 'nom photo role');
        if (!post) {
            throw new Error('Post non trouvé');
        }
        return post.likedBy;
    }
    static async getPostById(postId) {
        return await post_model_1.default.findById(postId)
            .populate('user', 'nom photo role')
            .populate('likedBy', 'nom photo role')
            .populate({
            path: 'comments.user',
            select: 'nom photo role'
        })
            .populate({
            path: 'comments.replies.user',
            select: 'nom photo role'
        });
    }
}
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map