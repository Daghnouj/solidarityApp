import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    Heart,
    MessageSquare,
    User,
    Shield
} from "lucide-react";

const UserSidebar: React.FC = () => {
    const menuItems = [
        {
            path: "/dashboard/user",
            label: "Overview",
            icon: LayoutDashboard,
            end: true
        },
        {
            path: "/dashboard/user/appointments",
            label: "My Appointments",
            icon: Calendar
        },
        {
            path: "/dashboard/user/favorites",
            label: "Favorites",
            icon: Heart
        },
        {
            path: "/dashboard/user/community",
            label: "My Community",
            icon: MessageSquare
        },
        {
            path: "/dashboard/user/profile",
            label: "Profile",
            icon: User
        }
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-20 md:w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white p-3 md:p-4 lg:p-6 shadow-2xl z-50 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-12">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Shield className="text-white" size={18} />
                </div>
                <div className="hidden md:block">
                    <span className="text-xl md:text-2xl font-bold">Solidarity</span>
                    <p className="text-xs text-blue-200">User Dashboard</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 md:space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex items-center gap-2 md:gap-3 px-2 md:px-3 lg:px-4 py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 text-sm md:text-base ${isActive
                                ? "bg-orange-500 text-white shadow-lg transform scale-105"
                                : "text-blue-100 hover:bg-blue-800/50"
                            }`
                        }
                    >
                        <item.icon size={18} className="flex-shrink-0 md:w-5 md:h-5" />
                        <span className="hidden md:block font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-4 md:bottom-6 left-2 md:left-4 lg:left-6 right-2 md:right-4 lg:right-6">
                <div className="hidden md:block text-xs text-blue-300 text-center">
                    v2.0 • User Panel
                </div>
            </div>
        </aside>
    );
};

export default UserSidebar;
