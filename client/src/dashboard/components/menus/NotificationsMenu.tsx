import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  AlertCircle,
  Check,
  X,
  UserPlus,
  Mail,
  FileCheck,
  FileText,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import type { AdminNotification } from '../../services/adminNotification.service';

interface NotificationsMenuProps { }

const NotificationsMenu: React.FC<NotificationsMenuProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isConnected
  } = useAdminNotifications();

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

  // Format timestamp to relative time
  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Get action URL based on notification type
  const getActionUrl = (notification: AdminNotification): string | undefined => {
    switch (notification.type) {
      case 'user_login':
      case 'user_signup':
        return notification.data.userId ? `/admin/users?userId=${notification.data.userId}` : undefined;
      case 'contact_request':
        return undefined;
      case 'verification_request':
      case 'verification_update':
        return notification.data.requestId ? `/admin/requests?requestId=${notification.data.requestId}` : '/admin/requests';
      case 'new_post':
        return notification.data.postId ? `/community?postId=${notification.data.postId}` : '/community';
      default:
        return undefined;
    }
  };

  const getNotificationIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'user_login':
      case 'user_signup':
        return { icon: UserPlus, color: 'blue' };
      case 'contact_request':
        return { icon: Mail, color: 'teal' };
      case 'verification_request':
      case 'verification_update':
        return { icon: FileCheck, color: 'orange' };
      case 'new_post':
        return { icon: FileText, color: 'purple' };
      default:
        return { icon: Bell, color: 'gray' };
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-all duration-300 relative group focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fadeIn overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                {isConnected ? (
                  <Wifi size={14} className="text-green-500" />
                ) : (
                  <WifiOff size={14} className="text-red-500" />
                )}
              </div>
              <p className="text-xs font-semibold text-blue-600 mt-1">
                {loading ? 'Loading...' : unreadCount > 0 ? `${unreadCount} New` : 'All caught up!'}
              </p>
            </div>
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || loading}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed text-blue-600 rounded-lg text-xs font-bold transition-colors"
            >
              Mark all read
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Bell className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500 font-medium">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-red-400" size={32} />
                </div>
                <p className="text-gray-500 font-medium">Error loading notifications</p>
                <p className="text-gray-400 text-sm mt-2">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500 font-medium">No notifications</p>
                <p className="text-gray-400 text-sm mt-2">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => {
                  const { icon: Icon, color } = getNotificationIcon(notification.type);
                  const colorClasses = getColorClasses(color);
                  const actionUrl = getActionUrl(notification);
                  const notificationId = notification._id || notification.id || '';

                  return (
                    <div
                      key={notificationId}
                      className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group relative ${!notification.read ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${colorClasses.bg} flex-shrink-0 self-start`}>
                          <Icon size={16} className={colorClasses.text} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm ${!notification.read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {formatTimestamp(notification.createdAt)}
                            </span>
                            {actionUrl && (
                              <a
                                href={actionUrl}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!notification.read) {
                                    markAsRead(notificationId);
                                  }
                                }}
                                className="text-xs text-blue-600 font-bold hover:text-blue-700"
                              >
                                View Details →
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons (Show on hover) */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 self-start">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notificationId);
                              }}
                              className="p-1.5 rounded-lg hover:bg-green-100 transition-colors"
                              title="Mark as read"
                            >
                              <Check size={14} className="text-green-600" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notificationId);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
                            title="Remove"
                          >
                            <X size={14} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.2s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default NotificationsMenu;