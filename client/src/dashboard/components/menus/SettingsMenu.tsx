import React, { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Check,
  X,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      appointments: true,
      community: true,
      reminders: true
    },
    appearance: {
      darkMode: false,
      language: 'en',
      fontSize: 'medium'
    },
    privacy: {
      profileVisible: true,
      showActivity: true,
      allowMessages: true
    },
    sound: {
      enabled: true,
      volume: 70
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  const toggleSetting = (category: keyof typeof settings, key: string) => {
  setSettings((prev) => ({
    ...prev,
    [category]: {
      ...prev[category],
      [key]: !(prev[category] as any)[key]
    }
  }));
};


  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Settings Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl z-50 animate-slideInRight flex">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Settings className="text-white" size={24} />
              <h2 className="text-xl font-bold text-white">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="text-white" size={20} />
            </button>
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-blue-800/50'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <div className="p-4 bg-blue-800/50 rounded-xl">
              <HelpCircle className="text-blue-200 mb-2" size={20} />
              <p className="text-sm text-blue-200 font-medium">Need help?</p>
              <a href="/help" className="text-xs text-white hover:underline">
                Visit Help Center →
              </a>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">General Settings</h3>
                <p className="text-gray-600">Manage your general preferences</p>
              </div>

              {/* Language */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Globe className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Language</h4>
                    <p className="text-sm text-gray-600">Choose your preferred language</p>
                  </div>
                </div>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors">
                  <option value="en">English</option>
                  <option value="ar">العربية (Arabic)</option>
                  <option value="fr">Français (French)</option>
                  <option value="es">Español (Spanish)</option>
                </select>
              </div>

              {/* Sound */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100">
                      {settings.sound.enabled ? (
                        <Volume2 className="text-orange-600" size={20} />
                      ) : (
                        <VolumeX className="text-orange-600" size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">Sound Effects</h4>
                      <p className="text-sm text-gray-600">Enable notification sounds</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting('sound', 'enabled')}
                    className={`w-14 h-7 rounded-full transition-colors relative ${
                      settings.sound.enabled ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                        settings.sound.enabled ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
                {settings.sound.enabled && (
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                      Volume: {settings.sound.volume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.sound.volume}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          sound: { ...settings.sound, volume: Number(e.target.value) }
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Notifications</h3>
                <p className="text-gray-600">Control how you receive notifications</p>
              </div>

              {/* Notification Channels */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-4">Notification Channels</h4>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                    { key: 'push', label: 'Push Notifications', description: 'Browser and mobile alerts' },
                    { key: 'sms', label: 'SMS Notifications', description: 'Text message alerts' }
                  ].map((channel) => (
                    <div key={channel.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">{channel.label}</p>
                        <p className="text-sm text-gray-600">{channel.description}</p>
                      </div>
                      <button
                        onClick={() => toggleSetting('notifications', channel.key)}
                        className={`w-14 h-7 rounded-full transition-colors relative ${
                          settings.notifications[channel.key as keyof typeof settings.notifications]
                            ? 'bg-orange-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                            settings.notifications[channel.key as keyof typeof settings.notifications]
                              ? 'right-1'
                              : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Types */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-4">What to Notify</h4>
                <div className="space-y-3">
                  {[
                    { key: 'appointments', label: 'Appointment Reminders' },
                    { key: 'community', label: 'Community Updates' },
                    { key: 'reminders', label: 'Daily Check-in Reminders' }
                  ].map((type) => (
                    <label
                      key={type.key}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          settings.notifications[type.key as keyof typeof settings.notifications]
                            ? 'bg-orange-500 border-orange-500'
                            : 'border-gray-300'
                        }`}
                        onClick={() => toggleSetting('notifications', type.key)}
                      >
                        {settings.notifications[type.key as keyof typeof settings.notifications] && (
                          <Check className="text-white" size={14} />
                        )}
                      </div>
                      <span className="font-medium text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Appearance</h3>
                <p className="text-gray-600">Customize how Solidarity looks</p>
              </div>

              {/* Dark Mode */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {settings.appearance.darkMode ? (
                        <Moon className="text-blue-900" size={20} />
                      ) : (
                        <Sun className="text-orange-600" size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">Dark Mode</h4>
                      <p className="text-sm text-gray-600">Switch to dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting('appearance', 'darkMode')}
                    className={`w-14 h-7 rounded-full transition-colors relative ${
                      settings.appearance.darkMode ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                        settings.appearance.darkMode ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Font Size */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-4">Font Size</h4>
                <div className="grid grid-cols-3 gap-3">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, fontSize: size }
                        })
                      }
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        settings.appearance.fontSize === size
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="sticky bottom-0 pt-6 pb-2 bg-white border-t border-gray-200 mt-8">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default SettingsMenu;