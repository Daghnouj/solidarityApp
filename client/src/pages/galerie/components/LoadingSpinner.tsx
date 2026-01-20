// src/pages/galerie/components/LoadingSpinner.tsx

export const LoadingSpinner: React.FC = () => (
  <div className="text-center my-20">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    <p className="mt-4 text-gray-600">Loading videos...</p>
  </div>
);