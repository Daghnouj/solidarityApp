import React from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from './components/BookingForm';
import { useTherapist } from './hooks/useTherapist';
import LoadingSpinner from '../../components/LoadingSpinner';

const BookingPage: React.FC = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const { therapist, loading, error } = useTherapist(therapistId);

  if (loading) {
    return <LoadingSpinner message="Loading booking information..." />;
  }

  if (error || !therapist) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Therapist Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Therapist information is not available'}</p>
          <a
            href="/professionals"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Professionals
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Book Appointment with {therapist.nom}
          </h1>
          <p className="text-xl text-gray-600">
            {therapist.specialite} Specialist
          </p>
        </div>

        {/* Booking Form */}
        <BookingForm therapist={therapist} />
      </div>
    </div>
  );
};

export default BookingPage;