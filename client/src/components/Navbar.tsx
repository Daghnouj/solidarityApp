import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import UserProfileDropdown from "./UserProfileDropdown";
import { useAuth } from "../pages/auth/hooks/useAuth";
import { Bell, MessageSquare, Menu, X, ChevronDown } from "lucide-react";
import { useSocket } from "../context/SocketContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Header = () => {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [solidarityOpen, setSolidarityOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [notificationMessages, setNotificationMessages] = useState<any[]>([]);

  const navigate = useNavigate();

  const notificationRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
  };

  const lastFetchMessagesRef = useRef<number>(0);
  const fetchMessageNotifications = async () => {
    const now = Date.now();
    if (now - lastFetchMessagesRef.current < 2000) return; // Limit to 1 call per 2 seconds
    lastFetchMessagesRef.current = now;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Format snippets for the dropdown
        const snippets = data.map((conv: any) => {
          const otherUser = conv.participants.find((p: any) => p._id !== user?._id);
          const photoUrl = conv.isGroup
            ? `https://api.dicebear.com/7.x/initials/svg?seed=${conv.groupName}`
            : (otherUser?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.nom}`);

          return {
            id: conv._id,
            sender: conv.isGroup ? (conv.groupName || "Group Chat") : (otherUser?.nom || "Unknown"),
            photo: photoUrl,
            preview: conv.lastMessage?.content || "No messages yet",
            time: conv.lastMessage ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
            read: conv.lastMessage ? conv.lastMessage.read : true,
            otherUserId: otherUser?._id,
            isGroup: conv.isGroup,
            unreadCount: conv.unreadCount || 0
          };
        });
        setNotificationMessages(snippets.slice(0, 5)); // show latest 5

        // Sum all unreadCount from conversations
        const totalUnread = snippets.reduce((acc: number, curr: any) => acc + (curr.unreadCount || 0), 0);
        setUnreadMessagesCount(totalUnread);
      }
    } catch (error) {
      console.error("Failed to fetch message notifications", error);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setMessagesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
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

  const markOneAsRead = async (id: string) => {
    try {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const { socket } = useSocket();

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      fetchMessageNotifications();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (socket) {
      socket.on('new_notification', (newNotification: any) => {
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      socket.on('notification', (newNotification: any) => {
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      socket.on('receive_message', () => {
        setUnreadMessagesCount(prev => prev + 1);
        fetchMessageNotifications();
      });

      const handleChatRead = () => {
        // Just refetch to get updated counts, don't zero it out eagerly
        fetchMessageNotifications();
      };
      window.addEventListener('chat_opened', handleChatRead);

      return () => {
        socket.off('new_notification');
        socket.off('notification');
        socket.off('receive_message');
        window.removeEventListener('chat_opened', handleChatRead);
      };
    }
  }, [socket]);

  const handleNotificationClick = (notification: any) => {
    setNotificationsOpen(false);
    if (!notification.read) {
      markOneAsRead(notification._id);
    }

    if (notification.type.includes('appointment')) {
      navigate('/dashboard');
    } else if (notification.post?._id) {
      navigate(`/community/post/${notification.post._id}`);
    } else if (notification.type === 'comment' || notification.type === 'reply') {
      if (notification.post?._id) navigate(`/community/post/${notification.post._id}`);
    }
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


  const handleMessageClick = (msg: any) => {
    setMessagesOpen(false);
    window.dispatchEvent(new CustomEvent('open_chat', {
      detail: {
        userId: msg.isGroup ? undefined : msg.otherUserId,
        conversationId: msg.isGroup ? msg.id : undefined,
        isGroup: msg.isGroup
      }
    }));
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm fixed top-0 w-full z-50 transition-all duration-300">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <NavLink to="/">
            <img src={logo} alt="Logo" className="w-40 md:w-44 h-auto hover:opacity-90 transition-opacity" />
          </NavLink>

          {/* Desktop menu */}
          <div className="hidden lg:flex space-x-8 items-center">
            {/* Solidarity Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setSolidarityOpen(!solidarityOpen)}
                className="flex items-center gap-1 px-3 py-2 font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Solidarity
                <ChevronDown size={14} className={`transition-transform duration-300 ${solidarityOpen ? "rotate-180" : "group-hover:rotate-180"}`} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-2">
                  <NavLink to="/apropos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    About
                  </NavLink>
                  <NavLink to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Contact
                  </NavLink>
                  <NavLink to="/professionals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Professionals
                  </NavLink>
                  <NavLink to="/test" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Mental Test
                  </NavLink>
                </div>
              </div>
            </div>

            <NavLink to="/Professionals" className="px-3 py-2 font-medium text-gray-700 hover:text-blue-600 transition">
              Reservation
            </NavLink>
            <NavLink to="/activities-centers" className="px-3 py-2 font-medium text-gray-700 hover:text-blue-600 transition">
              Activities & Centers
            </NavLink>

            {/* Community Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setCommunityOpen(!communityOpen)}
                className="flex items-center gap-1 px-3 py-2 font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Community & Resources
                <ChevronDown size={14} className={`transition-transform duration-300 ${communityOpen ? "rotate-180" : "group-hover:rotate-180"}`} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-2">
                  <NavLink to="/community" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Community
                  </NavLink>
                  <NavLink to="/galerie" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Gallery
                  </NavLink>
                  <a href="https://solidarity-mentalhealth.blogspot.com" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    Blog
                  </a>
                </div>
              </div>
            </div>

            {/* Login/Register or Profile Dropdown */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      if (!notificationsOpen) markAsRead();
                    }}
                    className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-all duration-300 relative group"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fadeIn overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{unreadCount} New</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                          notifications.map((notification, i) => (
                            <div
                              key={i}
                              onClick={() => handleNotificationClick(notification)}
                              className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                  {getNotificationContent(notification)}
                                </p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500 text-sm">
                            No notifications yet
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                        <button
                          onClick={markAsRead}
                          disabled={unreadCount === 0}
                          className="w-full text-center py-2 text-blue-600 text-xs font-bold hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Mark All as Read
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="relative" ref={messageRef}>
                  <button
                    onClick={() => setMessagesOpen(!messagesOpen)}
                    className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-all duration-300 relative group"
                  >
                    <MessageSquare size={20} />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
                        {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                      </span>
                    )}
                  </button>

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
                              onClick={() => handleMessageClick(msg)}
                              className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${!msg.read ? 'bg-blue-50/20' : ''}`}
                            >
                              <div className="flex items-center gap-3">
                                {/* User Photo */}
                                <div className="relative">
                                  <img
                                    src={msg.photo}
                                    alt={msg.sender}
                                    className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
                                  />
                                  {(msg.unreadCount || 0) > 0 && (
                                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
                                      {msg.unreadCount > 9 ? '9+' : msg.unreadCount}
                                    </span>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <p className={`text-sm truncate ${!msg.read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{msg.sender}</p>
                                    <p className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{msg.time}</p>
                                  </div>
                                  <p className={`text-sm truncate mt-0.5 ${!msg.read ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{msg.preview}</p>
                                </div>
                              </div>
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

                {/* User Profile */}
                <UserProfileDropdown onLogout={handleLogout} />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/login" className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                  Log In
                </NavLink>
                <NavLink to="/register" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all transform hover:-translate-y-0.5">
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 pb-6 space-y-2 bg-white border-t border-gray-100 shadow-xl max-h-[80vh] overflow-y-auto animate-fadeIn">
          {/* Solidarity */}
          <button
            onClick={() => setSolidarityOpen(!solidarityOpen)}
            className="w-full text-left px-4 py-3 flex justify-between items-center font-medium text-gray-700 hover:text-blue-600 rounded-xl hover:bg-gray-50"
          >
            Solidarity
            <ChevronDown size={16} className={`transition-transform ${solidarityOpen ? "rotate-180" : ""}`} />
          </button>
          {solidarityOpen && (
            <div className="pl-4 space-y-1 bg-gray-50/50 rounded-xl p-2 mb-2">
              <NavLink to="/apropos" className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">About</NavLink>
              <NavLink to="/contact" className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">Contact</NavLink>
              <NavLink to="/professionals" className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">Professionals</NavLink>
              <NavLink to="/test" className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">Mental Test</NavLink>
            </div>
          )}

          <NavLink to="/Professionals" className="block px-4 py-3 font-medium text-gray-700 hover:text-blue-600 rounded-xl hover:bg-gray-50">Reservation</NavLink>
          <NavLink to="/activities-centers" className="block px-4 py-3 font-medium text-gray-700 hover:text-blue-600 rounded-xl hover:bg-gray-50">Activities & Centers</NavLink>

          {/* Community */}
          <button
            onClick={() => setCommunityOpen(!communityOpen)}
            className="w-full text-left px-4 py-3 flex justify-between items-center font-medium text-gray-700 hover:text-blue-600 rounded-xl hover:bg-gray-50"
          >
            Community & Resources
            <ChevronDown size={16} className={`transition-transform ${communityOpen ? "rotate-180" : ""}`} />
          </button>
          {communityOpen && (
            <div className="pl-4 space-y-1 bg-gray-50/50 rounded-xl p-2 mb-2">
              <NavLink to="/community" className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">Community</NavLink>
              <NavLink to="/galerie" className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">Gallery</NavLink>
              <a href="https://solidarity-mentalhealth.blogspot.com" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg">Blog</a>
            </div>
          )}

          {/* Mobile notifications and messages for logged in users */}
          {isLoggedIn ? (
            <>
              <div className="border-t border-gray-100 pt-4 mt-2">
                <NavLink to="/notifications" className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 rounded-xl hover:bg-gray-50">
                  <Bell size={20} className="mr-3" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    window.dispatchEvent(new CustomEvent('open_chat', { detail: {} }));
                  }}
                  className="w-full flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 rounded-xl hover:bg-gray-50 text-left"
                >
                  <MessageSquare size={20} className="mr-3" />
                  Messages
                  {unreadMessagesCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 mt-4 flex items-center justify-center gap-2 transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-4 space-y-3">
              <NavLink to="/register" className="block w-full text-center px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200">Register</NavLink>
              <NavLink to="/login" className="block w-full text-center px-4 py-3 text-gray-700 font-bold bg-gray-50 rounded-xl hover:bg-gray-100">Log In</NavLink>
            </div>
          )}
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
    </nav>
  );
};

export default Header;
