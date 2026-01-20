import { Types } from 'mongoose';
import Post from '../post/post.model';

export class FavorisService {
  static async toggleFavorite(postId: string, userId: Types.ObjectId): Promise<any> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    const index = post.favorites.indexOf(userId);
    if (index !== -1) {
      post.favorites.splice(index, 1);
      await post.save();
      return { message: 'Favori retiré', isFavorite: false };
    } else {
      post.favorites.push(userId);
      await post.save();
      return { message: 'Ajouté aux favoris', isFavorite: true };
    }
  }
}
