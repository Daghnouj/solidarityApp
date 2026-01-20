// src/redux/slices/galerieSelectors.ts

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Base selectors
export const selectVideos = (state: RootState) => state.galerie.videos;
export const selectIsLoading = (state: RootState) => state.galerie.isLoading;
export const selectError = (state: RootState) => state.galerie.error;
export const selectSearchQuery = (state: RootState) => state.galerie.searchQuery;
export const selectSelectedCategory = (state: RootState) => state.galerie.selectedCategory;

// Memoized selector for filtered videos
export const selectFilteredVideos = createSelector(
  [selectVideos, selectSearchQuery, selectSelectedCategory],
  (videos, searchQuery, selectedCategory) => {
    return videos.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Toutes les catégories' ||
        video.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }
);

// Selector for featured video (first video)
export const selectFeaturedVideo = createSelector(
  [selectVideos],
  (videos) => videos[0]
);

// Selector for videos count by category
export const selectVideosByCategory = createSelector(
  [selectVideos],
  (videos) => {
    return videos.reduce((acc, video) => {
      acc[video.category] = (acc[video.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
);