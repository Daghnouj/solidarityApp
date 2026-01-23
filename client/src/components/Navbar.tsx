import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import UserProfileDropdown from "./UserProfileDropdown";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // change to false to test guest view
  const [menuOpen, setMenuOpen] = useState(false);
  const [solidarityOpen, setSolidarityOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Mock data for notifications and messages
  const notifications = [
    { id: 1, text: "New appointment confirmed", time: "10 min ago", read: false },
    { id: 2, text: "Your post got 5 new likes", time: "1 hour ago", read: true },
    { id: 3, text: "Dr. Smith sent you a message", time: "2 hours ago", read: false },
  ];

  const messages = [
    { id: 1, sender: "Dr. Sarah Johnson", preview: "Hello, regarding your appointment tomorrow...", time: "2 min ago" },
    { id: 2, sender: "Support Team", preview: "Your account has been verified", time: "1 day ago" },
    { id: 3, sender: "Community Admin", preview: "Welcome to the community!", time: "3 days ago" },
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => !m.read).length;

  return (
    <nav className="bg-white shadow-sm fixed top-0 w-full z-50">
      <div className="max-w-8xl mx-auto px-12">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <NavLink to="/">
            <img src={logo} alt="Logo" className="w-44 h-auto" />
          </NavLink>

          {/* Desktop menu */}
          <div className="hidden lg:flex space-x-6 items-center">
            {/* Solidarity Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSolidarityOpen(!solidarityOpen)}
                className="flex items-center px-3 py-2 font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Solidarity
                <span className={`ml-1 transition-transform ${solidarityOpen ? "rotate-180" : ""}`}>&#9660;</span>
              </button>
              {solidarityOpen && (
                <div className="absolute top-full mt-2 bg-white border rounded-lg shadow-lg w-52 animate-fadeIn">
                  <NavLink to="/apropos" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">
                    About
                  </NavLink>
                  <NavLink to="/contact" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">
                    Contact
                  </NavLink>
                  <NavLink to="/professionals" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">
                    Professionals
                  </NavLink>
                  <NavLink to="/test" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">
                    Mental Test
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink to="/Professionals" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              Reservation
            </NavLink>
            <NavLink to="/activities-centers" className="px-3 py-2 text-gray-700 hover:text-blue-600">
              Activities & Centers
            </NavLink>

            {/* Community Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCommunityOpen(!communityOpen)}
                className="flex items-center px-3 py-2 font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Community & Resources
                <span className={`ml-1 transition-transform ${communityOpen ? "rotate-180" : ""}`}>&#9660;</span>
              </button>
              {communityOpen && (
                <div className="absolute top-full mt-2 bg-white border rounded-lg shadow-lg w-52 animate-fadeIn">
                  <NavLink to="/community" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">
                    Community
                  </NavLink>
                  <NavLink to="/galerie" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">
                    Gallery
                  </NavLink>
                  <a href="https://solidarity-mentalhealth.blogspot.com" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">
                    Blog
                  </a>
                </div>
              )}
            </div>

            {/* Login/Register or Profile Dropdown */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-gray-600 hover:text-blue-600 relative"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex justify-between">
                              <p className="text-sm text-gray-900">{notification.text}</p>
                              {!notification.read && (
                                <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t">
                        <NavLink to="/notifications" className="text-blue-600 text-sm hover:text-blue-800">
                          View all notifications
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="relative">
                  <button
                    onClick={() => setMessagesOpen(!messagesOpen)}
                    className="p-2 text-gray-600 hover:text-blue-600 relative"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadMessages}
                      </span>
                    )}
                  </button>

                  {messagesOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <h3 className="font-semibold text-gray-900">Messages</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {messages.map((message) => (
                          <div key={message.id} className="px-4 py-3 hover:bg-gray-50">
                            <p className="font-medium text-sm text-gray-900">{message.sender}</p>
                            <p className="text-sm text-gray-600 truncate">{message.preview}</p>
                            <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t">
                        <NavLink to="/messages" className="text-blue-600 text-sm hover:text-blue-800">
                          View all messages
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile */}
                <UserProfileDropdown onLogout={handleLogout} />
              </div>
            ) : (
              <>
                <NavLink to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Register
                </NavLink>
                <NavLink to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Log In
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-md text-gray-700 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden px-5 pb-4 space-y-2 bg-white border-t shadow-sm">
          {/* Solidarity */}
          <button
            onClick={() => setSolidarityOpen(!solidarityOpen)}
            className="w-full text-left px-3 py-2 flex justify-between items-center font-medium text-gray-700 hover:text-blue-600"
          >
            Solidarity
            <span className={`ml-1 transition-transform ${solidarityOpen ? "rotate-180" : ""}`}>&#9660;</span>
          </button>
          {solidarityOpen && (
            <div className="pl-3 space-y-1">
              <NavLink to="/apropos" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">About</NavLink>
              <NavLink to="/contact" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Contact</NavLink>
              <NavLink to="/professionals" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Professionals</NavLink>
              <NavLink to="/test" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Mental Test</NavLink>
            </div>
          )}

          <NavLink to="/Professionals" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Reservation</NavLink>
          <NavLink to="/activities-centers" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Activities & Centers</NavLink>

          {/* Community */}
          <button
            onClick={() => setCommunityOpen(!communityOpen)}
            className="w-full text-left px-3 py-2 flex justify-between items-center font-medium text-gray-700 hover:text-blue-600"
          >
            Community & Resources
            <span className={`ml-1 transition-transform ${communityOpen ? "rotate-180" : ""}`}>&#9660;</span>
          </button>
          {communityOpen && (
            <div className="pl-3 space-y-1">
              <NavLink to="/community" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Community</NavLink>
              <NavLink to="/galerie" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Gallery</NavLink>
              <a href="https://solidarity-mentalhealth.blogspot.com" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Blog</a>
            </div>
          )}

          {/* Mobile notifications and messages for logged in users */}
          {isLoggedIn ? (
            <>
              <div className="border-t pt-2 mt-2">
                <NavLink to="/notifications" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifications
                  {unreadNotifications > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </NavLink>

                <NavLink to="/messages" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Messages
                  {unreadMessages > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </NavLink>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-2"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/register" className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Register</NavLink>
              <NavLink to="/login" className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Log In</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
