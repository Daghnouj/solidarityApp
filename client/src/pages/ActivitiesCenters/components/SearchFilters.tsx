import React from 'react';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-8 lg:mb-12">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
        {/* Spacer for desktop alignment */}
        <div className="hidden lg:block lg:w-1/3"></div>
        
        {/* Search Input */}
        <div className="w-full lg:w-1/3">
          <div className="relative">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search centers, activities, locations..."
              className="w-full px-6 py-4 border-2 border-gray-900 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
            />
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="w-full lg:w-1/4">
          <select className="w-full px-6 py-4 border-2 border-gray-900 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg bg-white">
            <option value="">All Activities</option>
            <option value="yoga">Yoga & Meditation</option>
            <option value="fitness">Fitness & Gym</option>
            <option value="sports">Sports Complex</option>
            <option value="wellness">Wellness & Spa</option>
            <option value="adventure">Adventure Sports</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;