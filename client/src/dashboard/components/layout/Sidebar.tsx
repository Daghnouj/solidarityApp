import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  Building2, 
  Images, 
  User,
  Shield
} from "lucide-react";

const Sidebar: React.FC = () => {
  const menuItems = [
    {
      path: "/admin",
      label: "Overview",
      icon: LayoutDashboard,
      end: true
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: Users
    },
    {
      path: "/admin/requests",
      label: "Requests",
      icon: FileCheck
    },
    {
      path: "/admin/activities-centers",
      label: "Activities & Centers",
      icon: Building2
    },
    {
      path: "/admin/gallery",
      label: "Gallery",
      icon: Images
    },
    {
      path: "/admin/profile",
      label: "Profile",
      icon: User
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-20 md:w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white p-4 md:p-6 shadow-2xl z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <Shield className="text-white" size={20} />
        </div>
        <div className="hidden md:block">
          <span className="text-2xl font-bold">Solidarity</span>
          <p className="text-xs text-blue-200">Admin Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-orange-500 text-white shadow-lg transform scale-105" 
                  : "text-blue-100 hover:bg-blue-800/50"
              }`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            <span className="hidden md:block font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-6 left-4 md:left-6 right-4 md:right-6">
        <div className="hidden md:block text-xs text-blue-300 text-center">
          v2.0 • Admin Panel
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;