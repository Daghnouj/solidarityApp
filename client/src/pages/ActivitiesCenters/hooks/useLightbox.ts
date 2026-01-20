import { useState } from 'react';
import type { ActivityCenter, LightboxState } from '../types';

export const useLightbox = () => {
  const [lightboxState, setLightboxState] = useState<LightboxState>({
    isOpen: false,
    selectedCenter: null,
    currentImageIndex: 0
  });

  const openLightbox = (center: ActivityCenter, imageIndex: number = 0) => {
    setLightboxState({
      isOpen: true,
      selectedCenter: center,
      currentImageIndex: imageIndex
    });
  };

  const closeLightbox = () => {
    setLightboxState(prev => ({ ...prev, isOpen: false }));
  };

  const nextImage = () => {
    if (lightboxState.selectedCenter) {
      setLightboxState(prev => ({
        ...prev,
        currentImageIndex: (prev.currentImageIndex + 1) % prev.selectedCenter!.images.length
      }));
    }
  };

  const prevImage = () => {
    if (lightboxState.selectedCenter) {
      setLightboxState(prev => ({
        ...prev,
        currentImageIndex: (prev.currentImageIndex - 1 + prev.selectedCenter!.images.length) % prev.selectedCenter!.images.length
      }));
    }
  };

  return {
    lightboxState,
    openLightbox,
    closeLightbox,
    nextImage,
    prevImage
  };
};