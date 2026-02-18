import React, { useState } from 'react';
import ActivityCard from './components/ActivityCard';
import HeroBanner from './components/HeroBanner';
import SearchFilters from './components/SearchFilters';
import MapboxMap from './components/MapboxMap'; // Use the new Mapbox component
import Lightbox from './components/Lightbox';
import CenterDetailsModal from './components/CenterDetailsModal';
import { useLightbox } from './hooks/useLightbox';
import { useActivities } from './hooks/useActivities';
import type { ActivityCenter } from './types';

const ActivitiesCenters: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCenterDetails, setSelectedCenterDetails] = useState<ActivityCenter | null>(null);
    const [mapFocusLocation, setMapFocusLocation] = useState<{ lng: number; lat: number } | null>(null);
    const mapSectionRef = React.useRef<HTMLDivElement>(null);

    const { lightboxState, openLightbox, closeLightbox, nextImage, prevImage } = useLightbox();
    const { centers, loading, error } = useActivities();

    // Filter centers based on search and category
    const filteredCenters = centers.filter(center => {
        const matchesSearch =
            center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.activities.some(activity =>
                activity.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesCategory = selectedCategory === '' || center.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setMapFocusLocation(null);
    };

    const handleNavigateToMap = (coordinates: string) => {
        const [latStr, lngStr] = coordinates.split(',').map(s => s.trim());
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (!isNaN(lat) && !isNaN(lng)) {
            setSelectedCenterDetails(null); // Close modal first

            // Wait for modal to fully close, then focus map and scroll
            setTimeout(() => {
                setMapFocusLocation({ lng, lat });
                requestAnimationFrame(() => {
                    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            }, 300);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-100 max-w-md">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Scroll to top wrapper */}
            <div>
                <HeroBanner />

                {/* Main Content - Overlapping Hero */}
                <main className="relative pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Search and Filters */}
                        <SearchFilters
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />

                        {/* Results Count & Grid */}
                        <div className="animate-fade-in-up">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Recommended Places
                                </h2>
                            </div>

                            {/* Centers Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                                {filteredCenters.map((center) => (
                                    <ActivityCard
                                        key={center._id}
                                        center={center}
                                        onImageClick={openLightbox}
                                        onViewDetails={() => setSelectedCenterDetails(center)}
                                    />
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredCenters.length === 0 && (
                                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <div className="text-6xl mb-6">🤔</div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        No matches found
                                    </h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                                        We couldn't find any centers matching your filters. Try adjusting your search or category.
                                    </p>
                                    <button
                                        onClick={handleClearFilters}
                                        className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}

                            {/* Map Section */}
                            <div className="mt-20 lg:mt-32" ref={mapSectionRef}>
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        Explore on Map
                                    </h2>
                                    <p className="text-gray-500 max-w-2xl mx-auto">
                                        Find the nearest specialized centers and sports facilities in your area.
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100">
                                    <MapboxMap
                                        centers={filteredCenters}
                                        focusLocation={mapFocusLocation}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Center Details Modal */}
                <CenterDetailsModal
                    center={selectedCenterDetails}
                    isOpen={!!selectedCenterDetails}
                    onClose={() => setSelectedCenterDetails(null)}
                    onNavigateToMap={handleNavigateToMap}
                />

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