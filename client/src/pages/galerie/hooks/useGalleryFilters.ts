// src/pages/galerie/hooks/useGalleryFilters.ts

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setSearchQuery, setSelectedCategory, clearFilters } from '../../../redux/slices/galerieSlice';
import {
  selectFilteredVideos,
  selectSearchQuery,
  selectSelectedCategory,
  selectIsLoading,
  selectError,
} from '../../../redux/slices/galerieSelectors';
import type { CategoryType } from '../types';

interface UseGalleryFiltersReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  clearFilters: () => void;
  filteredVideos: ReturnType<typeof selectFilteredVideos>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for managing gallery filters using Redux
 * Centralizes all filter logic and state management
 */
export const useGalleryFilters = (): UseGalleryFiltersReturn => {
  const dispatch = useAppDispatch();

  // Select data from Redux store
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const filteredVideos = useAppSelector(selectFilteredVideos);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  // Action dispatchers
  const handleSetSearchQuery = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleSetSelectedCategory = (category: CategoryType) => {
    dispatch(setSelectedCategory(category));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    selectedCategory,
    setSelectedCategory: handleSetSelectedCategory,
    clearFilters: handleClearFilters,
    filteredVideos,
    isLoading,
    error,
  };
};