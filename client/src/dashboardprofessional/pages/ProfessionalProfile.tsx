import React, { useState, useEffect } from 'react';
import { Save, Award, MapPin, Building2, Book, GraduationCap, Globe, BadgeCheck, Plus, Trash2, Camera, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import axios from 'axios';

interface Education {
    degree: string;
    field: string;
    school: string;
    year: string;
    _id?: string;
}

interface Service {
    name: string;
    price: string;
    duration: string;
    _id?: string;
}

interface UserProfile {
    _id: string;
    nom: string;
    email: string;
    telephone: string;
    photo: string;
    specialite: string;
    role: string;
    bio?: string;
    gender?: 'Male' | 'Female' | 'Prefer not to say';
    licenseNumber?: string;
    languages?: string[];
    education?: Education[];
    services?: Service[];
    clinicName?: string;
    clinicAddress?: string;
    is_verified?: boolean;
    adresse?: string;
}

const ProfessionalProfile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'services'>('personal');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);



    const USERS_API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') + '/users';

    useEffect(() => {
        fetchProfile();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${USERS_API_URL}/me`, {
                headers: getAuthHeaders()
            });
            // Ensure arrays are initialized
            const data = response.data.data || response.data; // Handle { success: true, data: ... } or direct data
            setProfile({
                ...data,
                languages: data.languages || [],
                education: data.education || [],
                services: data.services || []
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setNotification({ type: 'error', message: 'Failed to load profile data' });
            // Fallback for demo if API fails? No, better to show error.
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profile) return;

        try {
            setSaving(true);
            setNotification(null);

            await axios.put(`${USERS_API_URL}/profile/${profile._id}`, profile, {
                headers: getAuthHeaders()
            });

            setNotification({ type: 'success', message: 'Profile updated successfully' });

            // Clear notification after 3 seconds
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setNotification({ type: 'error', message: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: keyof UserProfile, value: any) => {
        if (!profile) return;
        setProfile({ ...profile, [field]: value });
    };

    // --- Array Manipulators ---

    const addLanguage = () => {
        if (!profile) return;
        const newLang = prompt("Enter language:");
        if (newLang) {
            setProfile({
                ...profile,
                languages: [...(profile.languages || []), newLang]
            });
        }
    };

    const removeLanguage = (index: number) => {
        if (!profile) return;
        const newLangs = [...(profile.languages || [])];
        newLangs.splice(index, 1);
        setProfile({ ...profile, languages: newLangs });
    };

    const addEducation = () => {
        if (!profile) return;
        const degree = prompt("Degree (e.g., PhD):");
        if (!degree) return;
        const field = prompt("Field of Study:");
        const school = prompt("School/University:");
        const year = prompt("Year:");

        setProfile({
            ...profile,
            education: [...(profile.education || []), { degree, field: field || '', school: school || '', year: year || '' }]
        });
    };

    const removeEducation = (index: number) => {
        if (!profile) return;
        const newEdu = [...(profile.education || [])];
        newEdu.splice(index, 1);
        setProfile({ ...profile, education: newEdu });
    };

    const addService = () => {
        if (!profile) return;
        const name = prompt("Service Name:");
        if (!name) return;
        const price = prompt("Price (e.g., 120 TND):");
        const duration = prompt("Duration (e.g., 60 min):");

        setProfile({
            ...profile,
            services: [...(profile.services || []), { name, price: price || '', duration: duration || '' }]
        });
    };

    const removeService = (index: number) => {
        if (!profile) return;
        const newServices = [...(profile.services || [])];
        newServices.splice(index, 1);
        setProfile({ ...profile, services: newServices });
    };

    // --- Photo Upload ---
    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !profile) return;

        const formData = new FormData();
        formData.append('photo', e.target.files[0]);

        try {
            setSaving(true); // Reusing saving state for photo upload indication
            const response = await axios.put(`${USERS_API_URL}/profile/${profile._id}/photo`, formData, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProfile({ ...profile, photo: response.data.photo });
            setNotification({ type: 'success', message: 'Photo updated successfully' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Error uploading photo:', error);
            setNotification({ type: 'error', message: 'Failed to upload photo' });
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return <LoadingSpinner message="Loading profile..." />;
    }

    if (!profile) {
        return (
            <div className="text-center p-8 text-gray-500">
                Failed to load profile. Please try reloading.
            </div>
        );
    }

    return (
        <div className="max-w-5xl space-y-6">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fadeIn ${notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    {['personal', 'professional', 'services'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                            {tab === 'personal' ? 'Personal Info' : tab === 'professional' ? 'Professional Details' : 'Services & Clinic'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Banner */}
                <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-100 overflow-hidden relative group cursor-pointer">
                            <img
                                src={profile.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.nom}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                            {saving && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                                    <LoadingSpinner fullScreen={false} size="sm" />
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="text-white" size={24} />
                                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <h3 className="text-2xl font-bold text-gray-900">{profile.nom}</h3>
                                {profile.is_verified && (
                                    <BadgeCheck className="text-blue-500" size={20} fill="currentColor" /> // fill="currentColor" might need adjustment for lucide
                                )}
                            </div>
                            <p className="text-blue-600 font-medium mb-2">{profile.specialite || 'Professional'}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                                {profile.education && profile.education.length > 0 && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100">
                                        <Award size={14} className="text-orange-500" />
                                        <span>{profile.education[0].year ? `${new Date().getFullYear() - parseInt(profile.education[0].year)} Years Exp.` : 'Experienced'}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100">
                                    <MapPin size={14} className="text-red-500" />
                                    <span>{profile.clinicAddress || profile.adresse || 'Location'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:ml-auto">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-8">

                    {/* ================= PERSONAL INFO TAB ================= */}
                    {activeTab === 'personal' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Display Name</label>
                                    <input
                                        type="text"
                                        value={profile.nom}
                                        onChange={(e) => handleInputChange('nom', e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profile.telephone || ''}
                                        onChange={(e) => handleInputChange('telephone', e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Gender</label>
                                    <select
                                        value={profile.gender || 'Prefer not to say'}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                    >
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Bio & About</label>
                                <textarea
                                    rows={4}
                                    value={profile.bio || ''}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                                    placeholder="Tell patients about yourself..."
                                />
                                <p className="text-xs text-gray-400 text-right">Max 500 characters</p>
                            </div>
                        </div>
                    )}

                    {/* ================= PROFESSIONAL DETAILS TAB ================= */}
                    {activeTab === 'professional' && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Credentials */}
                            <section>
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Book className="text-orange-500" size={20} /> Credentials
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Specialty</label>
                                        <select
                                            value={profile.specialite || ''}
                                            onChange={(e) => handleInputChange('specialite', e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                        >
                                            <option value="">Select Specialty</option>
                                            <option value="Psychologist">Psychologist</option>
                                            <option value="Psychiatrist">Psychiatrist</option>
                                            <option value="Counselor">Counselor</option>
                                            <option value="Therapist">Therapist</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">License Number</label>
                                        <input
                                            type="text"
                                            value={profile.licenseNumber || ''}
                                            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Education */}
                            <section>
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <GraduationCap className="text-blue-500" size={20} /> Education
                                </h4>
                                <div className="space-y-3">
                                    {profile.education?.map((edu, idx) => (
                                        <div key={idx} className="flex gap-4 items-start p-3 bg-gray-50 rounded-xl relative group">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                                                <span className="font-bold text-gray-600">Edu</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900">{edu.degree} in {edu.field}</p>
                                                <p className="text-sm text-gray-500">{edu.school} • {edu.year}</p>
                                            </div>
                                            <button
                                                onClick={() => removeEducation(idx)}
                                                className="text-gray-400 hover:text-red-500 p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={addEducation}
                                        className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700"
                                    >
                                        <Plus size={16} /> Add Education
                                    </button>
                                </div>
                            </section>

                            {/* Languages */}
                            <section>
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Globe className="text-green-500" size={20} /> Languages
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {profile.languages?.map((lang, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                                            {lang}
                                            <button
                                                onClick={() => removeLanguage(idx)}
                                                className="hover:text-green-900"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </span>
                                    ))}
                                    <button
                                        onClick={addLanguage}
                                        className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100 flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ================= SERVICES & CLINIC TAB ================= */}
                    {activeTab === 'services' && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Clinic Info */}
                            <section>
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Building2 className="text-purple-500" size={20} /> Clinic Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Clinic Name</label>
                                        <input
                                            type="text"
                                            value={profile.clinicName || ''}
                                            onChange={(e) => handleInputChange('clinicName', e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                value={profile.clinicAddress || ''}
                                                onChange={(e) => handleInputChange('clinicAddress', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Services List */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> Services Provided
                                    </h4>
                                    <button
                                        onClick={addService}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add New
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {profile.services?.map((service, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4 group hover:border-gray-200 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{service.name}</p>
                                                    <p className="text-xs text-gray-500">{service.duration}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 ml-14 sm:ml-0">
                                                <div className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 min-w-[80px] text-center">
                                                    {service.price}
                                                </div>
                                                <button
                                                    onClick={() => removeService(idx)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!profile.services || profile.services.length === 0) && (
                                        <div className="text-center p-4 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            No services added yet.
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default ProfessionalProfile;
