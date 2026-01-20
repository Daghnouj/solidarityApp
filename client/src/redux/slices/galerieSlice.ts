// src/redux/slices/galerieSlice.ts
import type { PayloadAction } from '@reduxjs/toolkit';
import  { createSlice } from '@reduxjs/toolkit';
import type { Video, CategoryType } from '../../pages/galerie/types';
import { MOCK_VIDEOS } from '../../pages/galerie/constants';

interface GalerieState {
  videos: Video[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: CategoryType;
}

const initialState: GalerieState = {
  videos: MOCK_VIDEOS,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'Toutes les catégories',
};

const galerieSlice = createSlice({
  name: 'galerie',
  initialState,
  reducers: {
    // Filter actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<CategoryType>) => {
      state.selectedCategory = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = 'Toutes les catégories';
    },

    // Video actions
    setVideos: (state, action: PayloadAction<Video[]>) => {
      state.videos = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    incrementVideoViews: (state, action: PayloadAction<string>) => {
      const video = state.videos.find((v) => v.id === action.payload);
      if (video) {
        video.views += 1;
      }
    },

    // Loading and error actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  clearFilters,
  setVideos,
  incrementVideoViews,
  setLoading,
  setError,
} = galerieSlice.actions;

export default galerieSlice.reducer;