import React, { useState } from 'react';
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
  X
} from 'lucide-react';

const AdminProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@solidarity.com',
    phone: '+216 71 123 456',
    location: 'Tunis, Tunisia',
    bio: 'Platform administrator managing mental health services and community support.',
    role: 'Super Admin'
  });

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Admin Profile</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                alt="Admin Profile"
                className="w-32 h-32 rounded-2xl border-4 border-orange-500 shadow-lg"
              />
              <button className="absolute bottom-2 right-2 p-2 bg-orange-500 rounded-lg text-white shadow-lg hover:bg-orange-600 transition-colors">
                <Camera size={16} />
              </button>
            </div>
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                <Shield size={14} />
                Super Admin
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-blue-900">Profile Information</h2>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setIsEditing(false)} icon={<X size={18} />}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} icon={<Save size={18} />}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formData.name}</p>
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
                    <p className="text-gray-900">{formData.email}</p>
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
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-orange-600" />
                    <p className="text-gray-900">{formData.phone}</p>
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
                <p className="text-sm text-gray-600">Last changed 3 months ago</p>
              </div>
              <Button variant="ghost">
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
                <p className="text-sm text-gray-600">January 2025</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">Last Login</p>
                <p className="text-sm text-gray-600">Today at 09:24 AM</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminProfilePage;