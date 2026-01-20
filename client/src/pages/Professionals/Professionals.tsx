import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import Filters from './components/Filters';
import ProfessionalCard from './components/ProfessionalCard';
import EmptyState from './components/EmptyState';
import Pagination from './components/Pagination'; // ✅ IMPORT PAGINATION
import type { FiltersState, FilterOptions } from './types';
import { fetchProfessionals, setCurrentPage } from '../../redux/slices/professionalsSlice'; // ✅ ADD setCurrentPage
import type { RootState, AppDispatch } from '../../redux/store';
import { useDebounce } from '../../hooks/useDebounce';

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const Professionals: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    professionals, 
    loading, 
    error, 
    currentPage, 
    itemsPerPage, 
    totalItems 
  } = useAppSelector((state) => state.professionals);

  const [filters, setFilters] = useState<FiltersState>({
    specialty: '',
    location: '',
    search: ''
  });

  const debouncedSearch = useDebounce(filters.search, 300);
  const isSearching = filters.search !== debouncedSearch;

  // Dynamic filter options from Redux data
  const filterOptions: FilterOptions = {
    specialties: [...new Set(professionals.map(p => p.specialite))],
    locations: [...new Set(professionals.map(p => p.adresse))]
  };

  useEffect(() => {
    dispatch(fetchProfessionals());
  }, [dispatch]);

  // ✅ RESET TO PAGE 1 WHEN FILTERS CHANGE
  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [filters, dispatch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // ✅ PAGINATION LOGIC
  const filteredProfessionals = professionals.filter(p => {
    const matchSpec = !filters.specialty || p.specialite === filters.specialty;
    const matchLoc = !filters.location || p.adresse === filters.location;
    const matchSearch =
      !debouncedSearch ||
      p.nom.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.specialite.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchSpec && matchLoc && matchSearch;
  });

  // ✅ CALCULATE PAGINATED PROFESSIONALS
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProfessionals = filteredProfessionals.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-semibold text-gray-600">Loading professionals...</div>
          <div className="mt-4 text-gray-500">Please wait while we fetch the best healthcare professionals for you.</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-semibold text-red-600 mb-4">Error Loading Professionals</div>
          <div className="text-gray-600 mb-6">{error}</div>
          <button 
            onClick={() => dispatch(fetchProfessionals())}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-start mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mt-8 sm:mt-12">Our Professionals</h2>
          <p className="mt-4 text-lg text-gray-600">Find the best healthcare professionals near you</p>
        </div>

        <Filters
          filters={filters}
          filterOptions={filterOptions}
          handleFilterChange={handleFilterChange}
          isSearching={isSearching}
        />

        {currentProfessionals.length > 0 ? (
          <>
            {/* ✅ PROFESSIONALS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProfessionals.map((p) => (
                <Link key={p._id} to={`/professionals/${p._id}`}>
                  <ProfessionalCard professional={p} />
                </Link>
              ))}
            </div>

            {/* ✅ PAGINATION COMPONENT */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredProfessionals.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Professionals;