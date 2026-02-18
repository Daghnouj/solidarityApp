import React, { useState, useEffect } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  Plus,
  Upload,
  Trash2,
  Eye,
  Download,
  Filter,
  Grid,
  List,
  Calendar,
  Tag,
  Image as ImageIcon,
  RefreshCw,
  X,
  AlertCircle,
  Save,
  Play,
  CheckSquare,
  Square
} from 'lucide-react';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Interface for backend gallery data
interface BackendGalleryItem {
  _id: string;
  titre: string;
  desc: string;
  video: string;
  categorie: 'Bien-être Mental' | 'Gestion du Stress' | 'Thérapies et Coaching' | 'Relations Sociales' | 'Développement Personnel';
  views: number;
  createdAt: string;
}

// Interface for frontend gallery item
interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: 'events' | 'centers' | 'activities' | 'testimonials';
  uploadDate: string;
  uploadedBy: string;
  size: string;
  tags: string[];
  videoUrl?: string;
  description?: string;
  views?: number;
}

// Helper function to extract YouTube thumbnail
const getYouTubeThumbnail = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
  }
  return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600';
};

// Helper function to map server category to frontend category
const mapCategory = (serverCategory: string): 'events' | 'centers' | 'activities' | 'testimonials' => {
  const categoryMap: Record<string, 'events' | 'centers' | 'activities' | 'testimonials'> = {
    'Bien-être Mental': 'activities',
    'Gestion du Stress': 'activities',
    'Thérapies et Coaching': 'centers',
    'Relations Sociales': 'events',
    'Développement Personnel': 'testimonials'
  };
  return categoryMap[serverCategory] || 'activities';
};

// Helper function to format file size (mock for now)
const formatSize = (): string => {
  return `${(Math.random() * 3 + 1).toFixed(1)} MB`;
};

const GalleryPage: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [backendItems, setBackendItems] = useState<BackendGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    titre: '',
    desc: '',
    video: '',
    categorie: '' as BackendGalleryItem['categorie'] | ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Bulk delete state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Fetch gallery items from server
  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!API_BASE_URL) {
        throw new Error('API URL is not configured');
      }

      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch gallery items');
      }

      const data = await response.json();

      if (data.success && data.data) {
        setBackendItems(data.data);
        // Map backend items to frontend format
        const mappedItems: GalleryItem[] = data.data.map((item: BackendGalleryItem) => ({
          id: item._id,
          title: item.titre,
          imageUrl: getYouTubeThumbnail(item.video),
          category: mapCategory(item.categorie),
          uploadDate: item.createdAt,
          uploadedBy: 'Admin',
          size: formatSize(),
          tags: item.desc.split(' ').slice(0, 3), // Extract tags from description
          videoUrl: item.video,
          description: item.desc,
          views: item.views
        }));

        setGalleryItems(mappedItems);
      } else {
        setGalleryItems([]);
      }
    } catch (err: any) {
      console.error('Error fetching gallery items:', err);
      setError(err.message || 'Failed to load gallery items');
      setGalleryItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Calculate stats
  const totalImages = galleryItems.length;
  const eventsCount = galleryItems.filter(item => item.category === 'events').length;
  const centersCount = galleryItems.filter(item => item.category === 'centers').length;
  const activitiesCount = galleryItems.filter(item => item.category === 'activities').length;

  // Get unique categories from backend
  const serverCategories: BackendGalleryItem['categorie'][] = [
    'Bien-être Mental',
    'Gestion du Stress',
    'Thérapies et Coaching',
    'Relations Sociales',
    'Développement Personnel'
  ];

  // Filter gallery items
  const getFilteredItems = () => {
    return galleryItems.filter(item => {
      const matchesSearch = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const filteredItems = getFilteredItems();

  // Handle upload modal open
  const handleUploadModalOpen = () => {
    setFormData({
      titre: '',
      desc: '',
      video: '',
      categorie: ''
    });
    setFormError(null);
    setShowUploadModal(true);
  };

  // Handle create gallery item
  const handleCreateGalleryItem = async () => {
    try {
      setFormError(null);
      setFormLoading(true);

      // Validation
      if (!formData.titre.trim()) {
        setFormError('Title is required');
        setFormLoading(false);
        return;
      }
      if (!formData.desc.trim()) {
        setFormError('Description is required');
        setFormLoading(false);
        return;
      }
      if (!formData.video.trim()) {
        setFormError('Video URL is required');
        setFormLoading(false);
        return;
      }
      if (!formData.categorie) {
        setFormError('Category is required');
        setFormLoading(false);
        return;
      }

      // Validate YouTube URL
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      if (!youtubeRegex.test(formData.video)) {
        setFormError('Please enter a valid YouTube URL');
        setFormLoading(false);
        return;
      }

      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        setFormError('Admin authentication required');
        setFormLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create gallery item');
      }

      // Success
      await fetchGalleryItems();
      setShowUploadModal(false);
      setFormData({
        titre: '',
        desc: '',
        video: '',
        categorie: ''
      });
      alert('Gallery item created successfully!');
    } catch (err: any) {
      console.error('Error creating gallery item:', err);
      setFormError(err.message || 'Failed to create gallery item');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete
  const handleDeleteClick = (itemId: string) => {
    setDeletingId(itemId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      setError(null);
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        throw new Error('Admin authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/gallery/${deletingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete gallery item');
      }

      // Refresh gallery
      await fetchGalleryItems();
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      alert('Gallery item deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting gallery item:', err);
      setError(err.message || 'Failed to delete gallery item');
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
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(i => i.id)));
    }
  };

  const handleBulkDeleteConfirm = async () => {
    setBulkDeleting(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) throw new Error('Admin authentication required');

      const deletePromises = Array.from(selectedIds).map(id =>
        fetch(`${API_BASE_URL}/gallery/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
        })
      );
      await Promise.all(deletePromises);
      await fetchGalleryItems();
      setSelectedIds(new Set());
      setBulkDeleteConfirmOpen(false);
      alert(`${selectedIds.size} item(s) deleted successfully!`);
    } catch (err: any) {
      console.error('Error bulk deleting:', err);
      setError(err.message || 'Failed to delete some items');
    } finally {
      setBulkDeleting(false);
    }
  };

  // Handle view
  const handleView = (item: GalleryItem) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  // Handle download (open video in new tab)
  const handleDownload = (item: GalleryItem) => {
    if (item.videoUrl) {
      window.open(item.videoUrl, '_blank');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'events': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'centers': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'activities': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'testimonials': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading && galleryItems.length === 0) {
    return <LoadingSpinner message="Loading gallery..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Gallery</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">Manage platform images and media content</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="ghost"
            icon={selectedIds.size === filteredItems.length && filteredItems.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
            onClick={toggleSelectAll}
          >
            {selectedIds.size === filteredItems.length && filteredItems.length > 0 ? 'Deselect All' : 'Select All'}
          </Button>
          {selectedIds.size > 0 && (
            <Button
              icon={<Trash2 size={18} />}
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              onClick={() => setBulkDeleteConfirmOpen(true)}
            >
              Delete Selected ({selectedIds.size})
            </Button>
          )}
          <Button
            variant="ghost"
            icon={<RefreshCw size={18} />}
            onClick={fetchGalleryItems}
          >
            Refresh
          </Button>
          <Button icon={<Upload size={18} />} onClick={handleUploadModalOpen}>
            Upload Images
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Total Images</p>
          <p className="text-3xl font-bold text-blue-900">{totalImages}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100">
          <p className="text-sm text-gray-600 mb-1">Events</p>
          <p className="text-3xl font-bold text-purple-900">{eventsCount}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-teal-50 to-white border-2 border-teal-100">
          <p className="text-sm text-gray-600 mb-1">Centers</p>
          <p className="text-3xl font-bold text-teal-900">{centersCount}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100">
          <p className="text-sm text-gray-600 mb-1">Activities</p>
          <p className="text-3xl font-bold text-orange-900">{activitiesCount}</p>
        </Card>
      </div>

      {/* Filters & View Controls */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by title or tags..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Categories</option>
            <option value="events">Events</option>
            <option value="centers">Centers</option>
            <option value="activities">Activities</option>
            <option value="testimonials">Testimonials</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-gray-600'
                }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-gray-600'
                }`}
            >
              <List size={20} />
            </button>
          </div>

          <Button variant="ghost" icon={<Filter size={18} />} className="px-4">
            Filters
          </Button>
        </div>
      </Card>

      {/* Gallery Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} hover className={`overflow-hidden group relative ${selectedIds.has(item.id) ? 'ring-2 ring-blue-500' : ''}`}>
              {/* Checkbox */}
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedIds.has(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="w-5 h-5 rounded cursor-pointer shadow-sm"
                />
              </div>
              {/* Image */}
              <div className="relative h-64 bg-gray-200 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleView(item)}
                      className="flex-1 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-semibold text-blue-900 hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(item)}
                      className="px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-blue-900 hover:bg-white transition-colors"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className="px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-600 hover:bg-white transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm bg-white/90 ${getCategoryColor(item.category)}`}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                </div>
                {item.videoUrl && (
                  <div className="absolute top-4 left-4">
                    <div className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs flex items-center gap-1">
                      <Play size={12} />
                      Video
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-blue-900 mb-2 line-clamp-1">{item.title}</h3>

                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  <Calendar size={12} className="text-teal-600" />
                  <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{item.size}</span>
                  {item.views !== undefined && (
                    <>
                      <span>•</span>
                      <span>{item.views} views</span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs flex items-center gap-1">
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Gallery List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} hover className={`p-6 ${selectedIds.has(item.id) ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="flex gap-6">
                {/* Checkbox */}
                <div className="flex items-start pt-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>
                {/* Thumbnail */}
                <div className="w-32 h-32 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600';
                    }}
                  />
                  {item.videoUrl && (
                    <div className="absolute top-2 left-2">
                      <div className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs flex items-center gap-1">
                        <Play size={10} />
                        Video
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900 mb-1">{item.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(item.category)}`}>
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-teal-600" />
                      <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImageIcon size={14} className="text-blue-600" />
                      <span>{item.size}</span>
                    </div>
                    {item.views !== undefined && (
                      <div className="flex items-center gap-2">
                        <Eye size={14} className="text-purple-600" />
                        <span>{item.views} views</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">By {item.uploadedBy}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs flex items-center gap-1">
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" icon={<Eye size={16} />} className="text-sm py-2" onClick={() => handleView(item)}>
                      View
                    </Button>
                    <Button variant="ghost" icon={<Download size={16} />} className="text-sm py-2" onClick={() => handleDownload(item)}>
                      Download
                    </Button>
                    <Button variant="ghost" icon={<Trash2 size={16} />} className="text-sm py-2 border-red-300 text-red-600 hover:bg-red-50" onClick={() => handleDeleteClick(item.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="text-gray-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No images found</h3>
          <p className="text-gray-500 mb-6">
            {galleryItems.length === 0
              ? 'Upload your first image to get started'
              : 'No images match your search criteria'}
          </p>
          {galleryItems.length === 0 && (
            <Button icon={<Upload size={18} />} onClick={handleUploadModalOpen}>
              Upload Images
            </Button>
          )}
        </Card>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-blue-900">Upload Gallery Item</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setFormError(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Error Message */}
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                  <AlertCircle className="text-red-600" size={20} />
                  <p className="text-red-600">{formError}</p>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter gallery item title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none transition-colors"
                  placeholder="Enter description"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube Video URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.video}
                  onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500 mt-1">Enter a valid YouTube video URL</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value as BackendGalleryItem['categorie'] })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="">Select category</option>
                  {serverCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowUploadModal(false);
                  setFormError(null);
                }}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button
                icon={<Save size={18} />}
                onClick={handleCreateGalleryItem}
                disabled={formLoading}
              >
                {formLoading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-blue-900">Gallery Item Details</h2>
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedItem(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Video/Image */}
              {selectedItem.videoUrl ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={selectedItem.videoUrl.replace('watch?v=', 'embed/').split('&')[0]}
                    title={selectedItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600';
                  }}
                />
              )}

              {/* Info */}
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{selectedItem.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(selectedItem.category)}`}>
                    {selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1)}
                  </span>
                </div>
                {selectedItem.description && (
                  <p className="text-gray-700 mb-4">{selectedItem.description}</p>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Upload Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedItem.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Size</p>
                  <p className="font-semibold text-gray-900">{selectedItem.size}</p>
                </div>
                {selectedItem.views !== undefined && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Views</p>
                    <p className="font-semibold text-gray-900">{selectedItem.views}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-600 mb-1">Uploaded By</p>
                  <p className="font-semibold text-gray-900">{selectedItem.uploadedBy}</p>
                </div>
              </div>

              {/* Tags */}
              {selectedItem.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center gap-1">
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedItem(null);
                }}
              >
                Close
              </Button>
              {selectedItem.videoUrl && (
                <Button
                  icon={<Play size={18} />}
                  onClick={() => handleDownload(selectedItem)}
                >
                  Open Video
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Gallery Item</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this gallery item? All associated data will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeletingId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
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
                <h3 className="text-lg font-bold text-gray-900">Delete {selectedIds.size} Item(s)?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete <span className="font-bold text-red-600">{selectedIds.size}</span> selected gallery item(s)?
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

export default GalleryPage;
