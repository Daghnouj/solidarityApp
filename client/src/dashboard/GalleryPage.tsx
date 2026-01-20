import React, { useState } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
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
  Image as ImageIcon
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: 'events' | 'centers' | 'activities' | 'testimonials';
  uploadDate: string;
  uploadedBy: string;
  size: string;
  tags: string[];
}

const GalleryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const galleryItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Wellness Workshop March 2026',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
      category: 'events',
      uploadDate: '2026-01-15',
      uploadedBy: 'Admin User',
      size: '2.4 MB',
      tags: ['workshop', 'wellness', 'group']
    },
    {
      id: '2',
      title: 'Therapy Center Tunis - Main Hall',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
      category: 'centers',
      uploadDate: '2026-01-14',
      uploadedBy: 'Admin User',
      size: '3.1 MB',
      tags: ['center', 'facilities', 'tunis']
    },
    {
      id: '3',
      title: 'Mindfulness Session',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
      category: 'activities',
      uploadDate: '2026-01-13',
      uploadedBy: 'Admin User',
      size: '1.8 MB',
      tags: ['mindfulness', 'meditation', 'session']
    },
    {
      id: '4',
      title: 'Client Success Story',
      imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600',
      category: 'testimonials',
      uploadDate: '2026-01-12',
      uploadedBy: 'Admin User',
      size: '2.0 MB',
      tags: ['testimonial', 'success', 'story']
    },
    {
      id: '5',
      title: 'Group Therapy Session',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600',
      category: 'activities',
      uploadDate: '2026-01-11',
      uploadedBy: 'Admin User',
      size: '2.7 MB',
      tags: ['group', 'therapy', 'session']
    },
    {
      id: '6',
      title: 'Wellness Center Sousse - Reception',
      imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600',
      category: 'centers',
      uploadDate: '2026-01-10',
      uploadedBy: 'Admin User',
      size: '3.5 MB',
      tags: ['center', 'reception', 'sousse']
    }
  ];

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'events': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'centers': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'activities': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'testimonials': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Gallery</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">Manage platform images and media content</p>
        </div>
        <Button icon={<Upload size={18} />}>
          Upload Images
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Total Images</p>
          <p className="text-3xl font-bold text-blue-900">156</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100">
          <p className="text-sm text-gray-600 mb-1">Events</p>
          <p className="text-3xl font-bold text-purple-900">42</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-teal-50 to-white border-2 border-teal-100">
          <p className="text-sm text-gray-600 mb-1">Centers</p>
          <p className="text-3xl font-bold text-teal-900">38</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100">
          <p className="text-sm text-gray-600 mb-1">Activities</p>
          <p className="text-3xl font-bold text-orange-900">76</p>
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
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-900 shadow-md' 
                  : 'text-gray-600'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' 
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
          {galleryItems.map((item) => (
            <Card key={item.id} hover className="overflow-hidden group">
              {/* Image */}
              <div className="relative h-64 bg-gray-200 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-semibold text-blue-900 hover:bg-white transition-colors flex items-center justify-center gap-2">
                      <Eye size={16} />
                      View
                    </button>
                    <button className="px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-blue-900 hover:bg-white transition-colors">
                      <Download size={16} />
                    </button>
                    <button className="px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-600 hover:bg-white transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm bg-white/90 ${getCategoryColor(item.category)}`}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-blue-900 mb-2 line-clamp-1">{item.title}</h3>
                
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  <Calendar size={12} className="text-teal-600" />
                  <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{item.size}</span>
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
          {galleryItems.map((item) => (
            <Card key={item.id} hover className="p-6">
              <div className="flex gap-6">
                {/* Thumbnail */}
                <div className="w-32 h-32 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
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

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-teal-600" />
                      <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImageIcon size={14} className="text-blue-600" />
                      <span>{item.size}</span>
                    </div>
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
                    <Button variant="ghost" icon={<Eye size={16} />} className="text-sm py-2">
                      View
                    </Button>
                    <Button variant="ghost" icon={<Download size={16} />} className="text-sm py-2">
                      Download
                    </Button>
                    <Button variant="ghost" icon={<Trash2 size={16} />} className="text-sm py-2 border-red-300 text-red-600 hover:bg-red-50">
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
      {galleryItems.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="text-gray-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No images found</h3>
          <p className="text-gray-500 mb-6">Upload your first image to get started</p>
          <Button icon={<Upload size={18} />}>
            Upload Images
          </Button>
        </Card>
      )}
    </div>
  );
};

export default GalleryPage;