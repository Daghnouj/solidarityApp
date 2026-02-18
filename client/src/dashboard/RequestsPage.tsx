import React, { useState, useEffect } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Calendar,
  FileText,
  Download,
  RefreshCw,
  AlertCircle,
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FileDown,
  CheckSquare,
  Square
} from 'lucide-react';

// Utilisation exclusive de la variable d'environnement VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Interface correspondant au backend
interface BackendRequest {
  _id: string;
  professional: {
    _id: string;
    nom: string;
    email: string;
    telephone?: string;
    photo?: string;
    role: string;
    is_verified: boolean;
    verification_status?: 'pending' | 'approved' | 'rejected';
    rejection_reason?: string;
    dateNaissance?: string;
    adresse?: string;
    // New fields mapped from backend
    bio?: string;
    gender?: string;
    licenseNumber?: string;
    languages?: string[];
    education?: { degree: string; field: string; school: string; year: string }[];
    services?: { name: string; price: string; duration: string }[];
    clinicName?: string;
    clinicAddress?: string;
  };
  specialite: string;
  situation_professionnelle?: string;
  intitule_diplome?: string;
  nom_etablissement?: string;
  date_obtention_diplome?: string;
  biographie?: string;
  document?: string;
  services?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Interface pour le frontend
interface Request {
  id: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    id: string;
    dateNaissance?: string;
    adresse?: string;
    // New fields
    bio?: string;
    gender?: string;
    licenseNumber?: string;
    languages?: string[];
    education?: { degree: string; field: string; school: string; year: string }[];
    services?: { name: string; price: string; duration: string }[];
    clinicName?: string;
    clinicAddress?: string;
  };
  type: 'therapist' | 'center' | 'user';
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  description: string;
  specialite: string;
  professionalId: string;
  situation_professionnelle?: string;
  intitule_diplome?: string;
  nom_etablissement?: string;
  date_obtention_diplome?: string;
  services?: string[];
}

const RequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Bulk reject state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkRejectConfirmOpen, setBulkRejectConfirmOpen] = useState(false);
  const [bulkRejecting, setBulkRejecting] = useState(false);

  // Fonction pour convertir les données backend vers frontend
  const mapBackendToFrontend = (backendRequest: BackendRequest): Request => {
    const professional = backendRequest.professional;
    const avatar = professional.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.nom}`;

    // Déterminer le statut - priorité à verification_status, puis status, puis is_verified
    let status: 'pending' | 'approved' | 'rejected' = 'pending';
    if (backendRequest.status) {
      status = backendRequest.status;
    } else if (professional.verification_status) {
      status = professional.verification_status;
    } else if (professional.is_verified) {
      status = 'approved';
    } else {
      status = 'pending';
    }

    // Documents
    const documents: string[] = [];
    if (backendRequest.document) {
      documents.push(backendRequest.document);
    }

    // Description
    const description = backendRequest.biographie ||
      `Professionnel en ${backendRequest.specialite}${backendRequest.situation_professionnelle ? `. ${backendRequest.situation_professionnelle}` : ''}`;

    return {
      id: backendRequest._id,
      applicant: {
        name: professional.nom,
        email: professional.email,
        phone: professional.telephone || 'Not provided',
        avatar,
        id: professional._id,
        dateNaissance: professional.dateNaissance,
        adresse: professional.adresse,
        bio: professional.bio,
        gender: professional.gender,
        licenseNumber: professional.licenseNumber,
        languages: professional.languages,
        education: professional.education,
        services: professional.services,
        clinicName: professional.clinicName,
        clinicAddress: professional.clinicAddress
      },
      type: 'therapist',
      submittedDate: new Date(backendRequest.createdAt).toISOString().split('T')[0],
      status,
      documents,
      description,
      specialite: backendRequest.specialite,
      professionalId: professional._id,
      situation_professionnelle: backendRequest.situation_professionnelle,
      intitule_diplome: backendRequest.intitule_diplome,
      nom_etablissement: backendRequest.nom_etablissement,
      date_obtention_diplome: backendRequest.date_obtention_diplome,
      services: backendRequest.services
    };
  };

  // Fonction pour récupérer les requêtes
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!API_BASE_URL) {
        throw new Error('API URL is not configured. Please check your .env file.');
      }

      const adminToken = localStorage.getItem('adminToken');

      const response = await fetch(`${API_BASE_URL}/admin/verification/all-requests`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch requests: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Convertir les données backend vers le format frontend
      const mappedRequests = data.requests.map(mapBackendToFrontend);
      setRequests(mappedRequests);

    } catch (err: any) {
      console.error('Error fetching requests:', err);
      setError(err.message || 'Failed to load requests. Please try again.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les détails d'une requête
  const fetchRequestDetails = async (requestId: string) => {
    try {
      setError(null);
      const adminToken = localStorage.getItem('adminToken');

      const response = await fetch(`${API_BASE_URL}/admin/verification/request/${requestId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch request details');
      }

      const data = await response.json();
      const mappedRequest = mapBackendToFrontend(data.request);
      setSelectedRequest(mappedRequest);
      setDetailsModalOpen(true);
    } catch (err: any) {
      console.error('Error fetching request details:', err);
      setError(err.message || 'Failed to load request details');
    }
  };

  // Fonction pour approuver une requête
  const handleApprove = async (professionalId: string, requestId: string) => {
    if (!confirm('Are you sure you want to approve this request?')) {
      return;
    }

    try {
      setProcessingId(requestId);
      setError(null);

      const adminToken = localStorage.getItem('adminToken');

      const response = await fetch(`${API_BASE_URL}/admin/verification/verify/${professionalId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve request');
      }

      // Rafraîchir la liste
      await fetchRequests();
      alert('Request approved successfully!');
    } catch (err: any) {
      console.error('Error approving request:', err);
      setError(err.message || 'Failed to approve request');
    } finally {
      setProcessingId(null);
    }
  };

  // Fonction pour rejeter une requête
  const handleReject = async (professionalId: string, requestId: string) => {
    const reason = prompt('Please enter the rejection reason:');
    if (!reason || reason.trim() === '') {
      return;
    }

    try {
      setProcessingId(requestId);
      setError(null);

      const adminToken = localStorage.getItem('adminToken');

      const response = await fetch(`${API_BASE_URL}/admin/verification/reject/${professionalId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: reason.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject request');
      }

      // Rafraîchir la liste
      await fetchRequests();
      alert('Request rejected successfully!');
    } catch (err: any) {
      console.error('Error rejecting request:', err);
      setError(err.message || 'Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  // Bulk reject handlers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRequests.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRequests.map(r => r.id)));
    }
  };

  const handleBulkRejectConfirm = async () => {
    const reason = prompt('Please enter the rejection reason for all selected requests:');
    if (!reason || reason.trim() === '') return;

    setBulkRejecting(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      // Build list of professional IDs from selected request IDs
      const selectedRequests = requests.filter(r => selectedIds.has(r.id));
      const rejectPromises = selectedRequests.map(r =>
        fetch(`${API_BASE_URL}/admin/verification/reject/${r.professionalId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason: reason.trim() })
        })
      );
      await Promise.all(rejectPromises);
      await fetchRequests();
      setSelectedIds(new Set());
      setBulkRejectConfirmOpen(false);
      alert(`${selectedIds.size} request(s) rejected successfully!`);
    } catch (err: any) {
      console.error('Error bulk rejecting:', err);
      setError(err.message || 'Failed to reject some requests');
    } finally {
      setBulkRejecting(false);
    }
  };

  // Fonction pour exporter les requêtes
  const handleExport = async (format: 'pdf' | 'zip') => {
    try {
      setExportLoading(true);
      setError(null);

      const adminToken = localStorage.getItem('adminToken');
      const statusFilter = activeTab !== 'pending' && activeTab !== 'approved' && activeTab !== 'rejected'
        ? ''
        : `&status=${activeTab}`;

      const response = await fetch(`${API_BASE_URL}/admin/verification/export?format=${format}${statusFilter}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export requests');
      }

      // Récupérer les données
      const data = await response.json();

      // Créer le contenu selon le format
      let blob: Blob;
      let filename: string;

      if (format === 'pdf') {
        // Pour PDF, créer un JSON formaté (peut être amélioré avec une bibliothèque PDF côté client)
        const content = JSON.stringify(data, null, 2);
        blob = new Blob([content], { type: 'application/json' });
        filename = `requests-${activeTab}-${new Date().toISOString().split('T')[0]}.json`;
      } else {
        // Pour ZIP, créer un JSON formaté (peut être amélioré avec jszip côté client)
        const content = JSON.stringify(data, null, 2);
        blob = new Blob([content], { type: 'application/json' });
        filename = `requests-${activeTab}-${new Date().toISOString().split('T')[0]}.json`;
      }

      // Télécharger le fichier
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert(`Requests exported successfully! (${data.totalRequests || data.requests?.length || 0} requests)`);
    } catch (err: any) {
      console.error('Error exporting requests:', err);
      setError(err.message || 'Failed to export requests');
    } finally {
      setExportLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, []);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.relative')) {
          setExportMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [exportMenuOpen]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'therapist': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'center': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'user': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Filtrer les requêtes par statut
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  // Filtrer par recherche
  const filterRequests = (requestList: Request[]) => {
    if (!searchQuery) return requestList;
    const query = searchQuery.toLowerCase();
    return requestList.filter(request =>
      request.applicant.name.toLowerCase().includes(query) ||
      request.applicant.email.toLowerCase().includes(query) ||
      request.specialite.toLowerCase().includes(query) ||
      request.description.toLowerCase().includes(query) ||
      (request.applicant.phone && request.applicant.phone.toLowerCase().includes(query))
    );
  };

  const getFilteredRequests = () => {
    let filtered: Request[] = [];
    switch (activeTab) {
      case 'pending':
        filtered = pendingRequests;
        break;
      case 'approved':
        filtered = approvedRequests;
        break;
      case 'rejected':
        filtered = rejectedRequests;
        break;
    }
    return filterRequests(filtered);
  };

  const filteredRequests = getFilteredRequests();

  if (loading && requests.length === 0) {
    return <LoadingSpinner message="Loading activation requests..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Activation Requests</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">Review and approve account activation requests</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="ghost"
            icon={selectedIds.size === filteredRequests.length && filteredRequests.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
            onClick={toggleSelectAll}
          >
            {selectedIds.size === filteredRequests.length && filteredRequests.length > 0 ? 'Deselect All' : 'Select All'}
          </Button>
          {selectedIds.size > 0 && activeTab === 'pending' && (
            <Button
              icon={<XCircle size={18} />}
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              onClick={() => setBulkRejectConfirmOpen(true)}
            >
              Reject Selected ({selectedIds.size})
            </Button>
          )}
          {selectedIds.size > 0 && activeTab !== 'pending' && (
            <span className="text-sm text-gray-500 self-center">{selectedIds.size} selected</span>
          )}
          <Button
            variant="ghost"
            icon={<RefreshCw size={18} />}
            onClick={fetchRequests}
            disabled={loading}
          >
            Refresh
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              icon={<Download size={18} />}
              disabled={exportLoading}
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
            >
              {exportLoading ? 'Exporting...' : 'Export Requests'}
            </Button>
            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => {
                    handleExport('pdf');
                    setExportMenuOpen(false);
                  }}
                  disabled={exportLoading}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileDown size={16} />
                  Export as PDF/JSON
                </button>
                <button
                  onClick={() => {
                    handleExport('zip');
                    setExportMenuOpen(false);
                  }}
                  disabled={exportLoading}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileDown size={16} />
                  Export as ZIP/JSON
                </button>
              </div>
            )}
          </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-orange-900">{pendingRequests.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-900">{approvedRequests.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-white border-2 border-red-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500 rounded-xl shadow-lg">
              <XCircle className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-900">{rejectedRequests.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            {['pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 px-6 py-2.5 rounded-lg font-semibold transition-all ${activeTab === tab
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-gray-600 hover:text-blue-900'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                {tab === 'pending' ? pendingRequests.length :
                  tab === 'approved' ? approvedRequests.length :
                    rejectedRequests.length}
                )
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <Button variant="ghost" icon={<Filter size={18} />} className="px-4">
            Filter
          </Button>
        </div>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className={`p-6 ${selectedIds.has(request.id) ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Checkbox + Applicant Info */}
              <div className="flex items-start gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={selectedIds.has(request.id)}
                  onChange={() => toggleSelect(request.id)}
                  className="w-5 h-5 rounded cursor-pointer mt-5"
                />
                <img
                  src={request.applicant.avatar}
                  alt={request.applicant.name}
                  className="w-16 h-16 rounded-xl border-2 border-orange-500 shadow-md object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">{request.applicant.name}</h3>
                      <p className="text-sm text-gray-600">{request.applicant.email}</p>
                      <p className="text-sm text-gray-600">{request.applicant.phone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(request.type)}`}>
                      {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                    </span>
                  </div>

                  {/* Specialité */}
                  <div className="mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {request.specialite}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{request.description}</p>

                  {/* Documents */}
                  {request.documents.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Attached Documents:</p>
                      <div className="flex flex-wrap gap-2">
                        {request.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                            <FileText size={14} className="text-blue-600" />
                            <span className="text-sm text-blue-900">{doc.split('/').pop() || doc}</span>
                            <a
                              href={doc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Download size={14} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} className="text-teal-600" />
                    <span>Submitted on {new Date(request.submittedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2 lg:min-w-[200px]">
                <Button
                  variant="ghost"
                  icon={<Eye size={18} />}
                  className="flex-1 lg:flex-none"
                  onClick={() => fetchRequestDetails(request.id)}
                >
                  View Details
                </Button>

                {request.status === 'pending' && (
                  <>
                    <Button
                      variant="secondary"
                      icon={<CheckCircle size={18} />}
                      className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(request.professionalId, request.id)}
                      disabled={processingId === request.id}
                    >
                      {processingId === request.id ? 'Processing...' : 'Approve'}
                    </Button>
                    <Button
                      variant="ghost"
                      icon={<XCircle size={18} />}
                      className="flex-1 lg:flex-none border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(request.professionalId, request.id)}
                      disabled={processingId === request.id}
                    >
                      {processingId === request.id ? 'Processing...' : 'Reject'}
                    </Button>
                  </>
                )}

                {request.status === 'approved' && (
                  <div className="px-4 py-3 bg-green-100 border-2 border-green-200 rounded-xl text-center">
                    <CheckCircle className="mx-auto mb-1 text-green-600" size={20} />
                    <p className="text-sm font-semibold text-green-700">Approved</p>
                  </div>
                )}

                {request.status === 'rejected' && (
                  <div className="px-4 py-3 bg-red-100 border-2 border-red-200 rounded-xl text-center">
                    <XCircle className="mx-auto mb-1 text-red-600" size={20} />
                    <p className="text-sm font-semibold text-red-700">Rejected</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {searchQuery ? 'No requests found' : `No ${activeTab} requests`}
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? 'Try adjusting your search query.'
              : `There are no ${activeTab} requests at the moment.`}
          </p>
        </Card>
      )}

      {/* Details Modal */}
      {detailsModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-900">Request Details</h2>
              <button
                onClick={() => {
                  setDetailsModalOpen(false);
                  setSelectedRequest(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Professional Info */}
              <div className="flex items-start gap-4">
                <img
                  src={selectedRequest.applicant.avatar}
                  alt={selectedRequest.applicant.name}
                  className="w-20 h-20 rounded-xl border-2 border-orange-500 shadow-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{selectedRequest.applicant.name}</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      <span>{selectedRequest.applicant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} />
                      <span>{selectedRequest.applicant.phone}</span>
                    </div>
                    {selectedRequest.applicant.adresse && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={16} />
                        <span>{selectedRequest.applicant.adresse}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getTypeColor(selectedRequest.type)}`}>
                  {selectedRequest.type.charAt(0).toUpperCase() + selectedRequest.type.slice(1)}
                </span>
              </div>

              {/* Speciality */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Speciality</h4>
                <p className="text-gray-900">{selectedRequest.specialite}</p>
              </div>

              {/* Biography */}
              {selectedRequest.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Biography</h4>
                  <p className="text-gray-900">{selectedRequest.description}</p>
                </div>
              )}

              {/* Professional Situation */}
              {selectedRequest.situation_professionnelle && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Professional Situation</h4>
                  <p className="text-gray-900">{selectedRequest.situation_professionnelle}</p>
                </div>
              )}

              {/* Education */}
              {(selectedRequest.intitule_diplome || selectedRequest.nom_etablissement || selectedRequest.date_obtention_diplome || (selectedRequest.applicant.education && selectedRequest.applicant.education.length > 0)) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <GraduationCap size={16} />
                    Education
                  </h4>
                  <div className="space-y-3">
                    {/* Request Education Data */}
                    {(selectedRequest.intitule_diplome || selectedRequest.nom_etablissement) && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-sm text-gray-800">Initial Request Data:</p>
                        {selectedRequest.intitule_diplome && <p className="text-gray-900 text-sm"><strong>Degree:</strong> {selectedRequest.intitule_diplome}</p>}
                        {selectedRequest.nom_etablissement && <p className="text-gray-900 text-sm"><strong>Institution:</strong> {selectedRequest.nom_etablissement}</p>}
                        {selectedRequest.date_obtention_diplome && <p className="text-gray-900 text-sm"><strong>Date:</strong> {new Date(selectedRequest.date_obtention_diplome).toLocaleDateString()}</p>}
                      </div>
                    )}

                    {/* User Profile Education Data */}
                    {selectedRequest.applicant.education?.map((edu, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-gray-900 font-bold">{edu.degree} in {edu.field}</p>
                        <p className="text-sm text-gray-600">{edu.school} • {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinic & Services (New Section) */}
              {(selectedRequest.applicant.clinicName || (selectedRequest.applicant.services && selectedRequest.applicant.services.length > 0)) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Clinic & Services</h4>
                  <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                    {selectedRequest.applicant.clinicName && (
                      <div>
                        <p className="font-bold text-gray-900">{selectedRequest.applicant.clinicName}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1"><MapPin size={12} /> {selectedRequest.applicant.clinicAddress || 'Address not provided'}</p>
                      </div>
                    )}

                    {selectedRequest.applicant.services && selectedRequest.applicant.services.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Services:</p>
                        {selectedRequest.applicant.services.map((svc, idx) => (
                          <div key={idx} className="flex justify-between text-sm border-b border-gray-200 last:border-0 pb-1 last:pb-0">
                            <span>{svc.name} <span className="text-gray-400 text-xs">({svc.duration})</span></span>
                            <span className="font-semibold">{svc.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Languages (New Section) */}
              {selectedRequest.applicant.languages && selectedRequest.applicant.languages.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.applicant.languages.map((lang, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedRequest.applicant.gender && (
                  <div>
                    <span className="text-gray-500 block">Gender</span>
                    <span className="font-medium">{selectedRequest.applicant.gender}</span>
                  </div>
                )}
                {selectedRequest.applicant.licenseNumber && (
                  <div>
                    <span className="text-gray-500 block">License Number</span>
                    <span className="font-medium text-orange-600">{selectedRequest.applicant.licenseNumber}</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Bulk Reject Confirmation Modal */}
      {bulkRejectConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Reject {selectedIds.size} Request(s)?</h3>
                <p className="text-sm text-gray-500">You will be prompted for a rejection reason.</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reject <span className="font-bold text-red-600">{selectedIds.size}</span> selected request(s)? The same rejection reason will be applied to all.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setBulkRejectConfirmOpen(false)} disabled={bulkRejecting}>Cancel</Button>
              <Button icon={<XCircle size={18} />} className="bg-red-600 hover:bg-red-700 text-white border-red-600" onClick={handleBulkRejectConfirm} disabled={bulkRejecting}>
                {bulkRejecting ? 'Rejecting...' : `Reject All (${selectedIds.size})`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
