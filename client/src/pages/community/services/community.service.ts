// src/pages/community/services/community.service.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/community";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const CommunityService = {
  getAllPosts: async () => {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
  },

  getMyPosts: async () => {
    const response = await axios.get(`${API_URL}/posts/me`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  createPost: async (content: string) => {
    const response = await axios.post(
      `${API_URL}/posts/addPost`,
      { content },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  toggleLike: async (postId: string) => {
    const response = await axios.post(
      `${API_URL}/posts/${postId}/like`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  addComment: async (postId: string, text: string) => {
    const response = await axios.post(
      `${API_URL}/posts/${postId}/comment`,
      { comment: text },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  addReply: async (postId: string, commentId: string, text: string) => {
    const response = await axios.post(
      `${API_URL}/posts/${postId}/comments/${commentId}/reply`,
      { replyText: text },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  getFavoritePosts: async () => {
    const response = await axios.get(`${API_URL}/posts/saved`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  getLikedPosts: async () => {
    const response = await axios.get(`${API_URL}/posts/liked`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  getCommentedPosts: async () => {
    const response = await axios.get(`${API_URL}/posts/commented`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  toggleFavorite: async (postId: string) => {
    const response = await axios.post(
      `${API_URL}/favorites/toggle/${postId}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  updateComment: async (postId: string, commentId: string, newText: string) => {
    const response = await axios.put(
      `${API_URL}/posts/${postId}/comments/${commentId}`,
      { newText },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  deleteComment: async (postId: string, commentId: string) => {
    const response = await axios.delete(
      `${API_URL}/posts/${postId}/comments/${commentId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  updateReply: async (postId: string, commentId: string, replyId: string, newText: string) => {
    const response = await axios.put(
      `${API_URL}/posts/${postId}/comments/${commentId}/replies/${replyId}`,
      { newText },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  deleteReply: async (postId: string, commentId: string, replyId: string) => {
    const response = await axios.delete(
      `${API_URL}/posts/${postId}/comments/${commentId}/replies/${replyId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  updatePost: async (postId: string, content: string) => {
    const response = await axios.put(
      `${API_URL}/posts/${postId}`,
      { content },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await axios.delete(`${API_URL}/posts/${postId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};

export default CommunityService;
