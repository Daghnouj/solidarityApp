import React, { useState, useEffect } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import { 
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Lock,
  Bell,
  Save,
  X,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Interface for backend admin data
interface BackendAdmin {
  _id: string;
  nom: string;
  email: string;
  phone?: string;
  photo?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const AdminProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState<BackendAdmin | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Fetch admin profile from server
  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!API_BASE_URL) {
        throw new Error('API URL is not configured');
      }

      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/admin/profile/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch admin profile');
      }

      const data = await response.json();
      setAdminData(data);
      setFormData({
        nom: data.nom || '',
        email: data.email || '',
        phone: data.phone || '',
        location: 'Tunis, Tunisia', // Default location
        bio: 'Platform administrator managing mental health services and community support.' // Default bio
      });
    } catch (err: any) {
      console.error('Error fetching admin profile:', err);
      setError(err.message || 'Failed to load admin profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  // Handle profile update
  const handleSave = async () => {
    try {
      setFormError(null);
      setFormLoading(true);

      // Validation
      if (!formData.nom.trim()) {
        setFormError('Name is required');
        setFormLoading(false);
        return;
      }
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setFormError('Valid email is required');
        setFormLoading(false);
        return;
      }

      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        setFormError('Admin authentication required');
        setFormLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/profile/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          email: formData.email,
          phone: formData.phone || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      // Success
      await fetchAdminProfile();
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setFormError(err.message || 'Failed to update profile');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    try {
      setPasswordError(null);
      setPasswordLoading(true);

      // Validation
      if (!passwordData.oldPassword) {
        setPasswordError('Current password is required');
        setPasswordLoading(false);
        return;
      }
      if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters');
        setPasswordLoading(false);
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('Passwords do not match');
        setPasswordLoading(false);
        return;
      }

      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        setPasswordError('Admin authentication required');
        setPasswordLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/profile/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      // Success
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Password changed successfully!');
    } catch (err: any) {
      console.error('Error changing password:', err);
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setPhotoLoading(true);
      setError(null);

      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin authentication required');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('adminPhoto', file);

      const response = await fetch(`${API_BASE_URL}/admin/profile/profile-photo`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile photo');
      }

      // Success
      await fetchAdminProfile();
      alert('Profile photo updated successfully!');
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      setError(err.message || 'Failed to update profile photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  if (loading && !adminData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">{error || 'Failed to load admin profile'}</p>
          <Button onClick={fetchAdminProfile} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const avatarUrl = adminData.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminData.nom}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">Admin Profile</h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">Manage your account settings and preferences</p>
        </div>
        <Button 
          variant="ghost" 
          icon={<RefreshCw size={18} />} 
          onClick={fetchAdminProfile}
        >
          Refresh
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Profile Card */}
      <Card className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {photoLoading ? (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl border-4 border-orange-500 shadow-lg flex items-center justify-center bg-gray-100">
                  <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
              ) : (
                <img
                  src={avatarUrl}
                  alt="Admin Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl border-4 border-orange-500 shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminData.nom}`;
                  }}
                />
              )}
              <label className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1.5 sm:p-2 bg-orange-500 rounded-lg text-white shadow-lg hover:bg-orange-600 transition-colors cursor-pointer">
                <Camera size={14} className="sm:w-4 sm:h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={photoLoading}
                />
              </label>
            </div>
            <div className="mt-3 sm:mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold">
                <Shield size={12} className="sm:w-3.5 sm:h-3.5" />
                {adminData.role || 'Super Admin'}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-blue-900">Profile Information</h2>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="text-xs sm:text-sm w-full sm:w-auto">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setIsEditing(false);
                      setFormError(null);
                      // Reset form data
                      setFormData({
                        nom: adminData.nom || '',
                        email: adminData.email || '',
                        phone: adminData.phone || '',
                        location: 'Tunis, Tunisia',
                        bio: 'Platform administrator managing mental health services and community support.'
                      });
                    }} 
                    icon={<X size={16} className="sm:w-[18px] sm:h-[18px]" />} 
                    className="text-xs sm:text-sm flex-1 sm:flex-initial"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    icon={<Save size={16} className="sm:w-[18px] sm:h-[18px]" />} 
                    className="text-xs sm:text-sm flex-1 sm:flex-initial"
                    disabled={formLoading}
                  >
                    {formLoading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                <AlertCircle className="text-red-600" size={16} />
                <p className="text-red-600 text-sm">{formError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{adminData.nom}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-600" />
                    <p className="text-gray-900">{adminData.email}</p>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                    placeholder="+216 XX XXX XXX"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-orange-600" />
                    <p className="text-gray-900">{adminData.phone || 'Not provided'}</p>
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-teal-600" />
                    <p className="text-gray-900">{formData.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
                />
              ) : (
                <p className="text-gray-700">{formData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6 md:p-8">
        <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
          <Lock className="text-orange-600" size={24} />
          Security Settings
        </h2>

        <div className="space-y-6">
          {/* Change Password */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Password</h3>
                <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
              </div>
              <Button variant="ghost" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </Button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <button className="w-14 h-7 rounded-full bg-green-500 relative transition-colors">
                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-md"></div>
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Active Sessions</h3>
                <p className="text-sm text-gray-600">Manage devices where you're logged in</p>
              </div>
              <Button variant="ghost">
                View Sessions
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6 md:p-8">
        <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
          <Bell className="text-orange-600" size={24} />
          Notification Preferences
        </h2>

        <div className="space-y-4">
          {[
            { label: 'Email Notifications', description: 'Receive email updates about platform activity', enabled: true },
            { label: 'New User Registrations', description: 'Get notified when new users sign up', enabled: true },
            { label: 'Pending Requests', description: 'Alerts for new activation requests', enabled: true },
            { label: 'System Updates', description: 'Important platform updates and maintenance', enabled: true },
            { label: 'Weekly Reports', description: 'Receive weekly analytics reports', enabled: false }
          ].map((pref, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-blue-900">{pref.label}</p>
                <p className="text-sm text-gray-600">{pref.description}</p>
              </div>
              <button className={`w-14 h-7 rounded-full relative transition-colors ${
                pref.enabled ? 'bg-orange-500' : 'bg-gray-300'
              }`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  pref.enabled ? 'right-1' : 'left-1'
                }`}></div>
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Account Activity */}
      <Card className="p-6 md:p-8">
        <h2 className="text-xl font-bold text-blue-900 mb-6">Account Activity</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-teal-600" />
              <div>
                <p className="font-semibold text-blue-900">Member Since</p>
                <p className="text-sm text-gray-600">
                  {new Date(adminData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">Last Updated</p>
                <p className="text-sm text-gray-600">
                  {new Date(adminData.updatedAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-blue-900">Change Password</h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError(null);
                  setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Error Message */}
              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="text-red-600" size={16} />
                  <p className="text-red-600 text-sm">{passwordError}</p>
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.old ? 'text' : 'password'}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword.old ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 pr-12"
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 pr-12"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError(null);
                  setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                disabled={passwordLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordChange}
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfilePage;
