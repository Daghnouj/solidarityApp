import { useState, useEffect, useCallback } from 'react';
import blogApi from '../services/blogApi';
import type {
    BlogArticle,
    BlogListResponse,
    BlogQueryOptions,
    CategoryWithCount,
    TagWithCount
} from '../types';
import toast from 'react-hot-toast';

/**
 * Custom hook to manage the blog article list
 */
export const useBlogList = (initialOptions: BlogQueryOptions = {}) => {
    const [articles, setArticles] = useState<BlogArticle[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(initialOptions.page || 1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [options, setOptions] = useState<BlogQueryOptions>(initialOptions);

    const fetchArticles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response: BlogListResponse = await blogApi.getArticles({ ...options, page });

            setArticles(response.articles);
            setTotal(response.total);
            setTotalPages(response.totalPages);
        } catch (err: any) {
            console.error('Error loading articles:', err);
            setError(err.response?.data?.message || 'Error loading articles');
            toast.error('Unable to load articles');
        } finally {
            setLoading(false);
        }
    }, [options, page]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const updateOptions = (newOptions: Partial<BlogQueryOptions>) => {
        setOptions(prev => ({ ...prev, ...newOptions }));
        setPage(1); // Reset to first page when options change
    };

    const goToPage = (newPage: number) => {
        setPage(newPage);
    };

    return {
        articles,
        total,
        page,
        totalPages,
        loading,
        error,
        options,
        updateOptions,
        goToPage,
        refetch: fetchArticles
    };
};

/**
 * Custom hook to manage an individual article
 */
export const useBlogArticle = (slug: string) => {
    const [article, setArticle] = useState<BlogArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticle = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await blogApi.getArticleBySlug(slug);
            setArticle(data);
        } catch (err: any) {
            console.error('Error loading article:', err);
            setError(err.response?.data?.message || 'Article not found');
            toast.error('Unable to load article');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        if (slug) {
            fetchArticle();
        }
    }, [fetchArticle, slug]);

    const toggleLike = async () => {
        if (!article) return;

        try {
            const result = await blogApi.toggleLike(article._id);

            setArticle(prev => {
                if (!prev) return prev;

                const currentUserId = localStorage.getItem('userId');
                let newLikes = [...prev.likes];

                if (result.liked && currentUserId) {
                    newLikes.push(currentUserId);
                } else if (!result.liked && currentUserId) {
                    newLikes = newLikes.filter(id => id !== currentUserId);
                }

                return { ...prev, likes: newLikes };
            });

            toast.success(result.liked ? 'Article liked!' : 'Like removed');
        } catch (err: any) {
            console.error('Error liking article:', err);
            toast.error('Unable to like article');
        }
    };

    const addComment = async (text: string, isAnonymous: boolean = false) => {
        if (!article) return;

        try {
            const result = await blogApi.addComment(article._id, { text, isAnonymous });
            setArticle(result.article);
            toast.success('Comment added!');
        } catch (err: any) {
            console.error('Error adding comment:', err);
            toast.error('Unable to add comment');
            throw err;
        }
    };

    const deleteComment = async (commentId: string) => {
        if (!article) return;

        try {
            const result = await blogApi.deleteComment(article._id, commentId);
            setArticle(result.article);
            toast.success('Comment deleted');
        } catch (err: any) {
            console.error('Error deleting comment:', err);
            toast.error('Unable to delete comment');
        }
    };

    return {
        article,
        loading,
        error,
        toggleLike,
        addComment,
        deleteComment,
        refetch: fetchArticle
    };
};

/**
 * Hook to obtain featured articles
 */
export const useFeaturedArticles = (limit: number = 3) => {
    const [articles, setArticles] = useState<BlogArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await blogApi.getFeaturedArticles(limit);
                setArticles(data);
            } catch (err) {
                console.error('Erreur lors du chargement des articles en vedette:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, [limit]);

    return { articles, loading };
};

/**
 * Hook to obtain categories
 */
export const useCategories = () => {
    const [categories, setCategories] = useState<CategoryWithCount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await blogApi.getCategories();
                setCategories(data);
            } catch (err) {
                console.error('Erreur lors du chargement des catégories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading };
};

/**
 * Hook to obtain tags
 */
export const useTags = () => {
    const [tags, setTags] = useState<TagWithCount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const data = await blogApi.getTags();
                setTags(data);
            } catch (err) {
                console.error('Erreur lors du chargement des tags:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    return { tags, loading };
};

/**
 * Hook to obtain similar articles
 */
export const useSimilarArticles = (articleId: string) => {
    const [articles, setArticles] = useState<BlogArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSimilar = async () => {
            if (!articleId) return;
            try {
                const data = await blogApi.getSimilarArticles(articleId);
                setArticles(data);
            } catch (err) {
                console.error('Erreur lors du chargement des articles similaires:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilar();
    }, [articleId]);

    return { articles, loading };
};
