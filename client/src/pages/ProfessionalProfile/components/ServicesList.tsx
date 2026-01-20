import React from 'react';
import type { Professional } from '../../Professionals/types';

interface ServicesListProps {
  professional: Professional;
}

const ServicesList: React.FC<ServicesListProps> = ({ professional }) => {
  const hasServices = professional.services && professional.services.length > 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Procedures and Care
      </h2>
      <div className="grid gap-3">
        {hasServices ? (
          professional.services!.map((service, index) => (
            <div 
              key={`${service}-${index}`}
              className="bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors duration-200"
            >
              {service}
            </div>
          ))
        ) : (
          <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-600">
            No specific procedures listed
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ServicesList);