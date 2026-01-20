import React from 'react';
import type { Professional } from '../../Professionals/types';

interface BioSectionProps {
  professional: Professional;
}

const BioSection: React.FC<BioSectionProps> = ({ professional }) => {
  const firstName = professional.nom.split(' ')[0];
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        About {firstName}
      </h2>
      <p className="text-gray-700 leading-relaxed">
        {professional.bio || 'No biography available. This professional has not yet provided a biography.'}
      </p>
    </div>
  );
};

export default React.memo(BioSection);