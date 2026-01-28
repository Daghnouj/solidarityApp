import React from 'react';
import type { FiltersState, FilterOptions } from '../types';

interface FiltersProps {
  filters: FiltersState;
  filterOptions: FilterOptions;
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  isSearching?: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  filterOptions,
  handleFilterChange,
  isSearching = false
}) => {
  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-1">
          <select
            name="specialty"
            className="w-full px-4 py-3 border-2 border-gray-900 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            onChange={handleFilterChange}
            value={filters.specialty}
          >
            <option value="">All Specialties</option>
            {filterOptions.specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <select
            name="location"
            className="w-full px-4 py-3 border-2 border-gray-900 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            onChange={handleFilterChange}
            value={filters.location}
          >
            <option value="">All Locations</option>
            {filterOptions.locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1" />

        <div className="md:col-span-1 relative">
          <input
            type="text"
            name="search"
            placeholder="Search professionals..."
            className="w-full px-4 py-3 pr-10 border-2 border-gray-900 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            onChange={handleFilterChange}
            value={filters.search}
          />
          {/* ✅ Search loading indicator */}
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {/* ✅ Search icon when not searching */}
          {!isSearching && !filters.search && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Search status text */}
      {filters.search && (
        <div className="mt-2 text-sm text-gray-600 text-center md:text-right">
          {isSearching ? 'Searching...' : `Showing results for "${filters.search}"`}
        </div>
      )}
    </div>
  );
};

export default Filters;