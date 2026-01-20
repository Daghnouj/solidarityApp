import React from 'react';
import type { Professional } from '../../Professionals/types';

interface ContactCardProps {
  professional: Professional;
}

const ContactCard: React.FC<ContactCardProps> = ({ professional }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-700">
          <span className="text-lg" role="img" aria-label="Email">📧</span>
          <span>{professional.email || 'email@example.com'}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <span className="text-lg" role="img" aria-label="Phone">📱</span>
          <span>{professional.telephone || '+216 12 345 678'}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-700">
          <span className="text-lg" role="img" aria-label="Address">🏢</span>
          <span>{professional.adresse}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ContactCard);