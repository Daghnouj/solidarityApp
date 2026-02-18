"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protect_1 = require("../../../middlewares/protect");
const post_controller_1 = require("./post.controller");
const router = express_1.default.Router();
router.post('/addPost', protect_1.protect, post_controller_1.createPost);
router.post('/:postId/like', protect_1.protect, post_controller_1.addLike);
router.get('/me', protect_1.protect, post_controller_1.getMyPosts);
router.get('/saved', protect_1.protect, post_controller_1.getSavedPosts);
router.get('/liked', protect_1.protect, post_controller_1.getLikedPosts);
router.get('/commented', protect_1.protect, post_controller_1.getCommentedPosts);
router.get('/:postId/likers', post_controller_1.getPostLikers);
router.get('/:postId', post_controller_1.getPostById);
router.get('/', post_controller_1.getAllPosts);
router.put('/:postId', protect_1.protect, post_controller_1.updatePost);
router.delete('/:postId', protect_1.protect, post_controller_1.deletePost);
router.get('/search', post_controller_1.searchPosts);
router.get('/hashtags/popular', post_controller_1.getPopularHashtags);
exports.default = router;
//# sourceMappingURL=post.routes.js.map