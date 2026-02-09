import React, { useState } from 'react';
import type { Professional } from '../../Professionals/types';
import BookingSteps from './BookingSteps';
import Step1TimeSelection from './Step1TimeSelection';
import Step2PersonalDetails from './Step2PersonalDetails';
import Step3MedicalInfo from './Step3MedicalInfo';
import Step4Confirmation from './Step4Confirmation';
import BookingConfirmation from './BookingConfirmation';
import { useBooking } from '../hooks/useBooking';
import type { BookingFormData } from '../types';

interface BookingFormProps {
  therapist: Professional;
}

const BookingForm: React.FC<BookingFormProps> = ({ therapist }) => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const { loading, error, success, submitBooking } = useBooking();

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date) => {
    setFormData(prev => ({ ...prev, date: date.toISOString() }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitBooking(formData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!formData.date;
      case 2:
        return !!formData.nom && !!formData.prenom && !!formData.email && !!formData.phone && !!formData.ville;
      case 3:
        return !!formData.antecedentsMedicaux && !!formData.probleme;
      default:
        return true;
    }
  };

  if (success) {
    return <BookingConfirmation therapist={therapist} formData={formData} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <BookingSteps currentStep={currentStep} totalSteps={4} />

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 lg:p-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <Step1TimeSelection
                onDateSelect={(date) => {
                  handleDateSelect(date);
                }}
                therapistId={therapist._id}
                selectedDate={formData.date}
              />
            )}
            {currentStep === 2 && (
              <Step2PersonalDetails
                formData={formData}
                onFormChange={handleFormChange}
              />
            )}
            {currentStep === 3 && (
              <Step3MedicalInfo
                formData={formData}
                onFormChange={handleFormChange}
              />
            )}
            {currentStep === 4 && (
              <Step4Confirmation
                formData={formData}
                therapist={therapist}
                onSubmit={handleSubmit}
                loading={loading}
              />
            )}
          </div>

          <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-100">
            <button
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300
                ${currentStep === 1
                  ? 'opacity-0 cursor-default'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
            >
              ← Back
            </button>

            {currentStep < 4 && (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-10 py-3 rounded-full font-bold shadow-lg transition-all duration-300 flex items-center gap-2
                  ${!isStepValid()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-[#4FB2E5] text-white hover:bg-[#3da0d1] hover:shadow-[#4FB2E5]/30 transform hover:-translate-y-1'}`}
              >
                Next Step →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
