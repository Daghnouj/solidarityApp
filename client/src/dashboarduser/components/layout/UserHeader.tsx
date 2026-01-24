import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface UserHeaderProps {
    user: {
        name: string;
        email: string;
        photo: string;
    };
}

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
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

                    <button className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 group">
                        <Bell size={20} className="text-blue-900 group-hover:text-orange-600 transition-colors" />
                        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            2
                        </span>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-all duration-300 group cursor-pointer">
                        <img
                            src={user.photo}
                            alt={user.name}
                            className="w-10 h-10 rounded-full border-2 border-orange-500 group-hover:border-orange-600 transition-all duration-300"
                        />
                        <div className="hidden lg:block text-left">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-blue-900 dark:text-white group-hover:text-orange-600 transition-colors">
                                    {user.name}
                                </p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Patient
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default UserHeader;
