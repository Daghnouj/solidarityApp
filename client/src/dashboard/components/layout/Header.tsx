import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationsMenu from '../menus/NotificationsMenu';
import UserMenu from '../menus/UserMenu';
import MobileMenu from '../menus/MobileMenu';

const Header = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Get admin data from localStorage
  const adminDataString = localStorage.getItem('adminData');
  const adminData = adminDataString ? JSON.parse(adminDataString) : null;

  const user = {
    name: adminData?.nom || "Admin",
    email: adminData?.email || "admin@solidarity.com",
    avatar: adminData?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  };

  const handleLogout = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      // Call logout API
      if (adminToken && API_BASE_URL) {
        try {
          await fetch(`${API_BASE_URL}/admin/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
        } catch (error) {
          // Continue with logout even if API call fails
          console.error('Logout API error:', error);
        }
      }

      // Clear admin data from localStorage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');

      // Redirect to login page
      navigate('/admin/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, clear local storage and redirect
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      navigate('/admin/login');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 py-4 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Mobile menu */}
          <div className="md:hidden">
            <MobileMenu
              userName={user.name}
              userAvatar={user.avatar}
              onLogout={handleLogout}
            />
          </div>

          <div className="truncate">
            <h1 className="text-lg md:text-2xl font-bold text-blue-900 dark:text-white truncate">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1 hidden sm:block">
              Here's what's happening with your dashboard
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

          <NotificationsMenu />

          {/* User menu (desktop only) */}
          <div className="hidden md:block">
            <UserMenu
              userName={user.name}
              userEmail={user.email}
              userAvatar={user.avatar}
              onLogout={handleLogout}
            />
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
