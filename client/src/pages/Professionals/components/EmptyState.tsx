import React from 'react';

const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No professionals found</h3>
    <p className="text-gray-600">Try adjusting your filters or search terms</p>
  </div>
);

export default EmptyState;
