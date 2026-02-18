import React, { useState, useEffect } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import LoadingSpinner from '../components/LoadingSpinner';
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
  AlertCircle,
  X,
  Save,
  CheckSquare,
  Square
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
  dateNaissance?: string;
  adresse?: string;
}

// Interface pour les données d'édition
interface EditUserData {
  nom: string;
  email: string;
  telephone: string;
  dateNaissance?: string;
  adresse?: string;
}

// Interface pour les données de création d'utilisateur
interface AddUserData {
  nom: string;
  email: string;
  mdp: string;
  telephone: string;
  role: 'patient' | 'professional';
  dateNaissance?: string;
  adresse?: string;
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
  const [backendUsers, setBackendUsers] = useState<BackendUser[]>([]); // Store raw backend data
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUserData, setEditUserData] = useState<EditUserData | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addUserData, setAddUserData] = useState<AddUserData>({
    nom: '',
    email: '',
    mdp: '',
    telephone: '',
    role: 'patient',
    dateNaissance: '',
    adresse: '',
    specialite: ''
  });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'activate' | 'suspend' | 'delete' | null;
    userId: string | null;
    userName: string | null;
  }>({
    open: false,
    type: null,
    userId: null,
    userName: null
  });

  // Bulk delete state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

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

      // Récupérer le token admin depuis localStorage
      const adminToken = localStorage.getItem('adminToken');

      // Appel API au backend avec l'URL dynamique
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Store raw backend data for editing
      setBackendUsers(data.data || []);

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
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Fonction pour mettre à jour le statut d'un utilisateur
  const updateUserStatus = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      let endpoint = '';
      let method = 'PUT';

      switch (action) {
        case 'activate':
          endpoint = `${API_BASE_URL}/users/profile/${userId}/activate`;
          break;
        case 'deactivate':
          endpoint = `${API_BASE_URL}/users/profile/${userId}/deactivate`;
          break;
        case 'delete':
          endpoint = `${API_BASE_URL}/users/profile/${userId}`;
          method = 'DELETE';
          break;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        ...(action === 'deactivate' && {
          body: JSON.stringify({ password: '' })
        })
      });

      if (!response.ok) {
        throw new Error(`Action failed: ${response.status} ${response.statusText}`);
      }

      // Close confirmation dialog
      setConfirmDialog({ open: false, type: null, userId: null, userName: null });

      // Refresh users list
      fetchUsers();

    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user status');
    }
  };

  // Fonction pour éditer un utilisateur
  const handleEditUser = (userId: string) => {
    try {
      // Clear any previous errors
      setError(null);

      // Find user from already loaded backend data
      const userData = backendUsers.find(user => user._id === userId);

      if (!userData) {
        throw new Error('User not found in loaded data');
      }

      // Set edit form data from backend user data
      setEditUserData({
        nom: userData.nom || '',
        email: userData.email || '',
        telephone: userData.telephone || '',
        dateNaissance: userData.dateNaissance ? new Date(userData.dateNaissance).toISOString().split('T')[0] : '',
        adresse: userData.adresse || ''
      });
      setEditingUserId(userId);
      setEditModalOpen(true);
    } catch (err: any) {
      console.error('Error loading user data:', err);
      setError(err.message || 'Failed to load user data');
    }
  };

  // Fonction pour sauvegarder les modifications
  const handleSaveUser = async () => {
    if (!editingUserId || !editUserData) return;

    // Validation
    if (!editUserData.nom || editUserData.nom.trim() === '') {
      setError('Name is required');
      return;
    }

    if (!editUserData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUserData.email)) {
      setError('Invalid email');
      return;
    }

    if (!editUserData.telephone || editUserData.telephone.trim() === '') {
      setError('Phone is required');
      return;
    }

    try {
      setError(null);
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/users/profile/${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editUserData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      await response.json();

      // Close modal and refresh users
      setEditModalOpen(false);
      setEditUserData(null);
      setEditingUserId(null);

      // Show success message
      setError(null);
      // Refresh users list
      await fetchUsers();

      // Success notification
      alert('User updated successfully!');
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    }
  };

  // Fonction pour ouvrir le dialogue de confirmation
  const openConfirmDialog = (type: 'activate' | 'suspend' | 'delete', userId: string, userName: string) => {
    setConfirmDialog({
      open: true,
      type,
      userId,
      userName
    });
  };

  // Fonction pour créer un nouvel utilisateur
  const handleAddUser = async () => {
    // Validation
    if (!addUserData.nom || addUserData.nom.trim() === '') {
      setError('Name is required');
      return;
    }

    if (!addUserData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addUserData.email)) {
      setError('Invalid email');
      return;
    }

    if (!addUserData.mdp || addUserData.mdp.length < 8) {
      setError('Password must contain at least 8 characters');
      return;
    }

    if (!addUserData.telephone || addUserData.telephone.trim() === '') {
      setError('Phone is required');
      return;
    }

    if (addUserData.role === 'professional' && (!addUserData.specialite || addUserData.specialite.trim() === '')) {
      setError('Specialty is required for professionals');
      return;
    }

    try {
      setAddUserLoading(true);
      setError(null);

      const adminToken = localStorage.getItem('adminToken');

      // Préparer les données pour l'API
      const userPayload: any = {
        nom: addUserData.nom,
        email: addUserData.email,
        mdp: addUserData.mdp,
        telephone: addUserData.telephone,
        role: addUserData.role,
        dateNaissance: addUserData.dateNaissance || undefined,
        adresse: addUserData.adresse || undefined,
      };

      if (addUserData.role === 'professional' && addUserData.specialite) {
        userPayload.specialite = addUserData.specialite;
      }

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      await response.json();

      // Close modal and refresh users
      setAddModalOpen(false);
      setAddUserData({
        nom: '',
        email: '',
        mdp: '',
        telephone: '',
        role: 'patient',
        dateNaissance: '',
        adresse: '',
        specialite: ''
      });

      // Show success message
      setError(null);
      // Refresh users list
      await fetchUsers();

      // Success notification
      alert('User created successfully!');
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user');
    } finally {
      setAddUserLoading(false);
    }
  };

  // Fonction pour confirmer l'action
  const handleConfirmAction = () => {
    if (confirmDialog.userId && confirmDialog.type) {
      if (confirmDialog.type === 'suspend') {
        updateUserStatus(confirmDialog.userId, 'deactivate');
      } else {
        updateUserStatus(confirmDialog.userId, confirmDialog.type);
      }
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
    if (selectedIds.size === paginatedUsers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedUsers.map(u => u.id)));
    }
  };

  const handleBulkDeleteConfirm = async () => {
    setBulkDeleting(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const deletePromises = Array.from(selectedIds).map(id =>
        fetch(`${API_BASE_URL}/users/profile/${id}`, {
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
      await fetchUsers();
      alert(`${selectedIds.size} user(s) deleted successfully!`);
    } catch (err: any) {
      console.error('Error bulk deleting:', err);
      setError(err.message || 'Failed to delete some users');
    } finally {
      setBulkDeleting(false);
    }
  };

  // Initial fetch et filtrage
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, filterStatus, users]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Fonctions d'aide pour les styles
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'suspended': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'therapist': return 'bg-blue-100 text-blue-700';
      case 'user': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">Users Management</h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">View and manage all platform users</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="ghost"
            icon={selectedIds.size === paginatedUsers.length && paginatedUsers.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
            onClick={toggleSelectAll}
            className="text-xs sm:text-sm"
          >
            {selectedIds.size === paginatedUsers.length && paginatedUsers.length > 0 ? 'Deselect All' : 'Select All'}
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
            icon={<RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />}
            onClick={fetchUsers}
            className="text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
          <Button
            icon={<UserPlus size={16} className="sm:w-[18px] sm:h-[18px]" />}
            className="text-xs sm:text-sm"
            onClick={() => {
              setAddModalOpen(true);
              setError(null);
              setAddUserData({
                nom: '',
                email: '',
                mdp: '',
                telephone: '',
                role: 'patient',
                dateNaissance: '',
                adresse: '',
                specialite: ''
              });
            }}
          >
            <span className="hidden sm:inline">Add New User</span>
            <span className="sm:hidden">Add</span>
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
            onClick={() => setError(null)}
            className="ml-auto text-sm"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-900">{stats.total}</p>
          <p className="text-xs text-gray-600 mt-2">
            {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% active rate
          </p>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Active Users</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-900">{stats.active}</p>
          <p className="text-xs text-gray-600 mt-2">
            {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total
          </p>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl sm:text-3xl font-bold text-orange-900">{stats.pending}</p>
          <p className="text-xs text-orange-600 mt-2">Awaiting approval</p>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-red-50 to-white border-2 border-red-100">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Suspended</p>
          <p className="text-2xl sm:text-3xl font-bold text-red-900">{stats.suspended}</p>
          <p className="text-xs text-gray-600 mt-2">
            {stats.total > 0 ? Math.round((stats.suspended / stats.total) * 100) : 0}% of total
          </p>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'active', 'suspended', 'pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all ${filterStatus === status
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <Button variant="ghost" icon={<Filter size={18} />} className="px-3 sm:px-4 text-sm">
              <span className="hidden sm:inline">More Filters</span>
              <span className="sm:hidden">Filters</span>
            </Button>
          </div>
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
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gradient-to-r from-blue-900 to-blue-800">
                  <tr>
                    <th className="px-3 py-3 sm:py-4 text-center w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === paginatedUsers.length && paginatedUsers.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white">User</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white hidden md:table-cell">Contact</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white">Role</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white">Status</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white hidden lg:table-cell">Joined</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white hidden lg:table-cell">Last Active</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className={`hover:bg-blue-50/50 transition-colors ${selectedIds.has(user.id) ? 'bg-blue-50 ring-1 ring-inset ring-blue-200' : ''}`}>
                      {/* Checkbox */}
                      <td className="px-3 py-3 sm:py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(user.id)}
                          onChange={() => toggleSelect(user.id)}
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                      </td>
                      {/* User Info */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-orange-500 object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-blue-900 text-sm sm:text-base truncate">{user.name}</p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
                            {user.specialite && (
                              <p className="text-xs text-blue-600 mt-1 truncate">{user.specialite}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact - Hidden on mobile */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                            <Mail size={12} className="text-blue-600 flex-shrink-0" />
                            <span className="truncate max-w-[150px] lg:max-w-[200px]">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                            <Phone size={12} className="text-orange-600 flex-shrink-0" />
                            <span className="truncate">{user.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>

                      {/* Joined Date - Hidden on mobile/tablet */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                          <Calendar size={12} className="text-teal-600 flex-shrink-0" />
                          <span>{new Date(user.joinedDate).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Last Active - Hidden on mobile/tablet */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <span className="text-xs sm:text-sm text-gray-600">{user.lastActive}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Edit"
                            onClick={() => handleEditUser(user.id)}
                          >
                            <Edit size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                          </button>

                          {user.status === 'active' ? (
                            <button
                              className="p-1.5 sm:p-2 rounded-lg hover:bg-orange-100 transition-colors"
                              title="Suspend"
                              onClick={() => openConfirmDialog('suspend', user.id, user.name)}
                            >
                              <Ban size={14} className="sm:w-4 sm:h-4 text-orange-600" />
                            </button>
                          ) : (
                            <button
                              className="p-1.5 sm:p-2 rounded-lg hover:bg-green-100 transition-colors"
                              title="Activate"
                              onClick={() => openConfirmDialog('activate', user.id, user.name)}
                            >
                              <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-600" />
                            </button>
                          )}

                          <button
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete"
                            onClick={() => openConfirmDialog('delete', user.id, user.name)}
                          >
                            <Trash2 size={14} className="sm:w-4 sm:h-4 text-red-600" />
                          </button>

                          <button className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors hidden sm:block">
                            <MoreVertical size={14} className="sm:w-4 sm:h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Showing{' '}
                  <span className="font-semibold text-blue-900">
                    {filteredUsers.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredUsers.length)}
                  </span>{' '}
                  of <span className="font-semibold text-blue-900">{filteredUsers.length}</span> users
                  {filteredUsers.length !== stats.total && (
                    <span className="text-gray-500 hidden sm:inline"> (filtered from {stats.total} total)</span>
                  )}
                </p>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    className="text-xs sm:text-sm py-2 flex-1 sm:flex-initial"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    className="text-xs sm:text-sm py-2 flex-1 sm:flex-initial"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Edit User Modal */}
      {editModalOpen && editUserData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900">Edit User</h2>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditUserData(null);
                  setEditingUserId(null);
                  setError(null); // Clear error when closing modal
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {/* Error message in modal */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editUserData.nom}
                  onChange={(e) => setEditUserData({ ...editUserData, nom: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={editUserData.telephone}
                  onChange={(e) => setEditUserData({ ...editUserData, telephone: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="+216 XX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={editUserData.dateNaissance || ''}
                  onChange={(e) => setEditUserData({ ...editUserData, dateNaissance: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={editUserData.adresse || ''}
                  onChange={(e) => setEditUserData({ ...editUserData, adresse: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none transition-colors"
                  placeholder="Enter full address"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditUserData(null);
                  setEditingUserId(null);
                  setError(null); // Clear error when canceling
                }}
                className="w-full sm:w-auto text-sm"
              >
                Cancel
              </Button>
              <Button
                icon={<Save size={18} />}
                onClick={handleSaveUser}
                className="w-full sm:w-auto text-sm"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">

              <h2 className="text-xl sm:text-2xl font-bold text-blue-900">Add New User</h2>

              <h2 className="text-xl sm:text-2xl font-bold text-blue-900">Ajouter un nouvel utilisateur</h2>

              <h2 className="text-xl sm:text-2xl font-bold text-blue-900">Add New User</h2>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900">Ajouter un nouvel utilisateur</h2>
              <button
                onClick={() => {
                  setAddModalOpen(false);
                  setError(null);
                  setAddUserData({
                    nom: '',
                    email: '',
                    mdp: '',
                    telephone: '',
                    role: 'patient',
                    dateNaissance: '',
                    adresse: '',
                    specialite: ''
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {/* Error message in modal */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addUserData.nom}
                  onChange={(e) => setAddUserData({ ...addUserData, nom: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={addUserData.email}
                  onChange={(e) => setAddUserData({ ...addUserData, email: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={addUserData.mdp}
                  onChange={(e) => setAddUserData({ ...addUserData, mdp: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Minimum 8 characters"
                />
                <p className="text-xs text-gray-500 mt-1">Password must contain at least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={addUserData.telephone}
                  onChange={(e) => setAddUserData({ ...addUserData, telephone: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="+216 XX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={addUserData.role}
                  onChange={(e) => setAddUserData({ ...addUserData, role: e.target.value as 'patient' | 'professional', specialite: e.target.value === 'patient' ? '' : addUserData.specialite })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="patient">Patient</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              {addUserData.role === 'professional' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specialty <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addUserData.specialite || ''}
                    onChange={(e) => setAddUserData({ ...addUserData, specialite: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Ex: Psychology, Psychiatry..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={addUserData.dateNaissance || ''}
                  onChange={(e) => setAddUserData({ ...addUserData, dateNaissance: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={addUserData.adresse || ''}
                  onChange={(e) => setAddUserData({ ...addUserData, adresse: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none transition-colors"
                  placeholder="Enter full address"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setAddModalOpen(false);
                  setError(null);
                  setAddUserData({
                    nom: '',
                    email: '',
                    mdp: '',
                    telephone: '',
                    role: 'patient',
                    dateNaissance: '',
                    adresse: '',
                    specialite: ''
                  });
                }}
                className="w-full sm:w-auto text-sm"
                disabled={addUserLoading}
              >
                Cancel
              </Button>
              <Button
                icon={<UserPlus size={18} />}
                onClick={handleAddUser}
                disabled={addUserLoading}
                className="w-full sm:w-auto text-sm"
              >
                {addUserLoading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-md w-full mx-2 sm:mx-0">
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                {confirmDialog.type === 'delete' && (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Trash2 size={20} className="sm:w-6 sm:h-6 text-red-600" />
                  </div>
                )}
                {(confirmDialog.type === 'activate' || confirmDialog.type === 'suspend') && (
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${confirmDialog.type === 'activate' ? 'bg-green-100' : 'bg-orange-100'} flex items-center justify-center flex-shrink-0`}>
                    {confirmDialog.type === 'activate' ? (
                      <CheckCircle size={20} className="sm:w-6 sm:h-6 text-green-600" />
                    ) : (
                      <Ban size={20} className="sm:w-6 sm:h-6 text-orange-600" />
                    )}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {confirmDialog.type === 'delete' && 'Delete User'}
                    {confirmDialog.type === 'activate' && 'Activate User'}
                    {confirmDialog.type === 'suspend' && 'Suspend User'}
                  </h3>
                </div>
              </div>

              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                {confirmDialog.type === 'delete' && (
                  <>Are you sure you want to delete <span className="font-semibold text-gray-900">{confirmDialog.userName}</span>? This action cannot be undone.</>
                )}
                {confirmDialog.type === 'activate' && (
                  <>Are you sure you want to activate <span className="font-semibold text-gray-900">{confirmDialog.userName}</span>?</>
                )}
                {confirmDialog.type === 'suspend' && (
                  <>Are you sure you want to suspend <span className="font-semibold text-gray-900">{confirmDialog.userName}</span>?</>
                )}
              </p>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setConfirmDialog({ open: false, type: null, userId: null, userName: null })}
                  className="w-full sm:w-auto text-sm"
                >
                  Cancel
                </Button>
                <Button
                  className={`${confirmDialog.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''} w-full sm:w-auto text-sm`}
                  onClick={handleConfirmAction}
                >
                  {confirmDialog.type === 'delete' && 'Delete'}
                  {confirmDialog.type === 'activate' && 'Activate'}
                  {confirmDialog.type === 'suspend' && 'Suspend'}
                </Button>
              </div>
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
                <h3 className="text-lg font-bold text-gray-900">Delete {selectedIds.size} User(s)?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete <span className="font-bold text-red-600">{selectedIds.size}</span> selected user(s)?
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

export default UsersPage;