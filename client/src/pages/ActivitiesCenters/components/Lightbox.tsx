import React from 'react';
import type { LightboxState } from '../types';

interface LightboxProps {
  lightboxState: LightboxState;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ lightboxState, onClose, onNext, onPrev }) => {
  if (!lightboxState.isOpen || !lightboxState.selectedCenter) return null;

  const { selectedCenter, currentImageIndex } = lightboxState;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-7xl max-h-full w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 lg:-top-12 lg:-right-12 z-10 bg-red-500 hover:bg-red-600 text-white w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 text-lg lg:text-xl"
        >
          ✕
        </button>

        {/* Image Container */}
        <div className="relative h-[70vh] lg:h-[80vh] flex items-center justify-center">
          <img 
            src={selectedCenter.images[currentImageIndex]} 
            alt={selectedCenter.name}
            className="max-h-full max-w-full object-contain rounded-lg"
          />

          {/* Navigation Arrows */}
          {selectedCenter.images.length > 1 && (
            <>
              <button
                onClick={onPrev}
                className="absolute left-2 lg:left-8 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 text-xl"
              >
                ‹
              </button>
              <button
                onClick={onNext}
                className="absolute right-2 lg:right-8 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 text-xl"
              >
                ›
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm lg:text-base">
            {currentImageIndex + 1} / {selectedCenter.images.length}
          </div>

          {/* Center Info */}
          <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
            <h3 className="font-semibold text-lg">{selectedCenter.name}</h3>
            <p className="text-sm opacity-90">{selectedCenter.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;