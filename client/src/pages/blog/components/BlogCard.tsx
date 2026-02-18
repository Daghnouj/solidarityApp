import React from 'react';
import type { BlogArticle } from '../types';
import { Link } from 'react-router-dom';
import { Eye, Heart, Clock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogCardProps {
    article: BlogArticle;
    index?: number;
    variant?: 'standard' | 'featured-main' | 'featured-side';
    onAuthorClick?: (author: any) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ article, index = 0, variant = 'standard', onAuthorClick }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleAuthorClick = (e: React.MouseEvent) => {
        if (onAuthorClick) {
            e.preventDefault();
            e.stopPropagation();
            onAuthorClick(article.author);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
        >
            <Link to={`/blog/${article.slug}`} className="block group h-full">
                <article className={`relative bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col border border-blue-200 hover:border-blue-300 group ${variant === 'featured-main' ? 'min-h-[500px]' : ''}`}>

                    {/* Image Area */}
                    <div className={`relative overflow-hidden bg-blue-50 ${variant === 'featured-main' ? 'absolute inset-0 h-full w-full' :
                        variant === 'featured-side' ? 'h-48' : 'h-64'
                        }`}>
                        {article.coverImage ? (
                            <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                                <span className={`filter grayscale opacity-40 ${variant === 'featured-main' ? 'text-9xl' : 'text-6xl'}`}>📄</span>
                            </div>
                        )}

                        {/* Overlay Gradient for Main Feature */}
                        {variant === 'featured-main' && (
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent" />
                        )}

                        {/* Glass Overlay for Category */}
                        <div className="absolute top-6 left-6 z-10">
                            <span className={`px-5 py-2 rounded-full text-xs font-bold shadow-sm backdrop-blur-md border ${variant === 'featured-main'
                                ? 'bg-white/20 text-white border-white/30'
                                : 'bg-white/80 text-blue-700 border-white/40'
                                }`}>
                                {article.category}
                            </span>
                        </div>

                        {/* Featured Badge */}
                        {article.featured && (
                            <div className="absolute top-6 right-6 z-10 bg-orange-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-orange-400">
                                ⭐ Featured
                            </div>
                        )}

                        {variant !== 'featured-main' && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 flex flex-col ${variant === 'featured-main'
                        ? 'relative z-10 justify-end p-10 mt-auto'
                        : 'p-8'
                        }`}>
                        <h3 className={`font-bold mb-4 line-clamp-2 leading-tight transition-colors duration-300 ${variant === 'featured-main'
                            ? 'text-3xl md:text-5xl text-white group-hover:text-blue-200'
                            : 'text-xl md:text-2xl text-blue-900 group-hover:text-blue-600'
                            }`}>
                            {article.title}
                        </h3>

                        <p className={`text-sm mb-6 line-clamp-2 leading-relaxed ${variant === 'featured-main' ? 'text-blue-100/90 text-lg line-clamp-3' : 'text-gray-500 flex-1'
                            }`}>
                            {article.excerpt}
                        </p>

                        {variant !== 'featured-main' && (
                            <div className="mb-6">
                                <span className="inline-flex items-center gap-1.5 text-blue-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                    Read Full Article <ArrowRight size={14} />
                                </span>
                            </div>
                        )}

                        {/* Footer Section */}
                        <div className={`pt-6 mt-auto border-t ${variant === 'featured-main' ? 'border-white/20' : 'border-gray-50'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div
                                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity group/author"
                                    onClick={handleAuthorClick}
                                >
                                    <div className={`w-10 h-10 rounded-full border-2 overflow-hidden flex items-center justify-center transition-transform group-hover/author:scale-105 ${variant === 'featured-main' ? 'border-white/30 bg-white/10 text-white' : 'border-white shadow-sm bg-gray-50 text-gray-400'
                                        }`}>
                                        {article.authorPhoto ? (
                                            <img
                                                src={article.authorPhoto}
                                                alt={article.authorName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User size={18} />
                                        )}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold leading-none mb-1 group-hover/author:text-blue-500 transition-colors ${variant === 'featured-main' ? 'text-white group-hover/author:text-blue-200' : 'text-blue-900'
                                            }`}>
                                            {article.authorName}
                                        </p>
                                        <p className={`text-[10px] font-medium flex items-center gap-1 uppercase tracking-wider ${variant === 'featured-main' ? 'text-blue-200' : 'text-gray-400'
                                            }`}>
                                            <Clock size={10} />
                                            {formatDate(article.publishedAt || article.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`flex items-center gap-1.5 text-xs font-bold ${variant === 'featured-main' ? 'text-blue-200' : 'text-gray-400'}`}>
                                        <Eye size={14} className={variant === 'featured-main' ? 'text-white' : 'text-blue-400'} />
                                        {article.views}
                                    </span>
                                    <span className={`flex items-center gap-1.5 text-xs font-bold ${variant === 'featured-main' ? 'text-blue-200' : 'text-gray-400'}`}>
                                        <Heart size={14} className={variant === 'featured-main' ? 'text-white' : 'text-red-400'} />
                                        {article.likes.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
};

export default BlogCard;
