import React from 'react';
import type { Professional } from '../../Professionals/types';
import type { BookingFormData } from '../types';

interface BookingConfirmationProps {
  therapist: Professional;
  formData: BookingFormData;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  therapist,
  formData,
}) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-bold text-green-900 mb-4">
          Appointment Confirmed!
        </h2>
        
        <div className="bg-white rounded-lg p-6 mb-6 text-left">
          <h3 className="text-xl font-semibold mb-4">Appointment Details</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-700">Therapist:</p>
              <p className="text-gray-900">{therapist.nom}</p>
            </div>
            
            <div>
              <p className="font-medium text-gray-700">Specialty:</p>
              <p className="text-gray-900">{therapist.specialite}</p>
            </div>
            
            <div>
              <p className="font-medium text-gray-700">Date & Time:</p>
              <p className="text-gray-900">
                {new Date(formData.date).toLocaleString('fr-FR')}
              </p>
            </div>
            
            <div>
              <p className="font-medium text-gray-700">Patient:</p>
              <p className="text-gray-900">{formData.prenom} {formData.nom}</p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          You will receive a confirmation email shortly. Please arrive 10 minutes before your appointment.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/professionals"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Professionals
          </a>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;