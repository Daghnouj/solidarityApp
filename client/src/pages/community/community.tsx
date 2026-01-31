import { useState } from "react";
import { motion } from "framer-motion";
import Banner from "./components/Banner";
import LeftSidebar from "./components/LeftSidebar";
import PostFeed from "./components/PostFeed";
import RightSidebar from "./components/RightSidebar";
import AddPostModal from "./components/AddPostModal";
import CommentModal from "./components/CommentModal";
import DiscoverView from "./components/DiscoverView";
import GroupsView from "./components/GroupsView";
import FollowersView from "./components/FollowersView";
import { useCommunity } from "./hooks/useCommunity";
import type { Post } from "./types";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";


export default function Community() {
  const {
    posts,
    loading,
    error,
    addPost,
    editPost,
    removePost,
    toggleLike,
    toggleFavorite,
    addComment,
    addReply,
    editComment,
    removeComment,
    editReply,
    removeReply,
    trendingTags,
    refreshPost,
  } = useCommunity();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [postPrefill, setPostPrefill] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeView, setActiveView] = useState<'feed' | 'following' | 'groups' | 'followers'>('feed');

  // Handle post link from notification
  useEffect(() => {
    const postId = searchParams.get('post');
    if (postId && !loading) {
      // Refresh the post to get the latest comments/replies
      refreshPost(postId).then(freshPost => {
        if (freshPost) {
          setSelectedPost(freshPost);
        }
        // Clean up param so it doesn't stay in URL and re-open on refresh
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('post');
        setSearchParams(newParams, { replace: true });
      });
    }
  }, [searchParams, setSearchParams, refreshPost, loading]);

  // Update selected post if it changes in the posts list (to show new comments/replies)
  const currentSelectedPost = selectedPost ? posts.find(p => p._id === selectedPost._id) || selectedPost : null;

  const filtered = posts.filter((p) =>
    (p.content + (p.hashtags || []).join(" ") + (p.user?.nom || p.username)).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <Banner />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <LeftSidebar
            onAddPost={() => {
              setPostPrefill("");
              setShowAddModal(true);
            }}
            activeView={activeView}
            onViewChange={setActiveView}
          />

          <main className="md:col-span-6 space-y-6">
            {activeView === 'feed' ? (
              loading ? (
                <LoadingSpinner message="Loading community feed..." fullScreen={false} />
              ) : error ? (
                <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <span className="font-medium">{error}</span>
                </div>
              ) : (
                <PostFeed
                  posts={filtered}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onLike={toggleLike}
                  onFavorite={toggleFavorite}
                  onComment={(p) => setSelectedPost(p)}
                  onEditPost={editPost}
                  onDeletePost={removePost}
                  onAddPost={(prefill) => {
                    setPostPrefill(prefill || "");
                    setShowAddModal(true);
                  }}
                />
              )
            ) : activeView === 'following' ? (
              <DiscoverView
                onSearchTag={(tag) => {
                  setSearchQuery(tag);
                  setActiveView('feed');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : activeView === 'groups' ? (
              <GroupsView />
            ) : (
              <FollowersView />
            )}
          </main>

          <RightSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            trendingTags={trendingTags}
          />
        </div>
      </div>

      <AddPostModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(content, isAnonymous) => {
          addPost(content, isAnonymous);
          setShowAddModal(false);
        }}
        initialContent={postPrefill}
      />

      <CommentModal
        post={currentSelectedPost}
        onClose={() => setSelectedPost(null)}
        onAddComment={addComment}
        onAddReply={addReply}
        onEditComment={editComment}
        onDeleteComment={removeComment}
        onEditReply={editReply}
        onDeleteReply={removeReply}
      />
    </motion.div>
  );
}
