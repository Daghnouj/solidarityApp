import React from 'react';
import { MapPin, ShieldCheck, Star } from 'lucide-react';
import type { Professional } from '../../Professionals/types';

interface ProfileHeaderProps {
  professional: Professional;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ professional }) => {
  const name = professional.nom;
  const specialty = professional.specialite;
  const photo = professional.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
  const address = professional.adresse;
  const isVerified = true; // We can use professional.is_verified from backend if available
  const rating = 4.9; // Mock rating for now
  const reviewCount = 24; // Mock count

  return (
    <div className="bg-white rounded-3xl p-8 mb-8 border border-slate-100 shadow-sm relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-16 -mt-16 opacity-30 pointer-events-none" style={{ backgroundColor: '#4FB2E5' }}></div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-[#4FB2E5] to-[#F5A146]">
            <img
              src={photo}
              alt={name}
              className="w-full h-full rounded-full object-cover border-4 border-white"
            />
          </div>
          {isVerified && (
            <div className="absolute bottom-2 right-2 p-1.5 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: '#FF90BC' }} title="Verified Professional">
              <ShieldCheck size={20} fill="white" className="text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 font-display">
            {name}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-slate-600 mb-4 justify-center md:justify-start">
            <span className="text-lg font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#4FB2E520', color: '#4FB2E5' }}>
              {specialty}
            </span>
            {address && (
              <span className="flex items-center gap-1 text-sm">
                <MapPin size={16} />
                {address}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="flex items-center" style={{ color: '#F5A146' }}>
              <Star size={20} fill="#F5A146" />
              <span className="ml-1 font-bold text-slate-900">{rating}</span>
            </div>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 underline decoration-slate-300 underline-offset-4">{reviewCount} reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileHeader);