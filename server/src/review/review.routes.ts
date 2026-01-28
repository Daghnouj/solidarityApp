import { Router } from 'express';
import { ReviewController } from './review.controller';
import { protect } from '../../middlewares/protect';

const router = Router();

// Create a review (authenticated users only)
router.post('/', protect, ReviewController.createReview);

// Get reviews for a professional (public)
router.get('/professional/:professionalId', ReviewController.getReviewsByProfessional);

// Get user's own review for a professional (authenticated)
router.get('/professional/:professionalId/my-review', protect, ReviewController.getUserReview);

// Delete a review (author only)
router.delete('/:reviewId', protect, ReviewController.deleteReview);

export default router;
