import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  // Check authentication synchronously - before render
  const checkAuth = (): boolean => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminData');
      
      // Token must exist and not be empty
      if (!adminToken || adminToken.trim() === '' || adminToken === 'null' || adminToken === 'undefined') {
        // Clean up invalid token
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        return false;
      }
      
      // Admin data should also exist and be valid JSON
      if (!adminData || adminData.trim() === '' || adminData === 'null' || adminData === 'undefined') {
        // Clean up invalid data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        return false;
      }
      
      // Try to parse adminData to ensure it's valid JSON
      try {
        JSON.parse(adminData);
      } catch {
        // Invalid JSON, clean up
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking admin authentication:', error);
      // Clean up on error
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      return false;
    }
  };

  const isAuthenticated = checkAuth();

  // Block access if not authenticated - show error message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          
          <p className="text-gray-600 mb-6">
            You must be logged in as an administrator to access this page.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <AlertCircle className="w-5 h-5" />
            <span>Authentication required</span>
          </div>
          
          <Link
            to="/admin/login"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Render children only if authenticated
  return <>{children}</>;
};

export default ProtectedAdminRoute;
