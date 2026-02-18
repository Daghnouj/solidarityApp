"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavorisService = void 0;
const post_model_1 = __importDefault(require("../post/post.model"));
class FavorisService {
    static async toggleFavorite(postId, userId) {
        const post = await post_model_1.default.findById(postId);
        if (!post) {
            throw new Error('Post non trouvé');
        }
        const index = post.favorites.findIndex((id) => id.equals(userId));
        if (index !== -1) {
            post.favorites.splice(index, 1);
        }
        else {
            post.favorites.push(userId);
        }
        await post.save();
        const populatedPost = await post_model_1.default.findById(postId)
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
        return {
            success: true,
            message: index !== -1 ? 'Favori retiré' : 'Ajouté aux favoris',
            post: populatedPost
        };
    }
}
exports.FavorisService = FavorisService;
//# sourceMappingURL=favorites.service.js.map