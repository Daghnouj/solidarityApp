// src/pages/community/hooks/useCommunity.ts
import { useState, useEffect, useCallback } from "react";
import type { Post } from "../types";
import CommunityService from "../services/community.service";

export function useCommunity() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingTags, setTrendingTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostsData = useCallback(async () => {
    try {
      setLoading(true);
      const [postsData, exploreData] = await Promise.all([
        CommunityService.getAllPosts(),
        CommunityService.getExploreData()
      ]);
      setPosts(postsData);
      setTrendingTags(exploreData.trendingTags || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPost = useCallback(async (postId: string) => {
    try {
      const freshPost = await CommunityService.getSinglePost(postId);
      setPosts((s) => {
        const exists = s.find(p => p._id === postId);
        if (exists) {
          return s.map(p => p._id === postId ? freshPost : p);
        } else {
          return [freshPost, ...s];
        }
      });
      return freshPost;
    } catch (err: any) {
      console.error("Failed to refresh post", err);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchPostsData();
  }, [fetchPostsData]);

  async function addPost(content: string, isAnonymous: boolean = false) {
    try {
      const response = await CommunityService.createPost(content, isAnonymous);
      if (response.success) {
        setPosts((s) => [response.post, ...s]);
        // Refresh trending tags when a new post is added
        const exploreData = await CommunityService.getExploreData();
        setTrendingTags(exploreData.trendingTags || []);
      }
    } catch (err: any) {
      console.error("Failed to add post", err);
    }
  }

  async function editPost(postId: string, content: string) {
    try {
      const response = await CommunityService.updatePost(postId, content);
      if (response.success) {
        setPosts((s) => s.map((p) => (p._id === postId ? response.post : p)));
        const exploreData = await CommunityService.getExploreData();
        setTrendingTags(exploreData.trendingTags || []);
      }
    } catch (err: any) {
      console.error("Failed to edit post", err);
    }
  }

  async function removePost(postId: string) {
    try {
      const response = await CommunityService.deletePost(postId);
      if (response.success) {
        setPosts((s) => s.filter((p) => p._id !== postId));
        const exploreData = await CommunityService.getExploreData();
        setTrendingTags(exploreData.trendingTags || []);
      }
    } catch (err: any) {
      console.error("Failed to delete post", err);
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

  async function toggleFavorite(postId: string) {
    try {
      const response = await CommunityService.toggleFavorite(postId);
      if (response.success) {
        setPosts((s) =>
          s.map((p) => (p._id === postId ? response.post : p))
        );
      }
    } catch (err: any) {
      console.error("Failed to toggle favorite", err);
    }
  }

  async function addComment(postId: string, text: string, isAnonymous: boolean = false) {
    try {
      const response = await CommunityService.addComment(postId, text, isAnonymous);
      if (response.success) {
        setPosts((s) =>
          s.map((p) => {
            if (p._id === postId) {
              return {
                ...p,
                comments: [...(p.comments || []), response.comment]
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

  async function addReply(postId: string, commentId: string, text: string, notifiedUserId?: string, isAnonymous: boolean = false) {
    try {
      const response = await CommunityService.addReply(postId, commentId, text, notifiedUserId, isAnonymous);
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

  async function editComment(postId: string, commentId: string, text: string) {
    try {
      const response = await CommunityService.updateComment(postId, commentId, text);
      if (response.success) {
        setPosts((s) =>
          s.map((p) => {
            if (p._id === postId) {
              return {
                ...p,
                comments: p.comments.map((c) =>
                  c._id === commentId ? { ...c, text, edited: true } : c
                ),
              };
            }
            return p;
          })
        );
      }
    } catch (err: any) {
      console.error("Failed to edit comment", err);
    }
  }

  async function removeComment(postId: string, commentId: string) {
    try {
      const response = await CommunityService.deleteComment(postId, commentId);
      if (response.success) {
        setPosts((s) =>
          s.map((p) => {
            if (p._id === postId) {
              return {
                ...p,
                comments: p.comments.filter((c) => c._id !== commentId),
              };
            }
            return p;
          })
        );
      }
    } catch (err: any) {
      console.error("Failed to delete comment", err);
    }
  }

  async function editReply(postId: string, commentId: string, replyId: string, text: string) {
    try {
      const response = await CommunityService.updateReply(postId, commentId, replyId, text);
      if (response.success) {
        setPosts((s) =>
          s.map((p) => {
            if (p._id === postId) {
              return {
                ...p,
                comments: p.comments.map((c) => {
                  if (c._id === commentId) {
                    return {
                      ...c,
                      replies: (c.replies || []).map((r) =>
                        r._id === replyId ? { ...r, text, edited: true } : r
                      ),
                    };
                  }
                  return c;
                }),
              };
            }
            return p;
          })
        );
      }
    } catch (err: any) {
      console.error("Failed to edit reply", err);
    }
  }

  async function removeReply(postId: string, commentId: string, replyId: string) {
    try {
      const response = await CommunityService.deleteReply(postId, commentId, replyId);
      if (response.success) {
        setPosts((s) =>
          s.map((p) => {
            if (p._id === postId) {
              return {
                ...p,
                comments: p.comments.map((c) => {
                  if (c._id === commentId) {
                    return {
                      ...c,
                      replies: (c.replies || []).filter((r) => r._id !== replyId),
                    };
                  }
                  return c;
                }),
              };
            }
            return p;
          })
        );
      }
    } catch (err: any) {
      console.error("Failed to delete reply", err);
    }
  }

  return {
    posts,
    trendingTags,
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
    setPosts,
    fetchPosts: fetchPostsData,
    refreshPost,
  };
}
