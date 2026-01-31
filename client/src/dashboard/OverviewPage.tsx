import { useState, useEffect } from 'react';
import StatsWidget from './components/widgets/StatsWidget';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  FileCheck,
  MessageSquare,
  Heart,
  Calendar,
  Search,
  TrendingUp,
  UserCheck,
  Clock,
  Mail,
  Hash,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface AdminOverviewData {
  totalUsers: number;
  totalPatients: number;
  totalProfessionals: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalEvents: number;
  totalGalleryItems: number;
  totalContacts: number;
  totalPartners: number;
  totalRequests: number;
  totalAdmins: number;
  verificationStats: {
    pending: number;
    approved: number;
    rejected: number;
  };
  activeUsers: {
    online: number;
    offline: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  postsStats: {
    totalHashtags: number;
    topHashtags: { hashtag: string; count: number }[];
    postsThisWeek: number;
    postsThisMonth: number;
  };
  galleryStats: {
    totalViews: number;
    byCategory: { category: string; count: number; views: number }[];
  };
  mostActiveUsers: {
    _id: string;
    nom: string;
    email: string;
    role: string;
    postCount: number;
    commentCount: number;
    totalLikes: number;
  }[];
  recentlyCreatedPosts: {
    _id: string;
    content: string;
    username: string;
    userRole: string;
    likes: number;
    commentsCount: number;
    date: Date;
  }[];
  recentlyCreatedAdmins: {
    _id: string;
    nom: string;
    email: string;
    phone?: string;
    date: Date;
  }[];
  pendingVerifications: {
    _id: string;
    professional: {
      _id: string;
      nom: string;
      email: string;
      specialite: string;
    };
    specialite: string;
    createdAt: Date;
  }[];
  recentContacts: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    createdAt: Date;
  }[];
  timeline: {
    today: {
      users: number;
      posts: number;
      contacts: number;
    };
    thisWeek: {
      users: number;
      posts: number;
      contacts: number;
    };
    thisMonth: {
      users: number;
      posts: number;
      contacts: number;
    };
  };
}

const OverviewPage = () => {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!API_BASE_URL) {
        throw new Error('API URL is not configured. Please check your .env file');
      }

      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin authentication required. Please log in.');
      }

      const response = await fetch(`${API_BASE_URL}/admin/overview`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch overview data');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Error fetching overview:', err);

      // Generic error handling without port-specific messages
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Unable to connect to the backend server. Please ensure the server is running.');
      } else {
        setError(err.message || 'Failed to load overview data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setSearchLoading(true);
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/overview/search?query=${encodeURIComponent(searchQuery)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const result = await response.json();
      setSearchResults(result);
    } catch (err: any) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800 font-semibold mb-2">💡 Solution:</p>
            <p className="text-sm text-yellow-700">
              Please ensure the backend server is properly configured and running.
            </p>
          </div>
          <Button onClick={fetchOverviewData} icon={<RefreshCw size={16} />}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Dashboard Overview</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Platform statistics and overview
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            icon={<RefreshCw size={16} />}
            onClick={fetchOverviewData}
            className="text-xs sm:text-sm"
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search (users, posts, admins, events, gallery, contacts, partners, requests)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchLoading && (
          <div className="mt-4 text-center">
            <RefreshCw className="animate-spin mx-auto mb-2 text-blue-600" size={20} />
            <p className="text-gray-600 text-sm">Searching...</p>
          </div>
        )}

        {searchResults && !searchLoading && (
          <div className="mt-4 space-y-4">
            {searchResults.users?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Users ({searchResults.users.length})</h4>
                <div className="space-y-2">
                  {searchResults.users.map((user: any) => (
                    <div key={user._id} className="p-2 bg-gray-50 rounded text-sm">
                      <span className="font-medium">{user.nom}</span> - {user.email} ({user.role})
                    </div>
                  ))}
                </div>
              </div>
            )}
            {searchResults.posts?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Posts ({searchResults.posts.length})</h4>
                <div className="space-y-2">
                  {searchResults.posts.map((post: any) => (
                    <div key={post._id} className="p-2 bg-gray-50 rounded text-sm">
                      <span className="font-medium">{post.username}</span>: {post.content.substring(0, 100)}...
                    </div>
                  ))}
                </div>
              </div>
            )}
            {searchResults.admins?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Admins ({searchResults.admins.length})</h4>
                <div className="space-y-2">
                  {searchResults.admins.map((admin: any) => (
                    <div key={admin._id} className="p-2 bg-gray-50 rounded text-sm">
                      <span className="font-medium">{admin.nom}</span> - {admin.email}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Object.values(searchResults).every((arr: any) => !arr || arr.length === 0) && (
              <p className="text-gray-500 text-center py-4">No results found</p>
            )}
          </div>
        )}
      </Card>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatsWidget
          icon={Users}
          title="Total Users"
          value={data.totalUsers.toLocaleString()}
          change={`+${data.activeUsers.newThisMonth}`}
          trend="up"
          color="blue"
        />
        <StatsWidget
          icon={FileCheck}
          title="Pending Requests"
          value={data.verificationStats.pending.toString()}
          change={`${data.totalRequests} total`}
          trend="up"
          color="orange"
        />
        <StatsWidget
          icon={MessageSquare}
          title="Total Posts"
          value={data.totalPosts.toLocaleString()}
          change={`+${data.postsStats.postsThisWeek} this week`}
          trend="up"
          color="teal"
        />
        <StatsWidget
          icon={Heart}
          title="Total Likes"
          value={data.totalLikes.toLocaleString()}
          change={`${data.totalComments} comments`}
          trend="up"
          color="purple"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatsWidget
          icon={UserCheck}
          title="Patients"
          value={data.totalPatients.toLocaleString()}
          change={`${data.totalProfessionals} professionals`}
          trend="up"
          color="blue"
        />
        <StatsWidget
          icon={Activity}
          title="Online Users"
          value={data.activeUsers.online.toString()}
          change={`${data.activeUsers.offline} offline`}
          trend="up"
          color="teal"
        />
        <StatsWidget
          icon={Calendar}
          title="Events"
          value={data.totalEvents.toLocaleString()}
          change={`${data.totalGalleryItems} gallery items`}
          trend="up"
          color="purple"
        />
        <StatsWidget
          icon={Mail}
          title="Contacts"
          value={data.totalContacts.toLocaleString()}
          change={`${data.totalPartners} partners`}
          trend="up"
          color="orange"
        />
      </div>

      {/* Verification Stats */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Verification Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
            <Clock className="text-yellow-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{data.verificationStats.pending}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-700">{data.verificationStats.approved}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
            <XCircle className="text-red-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-700">{data.verificationStats.rejected}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline Stats */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Today</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Users</span>
                <span className="font-bold">{data.timeline.today.users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Posts</span>
                <span className="font-bold">{data.timeline.today.posts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contacts</span>
                <span className="font-bold">{data.timeline.today.contacts}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">This Week</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Users</span>
                <span className="font-bold">{data.timeline.thisWeek.users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Posts</span>
                <span className="font-bold">{data.timeline.thisWeek.posts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contacts</span>
                <span className="font-bold">{data.timeline.thisWeek.contacts}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">This Month</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Users</span>
                <span className="font-bold">{data.timeline.thisMonth.users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Posts</span>
                <span className="font-bold">{data.timeline.thisMonth.posts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contacts</span>
                <span className="font-bold">{data.timeline.thisMonth.contacts}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {/* Recent Posts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
            <MessageSquare className="text-blue-600" size={24} />
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.recentlyCreatedPosts.length > 0 ? (
              data.recentlyCreatedPosts.map((post) => (
                <div key={post._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{post.username}</p>
                      <p className="text-xs text-gray-500">{post.userRole}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(post.date)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart size={14} /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} /> {post.commentsCount}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent posts</p>
            )}
          </div>
        </Card>

        {/* Top Hashtags */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Top Hashtags</h2>
            <Hash className="text-blue-600" size={24} />
          </div>
          <div className="space-y-2">
            {data.postsStats.topHashtags.length > 0 ? (
              data.postsStats.topHashtags.map((tag, index) => (
                <div key={tag.hashtag} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    <span className="text-sm font-medium">#{tag.hashtag}</span>
                  </div>
                  <span className="text-sm text-gray-600">{tag.count} posts</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hashtags found</p>
            )}
          </div>
        </Card>

        {/* Most Active Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Most Active Users</h2>
            <TrendingUp className="text-blue-600" size={24} />
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.mostActiveUsers.length > 0 ? (
              data.mostActiveUsers.map((user, index) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.nom}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">{user.postCount} posts</p>
                    <p className="text-xs text-gray-500">{user.commentCount} comments</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No active users found</p>
            )}
          </div>
        </Card>

        {/* Gallery Stats */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Gallery Statistics</h2>
            <Eye className="text-blue-600" size={24} />
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Views</span>
              <span className="text-2xl font-bold text-blue-600">{data.galleryStats.totalViews.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            {data.galleryStats.byCategory.length > 0 ? (
              data.galleryStats.byCategory.map((cat) => (
                <div key={cat.category} className="p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{cat.category}</span>
                    <span className="text-xs text-gray-500">{cat.count} items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-600">{cat.views} views</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No gallery data available</p>
            )}
          </div>
        </Card>

        {/* Pending Verifications */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Pending Verifications</h2>
            <Clock className="text-orange-600" size={24} />
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.pendingVerifications.length > 0 ? (
              data.pendingVerifications.map((req) => (
                <div key={req._id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{req.professional.nom}</p>
                      <p className="text-xs text-gray-500">{req.professional.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(req.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Specialty:</span> {req.specialite}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No pending verifications</p>
            )}
          </div>
        </Card>

        {/* Recent Contacts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Contacts</h2>
            <Mail className="text-blue-600" size={24} />
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.recentContacts.length > 0 ? (
              data.recentContacts.map((contact) => (
                <div key={contact._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{contact.firstName} {contact.lastName}</p>
                      <p className="text-xs text-gray-500">{contact.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(contact.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Subject:</span> {contact.subject}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent contacts</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;