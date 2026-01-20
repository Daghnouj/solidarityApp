import { useState } from "react";
import { motion } from "framer-motion";
import Banner from "./components/Banner";
import LeftSidebar from "./components/LeftSidebar";
import PostFeed from "./components/PostFeed";
import RightSidebar from "./components/RightSidebar";
import AddPostModal from "./components/AddPostModal";
import CommentModal from "./components/CommentModal";
import NotificationsModal from "./components/NotificationsModal";
import FavoritesModal from "./components/FavoritesModal";
import { useCommunity } from "./hooks/useCommunity";
import type { Post } from "./types";


export default function Community() {
  const {
    posts,
    addPost,
    toggleLike,
    addComment,
    toggleBookmark,
    notifications,
    unreadCount,
    clearNotifications,
    setUnreadCount,
  } = useCommunity();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const filtered = posts.filter((p) =>
    (p.content + (p.hashtags || []).join(" ")).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-100 p-4 md:p-8 mt-20">
      <Banner />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
        <LeftSidebar
          unreadCount={unreadCount}
          onAddPost={() => setShowAddModal(true)}
          onShowFavorites={() => setShowFavorites(true)}
          onShowNotifications={() => {
            setShowNotifications(true);
            setUnreadCount(0);
          }}
        />

        <PostFeed
          posts={filtered}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onLike={toggleLike}
          onBookmark={toggleBookmark}
          onComment={(p) => setSelectedPost(p)}
          onAddPost={() => setShowAddModal(true)}
        />

        <RightSidebar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <AddPostModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(content) => {
          addPost(content);
          setShowAddModal(false);
        }}
      />

      <CommentModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onAddComment={(id, text) => {
          addComment(id, text);
          setSelectedPost(null);
        }}
      />

      <NotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        clearNotifications={() => {
          clearNotifications();
          setShowNotifications(false);
        }}
      />

      <FavoritesModal visible={showFavorites} onClose={() => setShowFavorites(false)} posts={posts} />
    </motion.div>
  );
}
