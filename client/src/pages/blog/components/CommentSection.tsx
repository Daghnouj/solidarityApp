import React, { useState } from 'react';
import { FaPaperPlane, FaUserSecret, FaTrash, FaReply } from 'react-icons/fa';
import type { BlogComment } from '../types';

interface CommentSectionProps {
    comments: BlogComment[];
    onAddComment: (text: string, isAnonymous: boolean) => Promise<void>;
    onDeleteComment: (commentId: string) => Promise<void>;
    currentUserId: string | null;
    isAdmin: boolean; // Added isAdmin prop for role comparison
}

const CommentSection: React.FC<CommentSectionProps> = ({
    comments,
    onAddComment,
    onDeleteComment,
    currentUserId,
    isAdmin // Destructured isAdmin
}) => {
    const [commentText, setCommentText] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            await onAddComment(commentText, isAnonymous);
            setCommentText('');
            setIsAnonymous(false);
        } catch (error) {
            // Error handling is managed by the hook/parent
        } finally {
            setIsSubmitting(false);
        }
    };

    const getAvatar = (photo?: string, name?: string) => {
        if (photo && photo !== 'default.png' && photo !== 'default-avatar.png' && typeof photo === 'string' && photo.includes('http')) return photo;
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;
    };

    return (
        <div className="mt-12 bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                Comments <span className="text-blue-500 bg-blue-50 px-3 py-1 rounded-full text-sm">{comments.length}</span>
            </h3>

            {/* Comment Form */}
            {currentUserId ? (
                <form onSubmit={handleSubmit} className="mb-10">
                    <div className="relative">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Share your thoughts or ask a question..."
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all min-h-[120px] resize-none"
                            required
                        />
                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isAnonymous ? 'bg-blue-500' : 'bg-gray-200'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isAnonymous ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                />
                                <span className="text-sm font-medium text-gray-600 group-hover:text-blue-500 transition-colors flex items-center gap-1">
                                    <FaUserSecret className={isAnonymous ? 'text-blue-500' : 'text-gray-400'} />
                                    Comment anonymously
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={isSubmitting || !commentText.trim()}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
                            >
                                {isSubmitting ? 'Sending...' : (
                                    <>
                                        Send <FaPaperPlane className="text-xs" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center mb-10">
                    <p className="text-blue-800 font-medium mb-3">Log in to join the discussion</p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Log in
                    </button>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="text-5xl mb-4">💬</div>
                        <p className="text-gray-500 italic">Be the first to comment on this article!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <img
                                src={comment.isAnonymous ? getAvatar(undefined, "AU") : getAvatar(comment.userPhoto, comment.username)}
                                alt={comment.isAnonymous ? 'Anonymous' : comment.username}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-900">
                                            {comment.isAnonymous ? 'Anonymous User' : comment.username}
                                        </h4>
                                        {comment.userRole === 'professional' && (
                                            <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">PRO</span>
                                        )}
                                        {comment.userRole === 'admin' && (
                                            <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">ADMIN</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(comment.date).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                                    {comment.text}
                                </p>
                                <div className="mt-3 flex items-center gap-4">
                                    <button className="text-xs font-semibold text-gray-500 hover:text-blue-500 flex items-center gap-1 transition-colors">
                                        <FaReply className="text-[10px]" /> Reply
                                    </button>
                                    {(currentUserId === comment.user || currentUserId === 'admin' || (currentUserId && isAdmin)) && (
                                        <button
                                            onClick={() => onDeleteComment(comment._id)}
                                            className="text-xs font-semibold text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                                        >
                                            <FaTrash className="text-[10px]" /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
