"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const review_model_1 = require("./review.model");
class ReviewService {
    static async createReview(professionalId, authorId, data) {
        try {
            const review = await review_model_1.Review.create({
                professional: professionalId,
                author: authorId,
                rating: data.rating,
                comment: data.comment
            });
            const populated = await review_model_1.Review.findById(review._id)
                .populate('author', 'nom photo')
                .lean();
            return populated;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new Error('You have already reviewed this professional');
            }
            throw error;
        }
    }
    static async getReviewsByProfessional(professionalId) {
        const reviews = await review_model_1.Review.find({ professional: professionalId })
            .populate('author', 'nom photo')
            .sort({ createdAt: -1 })
            .lean();
        return reviews;
    }
    static async getReviewStats(professionalId) {
        const reviews = await review_model_1.Review.find({ professional: professionalId });
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;
        const ratingDistribution = {
            1: reviews.filter(r => r.rating === 1).length,
            2: reviews.filter(r => r.rating === 2).length,
            3: reviews.filter(r => r.rating === 3).length,
            4: reviews.filter(r => r.rating === 4).length,
            5: reviews.filter(r => r.rating === 5).length
        };
        return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews,
            ratingDistribution
        };
    }
    static async deleteReview(reviewId, userId) {
        const review = await review_model_1.Review.findById(reviewId);
        if (!review) {
            throw new Error('Review not found');
        }
        if (review.author.toString() !== userId) {
            throw new Error('You can only delete your own reviews');
        }
        await review_model_1.Review.findByIdAndDelete(reviewId);
    }
    static async getUserReviewForProfessional(professionalId, userId) {
        const review = await review_model_1.Review.findOne({
            professional: professionalId,
            author: userId
        })
            .populate('author', 'nom photo')
            .lean();
        return review;
    }
}
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map