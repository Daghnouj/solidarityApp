import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Share2, RefreshCw, Bookmark, X } from 'lucide-react';
import { useAuth } from '../../pages/auth/hooks/useAuth';
import DashboardAddPostModal from '../../dashboard/components/ui/DashboardAddPostModal';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ProfessionalCommunity: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'activity' | 'saved'>('activity');
    const [likersModalOpen, setLikersModalOpen] = useState(false);
    const [selectedPostLikers, setSelectedPostLikers] = useState<any[]>([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const endpoint = activeTab === 'activity' ? '/community/posts/me' : '/community/posts/saved';
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error(`Failed to fetch ${activeTab}`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (content: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/community/posts/addPost`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                if (activeTab === 'activity') fetchData();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create post');
            }
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
            throw error;
        }
    };

    const handleLike = async (postId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/like`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const updatedPost = await response.json();
                // Update local state
                setPosts(prev => prev.map(p => {
                    const id = p._id || p.id;
                    if (id === postId) {
                        // The API returns { success: true, post: updatedPost }
                        // Actually controller returns { success: true, post } or just post?
                        // Let's look at controller: res.json({ success: true, post })
                        // So we need updatedPost.post
                        return { ...p, likes: updatedPost.post.likes, likedBy: updatedPost.post.likedBy };
                    }
                    return p;
                }));
            }
        } catch (error) {
            console.error("Failed to like post", error);
        }
    };

    const openLikersModal = (post: any) => {
        if (post.likedBy && post.likedBy.length > 0) {
            setSelectedPostLikers(post.likedBy);
            setLikersModalOpen(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Community</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your activity and saved insights.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5"
                >
                    <MessageSquare size={18} />
                    New Post
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'activity' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <MessageSquare size={18} />
                    My Activity
                </button>
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'saved' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Bookmark size={18} />
                    Saved Posts
                </button>
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
                                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                                    <img
                                        src={(activeTab === 'activity' ? (user?.photo || user?.profilePicture) : post.user?.photo || post.user?.profilePicture) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(activeTab === 'activity' ? (user?.nom || user?.name) : post.user?.nom || post.user?.name) || 'default'}`}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{activeTab === 'activity' ? (user?.nom || user?.name || 'Me') : (post.user?.nom || post.user?.name)}</h3>
                                            <p className="text-xs text-gray-400">
                                                {new Date(post.createdAt || post.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {post.hashtags?.slice(0, 2).map((tag: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold">#{tag}</span>
                                            ))}
                                            {activeTab === 'saved' && <Bookmark size={18} className="text-blue-500 fill-current" />}
                                        </div>
                                    </div>

                                    <p className="mt-4 text-gray-600 leading-relaxed">
                                        {post.content}
                                    </p>

                                    <div className="flex gap-6 mt-6 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleLike(post._id || post.id)}
                                            className={`flex items-center gap-2 text-sm transition-colors ${post.likedBy?.some((u: any) => (u._id || u) === user?._id) ? 'text-blue-600 font-semibold' : 'text-gray-400 hover:text-blue-600'}`}
                                        >
                                            <ThumbsUp size={18} className={post.likedBy?.some((u: any) => (u._id || u) === user?._id) ? 'fill-blue-600' : ''} />
                                            <span
                                                className="hover:underline cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openLikersModal(post);
                                                }}
                                            >
                                                {post.likes || 0} Likes
                                            </span>
                                        </button>

                                        <button
                                            onClick={() => navigate(`/community/post/${post._id || post.id}`)}
                                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <MessageSquare size={18} />
                                            <span>{post.comments?.length || 0} Comments</span>
                                        </button>

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
                <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-200 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        {activeTab === 'activity' ? <MessageSquare className="text-gray-300" size={40} /> : <Bookmark className="text-gray-300" size={40} />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">No {activeTab === 'activity' ? 'posts' : 'saved items'} yet</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        {activeTab === 'activity'
                            ? "You haven't shared anything with the community yet. Start by sharing your thoughts or expertise!"
                            : "Save interesting discussions from the community to find them here later."}
                    </p>
                    <button
                        onClick={() => activeTab === 'activity' ? setIsModalOpen(true) : window.location.href = '/community'}
                        className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                    >
                        {activeTab === 'activity' ? 'Create your first post' : 'Go to Community'}
                    </button>
                </div>
            )}

            <DashboardAddPostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreatePost}
            />

            {/* Likers Modal */}
            {likersModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">Liked by</h3>
                            <button
                                onClick={() => setLikersModalOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto p-2">
                            {selectedPostLikers.map((liker: any, index: number) => (
                                <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                    <img
                                        src={liker.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${liker.nom || 'User'}`}
                                        alt={liker.nom}
                                        className="w-10 h-10 rounded-full bg-gray-100 border border-gray-100"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm text-gray-900">{liker.nom}</p>
                                        <p className="text-xs text-gray-500 capitalize">{liker.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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

export default ProfessionalCommunity;
