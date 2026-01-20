import React from 'react';

const MapPlaceholder: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
      <div className="h-96 lg:h-[500px] rounded-lg bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
        <p className="text-gray-500 text-center max-w-md">
          Map integration will be added here when connected to backend services
        </p>
        <div className="mt-4 flex gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default MapPlaceholder;