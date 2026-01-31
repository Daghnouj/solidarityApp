import React, { useState } from 'react';
import type { Professional } from '../types';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface ProfessionalCardProps {
  professional: Professional;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // ✅ ENHANCED FALLBACK AVATAR FUNCTION
  const getFallbackAvatar = (name: string, specialty: string) => {
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500',
      'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'
    ];
    const color = colors[initials.charCodeAt(0) % colors.length];

    return (
      <div className={`w-full h-full ${color} flex flex-col items-center justify-center text-white p-4`}>
        <div className="text-3xl font-bold mb-1">{initials}</div>
        <div className="text-xs text-center opacity-90">{specialty}</div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
      <div className="h-72 overflow-hidden relative bg-gray-100">
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner fullScreen={false} size="sm" />
          </div>
        )}

        {imageError ? (
          // Fallback UI when image fails to load
          <div className="w-full h-full">
            {getFallbackAvatar(professional.nom, professional.specialite)}
          </div>
        ) : (
          // Actual image
          <img
            src={professional.photo || '/placeholder-professional.jpg'}
            alt={professional.nom}
            className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            {professional.nom}
          </h3>
          <p className="text-blue-600 text-sm font-medium uppercase tracking-wide text-center mb-2">
            {professional.specialite}
          </p>
          <p className="text-gray-900 font-bold text-center flex items-center justify-center gap-1 mb-4">
            📍 {professional.adresse}
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-lg mx-auto">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProfessionalCard;