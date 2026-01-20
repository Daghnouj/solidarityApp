import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Skeleton */}
        <div className="bg-purple-900 rounded-2xl p-6 mb-8 animate-pulse">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
            {/* Image Skeleton */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-purple-700 mx-auto"></div>
            </div>

            {/* Info Skeleton */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="h-8 bg-purple-700 rounded w-3/4 mx-auto lg:mx-0"></div>
              <div className="h-6 bg-purple-700 rounded w-1/2 mx-auto lg:mx-0"></div>
              
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="h-6 bg-purple-700 rounded w-1/4 mx-auto lg:mx-0"></div>
                <div className="h-12 bg-purple-700 rounded w-48 mx-auto lg:mx-0"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="grid gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-12 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;