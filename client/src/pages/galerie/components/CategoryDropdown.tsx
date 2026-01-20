// src/pages/galerie/components/CategoryDropdown.tsx

import { useState } from 'react';
import type { CategoryType } from '../types';
import { CATEGORIES } from '../constants';

interface CategoryDropdownProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (category: CategoryType) => {
    onSelectCategory(category);
    setIsOpen(false);
  };

  return (
    <div className="w-full md:w-auto relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-48 h-[53px] px-6 bg-[#ECECEC] border border-gray-800 rounded-full text-base text-left flex items-center justify-between hover:bg-gray-300 transition-colors"
        aria-label="Category filter"
        aria-expanded={isOpen}
      >
        <span className="text-gray-800">{selectedCategory}</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleSelect(category)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  selectedCategory === category
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};