import React, { useEffect, useState, useRef } from 'react';
import { Save, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../pages/auth/hooks/useAuth';
import UserService from '../services/user.service';
import { toast } from 'react-hot-toast';

const UserProfile: React.FC = () => {
    const { user, refreshCurrentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        bio: '',
        dateNaissance: ''
    });

    useEffect(() => {
        if (user) {
            const fullName = (user as any).nom || (user as any).name || '';
            const nameParts = fullName.trim().split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            setProfile({
                firstName,
                lastName,
                email: (user as any).email || '',
                phoneNumber: (user as any).telephone || (user as any).phoneNumber || '',
                bio: (user as any).bio || (user as any).professionalInfo?.biography || '',
                dateNaissance: (user as any).dateNaissance ? new Date((user as any).dateNaissance).toISOString().slice(0, 10) : ''
            });
        }
    }, [user]);

    const handleChange = (field: keyof typeof profile, value: string) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?._id) return;

        setLoading(true);
        try {
            const updateData: any = {
                nom: `${profile.firstName} ${profile.lastName}`.trim(),
                email: profile.email,
                telephone: profile.phoneNumber,
                bio: profile.bio
            };
            if (profile.dateNaissance) {
                updateData.dateNaissance = new Date(profile.dateNaissance);
            }

            const response = await UserService.updateProfile(user._id, updateData);
            if (response?.success) {
                toast.success('Profile updated successfully');
                await refreshCurrentUser?.();
            }
        } catch (error: any) {
            console.error('Update failed:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?._id) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB');
            return;
        }

        setUploading(true);
        try {
            const response = await UserService.updateProfilePhoto(user._id, file);
            if (response.success) {
                toast.success('Photo updated successfully');
                await refreshCurrentUser?.();
            }
        } catch (error: any) {
            console.error('Photo upload failed:', error);
            toast.error(error.response?.data?.message || 'Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-6 mb-8">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full border-4 border-orange-100 bg-gray-100 overflow-hidden">
                            <img
                                src={user?.photo || user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName || 'User'}`}
                                alt={user?.nom || user?.name || 'Profile'}
                                className="w-full h-full object-cover"
                            />
                            {uploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors"
                            disabled={uploading}
                        >
                            <Camera size={16} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePhotoChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{user?.nom || user?.name}</h3>
                        {user?.role && user.role !== 'patient' && (
                            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">JPG or PNG, max 2MB</p>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={profile.firstName}
                                onChange={(event) => handleChange('firstName', event.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={profile.lastName}
                                onChange={(event) => handleChange('lastName', event.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                            <input
                                type="date"
                                value={profile.dateNaissance}
                                onChange={(event) => handleChange('dateNaissance', event.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(event) => handleChange('email', event.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                value={profile.phoneNumber}
                                onChange={(event) => handleChange('phoneNumber', event.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Bio</label>
                        <textarea
                            rows={4}
                            value={profile.bio}
                            onChange={(event) => handleChange('bio', event.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-orange-200"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
