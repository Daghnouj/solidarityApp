import { Review } from './review.model';
import { CreateReviewDto, ReviewResponse, ReviewStats } from './review.types';
import mongoose from 'mongoose';

export class ReviewService {
    static async createReview(
        professionalId: string,
        authorId: string,
        data: CreateReviewDto
    ): Promise<ReviewResponse> {
        try {
            const review = await Review.create({
                professional: professionalId,
                author: authorId,
                rating: data.rating,
                comment: data.comment
            });

            const populated = await Review.findById(review._id)
                .populate('author', 'nom photo')
                .lean();

            return populated as unknown as ReviewResponse;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new Error('You have already reviewed this professional');
            }
            throw error;
        }
    }

    static async getReviewsByProfessional(professionalId: string): Promise<ReviewResponse[]> {
        const reviews = await Review.find({ professional: professionalId })
            .populate('author', 'nom photo')
            .sort({ createdAt: -1 })
            .lean();

        return reviews as unknown as ReviewResponse[];
    }

    static async getReviewStats(professionalId: string): Promise<ReviewStats> {
        const reviews = await Review.find({ professional: professionalId });

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

    static async deleteReview(reviewId: string, userId: string): Promise<void> {
        const review = await Review.findById(reviewId);

        if (!review) {
            throw new Error('Review not found');
        }

        if (review.author.toString() !== userId) {
            throw new Error('You can only delete your own reviews');
        }

        await Review.findByIdAndDelete(reviewId);
    }

    static async getUserReviewForProfessional(
        professionalId: string,
        userId: string
    ): Promise<ReviewResponse | null> {
        const review = await Review.findOne({
            professional: professionalId,
            author: userId
        })
            .populate('author', 'nom photo')
            .lean();

        return review as unknown as ReviewResponse;
    }
}
