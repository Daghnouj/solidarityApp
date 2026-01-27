import React from 'react';
import { Link } from 'react-router-dom';
import type { Professional } from '../../Professionals/types';

interface ProfileHeaderProps {
  professional: Professional;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ professional }) => {
  // Normalize fields coming from different shapes (list vs. detailed hook)
  const proId = (professional as any)._id || (professional as any).id;
  const name = (professional as any).nom || (professional as any).name || 'Professional';
  const specialty = (professional as any).specialite || (professional as any).specialty || 'Specialist';
  const photo =
    (professional as any).photo ||
    (professional as any).image ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  return (
    <div className="bg-purple-900 rounded-2xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
        {/* Professional Image */}
        <div className="flex-shrink-0">
          <img
            src={photo}
            alt={name}
            loading="lazy"
            className="w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-blue-500 mx-auto"
          />
        </div>

        {/* Professional Info */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            {name}
          </h1>
          
          <p className="text-blue-300 text-xl lg:text-2xl font-medium mb-6 lg:mb-8">
            {specialty}
          </p>

          {/* Pricing & Booking */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-white">
              <span className="text-2xl lg:text-3xl font-bold">60 DT</span>
              <span className="text-lg lg:text-xl ml-2">consultation</span>
            </div>
            
            {proId ? (
              <Link 
                to={`/book/${proId}`}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block text-center"
              >
                Book Appointment
              </Link>
            ) : (
              <button
                disabled
                className="bg-gray-400 text-white px-8 py-4 rounded-full font-semibold text-lg inline-block text-center cursor-not-allowed"
                title="Loading professional..."
              >
                Book Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileHeader);