import { Request, Response } from 'express';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './review.types';

export class ReviewController {
    static async createReview(req: Request, res: Response) {
        try {
            const { professional, rating, comment } = req.body as CreateReviewDto;
            const authorId = (req as any).user._id;

            if (!professional || !rating || !comment) {
                return res.status(400).json({
                    success: false,
                    message: 'Professional ID, rating, and comment are required'
                });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }

            const review = await ReviewService.createReview(
                professional,
                authorId,
                { professional, rating, comment }
            );

            res.status(201).json({
                success: true,
                data: review
            });
        } catch (error: any) {
            console.error('Error creating review:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to create review'
            });
        }
    }

    static async getReviewsByProfessional(req: Request, res: Response) {
        try {
            const { professionalId } = req.params;

            const reviews = await ReviewService.getReviewsByProfessional(professionalId);
            const stats = await ReviewService.getReviewStats(professionalId);

            res.json({
                success: true,
                data: {
                    reviews,
                    stats
                }
            });
        } catch (error: any) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch reviews'
            });
        }
    }

    static async deleteReview(req: Request, res: Response) {
        try {
            const { reviewId } = req.params;
            const userId = (req as any).user._id;

            await ReviewService.deleteReview(reviewId, userId);

            res.json({
                success: true,
                message: 'Review deleted successfully'
            });
        } catch (error: any) {
            console.error('Error deleting review:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to delete review'
            });
        }
    }

    static async getUserReview(req: Request, res: Response) {
        try {
            const { professionalId } = req.params;
            const userId = (req as any).user._id;

            const review = await ReviewService.getUserReviewForProfessional(
                professionalId,
                userId
            );

            res.json({
                success: true,
                data: review
            });
        } catch (error: any) {
            console.error('Error fetching user review:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user review'
            });
        }
    }
}
