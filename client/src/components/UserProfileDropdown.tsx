import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../pages/auth/hooks/useAuth";

const defaultUserIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236c757d'%3E%3Cpath d='M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.523 0-10 4.477-10 10h20c0-5.523-4.477-10-10-10z'/%3E%3C/svg%3E";

const UserProfileDropdown = ({ onLogout }: { onLogout: () => void }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";
  const displayPhoto = user?.profilePicture || defaultUserIcon;

  // Determine profile link based on role
  const getProfileLink = () => {
    if (user?.role === 'admin') return '/admin/profile';
    if (user?.role === 'professional' || user?.isProfessional) return '/dashboard/professional/profile';
    return '/dashboard/user/profile';
  };

  return (
    <div className="relative ml-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center focus:outline-none"
      >
        <img
          src={displayPhoto}
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover bg-gray-100"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 animate-fadeIn">
          <div className="px-4 py-2">
            <p className="font-semibold text-gray-800">{displayName}</p>
            <p className="text-sm text-gray-500 truncate">{displayEmail}</p>
          </div>
          <hr className="my-1 border-gray-200" />

          <NavLink
            to={getProfileLink()}
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            View Profile
          </NavLink>

          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
