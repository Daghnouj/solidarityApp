// components/community/useCommunity.ts
import { useState } from "react";
import type { Post, Comment } from "../types";
import { MOCK_POSTS } from "../data/mockPosts";

const fakeCurrentUserId = "me"; // local-only

function newId() {
  return (Date.now() + Math.random()).toString(36);
}

export function useCommunity() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to the community!",
  ]);
  const [unreadCount, setUnreadCount] = useState<number>(1);

  function addPost(content: string, hashtags: string[] = []) {
    const p: Post = {
      id: newId(),
      author: "You",
      avatar: "/default-avatar.png",
      content,
      likes: 0,
      likedBy: [],
      comments: [],
      hashtags,
      bookmarkedBy: [],
      timestamp: new Date().toISOString(),
    };
    setPosts((s) => [p, ...s]);
  }

  function toggleLike(postId: string) {
    setPosts((s) =>
      s.map((p) => {
        if (p.id !== postId) return p;
        const liked = p.likedBy.includes(fakeCurrentUserId);
        const likedBy = liked
          ? p.likedBy.filter((id) => id !== fakeCurrentUserId)
          : [...p.likedBy, fakeCurrentUserId];
        return {
          ...p,
          likedBy,
          likes: liked ? Math.max(0, p.likes - 1) : p.likes + 1,
        };
      })
    );
  }

  function addComment(postId: string, text: string) {
    const comment: Comment = {
      id: newId(),
      author: "You",
      text,
      timestamp: new Date().toISOString(),
    };
    setPosts((s) =>
      s.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p))
    );
  }

  function toggleBookmark(postId: string) {
    setPosts((s) =>
      s.map((p) => {
        if (p.id !== postId) return p;
        const bookmarked = p.bookmarkedBy.includes(fakeCurrentUserId);
        return {
          ...p,
          bookmarkedBy: bookmarked
            ? p.bookmarkedBy.filter((id) => id !== fakeCurrentUserId)
            : [...p.bookmarkedBy, fakeCurrentUserId],
        };
      })
    );
  }

  function clearNotifications() {
    setNotifications([]);
    setUnreadCount(0);
  }

  function markNotificationsRead() {
    setUnreadCount(0);
  }

  return {
    posts,
    addPost,
    toggleLike,
    addComment,
    toggleBookmark,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    clearNotifications,
    markNotificationsRead,
    setPosts,
  };
}
