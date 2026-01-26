import { Types } from 'mongoose';
import Post from '../post/post.model';
import { createNotification } from '../notification/notification.service';
import {
  AddCommentRequest,
  AddReplyRequest,
  UpdateCommentRequest,
  UpdateReplyRequest,
  CreateCommentData,
  CreateReplyData
} from './comment.types';

export class CommentService {
  static async addComment(
    postId: string,
    data: AddCommentRequest,
    userId: Types.ObjectId,
    io?: any
  ): Promise<any> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    const newComment: CreateCommentData = {
      user: userId,
      text: data.comment.trim(),
      date: new Date(),
      edited: false,
      replies: []
    };

    post.comments.push(newComment as any); // Cast en any pour éviter l'erreur
    await post.save();

    if (post.user.toString() !== userId.toString()) {
      console.log('💬 Creating comment notification...');
      console.log('Post owner:', post.user.toString());
      console.log('Commenter:', userId.toString());
      console.log('io available:', !!io);
      await createNotification(
        post.user,
        userId,
        'comment',
        postId,
        {
          commentId: post.comments[post.comments.length - 1]._id,
          commentPreview: data.comment.slice(0, 50)
        },
        io
      );
      console.log('✅ Comment notification created');
    }

    const populatedPost = await Post.findById(postId)
      .populate('comments.user', 'nom photo role')
      .populate('comments.replies.user', 'nom photo role');

    return populatedPost.comments[populatedPost.comments.length - 1];
  }

  static async addReply(
    postId: string,
    commentId: string,
    data: AddReplyRequest,
    userId: Types.ObjectId,
    io?: any
  ): Promise<any> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    // Utilisez find() au lieu de .id()
    const comment = post.comments.find(c => c._id?.toString() === commentId);
    if (!comment) {
      throw new Error('Commentaire non trouvé');
    }

    const newReply: CreateReplyData = {
      user: userId,
      text: data.replyText.trim(),
      date: new Date(),
      edited: false
    };

    comment.replies.push(newReply as any); // Cast en any pour éviter l'erreur
    await post.save();

    if (comment.user.toString() !== userId.toString()) {
      await createNotification(
        comment.user,
        userId,
        'reply',
        postId,
        {
          commentId: commentId,
          replyId: comment.replies[comment.replies.length - 1]._id,
          replyPreview: data.replyText.slice(0, 50)
        },
        io
      );
    }

    const populatedPost = await Post.findById(postId)
      .populate('comments.user', 'nom photo role')
      .populate('comments.replies.user', 'nom photo role');

    // Utilisez find() ici aussi
    const populatedComment = populatedPost.comments.find(c => c._id?.toString() === commentId);
    if (!populatedComment) {
      throw new Error('Commentaire non trouvé après population');
    }

    return populatedComment.replies[populatedComment.replies.length - 1];
  }

  static async updateComment(
    postId: string,
    commentId: string,
    data: UpdateCommentRequest,
    userId: Types.ObjectId
  ): Promise<any> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    // Utilisez find() au lieu de .id()
    const comment = post.comments.find(c => c._id?.toString() === commentId);
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

  static async deleteComment(
    postId: string,
    commentId: string,
    userId: Types.ObjectId
  ): Promise<void> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    // Utilisez find() au lieu de .id()
    const comment = post.comments.find(c => c._id?.toString() === commentId);
    if (!comment) {
      throw new Error('Commentaire non trouvé');
    }

    if (!comment.user.equals(userId)) {
      throw new Error('Non autorisé à supprimer ce commentaire');
    }

    post.comments = post.comments.filter(c => c._id?.toString() !== commentId);
    await post.save();
  }

  static async updateReply(
    postId: string,
    commentId: string,
    replyId: string,
    data: UpdateReplyRequest,
    userId: Types.ObjectId
  ): Promise<any> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    // Utilisez find() au lieu de .id()
    const comment = post.comments.find(c => c._id?.toString() === commentId);
    if (!comment) {
      throw new Error('Commentaire non trouvé');
    }

    // Utilisez find() pour replies aussi
    const reply = comment.replies.find(r => r._id?.toString() === replyId);
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

  static async deleteReply(
    postId: string,
    commentId: string,
    replyId: string,
    userId: Types.ObjectId
  ): Promise<void> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post non trouvé');
    }

    // Utilisez find() au lieu de .id()
    const comment = post.comments.find(c => c._id?.toString() === commentId);
    if (!comment) {
      throw new Error('Commentaire non trouvé');
    }

    // Utilisez find() pour replies aussi
    const reply = comment.replies.find(r => r._id?.toString() === replyId);
    if (!reply) {
      throw new Error('Réponse non trouvée');
    }

    if (!reply.user.equals(userId)) {
      throw new Error('Non autorisé à supprimer cette réponse');
    }

    comment.replies = comment.replies.filter(r => r._id?.toString() !== replyId);
    await post.save();
  }
}