import axios from 'axios';
import type {
    BlogArticle,
    BlogListResponse,
    CreateBlogArticleDTO,
    UpdateBlogArticleDTO,
    AddCommentDTO,
    BlogQueryOptions,
    CategoryWithCount,
    TagWithCount,
    ArticleStats
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BLOG_API_URL = `${API_BASE_URL}/blog`;

// Helper to get authentication token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * API Service for the blog module
 */
class BlogApiService {
    /**
     * Get a list of articles
     */
    async getArticles(options: BlogQueryOptions = {}): Promise<BlogListResponse> {
        const params = new URLSearchParams();

        if (options.page) params.append('page', options.page.toString());
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.category) params.append('category', options.category);
        if (options.tag) params.append('tag', options.tag);
        if (options.search) params.append('search', options.search);
        if (options.status) params.append('status', options.status);
        if (options.featured !== undefined) params.append('featured', options.featured.toString());
        if (options.sortBy) params.append('sortBy', options.sortBy);
        if (options.author) params.append('author', options.author);

        const response = await axios.get<BlogListResponse>(`${BLOG_API_URL}?${params.toString()}`, {
            headers: getAuthHeader()
        });

        return response.data;
    }

    /**
     * Get an article by slug
     */
    async getArticleBySlug(slug: string): Promise<BlogArticle> {
        const response = await axios.get<BlogArticle>(`${BLOG_API_URL}/${slug}`, {
            headers: getAuthHeader()
        });

        return response.data;
    }

    /**
     * Get an article by ID (for editing)
     */
    async getArticleById(id: string): Promise<BlogArticle> {
        const response = await axios.get<BlogArticle>(`${BLOG_API_URL}/edit/${id}`, {
            headers: getAuthHeader()
        });

        return response.data;
    }

    /**
     * Create a new article
     */
    async createArticle(data: CreateBlogArticleDTO): Promise<{ message: string; article: BlogArticle }> {
        const response = await axios.post(`${BLOG_API_URL}`, data, {
            headers: getAuthHeader()
        });

        return response.data;
    }

    /**
     * Update an article
     */
    async updateArticle(id: string, data: UpdateBlogArticleDTO): Promise<{ message: string; article: BlogArticle }> {
        const response = await axios.put(`${BLOG_API_URL}/${id}`, data, {
            headers: getAuthHeader()
        });

        return response.data;
    }

    /**
     * Delete an article
     */
    async deleteArticle(id: string): Promise<{ message: string }> {
        const response = await axios.delete(`${BLOG_API_URL}/${id}`, {
            headers: getAuthHeader()
        });

        return response.data;
    }

    /**
     * Like/Unlike an article
     */
    async toggleLike(id: string): Promise<{ liked: boolean; likesCount: number }> {
        const response = await axios.post(`${BLOG_API_URL}/${id}/like`, {}, {
            headers: getAuthHeader()
        });

        return response.data;
    }

    /**
     * Add a comment
     */
    async addComment(id: string, data: AddCommentDTO): Promise<{ message: string; article: BlogArticle }> {
        const response = await axios.post(`${BLOG_API_URL}/${id}/comment`, data, {
            headers: getAuthHeader()
        });

        return response.data;
    }

    /**
     * Delete a comment
     */
    async deleteComment(articleId: string, commentId: string): Promise<{ message: string; article: BlogArticle }> {
        const response = await axios.delete(`${BLOG_API_URL}/${articleId}/comment/${commentId}`, {
            headers: getAuthHeader()
        });

        return response.data;
    }

    /**
     * Get featured articles
     */
    async getFeaturedArticles(limit: number = 3): Promise<BlogArticle[]> {
        const response = await axios.get<BlogArticle[]>(`${BLOG_API_URL}/featured?limit=${limit}`);

        return response.data;
    }

    /**
     * Get similar articles
     */
    async getSimilarArticles(id: string, limit: number = 3): Promise<BlogArticle[]> {
        const response = await axios.get<BlogArticle[]>(`${BLOG_API_URL}/${id}/similar?limit=${limit}`);

        return response.data;
    }

    /**
     * Get stats for an article
     */
    async getArticleStats(id: string): Promise<ArticleStats> {
        const response = await axios.get<ArticleStats>(`${BLOG_API_URL}/${id}/stats`);

        return response.data;
    }

    /**
     * Get all categories with article count
     */
    async getCategories(): Promise<CategoryWithCount[]> {
        const response = await axios.get<CategoryWithCount[]>(`${BLOG_API_URL}/categories`);

        return response.data;
    }

    /**
     * Get all tags with article count
     */
    async getTags(): Promise<TagWithCount[]> {
        const response = await axios.get<TagWithCount[]>(`${BLOG_API_URL}/tags`);

        return response.data;
    }
}

export default new BlogApiService();
