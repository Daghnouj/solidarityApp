import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/reviews`;

export interface Review {
    _id: string;
    professional: string;
    author: {
        _id: string;
        nom: string;
        photo?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
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

export interface ReviewsResponse {
    success: boolean;
    data: {
        reviews: Review[];
        stats: ReviewStats;
    };
}

export const reviewService = {
    async getReviews(professionalId: string): Promise<ReviewsResponse> {
        const response = await axios.get(`${API_URL}/professional/${professionalId}`);
        return response.data;
    },

    async submitReview(professionalId: string, rating: number, comment: string): Promise<Review> {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            API_URL,
            { professional: professionalId, rating, comment },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data.data;
    },

    async deleteReview(reviewId: string): Promise<void> {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/${reviewId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    async getUserReview(professionalId: string): Promise<Review | null> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/professional/${professionalId}/my-review`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            return null;
        }
    }
};
