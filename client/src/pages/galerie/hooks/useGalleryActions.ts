// src/pages/galerie/hooks/useGalleryActions.ts

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/hooks';
import { incrementVideoViews } from '../../../redux/slices/galerieSlice';

interface UseGalleryActionsReturn {
  handleVideoClick: (videoId: string) => void;
  handleArticleClick: (articleId: number) => void;
}

/**
 * Custom hook for handling gallery user actions
 * Centralizes all event handlers and navigation logic
 */
export const useGalleryActions = (): UseGalleryActionsReturn => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleVideoClick = useCallback(
    (videoId: string) => {
      // Increment views in Redux store
      dispatch(incrementVideoViews(videoId));

      // TODO: Backend integration - Send view tracking to API
      console.log('Video clicked:', videoId);
      
      // Example API call:
      // await axios.post(`/api/videos/${videoId}/view`);
    },
    [dispatch]
  );

  const handleArticleClick = useCallback(
    (articleId: number) => {
      navigate(`/articles/${articleId}`);
    },
    [navigate]
  );

  return {
    handleVideoClick,
    handleArticleClick,
  };
};