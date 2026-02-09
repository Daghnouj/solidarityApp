import React from 'react';
import type { BookingFormData } from '../types';
import type { Professional } from '../../Professionals/types';

interface Step4ConfirmationProps {
    formData: BookingFormData;
    therapist: Professional;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

const Step4Confirmation: React.FC<Step4ConfirmationProps> = ({
    formData,
    therapist,
    onSubmit,
    loading,
}) => {
    const DetailRow = ({ label, value }: { label: string, value: string }) => (
        <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-medium">{label}</span>
            <span className="text-gray-900 font-semibold text-right">{value}</span>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Review & Confirm</h2>
                <p className="text-gray-500">Please verify your details before booking</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div>
                    <h3 className="text-[#F5A146] font-bold text-lg mb-4 flex items-center gap-2">
                        <span>📅</span> Appointment Details
                    </h3>
                    <DetailRow label="Professional" value={`Dr. ${therapist.nom}`} />
                    <DetailRow label="Specialty" value={therapist.specialite} />
                    <DetailRow
                        label="Date & Time"
                        value={formData.date ? new Date(formData.date).toLocaleString('fr-Fr', {
                            dateStyle: 'full',
                            timeStyle: 'short'
                        }) : '-'}
                    />
                </div>

                <div>
                    <h3 className="text-[#4FB2E5] font-bold text-lg mb-4 flex items-center gap-2">
                        <span>👤</span> Personal Information
                    </h3>
                    <DetailRow label="Name" value={`${formData.prenom} ${formData.nom}`} />
                    <DetailRow label="Email" value={formData.email} />
                    <DetailRow label="Phone" value={formData.phone} />
                    <DetailRow label="City" value={formData.ville} />
                </div>

                <div>
                    <h3 className="text-[#FF90BC] font-bold text-lg mb-4 flex items-center gap-2">
                        <span>⚕️</span> Medical Details
                    </h3>
                    <DetailRow label="History" value={formData.antecedentsMedicaux} />
                    <div className="py-3">
                        <span className="text-gray-500 font-medium block mb-2">Description</span>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg text-sm leading-relaxed">
                            {formData.probleme}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="relative overflow-hidden group w-full md:w-auto px-12 py-4 bg-[#F5A146] text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-[#e08e35] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1"
                >
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing Request...</span>
                        </div>
                    ) : (
                        <span className="text-lg">Confirm Appointment</span>
                    )}
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
            </div>
        </div>
    );
};

export default Step4Confirmation;
