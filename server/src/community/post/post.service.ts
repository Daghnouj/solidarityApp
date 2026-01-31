import { Types } from 'mongoose';
import { Server } from 'socket.io';
import Post from './post.model';
import { Hashtag } from '../community.models';
import { IPost, CreatePostRequest, UpdatePostRequest } from './post.types';
import { extractHashtags } from '../utils/hashtagUtils';
import { NotificationService } from '../notification/notification.service';
import { AdminNotificationService } from '../../admin/adminNotification/adminNotification.service';

export class PostService {
  static async createPost(data: CreatePostRequest, user: any, io?: Server | null): Promise<IPost> {
    const hashtags = extractHashtags(data.content);

    const newPost = new Post({
      content: data.content,
      user: user._id,
      username: user.nom,
      userPhoto: user.photo,
      userRole: user.role,
      hashtags,
      isAnonymous: data.isAnonymous || false
    });

    await newPost.save();

    // Emit admin notification for new post
    if (io) {
      try {
        await AdminNotificationService.createNotification({
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
      } catch (notifError) {
        console.error('Error creating admin notification for new post:', notifError);
        // Don't fail the post creation if notification fails
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

        await Hashtag.bulkWrite(bulkOps, { ordered: false });
      } catch (error: any) {
        // Log l'erreur mais ne bloque pas la création du post
        console.error('Erreur lors de la mise à jour des hashtags:', error.message);
        // Optionnel: nettoyer les hashtags invalides
        await Hashtag.deleteMany({ name: null });
      }
    }

    return newPost;
  }

  static async addLike(postId: string, userId: Types.ObjectId, io?: any): Promise<any> {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error('Post introuvable');
    }

    const isLiking = !post.likedBy.some((id: Types.ObjectId) => id.equals(userId));

    await Post.findByIdAndUpdate(
      postId,
      {
        $inc: { likes: isLiking ? 1 : -1 },
        [isLiking ? '$addToSet' : '$pull']: { likedBy: userId }
      },
      { new: true }
    );

    if (isLiking && post.user.toString() !== userId.toString()) {
      await NotificationService.createNotification({
        recipientId: post.user,
        senderId: userId,
        type: 'like',
        postId: postId,
        metadata: { postPreview: (post.content as string)?.slice(0, 50) },
        io: io
      });
    }

    // Return the full populated post
    return await Post.findById(postId)
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

  static async getFavoritePosts(userId: string): Promise<IPost[]> {
    return await Post.find({ favorites: userId })
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

  static async getMyPosts(userId: string): Promise<IPost[]> {
    return await Post.find({ user: userId })
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

  static async getLikedPosts(userId: string): Promise<IPost[]> {
    return await Post.find({ likedBy: userId })
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

  static async getCommentedPosts(userId: string): Promise<IPost[]> {
    return await Post.find({ 'comments.user': userId })
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

  static async getAllPosts(): Promise<IPost[]> {
    return await Post.find()
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

  static async updatePost(postId: string, data: UpdatePostRequest, userId: Types.ObjectId): Promise<IPost> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    if (!post.user.equals(userId)) {
      throw new Error('Non autorisé');
    }

    const oldHashtags = post.hashtags;
    const newHashtags = extractHashtags(data.content);

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
      await Hashtag.bulkWrite(addOps);
    }

    if (removedHashtags.length > 0) {
      const removeOps = removedHashtags.map(tag => ({
        updateOne: {
          filter: { name: tag },
          update: { $inc: { count: -1 } }
        }
      }));
      await Hashtag.bulkWrite(removeOps);
      await Hashtag.deleteMany({ count: { $lte: 0 } });
    }

    return post;
  }

  static async deletePost(postId: string, userId: Types.ObjectId): Promise<void> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    if (!post.user.equals(userId)) {
      throw new Error('Non autorisé');
    }

    const postHashtags = post.hashtags;

    await Post.deleteOne({ _id: postId });

    if (postHashtags.length > 0) {
      await Hashtag.updateMany(
        { name: { $in: postHashtags } },
        { $inc: { count: -1 } }
      );
      await Hashtag.deleteMany({ count: { $lte: 0 } });
    }
  }

  static async searchPosts(query: string): Promise<IPost[]> {
    const cleanQuery = query.replace(/#/g, '');
    const searchRegex = new RegExp(cleanQuery, 'i');

    return await Post.find({
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


  static async getPopularHashtags(): Promise<any[]> {
    return await Post.aggregate([
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

  static async getPostLikers(postId: string): Promise<any[]> {
    const post = await Post.findById(postId).populate('likedBy', 'nom photo role');
    if (!post) {
      throw new Error('Post non trouvé');
    }
    return post.likedBy;
  }

  static async getPostById(postId: string): Promise<IPost | null> {
    return await Post.findById(postId)
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