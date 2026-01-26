import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, LogOut, ChevronDown, MessageSquare } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../pages/auth/hooks/useAuth';
import { useSocket } from '../../../context/SocketContext';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ProfessionalHeader: React.FC = () => {
    const { user, logout } = useAuth();
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [messagesOpen, setMessagesOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [notificationMessages, setNotificationMessages] = useState<any[]>([]);

    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const fetchMessageNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const snippets = data.map((conv: any) => {
                    const otherUser = conv.participants.find((p: any) => p._id !== user?._id);
                    return {
                        id: conv._id,
                        sender: otherUser?.nom || "Unknown",
                        preview: conv.lastMessage?.content || "No messages yet",
                        time: conv.lastMessage ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
                        read: conv.lastMessage ? conv.lastMessage.read : true,
                        otherUserId: otherUser?._id
                    };
                });
                setNotificationMessages(snippets.slice(0, 5));
                setUnreadMessagesCount(data.filter((c: any) => c.lastMessage && !c.lastMessage.read && c.lastMessage.sender !== user?._id).length);
            }
        } catch (error) {
            console.error("Failed to fetch message notifications", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/community/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.read).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const markAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE_URL}/community/notifications/mark-read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark notifications as read", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchMessageNotifications();

        if (!socket) return;

        const handleNewNotification = (newNotification: any) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        };

        const handleReceiveMessage = () => {
            setUnreadMessagesCount(prev => prev + 1);
            fetchMessageNotifications();
        };

        socket.on('new_notification', handleNewNotification);
        socket.on('receive_message', handleReceiveMessage);

        const handleChatRead = () => {
            setUnreadMessagesCount(0);
            fetchMessageNotifications();
        };
        window.addEventListener('chat_opened', handleChatRead);

        return () => {
            socket.off('new_notification', handleNewNotification);
            socket.off('receive_message', handleReceiveMessage);
            window.removeEventListener('chat_opened', handleChatRead);
        };
    }, [socket]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
                setMessagesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification: any) => {
        setShowNotifications(false);
        if (!notification.read) {
            markOneAsRead(notification._id);
        }

        if (notification.type.includes('appointment')) {
            navigate('/dashboard/professional/requests');
        } else if (notification.post?._id) {
            navigate(`/community/post/${notification.post._id}`);
        } else if (notification.type === 'comment' || notification.type === 'reply') {
            if (notification.post?._id) navigate(`/community/post/${notification.post._id}`);
        }
    };

    const markOneAsRead = async (id: string) => {
        try {
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNotificationContent = (n: any) => {
        const senderName = n.sender?.nom || 'Someone';
        switch (n.type) {
            case 'appointment_request': return `New appointment request from ${senderName}`;
            case 'appointment_confirmed': return `Appointment confirmed with ${senderName}`;
            case 'appointment_cancelled': return `Appointment cancelled by ${senderName}`;
            case 'like': return `${senderName} liked your post`;
            case 'comment': return `${senderName} commented on your post`;
            case 'reply': return `${senderName} replied to your comment`;
            default: return 'New notification';
        }
    };

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 py-4 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center justify-between gap-4">

                {/* LEFT */}
                <div className="flex items-center gap-4 min-w-0">
                    <div className="truncate">
                        <h1 className="text-lg md:text-2xl font-bold text-blue-900 dark:text-white truncate">
                            Dr. {(user?.nom || user?.name || '').split(" ").pop() || 'Professional'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1 hidden sm:block">
                            Welcome back to your workspace
                        </p>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                    {/* Messages */}
                    <div className="relative" ref={messageRef}>
                        <button
                            onClick={() => setMessagesOpen(!messagesOpen)}
                            className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-all duration-300 relative group focus:outline-none"
                        >
                            <MessageSquare size={20} />
                            {unreadMessagesCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {unreadMessagesCount}
                                </span>
                            )}
                        </button>

                        {/* Messages Dropdown */}
                        {messagesOpen && (
                            <div className="absolute right-0 mt-4 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fadeIn overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-bold text-gray-900 text-sm">Messages</h3>
                                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{unreadMessagesCount} New</span>
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                    {notificationMessages.length > 0 ? (
                                        notificationMessages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                onClick={() => {
                                                    setMessagesOpen(false);
                                                    window.dispatchEvent(new CustomEvent('open_chat', { detail: { userId: msg.otherUserId } }));
                                                }}
                                                className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${!msg.read ? 'bg-blue-50/20' : ''}`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <p className={`text-sm ${!msg.read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{msg.sender}</p>
                                                    <p className="text-[10px] text-gray-400">{msg.time}</p>
                                                </div>
                                                <p className={`text-sm truncate mt-0.5 ${!msg.read ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{msg.preview}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                            Pas de messages récents
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                                    <button
                                        onClick={() => {
                                            setMessagesOpen(false);
                                            window.dispatchEvent(new CustomEvent('open_chat', { detail: {} }));
                                        }}
                                        className="w-full text-center py-2 text-blue-600 text-xs font-bold hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        View All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                            }}
                            className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-all duration-300 relative group focus:outline-none"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-4 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fadeIn overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{unreadCount} New</span>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                    {notifications.length > 0 ? (
                                        notifications.map((n, i) => (
                                            <div
                                                key={i}
                                                className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${!n.read ? 'bg-blue-50/30' : ''}`}
                                                onClick={() => handleNotificationClick(n)}
                                            >
                                                <div className="flex gap-3 items-start">
                                                    {/* Colored indicator button for unread notifications */}
                                                    {!n.read && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markOneAsRead(n._id);
                                                            }}
                                                            className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2 hover:scale-125 transition-transform"
                                                            title="Mark as read"
                                                        ></button>
                                                    )}
                                                    {n.read && (
                                                        <div className="w-2 h-2 flex-shrink-0 mt-2"></div>
                                                    )}
                                                    <img
                                                        src={n.sender?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.sender?.nom}`}
                                                        alt="User"
                                                        className="w-10 h-10 rounded-full bg-gray-200"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm line-clamp-2 ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                                            {getNotificationContent(n)}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            No notifications yet
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                                    <button
                                        onClick={markAsRead}
                                        disabled={unreadCount === 0}
                                        className={`w-full text-center py-2 text-xs font-bold rounded-lg transition-all ${unreadCount > 0
                                            ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-sm'
                                            : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                            }`}
                                    >
                                        Mark All as Read
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Professional Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-all duration-300 group cursor-pointer focus:outline-none"
                        >
                            <img
                                src={user?.photo || user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.nom || user?.name}`}
                                alt={user?.nom || user?.name}
                                className="w-10 h-10 rounded-full border-2 border-orange-500 group-hover:border-orange-600 transition-all duration-300 object-cover"
                            />
                            <div className="hidden lg:block text-left">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-blue-900 dark:text-white group-hover:text-orange-600 transition-colors">
                                        {user?.nom || user?.name}
                                    </p>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Professional
                                </p>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden py-1 animate-fadeIn z-50">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.nom || user?.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                </div>

                                <div className="py-1">
                                    <Link
                                        to="/dashboard/professional/profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-orange-600 transition-colors"
                                    >
                                        <User size={18} />
                                        My Profile
                                    </Link>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left font-semibold"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
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
        </header>
    );
};

export default ProfessionalHeader;
