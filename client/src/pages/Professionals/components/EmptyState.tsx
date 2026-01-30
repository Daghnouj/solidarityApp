import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <p className="text-xl text-gray-600">No professionals found matching your criteria.</p>
      <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
    </div>
  );
};

export default EmptyState;
