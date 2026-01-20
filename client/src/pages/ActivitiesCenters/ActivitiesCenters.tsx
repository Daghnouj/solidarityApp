import React, { useState } from 'react';
import ActivityCard from './components/ActivityCard';
import HeroBanner from './components/HeroBanner';
import SearchFilters from './components/SearchFilters';
import MapPlaceholder from './components/MapPlaceholder';
import Lightbox from './components/Lightbox';
import { useLightbox } from './hooks/useLightbox';
import { mockActivitiesCenters } from './data/mockActivitiesCenters';

const ActivitiesCenters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { lightboxState, openLightbox, closeLightbox, nextImage, prevImage } = useLightbox();

  // Filter centers based on search
  const filteredCenters = mockActivitiesCenters.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.activities.some(activity =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Scroll to top wrapper */}
      <div className="mt-20">
        <HeroBanner />

        {/* Main Content */}
        <main className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search and Filters */}
            <SearchFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            {/* Results Count */}
            <div className="mb-6 lg:mb-8">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredCenters.length}</span> of{' '}
                <span className="font-semibold">{mockActivitiesCenters.length}</span> centers
              </p>
            </div>

            {/* Centers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredCenters.map((center) => (
                <ActivityCard 
                  key={center._id}
                  center={center}
                  onImageClick={openLightbox}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredCenters.length === 0 && (
              <div className="text-center py-12 lg:py-16">
                <div className="text-6xl lg:text-7xl mb-4">🔍</div>
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                  No Centers Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your search terms or browse all our wellness centers
                </p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Show All Centers
                </button>
              </div>
            )}

            {/* Map Section */}
            <div className="mt-12 lg:mt-16">
              <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8">
                Find Centers Near You
              </h2>
              <MapPlaceholder />
            </div>
          </div>
        </main>

        {/* Lightbox */}
        <Lightbox 
          lightboxState={lightboxState}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      </div>
    </div>
  );
};

export default ActivitiesCenters;