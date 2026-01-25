import React from 'react';
import { Outlet } from 'react-router-dom';
import ProfessionalSidebar from './components/layout/ProfessionalSidebar';
import ProfessionalHeader from './components/layout/ProfessionalHeader';

const ProfessionalLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20">
            {/* Sidebar - Fixed, hidden on mobile */}
            <div className="hidden md:block">
                <ProfessionalSidebar />
            </div>

            {/* Main Content Area */}
            <div className="md:ml-72">
                {/* Header - Sticky */}
                <ProfessionalHeader />

                {/* Page Content - Child routes render here via Outlet */}
                <main className="p-3 sm:p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProfessionalLayout;
