import React, { useState, useEffect } from 'react';
import { useBlogList, useFeaturedArticles } from './hooks/useBlog';
import BlogCard from './components/BlogCard';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import type { BlogCategory, BlogAuthor } from './types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import AuthorProfileModal from './components/AuthorProfileModal';

import { useSearchParams } from 'react-router-dom';

const Blog: React.FC = () => {
    const [searchParams] = useSearchParams();
    const authorParam = searchParams.get('author');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<BlogCategory | ''>('');
    const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'mostCommented' | 'mostLiked'>('recent');
    const [selectedAuthor, setSelectedAuthor] = useState<BlogAuthor | null>(null);
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

    const { articles, loading, error, page, totalPages, goToPage, updateOptions } = useBlogList({
        limit: 9,
        search: searchQuery,
        category: selectedCategory || undefined,
        sortBy,
        author: authorParam || undefined
    });

    useEffect(() => {
        updateOptions({ author: authorParam || undefined });
    }, [authorParam]);

    const { articles: featuredArticles, loading: featuredLoading } = useFeaturedArticles(3);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateOptions({ search: searchQuery });
    };

    const handleCategoryChange = (category: BlogCategory | '') => {
        setSelectedCategory(category);
        updateOptions({ category: category || undefined });
    };

    const handleSortChange = (sort: typeof sortBy) => {
        setSortBy(sort);
        updateOptions({ sortBy: sort });
    };

    const handleAuthorClick = (author: BlogAuthor) => {
        setSelectedAuthor(author);
        setIsAuthorModalOpen(true);
    };

    return (
        <div className="w-full min-h-screen bg-white">
            {/* Hero Section - Professional Mesh Gradient */}
            <section className="relative pt-32 pb-12 overflow-hidden bg-white">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100/50"
                    >
                        <Sparkles size={14} /> Our Latest Insights
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-black text-blue-900 mb-8 leading-[1.1]"
                    >
                        Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Solidarity</span> Blog
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-12"
                    >
                        Evidence-based articles on mental health, expert advice, and personal stories to guide you through your journey.
                    </motion.p>

                    {/* Search and Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="max-w-4xl mx-auto bg-white rounded-3xl p-3 shadow-xl shadow-blue-900/5 border border-blue-200"
                    >
                        <div className="flex flex-col md:flex-row gap-12">
                            <form onSubmit={handleSearch} className="flex-1 relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by title, topic..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-2xl outline-none transition-all font-medium text-blue-900 text-center placeholder:text-center"
                                />
                            </form>

                            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value as BlogCategory | '')}
                                    className="px-6 py-4 bg-white hover:bg-white border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-2xl outline-none transition-all font-bold text-blue-900 cursor-pointer appearance-none whitespace-nowrap"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Mental Well-being">Mental Well-being</option>
                                    <option value="Stress Management">Stress Management</option>
                                    <option value="Therapy & Coaching">Therapy & Coaching</option>
                                    <option value="Social Relations">Social Relations</option>
                                    <option value="Personal Development">Personal Development</option>
                                    <option value="News">News</option>
                                    <option value="Testimonials">Testimonials</option>
                                </select>

                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                                    className="px-6 py-4 bg-white hover:bg-white border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-2xl outline-none transition-all font-bold text-blue-900 cursor-pointer appearance-none whitespace-nowrap"
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="mostLiked">Most Liked</option>
                                    <option value="mostCommented">Most Commented</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Articles Section */}
            {!featuredLoading && featuredArticles.length > 0 && (
                <section className="container mx-auto px-4 py-12 bg-slate-50/50 my-8 rounded-[3rem]">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
                            <Sparkles className="text-orange-500" /> Featured Stories
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Featured Article (Left - Big) */}
                        {featuredArticles.length > 0 && (
                            <div className="lg:col-span-2">
                                <BlogCard
                                    article={featuredArticles[0]}
                                    index={0}
                                    variant="featured-main"
                                    onAuthorClick={handleAuthorClick}
                                />
                            </div>
                        )}

                        {/* Side Featured Articles (Right - Stacked) */}
                        <div className="flex flex-col gap-8">
                            {featuredArticles.slice(1, 3).map((article, idx) => (
                                <div key={article._id} className="flex-1">
                                    <BlogCard
                                        article={article}
                                        index={idx + 1}
                                        variant="featured-side"
                                        onAuthorClick={handleAuthorClick}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}



            {/* Articles Grid Section */}
            <section className="container mx-auto px-4 py-20 min-h-[600px]">
                {!loading && !error && articles.length > 0 && (
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
                            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                            Latest Articles
                        </h2>
                    </div>
                )}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <LoadingSpinner />
                        <p className="text-gray-400 font-medium">Curating articles for you...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100">
                        <p className="text-red-600 text-lg font-bold">{error}</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-32 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <p className="text-gray-400 text-xl font-medium">No articles found matching your criteria</p>
                        <button
                            onClick={() => { setSearchQuery(''); handleCategoryChange(''); }}
                            className="mt-6 text-blue-600 font-bold hover:underline"
                        >
                            Reset filters
                        </button>
                    </div>
                ) : (
                    <>
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20"
                        >
                            <AnimatePresence mode="popLayout">
                                {articles.map((article, idx) => (
                                    <BlogCard key={article._id} article={article} index={idx % 3} onAuthorClick={handleAuthorClick} />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Premium Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4">
                                <button
                                    onClick={() => goToPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="p-4 rounded-2xl bg-gray-50 text-blue-900 disabled:opacity-30 hover:bg-blue-50 transition-colors"
                                >
                                    <ArrowRight size={20} className="rotate-180" />
                                </button>

                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                        <button
                                            key={pageNum}
                                            onClick={() => goToPage(pageNum)}
                                            className={`w-12 h-12 rounded-2xl font-bold transition-all duration-300 ${page === pageNum
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110'
                                                : 'bg-white text-blue-900 border border-gray-100 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => goToPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    className="p-4 rounded-2xl bg-gray-50 text-blue-900 disabled:opacity-30 hover:bg-blue-50 transition-colors"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Newsletter CTA */}
            <section className="container mx-auto px-4 pb-24">
                <div className="relative bg-blue-900 rounded-[3rem] p-12 md:p-20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-800/50 skew-x-12 translate-x-32" />
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Never miss a story.</h2>
                        <p className="text-blue-100 text-lg mb-10 leading-relaxed">
                            Subscribe to our newsletter and get the latest health insights delivered straight to your inbox every week.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="flex-1 px-8 py-5 bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-2xl focus:outline-none focus:bg-white/20 transition-all font-medium"
                            />
                            <button className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all whitespace-nowrap shadow-xl shadow-orange-900/20">
                                Subscribe Now
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Author Profile Modal */}
            <AuthorProfileModal
                isOpen={isAuthorModalOpen}
                onClose={() => setIsAuthorModalOpen(false)}
                author={selectedAuthor}
                fallbackName={selectedAuthor?.nom ? `${selectedAuthor.prenom || ''} ${selectedAuthor.nom}` : undefined}
                fallbackPhoto={selectedAuthor?.photo}
                fallbackRole={selectedAuthor?.role}
            />
        </div>
    );
};

export default Blog;
