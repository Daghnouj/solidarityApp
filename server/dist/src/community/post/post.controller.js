"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostById = exports.getPostLikers = exports.getPopularHashtags = exports.searchPosts = exports.deletePost = exports.updatePost = exports.getCommentedPosts = exports.getLikedPosts = exports.getSavedPosts = exports.getMyPosts = exports.getAllPosts = exports.addLike = exports.createPost = void 0;
const post_service_1 = require("./post.service");
const socket_1 = require("../../socket");
const createPost = async (req, res) => {
    var _a;
    try {
        const { content, isAnonymous } = req.body;
        if (!req.user) {
            res.status(401).json({ message: 'Non autorisé' });
            return;
        }
        const post = await post_service_1.PostService.createPost({ content, isAnonymous }, req.user, (0, socket_1.getIOInstance)());
        res.status(201).json({
            success: true,
            post: {
                ...post.toObject(),
                user: {
                    _id: req.user._id,
                    nom: req.user.nom,
                    photo: req.user.photo,
                    role: req.user.role
                }
            }
        });
    }
    catch (error) {
        console.error('Erreur création de post:', {
            error: error.message,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
        });
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};
exports.createPost = createPost;
const addLike = async (req, res) => {
    var _a;
    const postId = req.params.postId;
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Non autorisé' });
            return;
        }
        const userId = req.user._id;
        if (!postId) {
            res.status(400).json({
                success: false,
                message: 'postId est requis dans les paramètres de la requête'
            });
            return;
        }
        const post = await post_service_1.PostService.addLike(postId, userId, (0, socket_1.getIOInstance)());
        res.json({
            success: true,
            post
        });
    }
    catch (error) {
        console.error('[ERREUR LIKE]', {
            error: error.message,
            postId,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
        });
        const status = error.message === 'Post introuvable' ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
exports.addLike = addLike;
const getAllPosts = async (req, res) => {
    try {
        const posts = await post_service_1.PostService.getAllPosts();
        res.json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllPosts = getAllPosts;
const getMyPosts = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Non autorisé' });
            return;
        }
        const posts = await post_service_1.PostService.getMyPosts(req.user._id);
        res.json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMyPosts = getMyPosts;
const getSavedPosts = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Non autorisé' });
            return;
        }
        const posts = await post_service_1.PostService.getFavoritePosts(req.user._id);
        res.json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getSavedPosts = getSavedPosts;
const getLikedPosts = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Non autorisé' });
            return;
        }
        const posts = await post_service_1.PostService.getLikedPosts(req.user._id);
        res.json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getLikedPosts = getLikedPosts;
const getCommentedPosts = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Non autorisé' });
            return;
        }
        const posts = await post_service_1.PostService.getCommentedPosts(req.user._id);
        res.json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCommentedPosts = getCommentedPosts;
const updatePost = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Non autorisé' });
            return;
        }
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;
        const post = await post_service_1.PostService.updatePost(postId, { content }, userId);
        const populatedPost = await post.populate('user', 'nom photo role');
        res.json({
            success: true,
            post: populatedPost
        });
    }
    catch (error) {
        console.error('Erreur modification post:', error);
        const status = error.message === 'Post non trouvé' ? 404 :
            error.message === 'Non autorisé' ? 403 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Non autorisé' });
            return;
        }
        const { postId } = req.params;
        const userId = req.user._id;
        await post_service_1.PostService.deletePost(postId, userId);
        res.json({
            success: true,
            message: 'Post supprimé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur suppression post:', error);
        const status = error.message === 'Post non trouvé' ? 404 :
            error.message === 'Non autorisé' ? 403 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
};
exports.deletePost = deletePost;
const searchPosts = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            res.status(400).json({ message: 'Le paramètre query est requis' });
            return;
        }
        const posts = await post_service_1.PostService.searchPosts(query);
        res.json(posts);
    }
    catch (error) {
        console.error('Erreur recherche:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.searchPosts = searchPosts;
const getPopularHashtags = async (req, res) => {
    try {
        const hashtags = await post_service_1.PostService.getPopularHashtags();
        res.json(hashtags);
    }
    catch (error) {
        console.error('Erreur récupération hashtags:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};
exports.getPopularHashtags = getPopularHashtags;
const getPostLikers = async (req, res) => {
    try {
        const { postId } = req.params;
        const likers = await post_service_1.PostService.getPostLikers(postId);
        res.json(likers);
    }
    catch (error) {
        console.error('Erreur récupération likers:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};
exports.getPostLikers = getPostLikers;
const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await post_service_1.PostService.getPostById(postId);
        if (!post) {
            res.status(404).json({ success: false, message: 'Post non trouvé' });
            return;
        }
        res.json(post);
    }
    catch (error) {
        console.error('Erreur récupération post:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};
exports.getPostById = getPostById;
//# sourceMappingURL=post.controller.js.map