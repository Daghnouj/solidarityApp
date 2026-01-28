import React, { useState, useEffect } from 'react';
import { Star, Quote, Plus } from 'lucide-react';
import type { Professional } from '../../Professionals/types';
import { reviewService } from '../services/reviewService';
import type { Review, ReviewStats } from '../services/reviewService';
import ReviewForm from './ReviewForm';
import toast from 'react-hot-toast';

interface ProfileReviewsProps {
    professional: Professional;
}

const ProfileReviews: React.FC<ProfileReviewsProps> = ({ professional }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userReview, setUserReview] = useState<Review | null>(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewService.getReviews(professional._id);
            setReviews(response.data.reviews);
            setStats(response.data.stats);

            // Check if user has already reviewed
            const token = localStorage.getItem('token');
            if (token) {
                const existingReview = await reviewService.getUserReview(professional._id);
                setUserReview(existingReview);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [professional._id]);

    const handleReviewSuccess = () => {
        fetchReviews();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="h-20 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Client Reviews</h3>
                    <div className="flex items-center gap-2">
                        {stats && stats.totalReviews > 0 ? (
                            <>
                                <Star size={24} fill="#F5A146" style={{ color: '#F5A146' }} />
                                <span className="text-2xl font-bold text-slate-900">
                                    {stats.averageRating.toFixed(1)}
                                </span>
                                <span className="text-slate-500">({stats.totalReviews} reviews)</span>
                            </>
                        ) : (
                            <span className="text-slate-500">No reviews yet</span>
                        )}
                    </div>
                </div>

                {/* Write Review Button */}
                {!userReview && (
                    <button
                        onClick={() => setShowReviewForm(true)}
                        className="mb-6 px-6 py-3 text-white rounded-xl font-semibold flex items-center gap-2 transition-all hover:shadow-md"
                        style={{ backgroundColor: '#4FB2E5' }}
                    >
                        <Plus size={20} />
                        Write a Review
                    </button>
                )}

                {userReview && (
                    <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#4FB2E520', border: '1px solid #4FB2E5' }}>
                        <p className="text-sm font-medium" style={{ color: '#4FB2E5' }}>
                            ✓ You have already reviewed this professional
                        </p>
                    </div>
                )}

                {/* Reviews List */}
                {reviews.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-slate-50 rounded-xl p-6 relative">
                                <Quote className="absolute top-4 right-4" size={40} style={{ color: '#FF90BC20' }} />
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill={i < review.rating ? '#F5A146' : 'transparent'}
                                            style={{ color: i < review.rating ? '#F5A146' : '#d1d5db' }}
                                        />
                                    ))}
                                </div>
                                <p className="text-slate-700 italic mb-4 relative z-10">"{review.comment}"</p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-slate-900">{review.author.nom}</span>
                                    <span className="text-slate-400">{formatDate(review.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-lg">No reviews yet. Be the first to review!</p>
                    </div>
                )}
            </div>

            {showReviewForm && (
                <ReviewForm
                    professionalId={professional._id}
                    professionalName={professional.nom}
                    onClose={() => setShowReviewForm(false)}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </>
    );
};

export default ProfileReviews;
