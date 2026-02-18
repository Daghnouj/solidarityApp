import express from 'express';
import { chatWithAI } from './ai-chat.controller';
import { protect } from '../../middlewares/protect';

const router = express.Router();

// Protected route - only logged in users can chat with AI
router.post('/message', protect, chatWithAI);

export default router;
