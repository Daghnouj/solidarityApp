import React from 'react';
import { useParams } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSkeleton from './components/LoadingSkeleton';
import ProfileHeader from './components/ProfileHeader';
import ContactCard from './components/ContactCard';
import BioSection from './components/BioSection';
import ServicesList from './components/ServicesList';
import { useProfessional } from '../../hooks/useProfessional'; // ✅ UPDATED IMPORT PATH

const ProfessionalProfileContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { professional, loading, error } = useProfessional(id);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a 
            href="/professionals" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Professionals
          </a>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-20">
        <div className="text-xl font-semibold text-gray-600">Professional not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader professional={professional} />
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="lg:w-1/3">
            <ContactCard professional={professional} />
          </div>
          
          <div className="lg:w-2/3">
            <BioSection professional={professional} />
            <ServicesList professional={professional} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfessionalProfile: React.FC = () => {
  return (
    <ErrorBoundary>
      <ProfessionalProfileContent />
    </ErrorBoundary>
  );
};

export default ProfessionalProfile;