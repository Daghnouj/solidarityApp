import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Star,
    Image,
    Search,
    RefreshCw,
    Heart,
    MessageSquare,
    CheckCircle,
    X,
    FileText,
    AlertCircle,
    CheckSquare,
    Square
} from 'lucide-react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import RichTextEditor from '../pages/blog/components/RichTextEditor';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface BlogArticle {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
    views: number;
    likes: string[];
    comments: any[];
    createdAt: string;
    publishedAt?: string;
}

const BlogManagementPage: React.FC = () => {
    const [articles, setArticles] = useState<BlogArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Bulk delete state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: 'Mental Well-being',
        tags: '',
        status: 'draft' as 'draft' | 'published' | 'archived',
        featured: false,
        metaTitle: '',
        metaDescription: ''
    });
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            // Construct query parameters
            const params = new URLSearchParams();
            params.append('limit', '100');
            params.append('status', statusFilter);
            if (categoryFilter !== 'all') params.append('category', categoryFilter);
            if (searchQuery) params.append('search', searchQuery);

            const response = await axios.get(`${API_BASE_URL}/blog?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setArticles(response.data.articles);
        } catch (error) {
            console.error('Error loading articles:', error);
            toast.error('Unable to load articles');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('adminToken');

            // Use FormData to support image upload
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);
            submitData.append('excerpt', formData.excerpt);
            submitData.append('category', formData.category);
            submitData.append('status', formData.status);
            submitData.append('featured', String(formData.featured));
            submitData.append('tags', formData.tags);

            if (coverImageFile) {
                submitData.append('coverImage', coverImageFile);
            }

            // SEO data (backend expect an object)
            submitData.append('seo[metaTitle]', formData.metaTitle);
            submitData.append('seo[metaDescription]', formData.metaDescription);

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            };

            if (editingArticle) {
                await axios.put(`${API_BASE_URL}/blog/${editingArticle._id}`, submitData, { headers });
                toast.success('Article updated successfully');
            } else {
                await axios.post(`${API_BASE_URL}/blog`, submitData, { headers });
                toast.success('Article created successfully');
            }

            setShowCreateModal(false);
            setEditingArticle(null);
            resetForm();
            fetchArticles();
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Error while saving');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_BASE_URL}/blog/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Article deleted');
            fetchArticles();
        } catch (error) {
            toast.error('Error while deleting');
        }
    };

    // Bulk delete handlers
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === paginatedArticles.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(paginatedArticles.map(a => a._id)));
        }
    };

    const handleBulkDeleteConfirm = async () => {
        setBulkDeleting(true);
        try {
            const token = localStorage.getItem('adminToken');
            const deletePromises = Array.from(selectedIds).map(id =>
                axios.delete(`${API_BASE_URL}/blog/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            );
            await Promise.all(deletePromises);
            toast.success(`${selectedIds.size} article(s) deleted`);
            setSelectedIds(new Set());
            setBulkDeleteConfirmOpen(false);
            fetchArticles();
        } catch (error) {
            toast.error('Error while deleting some articles');
        } finally {
            setBulkDeleting(false);
        }
    };

    const handleEdit = async (article: BlogArticle) => {
        try {
            // Fetch full article content for editing
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${API_BASE_URL}/blog/edit/${article._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fullArticle = response.data;

            setEditingArticle(fullArticle);
            setFormData({
                title: fullArticle.title,
                content: fullArticle.content,
                excerpt: fullArticle.excerpt,
                category: fullArticle.category,
                tags: fullArticle.tags.join(', '),
                status: fullArticle.status,
                featured: fullArticle.featured,
                metaTitle: fullArticle.seo?.metaTitle || '',
                metaDescription: fullArticle.seo?.metaDescription || ''
            });
            setImagePreview(fullArticle.coverImage);
            setCoverImageFile(null);
            setShowCreateModal(true);
        } catch (error) {
            toast.error('Error while fetching the article');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            excerpt: '',
            category: 'Mental Well-being',
            tags: '',
            status: 'draft',
            featured: false,
            metaTitle: '',
            metaDescription: ''
        });
        setCoverImageFile(null);
        setImagePreview(null);
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-700 border-gray-200',
            published: 'bg-green-100 text-green-700 border-green-200',
            archived: 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status as keyof typeof colors] || colors.draft;
    };

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    // Reset to first page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, categoryFilter]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">Blog Management</h1>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">Create and manage blog articles</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant="ghost"
                        icon={selectedIds.size === paginatedArticles.length && paginatedArticles.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                        onClick={toggleSelectAll}
                        className="text-xs sm:text-sm"
                    >
                        {selectedIds.size === paginatedArticles.length && paginatedArticles.length > 0 ? 'Deselect All' : 'Select All'}
                    </Button>
                    {selectedIds.size > 0 && (
                        <Button
                            icon={<Trash2 size={16} />}
                            className="text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white border-red-600"
                            onClick={() => setBulkDeleteConfirmOpen(true)}
                        >
                            Delete Selected ({selectedIds.size})
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        icon={<RefreshCw size={16} />}
                        onClick={fetchArticles}
                        className="text-xs sm:text-sm"
                    >
                        Refresh
                    </Button>
                    <Button
                        icon={<Plus size={16} />}
                        className="text-xs sm:text-sm"
                        onClick={() => {
                            resetForm();
                            setEditingArticle(null);
                            setShowCreateModal(true);
                        }}
                    >
                        New Article
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Articles</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-900">{articles.length}</p>
                    <p className="text-xs text-gray-600 mt-2">
                        {articles.length > 0 ? Math.round((articles.filter((a: BlogArticle) => a.status === 'published').length / articles.length) * 100) : 0}% publication rate
                    </p>
                </Card>

                <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Published</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-900">
                        {articles.filter((a: BlogArticle) => a.status === 'published').length}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">Live on site</p>
                </Card>

                <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Drafts</p>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-900">
                        {articles.filter((a: BlogArticle) => a.status === 'draft').length}
                    </p>
                    <p className="text-xs text-orange-600 mt-2">Work in progress</p>
                </Card>

                <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-100">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Featured</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                        {articles.filter((a: BlogArticle) => a.featured).length}
                    </p>
                    <p className="text-xs text-yellow-600 mt-2">Highlighted content</p>
                </Card>
            </div>

            {/* Filters & Search */}
            <Card className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-white border-2 border-gray-100 rounded-xl text-sm font-semibold text-blue-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 bg-white border-2 border-gray-100 rounded-xl text-sm font-semibold text-blue-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        >
                            <option value="all">All Categories</option>
                            <option value="Mental Well-being">Mental Well-being</option>
                            <option value="Stress Management">Stress Management</option>
                            <option value="Therapy & Coaching">Therapy & Coaching</option>
                            <option value="Social Relations">Social Relations</option>
                            <option value="Personal Development">Personal Development</option>
                            <option value="News">News</option>
                            <option value="Testimonials">Testimonials</option>
                        </select>

                        {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery !== '') && (
                            <Button
                                variant="ghost"
                                className="text-sm text-red-500 hover:text-red-600"
                                onClick={() => {
                                    setStatusFilter('all');
                                    setCategoryFilter('all');
                                    setSearchQuery('');
                                }}
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Articles List */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
                            <tr>
                                <th className="px-3 py-4 text-center w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === paginatedArticles.length && paginatedArticles.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded cursor-pointer"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-xs sm:text-sm font-semibold">Article</th>
                                <th className="px-6 py-4 text-left text-xs sm:text-sm font-semibold">Category</th>
                                <th className="px-6 py-4 text-left text-xs sm:text-sm font-semibold">Status</th>
                                <th className="px-6 py-4 text-left text-xs sm:text-sm font-semibold">Stats</th>
                                <th className="px-6 py-4 text-left text-xs sm:text-sm font-semibold">Date</th>
                                <th className="px-6 py-4 text-right text-xs sm:text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <RefreshCw className="animate-spin text-blue-600" size={20} />
                                            <span>Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedArticles.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        {searchQuery ? `No articles matching "${searchQuery}"` : 'No articles found. Create your first piece!'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedArticles.map((article: BlogArticle) => (
                                    <tr key={article._id} className={`hover:bg-blue-50/50 transition-colors ${selectedIds.has(article._id) ? 'bg-blue-50 ring-1 ring-inset ring-blue-200' : ''}`}>
                                        <td className="px-3 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(article._id)}
                                                onChange={() => toggleSelect(article._id)}
                                                className="w-4 h-4 rounded cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 flex-shrink-0 flex justify-center">
                                                    {article.featured ? (
                                                        <div className="p-1.5 bg-yellow-100 rounded-lg text-yellow-600">
                                                            <Star size={16} fill="currentColor" />
                                                        </div>
                                                    ) : (
                                                        <div className="p-1.5 bg-gray-50 rounded-lg text-gray-400">
                                                            <FileText size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-blue-900 truncate">{article.title}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{article.excerpt}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block whitespace-nowrap px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(article.status)}`}>
                                                {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Eye size={14} className="text-gray-400" />
                                                    <span>{article.views}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Heart size={14} className="text-red-400" />
                                                    <span>{article.likes.length}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare size={14} className="text-blue-400" />
                                                    <span>{article.comments.length}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex flex-col">
                                                <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US')}</span>
                                                <span className="text-[10px] text-gray-400">
                                                    {new Date(article.publishedAt || article.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(article)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && filteredArticles.length > 0 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-600">
                                Showing{' '}
                                <span className="font-bold text-blue-900">
                                    {startIndex + 1}-{Math.min(endIndex, filteredArticles.length)}
                                </span>{' '}
                                of <span className="font-bold text-blue-900">{filteredArticles.length}</span> articles
                                {(filteredArticles.length !== articles.length) && (
                                    <span className="text-gray-400 ml-1">(filtered)</span>
                                )}
                            </p>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    variant="ghost"
                                    className="flex-1 sm:flex-initial text-sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    className="flex-1 sm:flex-initial text-sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage >= totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto !p-0 shadow-2xl">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-blue-900">
                                {editingArticle ? 'Edit Article' : 'Create New Article'}
                            </h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Enter article title"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt</label>
                                        <textarea
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            rows={3}
                                            placeholder="Brief summary for cards"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                                    <div className="relative group aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-center transition-colors hover:border-blue-400">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Image className="text-gray-300 mb-2" size={48} />
                                                <p className="text-sm text-gray-500">Click to upload image</p>
                                            </>
                                        )}
                                        <label className="absolute inset-0 cursor-pointer opacity-0">
                                            <input type="file" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                        {imagePreview && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-bold">Change Image</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2">
                                        Recommended: 1200x800px. JPG, PNG or WebP.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                                <div className="prose-sm">
                                    <RichTextEditor
                                        value={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        placeholder="Start writing your article..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white"
                                    >
                                        <option value="Mental Well-being">Mental Well-being</option>
                                        <option value="Stress Management">Stress Management</option>
                                        <option value="Therapy & Coaching">Therapy & Coaching</option>
                                        <option value="Social Relations">Social Relations</option>
                                        <option value="Personal Development">Personal Development</option>
                                        <option value="News">News</option>
                                        <option value="Testimonials">Testimonials</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.featured ? 'bg-orange-500' : 'bg-gray-200'}`}>
                                            <div className={`bg-white w-4 h-4 rounded-full transition-transform ${formData.featured ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        />
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-blue-900 transition-colors">
                                            Feature Article
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-blue-50/50 p-6 rounded-2xl border-2 border-blue-50 space-y-4">
                                <h3 className="font-bold text-blue-900 flex items-center gap-2">
                                    <Search size={18} /> SEO Configuration
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-blue-700 mb-1 uppercase">Meta-Title</label>
                                        <input
                                            type="text"
                                            value={formData.metaTitle}
                                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="Google display title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-blue-700 mb-1 uppercase">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="wellbeing, health, tips"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-blue-700 mb-1 uppercase">Meta-Description</label>
                                    <textarea
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                                        rows={2}
                                        placeholder="Search result snippet..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t font-bold">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingArticle(null);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    icon={editingArticle ? <CheckCircle size={18} /> : <Plus size={18} />}
                                >
                                    {editingArticle ? 'Update Article' : 'Publish Article'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Bulk Delete Confirmation Modal */}
            {bulkDeleteConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Delete {selectedIds.size} Article(s)?</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to permanently delete <span className="font-bold text-red-600">{selectedIds.size}</span> selected article(s)?
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setBulkDeleteConfirmOpen(false)} disabled={bulkDeleting}>Cancel</Button>
                            <Button icon={<Trash2 size={18} />} className="bg-red-600 hover:bg-red-700 text-white border-red-600" onClick={handleBulkDeleteConfirm} disabled={bulkDeleting}>
                                {bulkDeleting ? 'Deleting...' : `Delete All (${selectedIds.size})`}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogManagementPage;
