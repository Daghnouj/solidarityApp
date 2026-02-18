import React, { useState, useEffect } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Users,
  Star,
  MoreVertical,
  Eye,
  RefreshCw,
  X,
  Globe,
  Calendar,
  Clock,
  AlertCircle,
  Upload,
  Save,
  CheckSquare,
  Square,
  Smartphone,
  Mail
} from 'lucide-react';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Interface for backend event data
interface BackendEvent {
  _id: string;
  name: string;
  images: string[];
  address: string;
  coordinates?: string;
  activities: Array<{
    name: string;
    day: string;
  }>;
  description: string;
  website?: string;
  category?: string;
  phone?: string;
  email?: string;
  participants?: string[];
  averageRating?: number;
  numberOfRatings?: number;
  createdAt: string;
  updatedAt: string;
}

// Interface for frontend center data
interface Center {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  rating: number;
  members: number;
  image: string;
  description: string;
  website?: string;
  category?: string;
  activities: Array<{
    name: string;
    day: string;
  }>;
  coordinates?: string;
  createdAt: string;
}

const ActivitiesCentersPage: React.FC = () => {
  const [centers, setCenters] = useState<Center[]>([]);
  const [backendEvents, setBackendEvents] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<Center | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [viewingMembersCenter, setViewingMembersCenter] = useState<Center | null>(null);
  const [centerMembers, setCenterMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);


  // Form states
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    coordinates: '',
    description: '',
    website: '',
    category: '',
    phone: '',
    email: '',
    activities: [] as Array<{ name: string; day: string }>
  });
  const [images, setImages] = useState<(File | null)[]>(new Array(4).fill(null));
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(new Array(4).fill(null));
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch events from server
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!API_BASE_URL) {
        throw new Error('API URL is not configured');
      }

      const response = await fetch(`${API_BASE_URL}/events?page=1&limit=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch events');
      }

      const data = await response.json();

      if (data.success && data.data) {
        setBackendEvents(data.data);
        // Map backend events to frontend centers
        const mappedCenters: Center[] = data.data.map((event: BackendEvent) => {
          // Extract city from address (simple extraction)
          const addressParts = event.address.split(',');
          const city = addressParts.length > 1 ? addressParts[addressParts.length - 1].trim() : 'Unknown';

          // Use first image as main image
          const image = event.images && event.images.length > 0 ? event.images[0] : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400';

          // Map category to type, or use category as type
          const type = event.category || 'therapy';

          return {
            id: event._id,
            name: event.name,
            type: type,
            address: event.address,
            city: city,
            phone: event.phone || '+216 XX XXX XXX',
            email: event.email || 'contact@center.tn',
            status: 'active' as const, // Default status
            rating: event.averageRating || 0,
            members: event.participants?.length || 0,
            image: image,
            description: event.description,
            website: event.website,
            category: event.category,
            activities: event.activities || [],
            coordinates: event.coordinates,
            createdAt: event.createdAt
          };
        });

        setCenters(mappedCenters);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load activity centers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Calculate stats
  const totalCenters = centers.length;
  const activeCenters = centers.filter(c => c.status === 'active').length;
  const totalMembers = centers.reduce((sum, c) => sum + c.members, 0);
  const avgRating = centers.length > 0
    ? centers.reduce((sum, c) => sum + c.rating, 0) / centers.length
    : 0;

  // Get unique categories
  const categories = Array.from(new Set(centers.map(c => c.category || c.type).filter(Boolean)));

  // Get unique cities
  const cities = Array.from(new Set(centers.map(c => c.city).filter(Boolean)));

  // Filter centers
  const getFilteredCenters = () => {
    return centers.filter(center => {
      const matchesSearch = !searchQuery ||
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' ||
        (center.category || center.type) === selectedCategory;

      const matchesCity = selectedCity === 'all' || center.city === selectedCity;

      return matchesSearch && matchesCategory && matchesCity;
    });
  };

  const filteredCenters = getFilteredCenters();

  // Handle view details
  const handleViewDetails = (center: Center) => {
    setSelectedCenter(center);
    setViewModalOpen(true);
  };

  // Handle edit
  const handleEdit = (center: Center) => {
    const backendEvent = backendEvents.find(e => e._id === center.id);
    if (backendEvent) {
      setEditingCenter(center);
      setFormData({
        name: backendEvent.name,
        address: backendEvent.address,
        coordinates: backendEvent.coordinates || '',
        description: backendEvent.description,
        website: backendEvent.website || '',
        category: backendEvent.category || '',
        phone: backendEvent.phone || '',
        email: backendEvent.email || '',
        activities: backendEvent.activities || []
      });

      // Initialize with backend images, padding to 4 slots
      const backendImages = backendEvent.images || [];
      const paddedPreviews = new Array(4).fill(null);
      backendImages.forEach((img, i) => { if (i < 4) paddedPreviews[i] = img; });
      setImagePreviews(paddedPreviews);
      setImages(new Array(4).fill(null));

      setFormError(null);
      setEditModalOpen(true);
    }
  };

  // Handle add modal open
  const handleAddModalOpen = () => {
    setFormData({
      name: '',
      address: '',
      coordinates: '',
      description: '',
      website: '',
      category: '',
      phone: '',
      email: '',
      activities: []
    });
    setImages(new Array(4).fill(null));
    setImagePreviews(new Array(4).fill(null));
    setFormError(null);
    setShowAddModal(true);
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormError('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size must be less than 5MB');
        return;
      }

      // Update images state immediately
      setImages(prev => {
        const next = [...prev];
        next[index] = file;
        return next;
      });

      // Update previews
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => {
          const next = [...prev];
          next[index] = reader.result as string;
          return next;
        });
      };
      reader.readAsDataURL(file);
      setFormError(null);
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setImagePreviews(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  // Handle form submit (create)
  const handleCreateEvent = async () => {
    try {
      setFormError(null);
      setFormLoading(true);

      // Validation
      if (!formData.name.trim()) {
        setFormError('Name is required');
        setFormLoading(false);
        return;
      }
      if (!formData.address.trim()) {
        setFormError('Address is required');
        setFormLoading(false);
        return;
      }
      if (!formData.description.trim()) {
        setFormError('Description is required');
        setFormLoading(false);
        return;
      }
      if (images.filter(img => img !== null).length !== 4) {
        setFormError('Exactly 4 images are required');
        setFormLoading(false);
        return;
      }

      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        setFormError('Admin authentication required');
        setFormLoading(false);
        return;
      }

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('address', formData.address);
      if (formData.coordinates) {
        formDataToSend.append('coordinates', formData.coordinates);
      }
      formDataToSend.append('description', formData.description);
      if (formData.website) {
        formDataToSend.append('website', formData.website);
      }
      if (formData.category) {
        formDataToSend.append('category', formData.category);
      }
      formDataToSend.append('activities', JSON.stringify(formData.activities));

      // Append images
      images.forEach((image) => {
        if (image) {
          formDataToSend.append('photo', image);
        }
      });

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }

      // Success
      await fetchEvents();
      setShowAddModal(false);
      setFormData({
        name: '',
        address: '',
        coordinates: '',
        description: '',
        website: '',
        category: '',
        phone: '',
        email: '',
        activities: []
      });
      setImages(new Array(4).fill(null));
      setImagePreviews(new Array(4).fill(null));
      alert('Event created successfully!');
    } catch (err: any) {
      console.error('Error creating event:', err);
      setFormError(err.message || 'Failed to create event');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form submit (update)
  const handleUpdateEvent = async () => {
    if (!editingCenter) return;

    try {
      setFormError(null);
      setFormLoading(true);

      // Validation
      if (!formData.name.trim()) {
        setFormError('Name is required');
        setFormLoading(false);
        return;
      }
      if (!formData.address.trim()) {
        setFormError('Address is required');
        setFormLoading(false);
        return;
      }
      if (!formData.description.trim()) {
        setFormError('Description is required');
        setFormLoading(false);
        return;
      }
      // Build image mapping to tell server which slots are new and which are existing URLs
      const imageMapping = imagePreviews.map((preview, index) => {
        if (images[index]) return '__NEW__';
        return preview; // Existing URL or null
      });

      // Validation: Ensure we still end up with 4 images (new or existing)
      if (imageMapping.filter(url => url !== null).length !== 4) {
        setFormError('Exactly 4 images are required (new or existing)');
        setFormLoading(false);
        return;
      }

      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        setFormError('Admin authentication required');
        setFormLoading(false);
        return;
      }

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('address', formData.address);
      if (formData.coordinates) {
        formDataToSend.append('coordinates', formData.coordinates);
      }
      formDataToSend.append('description', formData.description);
      if (formData.website) {
        formDataToSend.append('website', formData.website);
      }
      if (formData.category) {
        formDataToSend.append('category', formData.category);
      }
      if (formData.phone) {
        formDataToSend.append('phone', formData.phone);
      }
      if (formData.email) {
        formDataToSend.append('email', formData.email);
      }
      formDataToSend.append('activities', JSON.stringify(formData.activities));
      formDataToSend.append('imageMapping', JSON.stringify(imageMapping));

      // Append only the NEW images
      images.forEach((image) => {
        if (image) {
          formDataToSend.append('photo', image);
        }
      });

      const response = await fetch(`${API_BASE_URL}/events/${editingCenter.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update event');
      }

      // Success
      await fetchEvents();
      setEditModalOpen(false);
      setEditingCenter(null);
      setFormData({
        name: '',
        address: '',
        coordinates: '',
        description: '',
        website: '',
        category: '',
        phone: '',
        email: '',
        activities: []
      });
      setImages(new Array(4).fill(null));
      setImagePreviews(new Array(4).fill(null));
      alert('Event updated successfully!');
    } catch (err: any) {
      console.error('Error updating event:', err);
      setFormError(err.message || 'Failed to update event');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete
  const handleDeleteClick = (centerId: string) => {
    setDeletingId(centerId);
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

      const response = await fetch(`${API_BASE_URL}/events/${deletingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete event');
      }

      // Refresh events
      await fetchEvents();
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      alert('Event deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting event:', err);
      setError(err.message || 'Failed to delete event');
    }
  };

  // Bulk select/delete handlers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCenters.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCenters.map(c => c.id)));
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.size === 0) return;
    try {
      setBulkDeleting(true);
      setError(null);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin authentication required');
      }
      const deletePromises = Array.from(selectedIds).map(id =>
        fetch(`${API_BASE_URL}/events/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        })
      );
      await Promise.all(deletePromises);
      setSelectedIds(new Set());
      setBulkDeleteConfirmOpen(false);
      await fetchEvents();
      alert(`${selectedIds.size} event(s) deleted successfully!`);
    } catch (err: any) {
      console.error('Error bulk deleting events:', err);
      setError(err.message || 'Failed to delete some events');
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleViewMembers = async (center: Center) => {
    try {
      setViewingMembersCenter(center);
      setMembersModalOpen(true);
      setLoadingMembers(true);
      setCenterMembers([]);

      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/events/${center.id}/members`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      if (data.success) {
        setCenterMembers(data.data);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'therapy': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'wellness': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'meditation': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'counseling': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading && centers.length === 0) {
    return <LoadingSpinner message="Loading activity centers..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Activities & Centers</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">Manage therapy centers and wellness facilities</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {filteredCenters.length > 0 && (
            <Button
              variant="ghost"
              icon={selectedIds.size === filteredCenters.length ? <CheckSquare size={18} /> : <Square size={18} />}
              onClick={toggleSelectAll}
            >
              {selectedIds.size === filteredCenters.length ? 'Deselect All' : 'Select All'}
            </Button>
          )}
          {selectedIds.size > 0 && (
            <Button
              variant="ghost"
              icon={<Trash2 size={18} />}
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => setBulkDeleteConfirmOpen(true)}
            >
              Delete Selected ({selectedIds.size})
            </Button>
          )}
          <Button
            variant="ghost"
            icon={<RefreshCw size={18} />}
            onClick={fetchEvents}
          >
            Refresh
          </Button>
          <Button icon={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
            Add New Center
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Total Centers</p>
          <p className="text-3xl font-bold text-blue-900">{totalCenters}</p>
          <p className="text-xs text-gray-600 mt-2">All centers</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
          <p className="text-sm text-gray-600 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-900">{activeCenters}</p>
          <p className="text-xs text-gray-600 mt-2">
            {totalCenters > 0 ? `${Math.round((activeCenters / totalCenters) * 100)}% active rate` : 'No centers'}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100">
          <p className="text-sm text-gray-600 mb-1">Total Members</p>
          <p className="text-3xl font-bold text-purple-900">{totalMembers}</p>
          <p className="text-xs text-gray-600 mt-2">Across all centers</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100">
          <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
          <p className="text-3xl font-bold text-orange-900">{avgRating.toFixed(1)}</p>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                className={star <= Math.round(avgRating) ? "text-orange-500 fill-orange-500" : "text-gray-300"}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search centers by name, city, or type..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <select
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Types</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>

          <select
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCenters.map((center) => (
          <Card key={center.id} hover className={`overflow-hidden ${selectedIds.has(center.id) ? 'ring-2 ring-blue-500' : ''}`}>
            {/* Center Image */}
            <div className="h-48 bg-gray-200 relative overflow-hidden">
              <img
                src={center.image}
                alt={center.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400';
                }}
              />
              {/* Selection checkbox */}
              <div className="absolute top-4 left-4">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelect(center.id); }}
                  className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
                >
                  {selectedIds.has(center.id) ? (
                    <CheckSquare size={18} className="text-blue-600" />
                  ) : (
                    <Square size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm bg-white/90 ${getStatusColor(center.status)}`}>
                  {center.status.charAt(0).toUpperCase() + center.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Center Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-1">{center.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(center.type)}`}>
                    {(center.category || center.type).charAt(0).toUpperCase() + (center.category || center.type).slice(1)}
                  </span>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{center.description}</p>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="text-blue-600" />
                  <span>{center.address}, {center.city}</span>
                </div>
                {center.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe size={14} className="text-teal-600" />
                    <a href={center.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                      {center.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star size={16} className="text-orange-500 fill-orange-500" />
                    <span className="font-bold text-blue-900">{center.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div
                  className="text-center cursor-pointer hover:bg-gray-100 transition-colors p-1 rounded-lg"
                  onClick={(e) => { e.stopPropagation(); handleViewMembers(center); }}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users size={16} className="text-blue-600" />
                    <span className="font-bold text-blue-900">{center.members}</span>
                  </div>
                  <p className="text-xs text-gray-600">Members</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="ghost" icon={<Eye size={18} />} className="flex-1 text-sm" onClick={() => handleViewDetails(center)}>
                  View
                </Button>
                <Button variant="ghost" icon={<Edit size={18} />} className="flex-1 text-sm" onClick={() => handleEdit(center)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  icon={<Trash2 size={18} />}
                  className="px-4 text-sm border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteClick(center.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredCenters.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-gray-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No centers found</h3>
          <p className="text-gray-500 mb-6">
            {centers.length === 0
              ? 'Get started by adding your first center'
              : 'No centers match your search criteria'}
          </p>
          {centers.length === 0 && (
            <Button icon={<Plus size={18} />} onClick={handleAddModalOpen}>
              Add New Center
            </Button>
          )}
        </Card>
      )}

      {/* View Details Modal */}
      {viewModalOpen && selectedCenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-900">Center Details</h2>
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedCenter(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Gallery */}
              {backendEvents.find(e => e._id === selectedCenter.id)?.images && (
                <div className="grid grid-cols-2 gap-4">
                  {backendEvents.find(e => e._id === selectedCenter.id)!.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${selectedCenter.name} ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400';
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Basic Info */}
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">{selectedCenter.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(selectedCenter.type)}`}>
                    {(selectedCenter.category || selectedCenter.type).charAt(0).toUpperCase() + (selectedCenter.category || selectedCenter.type).slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedCenter.status)}`}>
                    {selectedCenter.status.charAt(0).toUpperCase() + selectedCenter.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-700">{selectedCenter.description}</p>
              </div>

              {/* Contact & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">Location</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-blue-600" />
                    <span>{selectedCenter.address}, {selectedCenter.city}</span>
                  </div>
                  {selectedCenter.coordinates && (
                    <p className="text-xs text-gray-500 ml-6">Coordinates: {selectedCenter.coordinates}</p>
                  )}
                </div>

                {selectedCenter.website && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700">Website</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe size={16} className="text-teal-600" />
                      <a href={selectedCenter.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                        {selectedCenter.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Activities */}
              {selectedCenter.activities && selectedCenter.activities.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Activities</h4>
                  <div className="space-y-2">
                    {selectedCenter.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar size={16} className="text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.name}</p>
                          <p className="text-sm text-gray-600">Day: {activity.day}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star size={18} className="text-orange-500 fill-orange-500" />
                    <span className="font-bold text-blue-900 text-lg">{selectedCenter.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users size={18} className="text-blue-600" />
                    <span className="font-bold text-blue-900 text-lg">{selectedCenter.members}</span>
                  </div>
                  <p className="text-xs text-gray-600">Members</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock size={18} className="text-purple-600" />
                    <span className="font-bold text-blue-900 text-lg">
                      {new Date(selectedCenter.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Created</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedCenter(null);
                }}
              >
                Close
              </Button>
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
                <h3 className="text-lg font-bold text-gray-900">Delete Center</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this center? All associated data will be permanently removed.
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

      {/* Add/Edit Modals */}
      {(showAddModal || editModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8 flex flex-col relative">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-blue-900">
                {editModalOpen ? 'Edit Center' : 'Add New Center'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditModalOpen(false);
                  setEditingCenter(null);
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

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Images <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">(Exactly 4 images required)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="relative">
                      {imagePreviews[index] ? (
                        <div className="relative group">
                          <img
                            src={imagePreviews[index]}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <span className="text-xs text-gray-600">Image {index + 1}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, index)}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter center name"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter full address"
                />
              </div>

              {/* Coordinates */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Coordinates (Optional)
                </label>
                <input
                  type="text"
                  value={formData.coordinates}
                  onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="e.g., 36.8065,10.1815"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none transition-colors"
                  placeholder="Enter center description"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="https://example.com"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                >
                  <option value="">Select category</option>
                  <option value="therapy">Therapy</option>
                  <option value="wellness">Wellness</option>
                  <option value="meditation">Meditation</option>
                  <option value="counseling">Counseling</option>
                </select>
              </div>

            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 z-10">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAddModal(false);
                  setEditModalOpen(false);
                  setEditingCenter(null);
                  setFormError(null);
                }}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button
                icon={<Save size={18} />}
                onClick={editModalOpen ? handleUpdateEvent : handleCreateEvent}
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : (editModalOpen ? 'Save Changes' : 'Create Center')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete {selectedIds.size} Center(s)?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete <span className="font-bold text-red-600">{selectedIds.size}</span> selected center(s) and all their associated images?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setBulkDeleteConfirmOpen(false)}
                disabled={bulkDeleting}
              >
                Cancel
              </Button>
              <Button
                icon={<Trash2 size={18} />}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-none"
                onClick={handleBulkDeleteConfirm}
                disabled={bulkDeleting}
              >
                {bulkDeleting ? 'Deleting...' : `Delete All (${selectedIds.size})`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {membersModalOpen && viewingMembersCenter && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-lg shadow-gray-200">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Enrolled Members</h3>
                  <p className="text-sm text-gray-500 font-medium">{viewingMembersCenter.name}</p>
                </div>
              </div>
              <button
                onClick={() => setMembersModalOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600 shadow-sm border border-transparent hover:border-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingMembers ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoadingSpinner />
                  <p className="text-gray-500 mt-4 font-medium animate-pulse">Loading members...</p>
                </div>
              ) : centerMembers.length > 0 ? (
                <div className="grid gap-4">
                  {centerMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-white transition-all duration-200 group">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                        <img
                          src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.nom)}&background=random`}
                          alt={member.nom}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate group-hover:text-black transition-colors uppercase text-sm tracking-wide">
                          {member.nom}
                        </h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Mail size={12} className="text-gray-400" />
                            <span className="truncate">{member.email}</span>
                          </div>
                          {member.telephone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Smartphone size={12} className="text-gray-400" />
                              <span className="font-medium text-gray-700">{member.telephone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                    <Users className="text-gray-400" size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">No members enrolled</h4>
                  <p className="text-gray-500 text-sm">This center has no members yet.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <Button
                variant="ghost"
                onClick={() => setMembersModalOpen(false)}
                className="font-bold text-gray-600 hover:bg-gray-100"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesCentersPage;
