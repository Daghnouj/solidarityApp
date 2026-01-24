import React, { useState } from 'react';
import AvailabilityService from '../services/availability.service';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, Check, Trash2 } from 'lucide-react';

const ProfessionalSchedule: React.FC = () => {
    const [showAddAvailability, setShowAddAvailability] = useState(false);
    const [availabilities, setAvailabilities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00'
    ];

    const fetchAvailabilities = async () => {
        try {
            setLoading(true);
            // Fetch for current logged in professional
            const data = await AvailabilityService.getAvailabilities();
            setAvailabilities(data);
        } catch (error) {
            console.error("Error fetching availabilities:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAvailabilities();
    }, []);

    const handlePrevDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const handleAddSlot = async (time: string) => {
        if (!showAddAvailability) return;

        try {
            const [hours, minutes] = time.split(':').map(Number);

            const start = new Date(selectedDate);
            start.setHours(hours, minutes, 0, 0);

            const end = new Date(selectedDate);
            end.setHours(hours + 1, minutes, 0, 0);

            await AvailabilityService.addAvailability({
                start: start.toISOString(),
                end: end.toISOString(),
                summary: "Available Slot"
            });
            fetchAvailabilities();
        } catch (error) {
            console.error("Error adding slot:", error);
        }
    };

    const handleDeleteSlot = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Delete this availability slot?')) {
            try {
                await AvailabilityService.deleteAvailability(id);
                fetchAvailabilities();
            } catch (error) {
                console.error("Error deleting slot:", error);
            }
        }
    };

    // Helper to check if a slot is filled
    const getSlotEvent = (time: string) => {
        return availabilities.find(a => {
            const eventStart = new Date(a.start);

            // Check if same date
            const isSameDate = eventStart.getDate() === selectedDate.getDate() &&
                eventStart.getMonth() === selectedDate.getMonth() &&
                eventStart.getFullYear() === selectedDate.getFullYear();

            if (!isSameDate) return false;

            const hour = eventStart.getHours().toString().padStart(2, '0');
            const minute = eventStart.getMinutes().toString().padStart(2, '0');
            return `${hour}:${minute}` === time;
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Availability Calendar</h2>

                <div className="flex gap-3">
                    <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
                        <button onClick={handlePrevDay} className="p-1 hover:bg-gray-100 rounded-lg">
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        <span className="px-4 font-semibold text-gray-700">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <button onClick={handleNextDay} className="p-1 hover:bg-gray-100 rounded-lg">
                            <ChevronRight size={20} className="text-gray-600" />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowAddAvailability(!showAddAvailability)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${showAddAvailability ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        {showAddAvailability ? <Check size={18} /> : <Plus size={18} />}
                        {showAddAvailability ? 'Done Editing' : 'Edit Availability'}
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
                {/* Availability Overlay */}
                {showAddAvailability && (
                    <div className="absolute top-0 left-0 w-full bg-blue-50/90 z-20 p-4 border-b border-blue-200 flex items-center justify-between animate-fadeIn">
                        <div className="flex items-center gap-3 text-blue-800">
                            <Clock size={20} />
                            <span className="font-semibold">Click on expected start times to add 1-hour availability slots</span>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="text-center p-10 text-gray-500">Loading schedule...</div>
                    ) : (
                        <div className="grid grid-cols-[80px_1fr] divide-x divide-gray-100">
                            {/* Time Column */}
                            <div className="space-y-12 pr-4 pt-4">
                                {timeSlots.map((time) => (
                                    <div key={time} className="text-xs font-medium text-gray-400 text-right h-12 flex items-center justify-end">{time}</div>
                                ))}
                            </div>

                            {/* Schedule Grid */}
                            <div className="relative pl-4 pt-4 space-y-4">
                                {timeSlots.map((time, i) => {
                                    const event = getSlotEvent(time);
                                    return (
                                        <div
                                            key={time}
                                            onClick={() => handleAddSlot(time)}
                                            className={`relative h-12 border-b border-gray-100 transition-all 
                                                ${showAddAvailability ? 'hover:bg-blue-50 cursor-pointer' : ''}
                                            `}
                                        >
                                            {event && (
                                                <div
                                                    className="absolute inset-x-2 top-1 bottom-1 bg-green-100 border-l-4 border-green-500 rounded p-2 text-xs text-green-800 font-medium flex justify-between items-center z-10"
                                                    onClick={(e) => e.stopPropagation()} // Prevent adding slot when clicking event
                                                >
                                                    <span>Available ({new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                                                    {showAddAvailability && (
                                                        <button
                                                            onClick={(e) => handleDeleteSlot(event.id, e)}
                                                            className="bg-white/50 p-1 rounded-full hover:bg-red-100 text-red-600"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default ProfessionalSchedule;
