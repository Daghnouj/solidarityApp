import React from 'react';
import type { BookingFormData } from '../types';

interface Step3MedicalInfoProps {
    formData: BookingFormData;
    onFormChange: (field: string, value: string) => void;
}

const Step3MedicalInfo: React.FC<Step3MedicalInfoProps> = ({
    formData,
    onFormChange,
}) => {
    const medicalHistory = ['Diabetes', 'Hypertension', 'Cardiaque', 'None', 'Other'];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Medical Information</h2>
                <p className="text-gray-500">Help the therapist prepare for your session</p>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-6">
                <h3 className="text-[#4FB2E5] font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">ℹ️</span> Privacy Notice
                </h3>
                <p className="text-gray-600 text-sm">
                    Your medical information is encrypted and only visible to your chosen professional.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 ml-1 block">
                        Medical History <span className="text-[#FF90BC]">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={formData.antecedentsMedicaux}
                            onChange={(e) => onFormChange('antecedentsMedicaux', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4FB2E5] focus:ring-4 focus:ring-[#4FB2E5]/10 outline-none transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                            required
                        >
                            <option value="">Select relevant history</option>
                            {medicalHistory.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 ml-1 block">
                        Problem Description <span className="text-[#FF90BC]">*</span>
                    </label>
                    <textarea
                        value={formData.probleme}
                        onChange={(e) => onFormChange('probleme', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4FB2E5] focus:ring-4 focus:ring-[#4FB2E5]/10 outline-none transition-all duration-200 bg-gray-50 focus:bg-white min-h-[160px] resize-none"
                        placeholder="Please describe your symptoms, concerns, or reason for visit..."
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default Step3MedicalInfo;
