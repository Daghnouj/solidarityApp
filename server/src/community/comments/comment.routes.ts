import express from 'express';

import { addComment, addReply, deleteComment, deleteReply, updateComment, updateReply } from './comment.controller';
import { protect } from '../../../middlewares/protect';

const router = express.Router();

router.post('/:postId/comment', protect, addComment);
router.post('/:postId/comments/:commentId/reply', protect, addReply);
router.put('/:postId/comments/:commentId', protect, updateComment);
router.delete('/:postId/comments/:commentId', protect, deleteComment);
router.put('/:postId/comments/:commentId/replies/:replyId', protect, updateReply);
router.delete('/:postId/comments/:commentId/replies/:replyId', protect, deleteReply 

);

export default router;