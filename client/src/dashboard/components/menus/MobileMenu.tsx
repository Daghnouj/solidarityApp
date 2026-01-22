import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  BarChart3,
  Calendar,
  MessageSquare,
  Users,
  Activity,
  Settings,
  Heart,
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface MobileMenuProps {
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  userName = "Omar Ben Ali",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
  onLogout
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navigationItems = [
    { icon: BarChart3, label: 'Overview', path: '/dashboard' },
    { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments' },
    { icon: MessageSquare, label: 'Community', path: '/dashboard/community' },
    { icon: Users, label: 'Therapists', path: '/dashboard/therapists' },
    { icon: Activity, label: 'Analytics', path: '/dashboard/analytics' }
  ];

  const quickActions = [
    { icon: User, label: 'My Profile', path: '/admin/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <>
      {/* Menu Toggle Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2.5 rounded-xl bg-gray-100 hover:bg-orange-50 transition-colors"
      >
        <Menu size={20} className="text-blue-900" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold text-white">Solidarity</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
            <img
              src={userAvatar}
              alt={userName}
              className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-sm">{userName}</p>
              </div>
              <p className="text-blue-200 text-xs">
                Admin
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Main Menu
            </p>
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span className="font-medium flex-1">{item.label}</span>
                  <ChevronRight size={16} className="opacity-50" />
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Quick Actions
            </p>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <button
                  key={action.path}
                  onClick={() => {
                    setIsOpen(false);
                    navigate(action.path);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <action.icon size={16} className="text-blue-900 dark:text-white" />
                  </div>
                  <span className="font-medium flex-1 text-left">{action.label}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl border-2 border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <Activity size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Your Progress</p>
                <p className="text-xs text-gray-600">This month</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg">
                <p className="text-2xl font-bold text-blue-900">24</p>
                <p className="text-xs text-gray-600">Sessions</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">8.4</p>
                <p className="text-xs text-gray-600">Mood Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout?.();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 group"
          >
            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
              <LogOut size={18} />
            </div>
            <span className="font-semibold flex-1 text-left">Logout</span>
          </button>
          
          <div className="text-xs text-gray-400 text-center mt-4">
            v2.0 • Solidarity Platform
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default MobileMenu;