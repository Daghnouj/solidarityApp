import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { reviewService } from '../services/reviewService';
import toast from 'react-hot-toast';

interface ReviewFormProps {
    professionalId: string;
    professionalName: string;
    onClose: () => void;
    onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ professionalId, professionalName, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please write a review');
            return;
        }

        setIsSubmitting(true);
        try {
            await reviewService.submitReview(professionalId, rating, comment);
            toast.success('Review submitted successfully!');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">Write a Review</h2>
                <p className="text-slate-600 mb-6">Share your experience with {professionalName}</p>

                <form onSubmit={handleSubmit}>
                    {/* Star Rating */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Your Rating
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={32}
                                        fill={(hoverRating || rating) >= star ? '#F5A146' : 'transparent'}
                                        style={{ color: (hoverRating || rating) >= star ? '#F5A146' : '#d1d5db' }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Your Review
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
                            style={{ focusRingColor: '#4FB2E5' }}
                            rows={5}
                            maxLength={1000}
                        />
                        <p className="text-sm text-slate-400 mt-2">{comment.length}/1000 characters</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                            style={{ backgroundColor: '#4FB2E5' }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;
