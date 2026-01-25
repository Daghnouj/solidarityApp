// src/pages/community/hooks/useCommunity.ts
import { useState, useEffect, useCallback } from "react";
import type { Post } from "../types";
import CommunityService from "../services/community.service";

export function useCommunity() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CommunityService.getAllPosts();
      setPosts(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function addPost(content: string) {
    try {
      const response = await CommunityService.createPost(content);
      if (response.success) {
        setPosts((s) => [response.post, ...s]);
      }
    } catch (err: any) {
      console.error("Failed to add post", err);
    }
  }

  async function toggleLike(postId: string) {
    try {
      const response = await CommunityService.toggleLike(postId);
      if (response.success) {
        setPosts((s) =>
          s.map((p) => (p._id === postId ? response.post : p))
        );
      }
    } catch (err: any) {
      console.error("Failed to toggle like", err);
    }
  }

  async function addComment(postId: string, text: string) {
    try {
      const response = await CommunityService.addComment(postId, text);
      if (response.success) {
        setPosts((s) =>
          s.map((p) => {
            if (p._id === postId) {
              // Add the new comment to the existing post's comments array
              return {
                ...p,
                comments: [...p.comments, response.comment]
              };
            }
            return p;
          })
        );
      }
    } catch (err: any) {
      console.error("Failed to add comment", err);
    }
  }

  async function addReply(postId: string, commentId: string, text: string) {
    try {
      const response = await CommunityService.addReply(postId, commentId, text);
      if (response.success) {
        setPosts((s) =>
          s.map((p) => {
            if (p._id === postId) {
              return {
                ...p,
                comments: p.comments.map(c => {
                  if (c._id === commentId) {
                    return {
                      ...c,
                      replies: [...(c.replies || []), response.reply]
                    };
                  }
                  return c;
                })
              };
            }
            return p;
          })
        );
      }
    } catch (err: any) {
      console.error("Failed to add reply", err);
    }
  }

  return {
    posts,
    loading,
    error,
    addPost,
    toggleLike,
    addComment,
    addReply,
    setPosts,
    fetchPosts,
  };
}
