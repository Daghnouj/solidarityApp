import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, Plus, Check } from 'lucide-react';

const ProfessionalSchedule: React.FC = () => {
    const [showAddAvailability, setShowAddAvailability] = useState(false);

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const appointments = [
        { time: '09:00 AM', patient: 'John Doe', type: 'Consultation', duration: '1h', color: 'bg-blue-100 border-blue-200 text-blue-700' },
        { time: '11:00 AM', patient: 'Jane Smith', type: 'Follow-up', duration: '30m', color: 'bg-green-100 border-green-200 text-green-700' },
        { time: '02:00 PM', patient: 'Mike Johnson', type: 'Therapy', duration: '1h', color: 'bg-purple-100 border-purple-200 text-purple-700' },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Calendar</h2>

                <div className="flex gap-3">
                    <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
                        <button className="p-1 hover:bg-gray-100 rounded-lg">
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        <span className="px-4 font-semibold text-gray-700">Jan 24, 2026</span>
                        <button className="p-1 hover:bg-gray-100 rounded-lg">
                            <ChevronRight size={20} className="text-gray-600" />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowAddAvailability(!showAddAvailability)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                        {showAddAvailability ? <Check size={18} /> : <Plus size={18} />}
                        {showAddAvailability ? 'Done' : 'Add Availability'}
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
                {/* Availability Overlay */}
                {showAddAvailability && (
                    <div className="absolute top-0 left-0 w-full bg-blue-50/90 z-20 p-4 border-b border-blue-200 flex items-center justify-between animate-fadeIn">
                        <div className="flex items-center gap-3 text-blue-800">
                            <Clock size={20} />
                            <span className="font-semibold">Click on time slots to mark them as available</span>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-[80px_1fr] divide-x divide-gray-100">
                        {/* Time Column */}
                        <div className="space-y-12 pr-4 pt-4">
                            {timeSlots.map((time) => (
                                <div key={time} className="text-xs font-medium text-gray-400 text-right">{time}</div>
                            ))}
                        </div>

                        {/* Schedule Grid */}
                        <div className="relative pl-4 pt-4 space-y-4">
                            {/* Grid Lines */}
                            {timeSlots.map((_, i) => (
                                <div
                                    key={i}
                                    className={`absolute left-0 w-full border-t cursor-pointer transition-colors ${i % 2 === 0 && showAddAvailability ? 'bg-green-50/50' : ''} ${showAddAvailability ? 'hover:bg-blue-100' : ''}`}
                                    style={{ top: `${i * 3 + 1}rem`, height: '3rem', borderTop: '1px solid #f3f4f6' }}
                                />
                            ))}

                            {/* Appointment Blocks */}
                            {appointments.map((apt, index) => (
                                <div
                                    key={index}
                                    className={`relative p-4 rounded-xl border-l-4 ${apt.color} mb-4 hover:shadow-md transition-shadow cursor-pointer z-10`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-sm mb-1">{apt.patient}</h4>
                                            <p className="text-xs opacity-80">{apt.type}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1 text-xs opacity-80">
                                                <Clock size={12} />
                                                {apt.time} ({apt.duration})
                                            </div>
                                            <div className="flex items-center gap-1 text-xs opacity-80">
                                                <User size={12} />
                                                View Profile
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
