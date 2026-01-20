import React, { useState } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  UserPlus
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'therapist' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  avatar: string;
  lastActive: string;
}

const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');

  const users: User[] = [
    {
      id: '1',
      name: 'Sarah Ahmed',
      email: 'sarah.ahmed@example.com',
      phone: '+216 98 765 432',
      role: 'user',
      status: 'active',
      joinedDate: '2026-01-10',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Dr. Lina Hassan',
      email: 'lina.hassan@example.com',
      phone: '+216 97 123 456',
      role: 'therapist',
      status: 'active',
      joinedDate: '2025-12-15',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lina',
      lastActive: '1 hour ago'
    },
    {
      id: '3',
      name: 'Mohammed Ali',
      email: 'mohammed.ali@example.com',
      phone: '+216 99 876 543',
      role: 'user',
      status: 'pending',
      joinedDate: '2026-01-15',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed',
      lastActive: '5 hours ago'
    },
    {
      id: '4',
      name: 'Amira Ben Salem',
      email: 'amira.bs@example.com',
      phone: '+216 96 543 210',
      role: 'user',
      status: 'suspended',
      joinedDate: '2025-11-20',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amira',
      lastActive: '1 day ago'
    },
    {
      id: '5',
      name: 'Youssef Mansour',
      email: 'youssef.m@example.com',
      phone: '+216 95 432 109',
      role: 'therapist',
      status: 'active',
      joinedDate: '2025-10-05',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef',
      lastActive: '30 min ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'suspended': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'therapist': return 'bg-blue-100 text-blue-700';
      case 'user': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Users Management</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">View and manage all platform users</p>
        </div>
        <Button icon={<UserPlus size={18} />}>
          Add New User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-blue-900">2,847</p>
          <p className="text-xs text-green-600 mt-2">+12.5% this month</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
          <p className="text-sm text-gray-600 mb-1">Active Users</p>
          <p className="text-3xl font-bold text-green-900">2,654</p>
          <p className="text-xs text-gray-600 mt-2">93.2% of total</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-orange-900">150</p>
          <p className="text-xs text-orange-600 mt-2">Awaiting approval</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-white border-2 border-red-100">
          <p className="text-sm text-gray-600 mb-1">Suspended</p>
          <p className="text-3xl font-bold text-red-900">43</p>
          <p className="text-xs text-gray-600 mt-2">1.5% of total</p>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {['all', 'active', 'suspended', 'pending'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <Button variant="ghost" icon={<Filter size={18} />} className="px-4">
            More Filters
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-900 to-blue-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Last Active</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-orange-500"
                      />
                      <div>
                        <p className="font-semibold text-blue-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail size={14} className="text-blue-600" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={14} className="text-orange-600" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar size={14} className="text-teal-600" />
                      <span>{new Date(user.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </td>

                  {/* Last Active */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{user.lastActive}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
                        <Edit size={16} className="text-blue-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-orange-100 transition-colors" title="Suspend">
                        <Ban size={16} className="text-orange-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-blue-900">1-5</span> of <span className="font-semibold text-blue-900">2,847</span> users
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" className="text-sm py-2">
                Previous
              </Button>
              <Button className="text-sm py-2">
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UsersPage;