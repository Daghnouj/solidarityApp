"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const review_service_1 = require("./review.service");
class ReviewController {
    static async createReview(req, res) {
        try {
            const { professional, rating, comment } = req.body;
            const authorId = req.user._id;
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
            const review = await review_service_1.ReviewService.createReview(professional, authorId, { professional, rating, comment });
            res.status(201).json({
                success: true,
                data: review
            });
        }
        catch (error) {
            console.error('Error creating review:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to create review'
            });
        }
    }
    static async getReviewsByProfessional(req, res) {
        try {
            const { professionalId } = req.params;
            const reviews = await review_service_1.ReviewService.getReviewsByProfessional(professionalId);
            const stats = await review_service_1.ReviewService.getReviewStats(professionalId);
            res.json({
                success: true,
                data: {
                    reviews,
                    stats
                }
            });
        }
        catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch reviews'
            });
        }
    }
    static async deleteReview(req, res) {
        try {
            const { reviewId } = req.params;
            const userId = req.user._id;
            await review_service_1.ReviewService.deleteReview(reviewId, userId);
            res.json({
                success: true,
                message: 'Review deleted successfully'
            });
        }
        catch (error) {
            console.error('Error deleting review:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to delete review'
            });
        }
    }
    static async getUserReview(req, res) {
        try {
            const { professionalId } = req.params;
            const userId = req.user._id;
            const review = await review_service_1.ReviewService.getUserReviewForProfessional(professionalId, userId);
            res.json({
                success: true,
                data: review
            });
        }
        catch (error) {
            console.error('Error fetching user review:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user review'
            });
        }
    }
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.controller.js.map