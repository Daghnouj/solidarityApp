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

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      {/* Page Info */}
      <div className="text-sm text-gray-600">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} professionals
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex gap-2">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-400">
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;