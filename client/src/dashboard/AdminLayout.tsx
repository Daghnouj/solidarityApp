import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import QuickActionsMenu from './components/menus/QuickActionsMenu';
import ProtectedAdminRoute from './ProtectedAdminRoute';

const AdminLayout: React.FC = () => {
  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20">
        {/* Sidebar - Fixed, hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Main Content Area */}
        <div className="md:ml-72">
          {/* Header - Sticky */}
          <Header />
          
          {/* Page Content - Child routes render here via Outlet */}
          <main className="p-3 sm:p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>

        {/* Floating Quick Actions - Hidden on mobile */}
        <div className="hidden md:block">
          <QuickActionsMenu position="bottom-right" />
        </div>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminLayout;