import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, BookOpen, ExternalLink, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BlogAuthor } from '../types';

interface AuthorProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    author: BlogAuthor | null;
    fallbackName?: string;
    fallbackPhoto?: string;
    fallbackRole?: string;
}

const AuthorProfileModal: React.FC<AuthorProfileModalProps> = ({
    isOpen,
    onClose,
    author,
    fallbackName,
    fallbackPhoto,
    fallbackRole
}) => {
    // If no author object AND no fallback name, we shouldn't show anything
    if (!author && !fallbackName) return null;

    const displayName = author ? `${author.prenom || ''} ${author.nom}`.trim() : fallbackName;
    const displayPhoto = author?.photo || fallbackPhoto;
    const displayRole = author?.role || fallbackRole;
    const displaySpecialite = author?.specialite;
    const displayBio = author?.bio;
    const displayId = author?._id;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header Image/Pattern */}
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-md"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="px-8 pb-10 -mt-16 text-center">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white mx-auto">
                                    {displayPhoto ? (
                                        <img
                                            src={displayPhoto}
                                            alt={displayName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                            <User size={48} />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm" title="Active Author" />
                            </div>

                            <h2 className="text-3xl font-black text-blue-900 mb-2">
                                {displayName}
                            </h2>

                            <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${displayRole === 'admin'
                                    ? 'bg-purple-50 text-purple-700 border-purple-100'
                                    : 'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                    {displayRole === 'admin' ? 'Strategic Lead' : 'Care Specialist'}
                                </span>
                                {displaySpecialite && (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                        <Award size={14} className="text-orange-500" />
                                        {displaySpecialite}
                                    </span>
                                )}
                            </div>

                            <div className="bg-blue-50/50 rounded-2xl p-6 mb-8 border border-blue-100/30">
                                <p className="text-gray-600 leading-relaxed text-sm italic">
                                    "{displayBio || `Specialist dedicated to mental health and well-being within the Solidarity community.`}"
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Link
                                    to={`/blog?author=${displayId}`}
                                    onClick={onClose}
                                    className={`flex items-center justify-center gap-2 py-4 bg-white border-2 border-blue-100 text-blue-600 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-sm ${!displayId && 'opacity-50 pointer-events-none'}`}
                                >
                                    <BookOpen size={18} />
                                    Read Articles
                                </Link>
                                <Link
                                    to={`/professionals/${displayId}`}
                                    onClick={onClose}
                                    className={`flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 ${!displayId && 'opacity-50 pointer-events-none'}`}
                                >
                                    <ExternalLink size={18} />
                                    Full Profile
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthorProfileModal;
