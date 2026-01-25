import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Image as ImageIcon, Hash, RefreshCw } from "lucide-react";
import { useAuth } from "../../../pages/auth/hooks/useAuth";

interface DashboardAddPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (content: string) => Promise<void>;
}

const DashboardAddPostModal: React.FC<DashboardAddPostModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content);
            setContent("");
            onClose();
        } catch (error) {
            console.error("Failed to submit post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <form onSubmit={handleSubmit}>
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-900">Share with the Community</h3>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-gray-600 transition-all border border-transparent hover:border-gray-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <div className="flex gap-4 mb-4">
                                    <img
                                        src={user?.photo || user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.nom || user?.name}`}
                                        alt="Me"
                                        className="w-10 h-10 rounded-full border border-gray-100 object-cover"
                                    />
                                    <div className="flex-1">
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="What's on your mind? Share an insight, question, or story..."
                                            className="w-full h-32 bg-transparent text-gray-700 focus:outline-none transition-all resize-none mt-1"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold">
                                        <Hash size={14} />
                                        <span>Use #hashtags to tag topics</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors"
                                    >
                                        <ImageIcon size={14} />
                                        <span>Add Photo</span>
                                    </button>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!content.trim() || isSubmitting}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-300 disabled:opacity-50 disabled:shadow-none transition-all transform hover:-translate-y-0.5"
                                >
                                    {isSubmitting ? (
                                        <RefreshCw size={18} className="animate-spin" />
                                    ) : (
                                        <Send size={18} />
                                    )}
                                    <span>{isSubmitting ? 'Posting...' : 'Post Now'}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DashboardAddPostModal;
