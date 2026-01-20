import React from 'react';
import type { BookingFormData } from '../types';

interface PatientInfoFormProps {
  formData: BookingFormData;
  onFormChange: (field: string, value: string) => void;
  onTimeSlotClick: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  isFormValid: boolean;
  selectedDate: Date | null;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({
  formData,
  onFormChange,
  onTimeSlotClick,
  onSubmit,
  loading,
  isFormValid,
  selectedDate,
}) => {
  const cities = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
    'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Kairouan',
    'Kasserine', 'Sidi Bouzid', 'Sousse', 'Monastir', 'Mahdia', 'Sfax',
    'Gafsa', 'Tozeur', 'Kébili', 'Gabès', 'Médenine', 'Tataouine'
  ];

  const medicalHistory = ['Diabetes', 'Hypertension', 'Cardiaque', 'Other'];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.prenom}
            onChange={(e) => onFormChange('prenom', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="First Name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => onFormChange('nom', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Last Name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onFormChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onFormChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Phone Number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <select
            value={formData.ville}
            onChange={(e) => onFormChange('ville', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical History
          </label>
          <select
            value={formData.antecedentsMedicaux}
            onChange={(e) => onFormChange('antecedentsMedicaux', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          >
            <option value="">Select Medical History</option>
            {medicalHistory.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Problem Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Problem Description
        </label>
        <textarea
          value={formData.probleme}
          onChange={(e) => onFormChange('probleme', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical min-h-32"
          placeholder="Please describe your problem..."
          required
        />
      </div>

      {/* Time Slot Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Appointment Time
        </label>
        <button
          type="button"
          onClick={onTimeSlotClick}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {selectedDate 
            ? selectedDate.toLocaleString('fr-FR')
            : 'Select Time Slot'}
        </button>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="px-8 py-4 bg-yellow-500 text-gray-900 rounded-full font-semibold hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              Booking...
            </div>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </div>
    </form>
  );
};

export default PatientInfoForm;