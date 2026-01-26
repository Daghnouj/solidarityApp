import React, { useState, useEffect } from 'react';
import { Bookmark, ThumbsUp, MessageSquare, Share2, RefreshCw } from 'lucide-react';
import CommunityService from '../../pages/community/services/community.service';

const ProfessionalSavedPosts: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSavedPosts = async () => {
        try {
            const data = await CommunityService.getFavoritePosts();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch saved posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Saved Posts</h2>
                <p className="text-gray-500 text-sm mt-1">Community insights and discussions you've bookmarked.</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <RefreshCw className="animate-spin text-blue-600" size={32} />
                </div>
            ) : posts.length > 0 ? (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post._id || post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                                    <img
                                        src={post.user?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.nom}`}
                                        alt="Author"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{post.user?.nom}</h3>
                                            <p className="text-xs text-gray-400">
                                                {new Date(post.createdAt || post.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {post.hashtags?.slice(0, 2).map((tag: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold">#{tag}</span>
                                            ))}
                                            <Bookmark className="text-blue-600 fill-current" size={18} />
                                        </div>
                                    </div>

                                    <p className="mt-3 text-gray-600 leading-relaxed">
                                        {post.content}
                                    </p>

                                    <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <ThumbsUp size={18} />
                                            <span>{post.likes || 0} Likes</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <MessageSquare size={18} />
                                            <span>{post.comments?.length || 0} Comments</span>
                                        </div>
                                        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors ml-auto">
                                            <Share2 size={18} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bookmark className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">No saved posts</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        Save interesting discussions and insights from the community to find them here later.
                    </p>
                    <button
                        onClick={() => window.location.href = '/community'}
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                    >
                        Explore Community
                    </button>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ProfessionalSavedPosts;
