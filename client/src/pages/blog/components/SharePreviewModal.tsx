import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Globe, Calendar, User } from 'lucide-react';
import SocialShare from './SocialShare';

interface SharePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: {
        title: string;
        summary?: string;
        excerpt?: string;
        coverImage?: string;
        authorName: string;
        publishedAt?: string;
        createdAt: string;
    };
    url: string;
}

const SharePreviewModal: React.FC<SharePreviewModalProps> = ({ isOpen, onClose, article, url }) => {
    if (!isOpen) return null;

    const domain = window.location.hostname;
    const date = new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2 text-blue-900">
                            <Share2 size={20} className="text-blue-600" />
                            <h3 className="font-bold text-lg font-display">Share Article</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        <p className="text-sm text-gray-500 mb-4 font-medium">
                            This is how your post will look when shared:
                        </p>

                        {/* Social Card Preview */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 mb-8 shadow-sm group hover:shadow-md transition-shadow">
                            {/* Image Part */}
                            <div className="relative aspect-[1.91/1] bg-gray-200 overflow-hidden">
                                {article.coverImage ? (
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                                        <Share2 className="text-white/20 w-20 h-20" />
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <p className="text-white/90 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                        <Globe size={12} /> {domain}
                                    </p>
                                </div>
                            </div>

                            {/* Text Part */}
                            <div className="p-4 bg-white">
                                <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 font-display">
                                    {article.title}
                                </h4>
                                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-3">
                                    {article.excerpt || article.summary || "Read this inspiring article on Solidarity."}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
                                    <span className="flex items-center gap-1.5">
                                        <User size={12} /> {article.authorName}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={12} /> {date}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Share Buttons */}
                        <div className="text-center">
                            <p className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                                Select a platform
                            </p>
                            <div className="flex justify-center">
                                <SocialShare url={url} title={article.title} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SharePreviewModal;
