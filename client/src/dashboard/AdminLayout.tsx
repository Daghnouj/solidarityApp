import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import QuickActionsMenu from './components/menus/QuickActionsMenu';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20">
      {/* Sidebar - Fixed */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="md:ml-72">
        {/* Header - Sticky */}
        <Header />
        
        {/* Page Content - Child routes render here via Outlet */}
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Floating Quick Actions */}
      <QuickActionsMenu position="bottom-right" />
    </div>
  );
};

export default AdminLayout;