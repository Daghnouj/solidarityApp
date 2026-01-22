import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

interface UserMenuProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  userName = "Omar Ben Ali",
  userEmail = "omar@solidarity.com",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    {
      icon: User,
      label: 'My Profile',
      href: '/admin/profile',
      description: 'View and edit your profile'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
      description: 'Manage your preferences'
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/notifications',
      description: 'View all notifications',
      badge: 3
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      href: '/help',
      description: 'Get help when you need it'
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
      >
        <img 
          src={userAvatar}
          alt={userName}
          className="w-10 h-10 rounded-full border-2 border-orange-500 group-hover:border-orange-600 transition-all duration-300"
        />
        <div className="hidden lg:block text-left">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-blue-900 dark:text-white group-hover:text-orange-600 transition-colors">
              {userName}
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Admin
          </p>
        </div>
        <ChevronRight 
          size={16} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-slideDown">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="flex items-center gap-3">
              <img 
                src={userAvatar}
                alt={userName}
                className="w-14 h-14 rounded-full border-3 border-white shadow-lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold">{userName}</h3>
                </div>
                <p className="text-blue-200 dark:text-gray-300 text-sm">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  navigate(item.href);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 group relative"
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-gray-600 transition-colors">
                  <item.icon size={18} className="text-blue-900 dark:text-white group-hover:text-orange-600 transition-colors" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-blue-900 dark:text-white text-sm group-hover:text-orange-600 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
                {item.badge && (
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-orange-600 transition-colors" />
              </button>
            ))}
          </div>

          {/* Dark Mode Toggle */}
          <div className="px-2 pb-2">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-gray-600 transition-colors">
                  {isDarkMode ? (
                    <Moon size={18} className="text-blue-900 dark:text-white" />
                  ) : (
                    <Sun size={18} className="text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-blue-900 dark:text-white text-sm">Dark Mode</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Toggle theme</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-orange-500' : 'bg-gray-300'} relative`}>
                <div className={`absolute top-1 ${isDarkMode ? 'right-1' : 'left-1'} w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md`}></div>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 mx-2"></div>

          {/* Logout */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout?.();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/40 transition-colors">
                <LogOut size={18} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-red-600 dark:text-red-400 text-sm">Logout</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserMenu;