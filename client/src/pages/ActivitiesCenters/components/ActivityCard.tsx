import React from 'react';
import type { ActivityCenter } from '../types';

interface ActivityCardProps {
  center: ActivityCenter;
  onImageClick: (center: ActivityCenter, index: number) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ center, onImageClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % center.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + center.images.length) % center.images.length);
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      {/* Image Carousel */}
      <div className="relative h-48 lg:h-56 overflow-hidden">
        <img
          src={center.images[currentImageIndex]}
          alt={center.name}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => onImageClick(center, currentImageIndex)}
        />

        {/* Image Navigation */}
        {center.images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
            >
              ›
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {center.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6 flex-1 flex flex-col">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
          {center.name}
        </h3>

        <div className="flex items-start gap-2 text-gray-600 mb-3">
          <span className="text-lg mt-0.5">📍</span>
          <span className="text-sm lg:text-base leading-tight">{center.address}</span>
        </div>

        {/* Activities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {center.activities.slice(0, 3).map((activity, index) => (
              <div
                key={index}
                className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{activity.name}</div>
                  <div className="text-xs text-gray-600">{activity.day}</div>
                </div>
              </div>
            ))}
            {center.activities.length > 3 && (
              <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600">
                +{center.activities.length - 3} more
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-700 text-sm lg:text-base leading-relaxed line-clamp-3">
          {center.description}
        </p>
      </div>
    </article>
  );
};

export default ActivityCard;