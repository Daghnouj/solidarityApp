import React, { useState, useEffect } from 'react';
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
  UserPlus,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

// Utilisation exclusive de la variable d'environnement VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Interface correspondant au backend
interface BackendUser {
  _id: string;
  nom: string;
  email: string;
  telephone: string;
  role: "patient" | "professional";
  isActive: boolean;
  is_verified: boolean;
  photo: string | null;
  createdAt: string;
  lastLogin: string | null;
  deactivatedAt: string | null;
  specialite?: string;
}

// Interface pour le frontend
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
  specialite?: string;
}

const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0
  });

  // Fonction pour convertir l'utilisateur backend vers frontend
  const mapBackendToFrontend = (backendUser: BackendUser): User => {
    // Déterminer le rôle pour le frontend
    let role: 'user' | 'therapist' | 'admin' = 'user';
    if (backendUser.role === 'professional') {
      role = 'therapist';
    }
    
    // Déterminer le statut
    let status: 'active' | 'suspended' | 'pending' = 'active';
    if (!backendUser.isActive) {
      status = 'suspended';
    } else if (backendUser.role === 'professional' && !backendUser.is_verified) {
      status = 'pending';
    }
    
    // Générer une avatar par défaut si nécessaire
    const avatar = backendUser.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendUser.nom}`;
    
    // Formater la dernière activité
    let lastActive = 'Never';
    if (backendUser.lastLogin) {
      const lastLoginDate = new Date(backendUser.lastLogin);
      const now = new Date();
      const diffHours = Math.floor((now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        lastActive = 'Just now';
      } else if (diffHours < 24) {
        lastActive = `${diffHours} hours ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        lastActive = `${diffDays} days ago`;
      }
    }
    
    return {
      id: backendUser._id,
      name: backendUser.nom,
      email: backendUser.email,
      phone: backendUser.telephone || 'Not provided',
      role,
      status,
      joinedDate: new Date(backendUser.createdAt).toISOString().split('T')[0],
      avatar,
      lastActive,
      specialite: backendUser.specialite
    };
  };

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérification que l'URL de l'API est définie
      if (!API_BASE_URL) {
        throw new Error('API URL is not configured. Please check your .env file.');
      }
      
      // Récupérer le token d'authentification depuis localStorage
      const token = localStorage.getItem('token');
      
      // Appel API au backend avec l'URL dynamique
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Convertir les données backend vers le format frontend
      const mappedUsers = data.data.map(mapBackendToFrontend);
      setUsers(mappedUsers);
      
      // Calculer les statistiques
      calculateStats(mappedUsers);
      
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users. Please try again.');
      
      // Données de démonstration en cas d'erreur
      const demoUsers: User[] = [
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
          lastActive: '1 hour ago',
          specialite: 'Psychologie'
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
          lastActive: '30 min ago',
          specialite: 'Psychiatrie'
        }
      ];
      setUsers(demoUsers);
      calculateStats(demoUsers);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour calculer les statistiques
  const calculateStats = (usersList: User[]) => {
    const stats = {
      total: usersList.length,
      active: usersList.filter(u => u.status === 'active').length,
      pending: usersList.filter(u => u.status === 'pending').length,
      suspended: usersList.filter(u => u.status === 'suspended').length
    };
    setStats(stats);
  };

  // Fonction pour filtrer les utilisateurs
  const filterUsers = () => {
    let filtered = [...users];
    
    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query)
      );
    }
    
    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }
    
    setFilteredUsers(filtered);
  };

  // Fonction pour mettre à jour le statut d'un utilisateur
  const updateUserStatus = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      const token = localStorage.getItem('token');
      
      let endpoint = '';
      let method = 'POST';
      
      switch (action) {
        case 'activate':
          endpoint = `${API_BASE_URL}/users/${userId}/activate`;
          break;
        case 'deactivate':
          endpoint = `${API_BASE_URL}/users/${userId}/deactivate`;
          break;
        case 'delete':
          endpoint = `${API_BASE_URL}/users/${userId}`;
          method = 'DELETE';
          break;
      }
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        ...(action === 'deactivate' && {
          body: JSON.stringify({ password: '' })
        })
      });
      
      if (!response.ok) {
        throw new Error(`Action failed: ${response.status} ${response.statusText}`);
      }
      
      // Rafraîchir la liste des utilisateurs
      fetchUsers();
      
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user status');
    }
  };

  // Fonction pour éditer un utilisateur
  const handleEditUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User data:', userData);
        // Ouvrir un modal avec les données de l'utilisateur
        // Vous pouvez implémenter un modal ici
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  // Initial fetch et filtrage
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, filterStatus, users]);

  // Fonctions d'aide pour les styles
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

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Users Management</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">View and manage all platform users</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            icon={<RefreshCw size={18} />} 
            onClick={fetchUsers}
            className="text-sm"
          >
            Refresh
          </Button>
          <Button icon={<UserPlus size={18} />}>
            Add New User
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-600">{error}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setError(null)}
            className="ml-auto"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
          <p className="text-xs text-gray-600 mt-2">
            {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% active rate
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
          <p className="text-sm text-gray-600 mb-1">Active Users</p>
          <p className="text-3xl font-bold text-green-900">{stats.active}</p>
          <p className="text-xs text-gray-600 mt-2">
            {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-orange-900">{stats.pending}</p>
          <p className="text-xs text-orange-600 mt-2">Awaiting approval</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-white border-2 border-red-100">
          <p className="text-sm text-gray-600 mb-1">Suspended</p>
          <p className="text-3xl font-bold text-red-900">{stats.suspended}</p>
          <p className="text-xs text-gray-600 mt-2">
            {stats.total > 0 ? Math.round((stats.suspended / stats.total) * 100) : 0}% of total
          </p>
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
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600">Updating data...</span>
          </div>
        ) : (
          <>
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
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover"
                          />
                          <div>
                            <p className="font-semibold text-blue-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            {user.specialite && (
                              <p className="text-xs text-blue-600 mt-1">{user.specialite}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail size={14} className="text-blue-600" />
                            <span className="truncate max-w-[200px]">{user.email}</span>
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
                          <button 
                            className="p-2 rounded-lg hover:bg-blue-100 transition-colors" 
                            title="Edit"
                            onClick={() => handleEditUser(user.id)}
                          >
                            <Edit size={16} className="text-blue-600" />
                          </button>
                          
                          {user.status === 'active' ? (
                            <button 
                              className="p-2 rounded-lg hover:bg-orange-100 transition-colors" 
                              title="Suspend"
                              onClick={() => updateUserStatus(user.id, 'deactivate')}
                            >
                              <Ban size={16} className="text-orange-600" />
                            </button>
                          ) : (
                            <button 
                              className="p-2 rounded-lg hover:bg-green-100 transition-colors" 
                              title="Activate"
                              onClick={() => updateUserStatus(user.id, 'activate')}
                            >
                              <CheckCircle size={16} className="text-green-600" />
                            </button>
                          )}
                          
                          <button 
                            className="p-2 rounded-lg hover:bg-red-100 transition-colors" 
                            title="Delete"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                                updateUserStatus(user.id, 'delete');
                              }
                            }}
                          >
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
                  Showing{' '}
                  <span className="font-semibold text-blue-900">
                    {filteredUsers.length > 0 ? 1 : 0}-{filteredUsers.length}
                  </span>{' '}
                  of <span className="font-semibold text-blue-900">{stats.total}</span> users
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" className="text-sm py-2" disabled={filteredUsers.length <= 5}>
                    Previous
                  </Button>
                  <Button className="text-sm py-2" disabled={filteredUsers.length <= 5}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default UsersPage;