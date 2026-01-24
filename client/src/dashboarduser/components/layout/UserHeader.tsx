import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserHeaderProps {
    user: {
        name: string;
        email: string;
        photo: string;
    };
}

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const notifications = [
        { id: 1, title: "Appointment Confirmed", time: "10 mins ago", unread: true },
        { id: 2, title: "New Message from Dr. Sarah", time: "1 hour ago", unread: true },
        { id: 3, title: "Daily Wellness Tip", time: "5 hours ago", unread: false },
    ];

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 py-4 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center justify-between gap-4">

                {/* LEFT */}
                <div className="flex items-center gap-4 min-w-0">
                    <div className="truncate">
                        <h1 className="text-lg md:text-2xl font-bold text-blue-900 dark:text-white truncate">
                            Welcome back, {user.name.split(" ")[0]}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1 hidden sm:block">
                            Here's what's happening with your health journey
                        </p>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                    {/* Search (desktop only) */}
                    <div className="relative hidden lg:block max-w-xs">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                    </div>

                    {/* Notification Bell Dropdown */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 group focus:outline-none"
                        >
                            <Bell size={20} className="text-blue-900 group-hover:text-orange-600 transition-colors" />
                            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {notifications.filter(n => n.unread).length}
                            </span>
                        </button>

                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden py-2 animate-fadeIn z-50">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Mark all read</button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map(n => (
                                        <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-700 last:border-0 ${n.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <p className={`text-sm ${n.unread ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{n.title}</p>
                                                {n.unread && <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5"></span>}
                                            </div>
                                            <p className="text-xs text-gray-400">{n.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 text-center">
                                    <button className="text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">View All Updates</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-all duration-300 group cursor-pointer focus:outline-none"
                        >
                            <img
                                src={user.photo}
                                alt={user.name}
                                className="w-10 h-10 rounded-full border-2 border-orange-500 group-hover:border-orange-600 transition-all duration-300 object-cover"
                            />
                            <div className="hidden lg:block text-left">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-blue-900 dark:text-white group-hover:text-orange-600 transition-colors">
                                        {user.name}
                                    </p>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Patient
                                </p>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden py-1 animate-fadeIn z-50">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                </div>

                                <div className="py-1">
                                    <Link
                                        to="/dashboard/user/profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-orange-600 transition-colors"
                                    >
                                        <User size={18} />
                                        My Profile
                                    </Link>
                                    {/* Settings removed as requested */}
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                                        onClick={() => {
                                            // Add logout logic here
                                            console.log("Logging out...");
                                            setIsProfileOpen(false);
                                        }}
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
            `}</style>
        </header>
    );
};

export default UserHeader;
