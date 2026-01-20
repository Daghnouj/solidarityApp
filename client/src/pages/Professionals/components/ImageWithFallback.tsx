import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallback,
  className = ''
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return <>{fallback}</>;
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    </>
  );
};

export default ImageWithFallback;