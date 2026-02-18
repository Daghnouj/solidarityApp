import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogArticle, useSimilarArticles } from './hooks/useBlog';
import CommentSection from './components/CommentSection';
import SharePreviewModal from './components/SharePreviewModal';
import AuthorProfileModal from './components/AuthorProfileModal';
import { Heart, Eye, Calendar, ChevronLeft, Tag, User, ArrowRight, Lightbulb, MessageCircle, Share2 } from 'lucide-react';

import LoadingSpinner from '../../components/LoadingSpinner';
import { motion, useScroll, useSpring } from 'framer-motion';
import DOMPurify from 'dompurify';
import type { BlogAuthor } from './types';

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { article, loading, error, toggleLike, addComment, deleteComment } = useBlogArticle(slug || '');
    const { articles: similarArticles } = useSimilarArticles(article?._id || '');

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const currentUserId = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('adminToken') !== null;
    const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
    const [selectedAuthor, setSelectedAuthor] = React.useState<BlogAuthor | null>(null);
    const [isAuthorModalOpen, setIsAuthorModalOpen] = React.useState(false);

    // Determine if the user has liked the article
    const hasLiked = article && currentUserId ? article.likes.includes(currentUserId) : false;

    // Calculate reading time
    const calculateReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const text = content.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
        const words = text.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    const handleAuthorClick = () => {
        if (article?.author) {
            setSelectedAuthor(article.author);
            setIsAuthorModalOpen(true);
        }
    };

    // SEO and Scrolling
    useEffect(() => {
        if (article) {
            document.title = article.seo?.metaTitle || `${article.title} | Solidarity Blog`;

            // Meta tags for social share previews
            const setMeta = (attr: string, value: string, content: string) => {
                let meta = document.querySelector(`meta[${attr}="${value}"]`);
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.setAttribute(attr, value);
                    document.head.appendChild(meta);
                }
                meta.setAttribute('content', content);
            };

            setMeta('property', 'og:title', article.seo?.metaTitle || article.title);
            setMeta('property', 'og:description', article.seo?.metaDescription || article.excerpt || article.content.replace(/<[^>]*>?/gm, '').substring(0, 160));
            setMeta('property', 'og:image', article.coverImage || '');
            setMeta('property', 'og:url', window.location.href);
            setMeta('property', 'og:type', 'article');

            setMeta('name', 'twitter:card', 'summary_large_image');
            setMeta('name', 'twitter:title', article.seo?.metaTitle || article.title);
            setMeta('name', 'twitter:description', article.seo?.metaDescription || article.excerpt || '');
            setMeta('name', 'twitter:image', article.coverImage || '');
        }
        window.scrollTo(0, 0);
    }, [slug, article]);

    if (loading) return <LoadingSpinner />;
    if (error || !article) {
        return (
            <div className="pt-40 pb-20 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h2 className="text-4xl font-black text-blue-900 mb-6 font-display">Oops! Article not found.</h2>
                    <p className="text-gray-500 mb-10 text-lg">The article you're looking for seems to have been moved or deleted.</p>
                    <Link to="/blog" className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-xl shadow-blue-200">
                        <ChevronLeft size={20} /> Back to Blog
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-[80px] left-0 right-0 h-1 bg-blue-600 origin-left z-[50]"
                style={{ scaleX }}
            />

            {/* Header / Hero Section */}
            <header className="relative h-[60vh] min-h-[500px] w-full overflow-hidden flex flex-col justify-end">
                {article.coverImage ? (
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/60 to-black/30" />

                {/* Navbar Placeholder / Back Button Area */}
                <div className="absolute top-28 left-0 w-full px-6 md:px-10 z-20 pointer-events-none">
                    <Link to="/blog" className="inline-flex items-center gap-2 group text-white hover:text-white transition-all duration-300 font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-full shadow-lg hover:shadow-xl border border-white/20 hover:border-white/40 pointer-events-auto transform hover:-translate-y-0.5">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
                        <span className="uppercase tracking-wide text-xs">Back to Blog</span>
                    </Link>
                </div>

                <div className="container mx-auto px-4 pb-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="inline-block bg-blue-600/90 text-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 border border-blue-500/30">
                                {article.category}
                            </span>
                            <span className="text-blue-100/80 text-sm font-bold flex items-center gap-2">
                                • {calculateReadingTime(article.content)} min read
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight font-display tracking-tight drop-shadow-sm">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 md:gap-8 text-white/90">
                            <div
                                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity group/author"
                                onClick={handleAuthorClick}
                            >
                                <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shadow-lg bg-white/10 flex items-center justify-center transition-transform group-hover/author:scale-105">
                                    {article.authorPhoto ? (
                                        <img
                                            src={article.authorPhoto}
                                            alt={article.authorName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User size={20} className="text-white/60" />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm leading-none group-hover/author:text-blue-200 transition-colors">{article.authorName}</span>
                                    <span className="text-[10px] text-blue-200 font-medium uppercase tracking-wider mt-1">{article.authorRole || 'Author'}</span>
                                </div>
                            </div>

                            <div className="h-8 w-[1px] bg-white/10 hidden md:block" />

                            <div className="flex items-center gap-6 text-sm font-medium text-blue-100">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-blue-300" />
                                    <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye size={16} className="text-blue-300" />
                                    <span>{article.views} views</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="container mx-auto px-4 -mt-16 relative z-10 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Article Body */}
                    <div className="lg:col-span-8">
                        <article className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 overflow-hidden mb-12 border border-gray-100">
                            <div className="p-8 md:p-16">
                                {/* Article Content with Premium Typography */}
                                <div
                                    className="prose prose-xl max-w-none prose-headings:text-blue-900 prose-headings:font-black prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-[2rem] prose-img:shadow-xl prose-strong:text-blue-900 italic-quote"
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                                />

                                {/* Tags */}
                                {article.tags && article.tags.length > 0 && (
                                    <div className="mt-16 pt-10 border-t border-gray-50">
                                        <div className="flex flex-wrap gap-3">
                                            {article.tags.map((tag, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={`/blog?tag=${tag}`}
                                                    className="inline-flex items-center gap-2 bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border border-transparent hover:border-blue-100"
                                                >
                                                    <Tag size={12} /> {tag}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Interaction Bar */}
                                <div className="mt-16 pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={toggleLike}
                                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${hasLiked
                                                ? 'bg-red-50 text-red-600 border border-red-100 shadow-lg shadow-red-100'
                                                : 'bg-gray-50 text-gray-400 border border-gray-100 hover:text-red-500 hover:border-red-100'
                                                }`}
                                        >
                                            <Heart size={20} fill={hasLiked ? "currentColor" : "none"} />
                                            {article.likes.length} Likes
                                        </motion.button>

                                        <div className="flex items-center gap-2 text-gray-400 font-bold">
                                            <MessageCircle size={20} />
                                            {article.comments.length} Comments
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setIsShareModalOpen(true)}
                                            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 px-6 py-4 rounded-2xl font-bold transition-all"
                                        >
                                            <Share2 size={20} />
                                            Share Article
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Comments */}
                        <div className="bg-gray-50 rounded-[3rem] p-8 md:p-12 border border-gray-100">
                            <CommentSection
                                comments={article.comments}
                                onAddComment={addComment}
                                onDeleteComment={deleteComment}
                                currentUserId={isAdmin ? 'admin' : currentUserId}
                                isAdmin={isAdmin}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-10">
                        {/* Author Card - Modernized */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-10 border border-gray-50 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
                            <h3 className="text-xl font-black text-blue-900 mb-8 font-display">Author Insights</h3>

                            <div
                                className="relative inline-block mb-6 cursor-pointer group/sidebar-author"
                                onClick={handleAuthorClick}
                            >
                                <div className="w-28 h-28 rounded-full border-4 border-blue-50 p-1 shadow-inner inline-block bg-white transition-transform group-hover/sidebar-author:scale-105">
                                    <img
                                        src={article.authorPhoto || '/default.png'}
                                        alt={article.authorName}
                                        className="w-full h-full rounded-full object-cover shadow-md"
                                    />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
                            </div>

                            <h4
                                className="text-2xl font-black text-blue-900 mb-2 font-display cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={handleAuthorClick}
                            >
                                {article.authorName}
                            </h4>
                            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 ${article.authorRole === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {article.authorRole === 'admin' ? 'Strategic Lead' : (article.author?.specialite || 'Care Specialist')}
                            </span>

                            <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium line-clamp-3">
                                {article.author?.bio || 'Dedicated to empowering individuals through knowledge and compassionate expert guidance.'}
                            </p>

                            <button
                                onClick={handleAuthorClick}
                                className="w-full py-4 bg-white border-2 border-blue-100 text-blue-600 rounded-2xl font-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group/btn"
                            >
                                <span>Voir le profil de {article.author?.prenom || article.authorName.split(' ')[0]}</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Impact CTA */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                            <Lightbulb className="text-blue-200 mb-6" size={40} />
                            <h3 className="text-2xl font-black mb-4 font-display">
                                Join the Conversation
                            </h3>
                            <p className="text-blue-100 font-medium leading-relaxed mb-8">
                                Don't just read about well-being, live it. Connect with others who share your journey in our secure community.
                            </p>
                            <Link to="/community" className="block text-center py-4 bg-white text-blue-700 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-lg">
                                Access Community
                            </Link>
                        </div>

                        {/* Similar Articles */}
                        {similarArticles && similarArticles.length > 0 && (
                            <div className="space-y-6 pt-4">
                                <h3 className="text-xl font-black text-blue-900 px-4 flex items-center gap-2 font-display">
                                    <ArrowRight className="text-blue-500" size={20} /> Explore Further
                                </h3>
                                <div className="space-y-4">
                                    {similarArticles.map(similar => (
                                        <Link
                                            key={similar._id}
                                            to={`/blog/${similar.slug}`}
                                            className="flex items-center gap-5 p-4 bg-white rounded-[2rem] border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
                                        >
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                                                <img
                                                    src={similar.coverImage || '/default-blog.png'}
                                                    alt={similar.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 block">{similar.category}</span>
                                                <h4 className="text-sm font-bold text-blue-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                                    {similar.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </main>

            {/* Share Preview Modal */}
            <SharePreviewModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                article={{
                    title: article.title,
                    excerpt: article.excerpt,
                    coverImage: article.coverImage,
                    authorName: article.authorName,
                    publishedAt: article.publishedAt,
                    createdAt: article.createdAt
                }}
                url={window.location.href}
            />

            {/* Author Profile Modal */}
            <AuthorProfileModal
                isOpen={isAuthorModalOpen}
                onClose={() => setIsAuthorModalOpen(false)}
                author={selectedAuthor}
                fallbackName={article?.authorName}
                fallbackPhoto={article?.authorPhoto}
                fallbackRole={article?.authorRole}
            />
        </div>
    );
};

export default BlogDetail;
