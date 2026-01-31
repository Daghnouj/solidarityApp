import React, { useState, useEffect } from 'react';
import { MessageSquare, Bookmark } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardAddPostModal from '../../dashboard/components/ui/DashboardAddPostModal';
import CommunityService from '../../pages/community/services/community.service';
import CommentModal from '../../pages/community/components/CommentModal';
import PostCard from '../../pages/community/components/PostCard';
import type { Post } from '../../pages/community/types';

const UserCommunity: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'activity' | 'saved'>('activity');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const currentSelectedPost = selectedPost ? posts.find(p => p._id === selectedPost._id) || selectedPost : null;

    const fetchData = async () => {
        setLoading(true);
        try {
            let data: any;
            switch (activeTab) {
                case 'activity':
                    data = await CommunityService.getMyPosts();
                    break;
                case 'saved':
                    data = await CommunityService.getFavoritePosts();
                    break;
                default:
                    data = [];
            }
            setPosts(data);
        } catch (error) {
            console.error(`Failed to fetch ${activeTab}`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (content: string, isAnonymous?: boolean) => {
        try {
            const response = await CommunityService.createPost(content, isAnonymous);
            if (response.success) {
                if (activeTab === 'activity') fetchData();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    };

    const handleLike = async (postId: string) => {
        try {
            const response = await CommunityService.toggleLike(postId);
            if (response.success) {
                setPosts((prev: Post[]) => prev.map((p: Post) => p._id === postId ? response.post : p));
            }
        } catch (error) {
            console.error("Failed to like post", error);
        }
    };

    const handleToggleFavorite = async (postId: string) => {
        try {
            const response = await CommunityService.toggleFavorite(postId);
            if (response.success) {
                if (activeTab === 'saved') {
                    setPosts((prev: Post[]) => prev.filter((p: Post) => p._id !== postId));
                } else {
                    setPosts((prev: Post[]) => prev.map((p: Post) => p._id === postId ? response.post : p));
                }
            }
        } catch (error) {
            console.error("Failed to toggle favorite", error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await CommunityService.deletePost(postId);
            setPosts((prev: Post[]) => prev.filter((p: Post) => p._id !== postId));
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    const handleEditPost = async (postId: string, content: string) => {
        try {
            const response = await CommunityService.updatePost(postId, content);
            setPosts((prev: Post[]) => prev.map((p: Post) => p._id === postId ? response : p));
        } catch (error) {
            console.error("Failed to edit post", error);
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
                    <p className="text-gray-500 text-sm mt-1">Manage your activity and saved posts.</p>
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
            <div className="flex flex-wrap p-1 bg-gray-100 rounded-2xl w-fit gap-1">
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
                <LoadingSpinner message="Loading feed..." fullScreen={false} />
            ) : posts.length > 0 ? (
                <div className="space-y-4 max-w-2xl mx-auto">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onLike={() => handleLike(post._id)}
                            onFavorite={() => handleToggleFavorite(post._id)}
                            onComment={() => setSelectedPost(post)}
                            onEdit={(content) => handleEditPost(post._id, content)}
                            onDelete={() => handleDeletePost(post._id)}
                        />
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
                            ? "You haven't shared anything with the community yet. Start by sharing your thoughts!"
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

            <CommentModal
                post={currentSelectedPost}
                onClose={() => setSelectedPost(null)}
                onAddComment={async (pid: string, txt: string) => {
                    const res = await CommunityService.addComment(pid, txt);
                    setPosts((prev: Post[]) => prev.map((p: Post) => p._id === pid ? res.post : p));
                }}
                onAddReply={async (pid: string, cid: string, txt: string, nid?: string) => {
                    const res = await CommunityService.addReply(pid, cid, txt, nid);
                    setPosts((prev: Post[]) => prev.map((p: Post) => p._id === pid ? res.post : p));
                }}
                onEditComment={async (pid: string, cid: string, txt: string) => {
                    const res = await CommunityService.updateComment(pid, cid, txt);
                    setPosts((prev: Post[]) => prev.map((p: Post) => p._id === pid ? res.post : p));
                }}
                onDeleteComment={async (pid: string, cid: string) => {
                    const res = await CommunityService.deleteComment(pid, cid);
                    setPosts((prev: Post[]) => prev.map((p: Post) => p._id === pid ? res.post : p));
                }}
                onEditReply={async (pid: string, cid: string, rid: string, txt: string) => {
                    const res = await CommunityService.updateReply(pid, cid, rid, txt);
                    setPosts((prev: Post[]) => prev.map((p: Post) => p._id === pid ? res.post : p));
                }}
                onDeleteReply={async (pid: string, cid: string, rid: string) => {
                    const res = await CommunityService.deleteReply(pid, cid, rid);
                    setPosts((prev: Post[]) => prev.map((p: Post) => p._id === pid ? res.post : p));
                }}
            />

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

export default UserCommunity;
