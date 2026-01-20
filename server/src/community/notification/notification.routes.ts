import express from 'express';
import { 
  getUserNotifications,
  markAsRead
} from './notification.controller';
import { protect } from '../../../middlewares/protect';

const router = express.Router();

router.get('/', protect, getUserNotifications);
router.patch('/mark-read', protect, markAsRead);

export default router;