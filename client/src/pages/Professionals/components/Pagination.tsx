import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Don't show pagination if only one page
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // ✅ UPDATED: Scroll to top when changing pages
  const handlePageChangeWithScroll = (page: number) => {
    onPageChange(page);
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChangeWithScroll(currentPage - 1); // ✅ Use updated handler
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChangeWithScroll(currentPage + 1); // ✅ Use updated handler
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 px-4 py-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Page Info */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
        <span className="font-semibold">
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span>{' '}
        of <span className="font-semibold">{totalItems}</span> professionals
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => handlePageChangeWithScroll(page)} // ✅ Use updated handler
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                currentPage === page
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>

      {/* Items Per Page Selector (Optional) */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Show:</span>
        <select 
          value={itemsPerPage}
          onChange={(e) => {
            // ✅ UPDATED: Scroll to top when changing items per page
            onPageChange(1);
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          }}
          className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={16}>16</option>
        </select>
        <span>per page</span>
      </div>
    </div>
  );
};

export default Pagination;