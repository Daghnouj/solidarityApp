import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  Award, 
  AlertCircle,
  Check,
  X,
  Settings as SettingsIcon
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'appointment' | 'message' | 'achievement' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationsMenuProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearNotification?: (id: string) => void;
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Default notifications if none provided
  const defaultNotifications: Notification[] = [
    {
      id: '1',
      type: 'appointment',
      title: 'Upcoming Session',
      message: 'Your therapy session with Dr. Lina is tomorrow at 10:00 AM',
      timestamp: '2 hours ago',
      read: false,
      actionUrl: '/appointments'
    },
    {
      id: '2',
      type: 'achievement',
      title: 'Goal Achieved! 🎉',
      message: 'You completed 7 days of mindfulness practice',
      timestamp: '5 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'message',
      title: 'New Community Post',
      message: 'Coach Samir shared new breathing exercises',
      timestamp: '1 day ago',
      read: true,
      actionUrl: '/community'
    },
    {
      id: '4',
      type: 'alert',
      title: 'Subscription Expiring',
      message: 'Your premium subscription expires in 7 days',
      timestamp: '2 days ago',
      read: true,
      actionUrl: '/settings/billing'
    }
  ];

  const notificationsList = notifications.length > 0 ? notifications : defaultNotifications;
  const unreadCount = notificationsList.filter(n => !n.read).length;

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return { icon: Calendar, color: 'blue' };
      case 'message':
        return { icon: MessageSquare, color: 'teal' };
      case 'achievement':
        return { icon: Award, color: 'orange' };
      case 'alert':
        return { icon: AlertCircle, color: 'red' };
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
      gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 group"
      >
        <Bell size={20} className="text-blue-900 group-hover:text-orange-600 transition-colors" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slideDown">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">Notifications</h3>
                <p className="text-blue-200 text-sm">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
              <button
                onClick={onMarkAllAsRead}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Mark all read
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notificationsList.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500 font-medium">No notifications</p>
                <p className="text-gray-400 text-sm mt-2">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notificationsList.map((notification) => {
                  const { icon: Icon, color } = getNotificationIcon(notification.type);
                  const colorClasses = getColorClasses(color);

                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group relative ${
                        !notification.read ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${colorClasses.bg} flex-shrink-0`}>
                          <Icon size={18} className={colorClasses.text} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-blue-900 text-sm">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5"></span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {notification.timestamp}
                            </span>
                            {notification.actionUrl && (
                              <a
                                href={notification.actionUrl}
                                className="text-xs text-orange-600 font-semibold hover:text-orange-700"
                              >
                                View →
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons (Show on hover) */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead?.(notification.id);
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
                              onClearNotification?.(notification.id);
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

          {/* Footer */}
          <div className="border-t border-gray-200 p-3 bg-gray-50 flex gap-2">
            <a
              href="/notifications"
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all text-center text-sm shadow-md hover:shadow-lg"
            >
              View All
            </a>
            <button className="p-2.5 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <SettingsIcon size={18} className="text-gray-600" />
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

export default NotificationsMenu;