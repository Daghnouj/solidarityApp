import React, { useState } from 'react';
import type { ActivityCenter } from '../types';
import { X, Globe, MapPin, Calendar, Clock, ChevronLeft, ChevronRight, Phone, Send, Star } from 'lucide-react';

interface CenterDetailsModalProps {
    center: ActivityCenter | null;
    isOpen: boolean;
    onClose: () => void;
    onNavigateToMap: (coordinates: string) => void;
}

const CenterDetailsModal: React.FC<CenterDetailsModalProps> = ({ center, isOpen, onClose, onNavigateToMap }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isJoining, setIsJoining] = useState(false);
    const [localParticipantCount, setLocalParticipantCount] = useState(center?.participants.length || 0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPhonePrompt, setShowPhonePrompt] = useState(false);
    const [userPhone, setUserPhone] = useState('');
    const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [isRating, setIsRating] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    // Re-sync local count when center changes
    React.useEffect(() => {
        if (center) {
            setLocalParticipantCount(center.participants.length);
            setShowSuccess(false);
        }
    }, [center]);

    if (!isOpen || !center) return null;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isMember = center.participants.includes(user._id);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % center.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + center.images.length) % center.images.length);
    };

    const handleParticipate = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to participate.');
            return;
        }

        try {
            setIsJoining(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/events/${center._id}/participate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error during participation');

            const data = await response.json();
            setLocalParticipantCount(data.participantCount);

            if (data.isParticipating) {
                setShowSuccess(true);
                // Always show phone prompt so the center can contact the member
                setUserPhone(user.telephone || '');
                setShowPhonePrompt(true);
                // Hide success message after 5 seconds
                setTimeout(() => setShowSuccess(false), 5000);
            } else {
                setShowSuccess(false);
                setShowPhonePrompt(false);
            }

            // Note: Since 'center' prop is immutable here, we rely on localParticipantCount 
            // and we would ideally need to update the parent state or re-fetch.
            // For now, we update the local member list for the reveal logic.
            if (data.isParticipating) {
                center.participants.push(user._id);
            } else {
                center.participants = center.participants.filter(id => id !== user._id);
            }

        } catch (error) {
            console.error('Participation error:', error);
            alert('An error occurred during participation.');
        } finally {
            setIsJoining(false);
        }
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userPhone.trim()) return;

        const token = localStorage.getItem('token');
        if (!token || !user._id) return;

        try {
            setIsUpdatingPhone(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/users/profile/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ telephone: userPhone })
            });

            if (!response.ok) throw new Error('Error during update');

            const result = await response.json();
            // Mettre à jour le localStorage
            localStorage.setItem('user', JSON.stringify(result.data));
            setShowPhonePrompt(false);
            alert('Your number has been saved. The center will contact you soon.');
        } catch (error) {
            console.error('Phone update error:', error);
            alert('An error occurred while saving the number.');
        } finally {
            setIsUpdatingPhone(false);
        }
    };

    const handleRate = async (ratingValue: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to rate.');
            return;
        }

        try {
            setIsRating(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/events/${center._id}/rate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating: ratingValue })
            });

            if (!response.ok) throw new Error('Error during rating');

            const data = await response.json();
            setUserRating(ratingValue);

            // Hacky way to update local UI without full re-fetch
            center.averageRating = data.averageRating;
            center.numberOfRatings = data.numberOfRatings;

        } catch (error) {
            console.error('Rating error:', error);
            alert('Une erreur est survenue lors de la notation.');
        } finally {
            setIsRating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div
                className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col lg:flex-row">
                    {/* Left Side: Images */}
                    <div className="lg:w-1/2 relative bg-gray-100 h-[300px] lg:h-auto min-h-[400px]">
                        <img
                            src={center.images[currentImageIndex]}
                            alt={center.name}
                            className="w-full h-full object-cover"
                        />

                        {/* Carousel Controls */}
                        {center.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>

                                {/* Dots */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                    {center.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Side: Details */}
                    <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col gap-8">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                {center.category && (
                                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
                                        {center.category}
                                    </span>
                                )}
                                <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                    {center.name}
                                </h2>
                            </div>
                            <div className="flex flex-col items-end gap-1 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-blue-600 font-black text-2xl leading-none">{localParticipantCount}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Members</span>
                            </div>
                        </div>

                        {/* Star Rating Interaction */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Average Rating</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-orange-400">
                                            <Star size={20} className="fill-current" />
                                            <span className="text-2xl font-black text-gray-900">{center.averageRating.toFixed(1)}</span>
                                        </div>
                                        <span className="text-sm text-gray-500 font-medium">({center.numberOfRatings} reviews)</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Your Rating</p>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => handleRate(star)}
                                                disabled={isRating}
                                                className="transition-transform hover:scale-125 focus:outline-none disabled:opacity-50"
                                            >
                                                <Star
                                                    size={24}
                                                    className={`${star <= (hoverRating || userRating)
                                                        ? 'text-orange-400 fill-current'
                                                        : 'text-gray-300'
                                                        } transition-colors duration-200`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {userRating > 0 && (
                                <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest text-center border-t border-gray-200 pt-3 mt-1">
                                    Thank you for your review!
                                </p>
                            )}
                        </div>

                        {/* Success Message */}
                        {showSuccess && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-bounce">
                                <div className="bg-green-500 text-white p-1 rounded-full">
                                    <Clock size={16} />
                                </div>
                                <p className="text-sm font-bold">Congratulations! You are now a member of this center.</p>
                            </div>
                        )}

                        {/* Phone Prompt */}
                        {showPhonePrompt && (
                            <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-6 animate-scale-up">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Would you like to be contacted?</h4>
                                        <p className="text-xs text-gray-600">Leave your number so the center can call you.</p>
                                    </div>
                                </div>
                                <form onSubmit={handlePhoneSubmit} className="flex gap-2">
                                    <input
                                        type="tel"
                                        placeholder="Your phone number"
                                        value={userPhone}
                                        onChange={(e) => setUserPhone(e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-xl border-2 border-orange-100 focus:border-orange-500 outline-none text-sm transition-all"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isUpdatingPhone}
                                        className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {isUpdatingPhone ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Send size={20} />
                                        )}
                                    </button>
                                </form>
                                <button
                                    onClick={() => setShowPhonePrompt(false)}
                                    className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                                >
                                    Not now
                                </button>
                            </div>
                        )}

                        {/* Participation Action */}
                        <button
                            onClick={handleParticipate}
                            disabled={isJoining}
                            className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 shadow-xl ${isJoining
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : isMember
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-100 shadow-none'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 shadow-lg'
                                }`}
                        >
                            {isJoining ? (
                                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Calendar size={20} />
                                    {isMember ? 'Leave this center' : 'Join this center'}
                                </>
                            )}
                        </button>

                        {/* Member Info Revealed */}
                        {isMember && (center.phone || center.email) && (
                            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100 animate-fade-in">
                                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Exclusive Member Info</p>
                                <div className="space-y-4">
                                    {center.phone && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Clock size={18} className="text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
                                                <p className="text-gray-900 font-bold">{center.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                    {center.email && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Globe size={18} className="text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                                                <p className="text-gray-900 font-bold">{center.email}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Main Info Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg shrink-0">
                                    <MapPin size={20} className="text-orange-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-tighter">Location</p>
                                    <p className="text-gray-700 font-medium text-sm mt-0.5">{center.address}</p>
                                    {center.coordinates && (
                                        <button
                                            onClick={() => onNavigateToMap(center.coordinates!)}
                                            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 transition-all duration-200 border border-blue-100 hover:border-blue-200 group"
                                        >
                                            <MapPin size={16} />
                                            View on Map
                                            <Send size={14} className="transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform -rotate-45" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {center.website && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                                        <Globe size={20} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-tighter">Website</p>
                                        <a
                                            href={center.website.startsWith('http') ? center.website : `https://${center.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 font-medium hover:underline break-all"
                                        >
                                            {center.website}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-tighter mb-2">Description</p>
                            <div className="prose prose-sm text-gray-600 max-w-none">
                                {center.description}
                            </div>
                        </div>

                        {/* Schedule / Activities */}
                        {center.activities.length > 0 && (
                            <div>
                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-tighter mb-4 flex items-center gap-2">
                                    <Calendar size={16} /> Weekly Schedule
                                </p>
                                <div className="grid grid-cols-1 gap-3">
                                    {center.activities.map((activity, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                                        >
                                            <span className="font-bold text-gray-900">{activity.name}</span>
                                            <div className="flex items-center gap-1.5 text-blue-600 font-medium text-sm">
                                                <Clock size={14} />
                                                {activity.day}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CenterDetailsModal;
