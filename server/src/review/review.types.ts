import { IReview } from './review.model';

export interface CreateReviewDto {
    professional: string;
    rating: number;
    comment: string;
}

export interface ReviewResponse {
    _id: string;
    professional: string;
    author: {
        _id: string;
        nom: string;
        photo?: string;
    };
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

export { IReview };
