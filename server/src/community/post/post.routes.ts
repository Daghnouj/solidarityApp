import express from 'express';

import { protect } from '../../../middlewares/protect';
import { addLike, createPost, deletePost, getAllPosts, getMyPosts, getSavedPosts, getLikedPosts, getCommentedPosts, getPopularHashtags, searchPosts, updatePost } from './post.controller';

const router = express.Router();

router.post('/addPost', protect, createPost);
router.post('/:postId/like', protect, addLike);
router.get('/me', protect, getMyPosts);
router.get('/saved', protect, getSavedPosts);
router.get('/liked', protect, getLikedPosts);
router.get('/commented', protect, getCommentedPosts);
router.get('/', getAllPosts);
router.put('/:postId', protect, updatePost);
router.delete('/:postId', protect, deletePost);
router.get('/search', searchPosts);
router.get('/hashtags/popular', getPopularHashtags);


export default router; 