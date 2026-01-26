import { Types } from 'mongoose';
import Post from '../post/post.model';

export class FavorisService {
  static async toggleFavorite(postId: string, userId: Types.ObjectId): Promise<any> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    const index = post.favorites.findIndex((id: any) => id.equals(userId));
    if (index !== -1) {
      post.favorites.splice(index, 1);
    } else {
      post.favorites.push(userId);
    }

    await post.save();

    const populatedPost = await Post.findById(postId)
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
