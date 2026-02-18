import React, { useState } from 'react';
import type { ActivityCenter } from '../types';
import { Star } from 'lucide-react';

interface ActivityCardProps {
  center: ActivityCenter;
  onImageClick: (center: ActivityCenter, index: number) => void;
  onViewDetails: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ center, onImageClick, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev: number) => (prev + 1) % center.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev: number) => (prev - 1 + center.images.length) % center.images.length);
  };

  return (
    <article
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col border border-gray-100 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Carousel */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={center.images[currentImageIndex]}
          alt={center.name}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-110"
          onClick={() => onImageClick(center, currentImageIndex)}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Enrollment Badge */}
        {(() => {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (user?._id && center.participants.includes(user._id)) {
            return (
              <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.1em] rounded-full border border-white/30 flex items-center gap-2 shadow-sm animate-fade-in transition-all duration-300">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                Enrolled
              </div>
            );
          }
          return null;
        })()}

        {/* Image Navigation */}
        {center.images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              {center.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white w-4' : 'bg-white/60 hover:bg-white/80'
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {center.name}
          </h3>
          <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
            </svg>
          </span>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 text-orange-400">
            <Star size={14} className="fill-current" />
            <span className="text-sm font-bold text-gray-900">{center.averageRating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-400">({center.numberOfRatings} reviews)</span>
        </div>

        <div className="flex items-center gap-2 text-gray-500 mb-4 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{center.address}</span>
        </div>

        {/* Activities Tags */}
        <div className="mb-4 flex-1">
          <div className="flex flex-wrap gap-2">
            {center.activities.slice(0, 3).map((activity, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-xs font-medium text-slate-600 border border-slate-100 group-hover:border-slate-200 transition-colors"
              >
                {activity.name}
              </span>
            ))}
            {center.activities.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-xs font-medium text-gray-500 border border-gray-100">
                +{center.activities.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 mt-auto">
          <button
            onClick={onViewDetails}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-50 text-gray-700 font-medium text-sm hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ActivityCard;