import express from 'express';

import { protect } from '../../../middlewares/protect';
import { toggleFavorite } from './favorites.controller';
const router = express.Router();

router.post('/toggle/:postId', protect, toggleFavorite);

export default router;