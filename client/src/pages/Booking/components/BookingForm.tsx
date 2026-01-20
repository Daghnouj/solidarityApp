import React, { useState } from 'react';
import type { Professional } from '../../Professionals/types';
import PatientInfoForm from './PatientInfoForm';
import TimeSlotModal from './TimeSlotModal';
import BookingConfirmation from './BookingConfirmation';
import { useBooking } from '../hooks/useBooking';
import type { BookingFormData } from '../types';

interface BookingFormProps {
  therapist: Professional;
}

const BookingForm: React.FC<BookingFormProps> = ({ therapist }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    nom: "",
    prenom: "",
    email: "",
    ville: "",
    antecedentsMedicaux: "",
    probleme: "",
    phone: "",
    date: "",
    therapistId: therapist._id,
    therapeutename: therapist.nom,
    specialite: therapist.specialite,
  });

  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const { loading, error, success, submitBooking } = useBooking();

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date) => {
    setFormData(prev => ({ ...prev, date: date.toISOString() }));
    setShowTimeSlotModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitBooking(formData);
  };

  const isFormValid = () => {
    const requiredFields = [
      'nom', 'prenom', 'email', 'ville',
      'antecedentsMedicaux', 'probleme', 
      'phone', 'date'
    ];
    
    return requiredFields.every(field => 
      formData[field] && formData[field].trim() !== ''
    );
  };

  if (success) {
    return <BookingConfirmation therapist={therapist} formData={formData} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
        <PatientInfoForm
          formData={formData}
          onFormChange={handleFormChange}
          onTimeSlotClick={() => setShowTimeSlotModal(true)}
          onSubmit={handleSubmit}
          loading={loading}
          isFormValid={isFormValid()}
          selectedDate={formData.date ? new Date(formData.date) : null}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <TimeSlotModal
          show={showTimeSlotModal}
          onHide={() => setShowTimeSlotModal(false)}
          onDateSelect={handleDateSelect}
          therapistId={therapist._id}
        />
      </div>
    </div>
  );
};

export default BookingForm;