import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { TimeSlot } from '../types';

interface Step1TimeSelectionProps {
    onDateSelect: (date: Date) => void;
    therapistId: string;
    selectedDate: string;
}

const Step1TimeSelection: React.FC<Step1TimeSelectionProps> = ({
    onDateSelect,
    therapistId,
    selectedDate,
}) => {
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAvailableSlots();
    }, [therapistId]);

    const fetchAvailableSlots = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!therapistId) return;

            const API_URL = `${import.meta.env.VITE_API_URL}/availabilities/slots`;
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            const response = await axios.get(API_URL, {
                params: {
                    professionalId: therapistId,
                    date: tomorrow.toISOString()
                }
            });

            const slots = response.data.map((s: any) => ({
                id: s.id,
                start: new Date(s.start),
                end: new Date(s.end)
            }));

            setAvailableSlots(slots);
        } catch (err) {
            console.error('Failed to fetch time slots:', err);
            setError('Failed to load available slots. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Select an Appointment Time</h2>
                <p className="text-gray-500">Choose a convenient time for your session</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-[#F5A146] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {availableSlots.map((slot) => {
                        const isSelected = selectedDate === slot.start.toISOString();
                        return (
                            <button
                                key={slot.id}
                                onClick={() => onDateSelect(slot.start)}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden
                  ${isSelected
                                        ? 'border-[#F5A146] bg-[#F5A146]/10 shadow-md transform scale-[1.02]'
                                        : 'border-gray-200 hover:border-[#4FB2E5] hover:shadow-md'
                                    }`}
                            >
                                <div className="flex flex-col items-center">
                                    <div className={`text-lg font-bold mb-1 ${isSelected ? 'text-[#F5A146]' : 'text-gray-800 group-hover:text-[#4FB2E5]'}`}>
                                        {slot.start.toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {slot.start.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-[#F5A146] rounded-full"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-lg">No available time slots for the near future.</p>
                    <button
                        onClick={fetchAvailableSlots}
                        className="mt-4 text-[#4FB2E5] hover:text-[#3da0d1] font-medium"
                    >
                        Refresh Slots
                    </button>
                </div>
            )}
        </div>
    );
};

export default Step1TimeSelection;
