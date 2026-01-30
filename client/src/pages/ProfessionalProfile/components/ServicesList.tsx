import React from 'react';
import type { Professional } from '../../Professionals/types';

interface ServicesListProps {
  professional: Professional;
}

const ServicesList: React.FC<ServicesListProps> = ({ professional }) => {
  const hasServices = professional.services && professional.services.length > 0;

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Services & Pricing
      </h2>
      <div className="grid gap-3">
        {hasServices ? (
          professional.services!.map((service, index) => (
            <div
              key={service._id || index}
              className="bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors duration-200 flex justify-between items-center"
            >
              <div className="font-medium text-gray-900">{service.name}</div>
              {(service.price || service.duration) && (
                <div className="text-sm text-gray-500">
                  {service.duration && <span>{service.duration}</span>}
                  {service.duration && service.price && <span className="mx-1">•</span>}
                  {service.price && <span>{service.price}</span>}
                </div>
              )}
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