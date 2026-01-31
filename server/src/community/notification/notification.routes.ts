import express from 'express';
import {
  getUserNotifications,
  markAsRead,
  markOneAsRead
} from './notification.controller';
import { protect } from '../../../middlewares/protect';

const router = express.Router();

router.get('/', protect, getUserNotifications);
router.patch('/mark-read', protect, markAsRead);
router.patch('/:id/mark-read', protect, markOneAsRead);

export default router;