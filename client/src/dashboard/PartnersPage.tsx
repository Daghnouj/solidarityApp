import React, { useState, useEffect } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import {
    Search,
    Plus,
    Trash2,
    Edit3,
    ExternalLink,
    RefreshCw,
    X,
    AlertCircle,
    Save,
    Handshake,
    Mail,
    Phone,
    MapPin,
    Globe,
    Briefcase,
    Eye,
    Image as ImageIcon,
    CheckSquare,
    Square
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Partner {
    _id: string;
    nom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    description?: string;
    logo?: {
        url: string;
        public_id: string;
    };
    service?: string;
    link: string;
    createdAt: string;
    updatedAt?: string;
}

const PartnersPage: React.FC = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [viewPartner, setViewPartner] = useState<Partner | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Bulk delete state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        telephone: '',
        adresse: '',
        description: '',
        service: '',
        link: ''
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Fetch partners
    const fetchPartners = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/partners`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch partners');
            }

            const data = await response.json();
            if (data.success && data.data) {
                setPartners(data.data);
            } else {
                setPartners([]);
            }
        } catch (err: any) {
            console.error('Error fetching partners:', err);
            setError(err.message || 'Failed to load partners');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    // Open form modal for creating
    const handleAddNew = () => {
        setEditingPartner(null);
        setFormData({ nom: '', email: '', telephone: '', adresse: '', description: '', service: '', link: '' });
        setLogoFile(null);
        setLogoPreview(null);
        setFormError(null);
        setShowFormModal(true);
    };

    // Open form modal for editing
    const handleEdit = (partner: Partner) => {
        setEditingPartner(partner);
        setFormData({
            nom: partner.nom,
            email: partner.email,
            telephone: partner.telephone || '',
            adresse: partner.adresse || '',
            description: partner.description || '',
            service: partner.service || '',
            link: partner.link
        });
        setLogoFile(null);
        setLogoPreview(partner.logo?.url || null);
        setFormError(null);
        setShowFormModal(true);
    };

    // Handle logo file change
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Handle create/update
    const handleSubmit = async () => {
        try {
            setFormError(null);
            setFormLoading(true);

            if (!formData.nom.trim()) { setFormError('Name is required'); setFormLoading(false); return; }
            if (!formData.email.trim()) { setFormError('Email is required'); setFormLoading(false); return; }
            if (!formData.link.trim()) { setFormError('Website link is required'); setFormLoading(false); return; }

            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) { setFormError('Admin authentication required'); setFormLoading(false); return; }

            const body = new FormData();
            body.append('nom', formData.nom);
            body.append('email', formData.email);
            body.append('link', formData.link);
            if (formData.telephone) body.append('telephone', formData.telephone);
            if (formData.adresse) body.append('adresse', formData.adresse);
            if (formData.description) body.append('description', formData.description);
            if (formData.service) body.append('service', formData.service);
            if (logoFile) body.append('logo', logoFile);

            const isEditing = !!editingPartner;
            const url = isEditing
                ? `${API_BASE_URL}/partners/${editingPartner!._id}`
                : `${API_BASE_URL}/partners/add`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${adminToken}` },
                body
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} partner`);
            }

            await fetchPartners();
            setShowFormModal(false);
        } catch (err: any) {
            console.error('Error submitting partner:', err);
            setFormError(err.message || 'An error occurred');
        } finally {
            setFormLoading(false);
        }
    };

    // Handle delete
    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingId) return;
        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) throw new Error('Admin authentication required');

            const response = await fetch(`${API_BASE_URL}/partners/${deletingId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete partner');
            }

            await fetchPartners();
            setDeleteConfirmOpen(false);
            setDeletingId(null);
        } catch (err: any) {
            console.error('Error deleting partner:', err);
            setError(err.message || 'Failed to delete partner');
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
        if (selectedIds.size === filteredPartners.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredPartners.map(p => p._id)));
        }
    };

    const handleBulkDeleteConfirm = async () => {
        setBulkDeleting(true);
        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) throw new Error('Admin authentication required');

            const deletePromises = Array.from(selectedIds).map(id =>
                fetch(`${API_BASE_URL}/partners/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' }
                })
            );
            await Promise.all(deletePromises);
            await fetchPartners();
            setSelectedIds(new Set());
            setBulkDeleteConfirmOpen(false);
        } catch (err: any) {
            console.error('Error bulk deleting:', err);
            setError(err.message || 'Failed to delete some partners');
        } finally {
            setBulkDeleting(false);
        }
    };

    // Filter
    const filteredPartners = partners.filter(p => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return p.nom.toLowerCase().includes(q) ||
            p.email.toLowerCase().includes(q) ||
            (p.service || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q);
    });

    if (loading && partners.length === 0) {
        return <LoadingSpinner message="Loading partners..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Partners</h1>
                    <p className="text-gray-600 text-sm md:text-base mt-1">Manage your organization's partners and sponsors</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant="ghost"
                        icon={selectedIds.size === filteredPartners.length && filteredPartners.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                        onClick={toggleSelectAll}
                    >
                        {selectedIds.size === filteredPartners.length && filteredPartners.length > 0 ? 'Deselect All' : 'Select All'}
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
                    <Button variant="ghost" icon={<RefreshCw size={18} />} onClick={fetchPartners}>Refresh</Button>
                    <Button icon={<Plus size={18} />} onClick={handleAddNew}>Add Partner</Button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                    <AlertCircle className="text-red-600" size={20} />
                    <p className="text-red-600">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X size={16} /></button>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">Total Partners</p>
                    <p className="text-3xl font-bold text-blue-900">{partners.length}</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
                    <p className="text-sm text-gray-600 mb-1">With Logo</p>
                    <p className="text-3xl font-bold text-green-900">{partners.filter(p => p.logo?.url).length}</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100">
                    <p className="text-sm text-gray-600 mb-1">With Phone</p>
                    <p className="text-3xl font-bold text-purple-900">{partners.filter(p => p.telephone).length}</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100">
                    <p className="text-sm text-gray-600 mb-1">This Month</p>
                    <p className="text-3xl font-bold text-orange-900">
                        {partners.filter(p => {
                            const d = new Date(p.createdAt);
                            const now = new Date();
                            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                        }).length}
                    </p>
                </Card>
            </div>

            {/* Search */}
            <Card className="p-4 md:p-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search partners by name, email, or service..."
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                    />
                </div>
            </Card>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.map((partner) => (
                    <Card key={partner._id} hover className={`overflow-hidden group relative ${selectedIds.has(partner._id) ? 'ring-2 ring-blue-500' : ''}`}>
                        {/* Checkbox */}
                        <div className="absolute top-3 left-3 z-10">
                            <input
                                type="checkbox"
                                checked={selectedIds.has(partner._id)}
                                onChange={() => toggleSelect(partner._id)}
                                className="w-5 h-5 rounded cursor-pointer shadow-sm"
                            />
                        </div>
                        {/* Logo Header */}
                        <div className="relative h-40 bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center overflow-hidden">
                            {partner.logo?.url ? (
                                <img src={partner.logo.url} alt={partner.nom} className="max-h-28 max-w-[80%] object-contain transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className="w-20 h-20 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm">
                                    <Handshake size={36} className="text-blue-400" />
                                </div>
                            )}
                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                                    <button onClick={() => setViewPartner(partner)} className="flex-1 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-semibold text-blue-900 hover:bg-white transition-colors flex items-center justify-center gap-1">
                                        <Eye size={14} /> View
                                    </button>
                                    <button onClick={() => handleEdit(partner)} className="px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-blue-900 hover:bg-white transition-colors">
                                        <Edit3 size={14} />
                                    </button>
                                    <button onClick={() => handleDeleteClick(partner._id)} className="px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-600 hover:bg-white transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 space-y-2">
                            <h3 className="font-bold text-blue-900 text-lg truncate">{partner.nom}</h3>
                            {partner.service && (
                                <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                    {partner.service}
                                </span>
                            )}
                            <div className="space-y-1.5 text-sm text-gray-500 pt-1">
                                <div className="flex items-center gap-2"><Mail size={13} className="text-gray-400" /> <span className="truncate">{partner.email}</span></div>
                                {partner.telephone && <div className="flex items-center gap-2"><Phone size={13} className="text-gray-400" /> {partner.telephone}</div>}
                                {partner.adresse && <div className="flex items-center gap-2"><MapPin size={13} className="text-gray-400" /> <span className="truncate">{partner.adresse}</span></div>}
                            </div>
                            <a href={partner.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-orange-600 font-semibold hover:text-orange-700 pt-1">
                                <Globe size={13} /> Visit Website <ExternalLink size={11} />
                            </a>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {!loading && filteredPartners.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Handshake className="text-gray-400" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No partners found</h3>
                    <p className="text-gray-500 mb-6">
                        {partners.length === 0 ? 'Add your first partner to get started' : 'No partners match your search'}
                    </p>
                    {partners.length === 0 && <Button icon={<Plus size={18} />} onClick={handleAddNew}>Add Partner</Button>}
                </Card>
            )}

            {/* ==================== View Modal ==================== */}
            {viewPartner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full my-8 overflow-hidden">
                        <div className="relative h-48 bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center">
                            {viewPartner.logo?.url ? (
                                <img src={viewPartner.logo.url} alt={viewPartner.nom} className="max-h-32 max-w-[70%] object-contain" />
                            ) : (
                                <Handshake size={64} className="text-blue-300" />
                            )}
                            <button onClick={() => setViewPartner(null)} className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-blue-900">{viewPartner.nom}</h2>
                            {viewPartner.service && <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold"><Briefcase size={13} className="inline mr-1" />{viewPartner.service}</span>}
                            {viewPartner.description && <p className="text-gray-600 leading-relaxed">{viewPartner.description}</p>}
                            <div className="space-y-2 text-sm border-t pt-4">
                                <div className="flex items-center gap-3"><Mail size={16} className="text-blue-500" /> <span>{viewPartner.email}</span></div>
                                {viewPartner.telephone && <div className="flex items-center gap-3"><Phone size={16} className="text-blue-500" /> <span>{viewPartner.telephone}</span></div>}
                                {viewPartner.adresse && <div className="flex items-center gap-3"><MapPin size={16} className="text-blue-500" /> <span>{viewPartner.adresse}</span></div>}
                                <div className="flex items-center gap-3">
                                    <Globe size={16} className="text-blue-500" />
                                    <a href={viewPartner.link} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline font-semibold flex items-center gap-1">{viewPartner.link} <ExternalLink size={12} /></a>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 pt-2">Added: {new Date(viewPartner.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== Add/Edit Form Modal ==================== */}
            {showFormModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-bold text-blue-900">{editingPartner ? 'Edit Partner' : 'Add Partner'}</h2>
                            <button onClick={() => { setShowFormModal(false); setFormError(null); }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {formError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                                    <AlertCircle className="text-red-600" size={20} />
                                    <p className="text-red-600">{formError}</p>
                                </div>
                            )}

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
                                        ) : (
                                            <ImageIcon size={24} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors">
                                            <Plus size={16} /> Choose File
                                            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                        </label>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG (max 300x300)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Row: Name + Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
                                    <input type="text" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors" placeholder="Partner name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors" placeholder="partner@email.com" />
                                </div>
                            </div>

                            {/* Row: Phone + Address */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                                    <input type="tel" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors" placeholder="+216 XX XXX XXX" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                                    <input type="text" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors" placeholder="City, Country" />
                                </div>
                            </div>

                            {/* Row: Service + Website */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service / Sector</label>
                                    <input type="text" value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors" placeholder="e.g., Mental Health, Technology" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website <span className="text-red-500">*</span></label>
                                    <input type="url" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors" placeholder="https://partner.com" />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="Brief description of the partner..." />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => { setShowFormModal(false); setFormError(null); }} disabled={formLoading}>Cancel</Button>
                            <Button icon={<Save size={18} />} onClick={handleSubmit} disabled={formLoading}>
                                {formLoading ? 'Saving...' : (editingPartner ? 'Update Partner' : 'Add Partner')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== Delete Confirm Modal ==================== */}
            {deleteConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <Card className="max-w-md w-full p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="text-red-600" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Partner?</h3>
                        <p className="text-gray-500 mb-6">This action cannot be undone. The partner and its logo will be permanently removed.</p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="ghost" onClick={() => { setDeleteConfirmOpen(false); setDeletingId(null); }}>Cancel</Button>
                            <Button variant="danger" icon={<Trash2 size={16} />} onClick={handleDeleteConfirm}>Delete</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Bulk Delete Confirmation Modal */}
            {bulkDeleteConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <Card className="max-w-md w-full p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="text-red-600" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete {selectedIds.size} Partner(s)?</h3>
                        <p className="text-gray-500 mb-6">This action cannot be undone. The selected partners and their logos will be permanently removed.</p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="ghost" onClick={() => setBulkDeleteConfirmOpen(false)} disabled={bulkDeleting}>Cancel</Button>
                            <Button variant="danger" icon={<Trash2 size={16} />} onClick={handleBulkDeleteConfirm} disabled={bulkDeleting}>
                                {bulkDeleting ? 'Deleting...' : `Delete All (${selectedIds.size})`}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PartnersPage;
