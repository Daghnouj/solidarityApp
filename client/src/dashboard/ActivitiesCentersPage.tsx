import React, { useState } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import { 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Users,
  Star,
  MoreVertical,
  Eye
} from 'lucide-react';

interface Center {
  id: string;
  name: string;
  type: 'therapy' | 'wellness' | 'meditation' | 'counseling';
  address: string;
  city: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  rating: number;
  members: number;
  image: string;
  description: string;
}

const ActivitiesCentersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const centers: Center[] = [
    {
      id: '1',
      name: 'Therapy Center Tunis',
      type: 'therapy',
      address: 'Avenue Habib Bourguiba',
      city: 'Tunis',
      phone: '+216 71 123 456',
      email: 'contact@therapy-tunis.tn',
      status: 'active',
      rating: 4.8,
      members: 245,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
      description: 'Professional therapy center offering CBT, family therapy, and counseling services.'
    },
    {
      id: '2',
      name: 'Wellness Hub Sousse',
      type: 'wellness',
      address: 'Rue de la République',
      city: 'Sousse',
      phone: '+216 73 456 789',
      email: 'info@wellness-sousse.tn',
      status: 'active',
      rating: 4.6,
      members: 189,
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400',
      description: 'Complete wellness center with spa, meditation, and mental health services.'
    },
    {
      id: '3',
      name: 'Mindfulness Center Sfax',
      type: 'meditation',
      address: 'Avenue Majida Boulila',
      city: 'Sfax',
      phone: '+216 74 987 654',
      email: 'hello@mindfulness-sfax.tn',
      status: 'active',
      rating: 4.9,
      members: 312,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
      description: 'Specialized mindfulness and meditation center with certified instructors.'
    },
    {
      id: '4',
      name: 'Counseling Center Bizerte',
      type: 'counseling',
      address: 'Rue 2 Mars 1934',
      city: 'Bizerte',
      phone: '+216 72 321 654',
      email: 'support@counseling-bizerte.tn',
      status: 'inactive',
      rating: 4.3,
      members: 98,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      description: 'Youth and family counseling services with experienced psychologists.'
    }
  ];

  const getTypeColor = (type: string) => {
    switch(type) {
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Activities & Centers</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">Manage therapy centers and wellness facilities</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
          Add New Center
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Total Centers</p>
          <p className="text-3xl font-bold text-blue-900">18</p>
          <p className="text-xs text-green-600 mt-2">+2 this month</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
          <p className="text-sm text-gray-600 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-900">15</p>
          <p className="text-xs text-gray-600 mt-2">83.3% active rate</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100">
          <p className="text-sm text-gray-600 mb-1">Total Members</p>
          <p className="text-3xl font-bold text-purple-900">844</p>
          <p className="text-xs text-purple-600 mt-2">Across all centers</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100">
          <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
          <p className="text-3xl font-bold text-orange-900">4.7</p>
          <div className="flex items-center gap-1 mt-2">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} size={12} className="text-orange-500 fill-orange-500" />
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

          <select className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500">
            <option>All Types</option>
            <option>Therapy</option>
            <option>Wellness</option>
            <option>Meditation</option>
            <option>Counseling</option>
          </select>

          <select className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500">
            <option>All Cities</option>
            <option>Tunis</option>
            <option>Sousse</option>
            <option>Sfax</option>
            <option>Bizerte</option>
          </select>

          <Button variant="ghost" icon={<Filter size={18} />} className="px-4">
            More Filters
          </Button>
        </div>
      </Card>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {centers.map((center) => (
          <Card key={center.id} hover className="overflow-hidden">
            {/* Center Image */}
            <div className="h-48 bg-gray-200 relative overflow-hidden">
              <img 
                src={center.image} 
                alt={center.name}
                className="w-full h-full object-cover"
              />
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
                    {center.type.charAt(0).toUpperCase() + center.type.slice(1)}
                  </span>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>

              <p className="text-gray-700 text-sm mb-4">{center.description}</p>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="text-blue-600" />
                  <span>{center.address}, {center.city}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-orange-600" />
                  <span>{center.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-teal-600" />
                  <span>{center.email}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star size={16} className="text-orange-500 fill-orange-500" />
                    <span className="font-bold text-blue-900">{center.rating}</span>
                  </div>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users size={16} className="text-blue-600" />
                    <span className="font-bold text-blue-900">{center.members}</span>
                  </div>
                  <p className="text-xs text-gray-600">Members</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="ghost" icon={<Eye size={18} />} className="flex-1 text-sm">
                  View
                </Button>
                <Button variant="ghost" icon={<Edit size={18} />} className="flex-1 text-sm">
                  Edit
                </Button>
                <Button variant="ghost" icon={<Trash2 size={18} />} className="px-4 text-sm border-red-300 text-red-600 hover:bg-red-50">
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {centers.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-gray-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No centers found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first center</p>
          <Button icon={<Plus size={18} />}>
            Add New Center
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ActivitiesCentersPage;