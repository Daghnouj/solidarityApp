import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../pages/auth/hooks/useAuth";
import { User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";

const UserProfileDropdown = ({ onLogout }: { onLogout: () => void }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name || user?.nom || "User";
  const displayEmail = user?.email || "";
  const displayPhoto = user?.photo || user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

  // Determine profile link based on role
  const getProfileLink = () => {
    if (user?.role === 'admin') return '/admin/profile';
    if (user?.role === 'professional' || user?.isProfessional) return '/dashboard/professional/profile';
    return '/dashboard/user/profile';
  };

  const getDashboardLink = () => {
    return '/dashboard';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 transition-all duration-300 focus:outline-none"
      >
        <img
          src={displayPhoto}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover"
        />
        <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-fadeIn overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <p className="font-bold text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
          </div>

          <div className="p-1">
            <NavLink
              to={getDashboardLink()}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to={getProfileLink()}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <User size={18} />
              View Profile
            </NavLink>

            <button
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
            >
              <LogOut size={18} />
              Sign Out
            </button>
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
      `}</style>
    </div>
  );
};

export default UserProfileDropdown;
