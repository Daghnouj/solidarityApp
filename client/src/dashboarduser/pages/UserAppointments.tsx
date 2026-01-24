import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Filter, MoreHorizontal } from 'lucide-react';

const UserAppointments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    const appointments = [
        {
            id: 1,
            doctor: "Dr. Sarah Johnson",
            specialty: "Psychology Session",
            date: "Jan 24, 2024",
            time: "10:00 AM",
            type: "In-Person",
            location: "Wellness Center A",
            status: "Confirmed",
            avatar: "Sarah"
        },
        {
            id: 2,
            doctor: "Dr. Ahmed Ben Ali",
            specialty: "General Checkup",
            date: "Jan 28, 2024",
            time: "02:00 PM",
            type: "In-Person",
            location: "Health Center B",
            status: "Pending",
            avatar: "Ahmed"
        }
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your upcoming and past sessions.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="flex-1 md:flex-none bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gray-200">
                        Book New
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200">
                {['upcoming', 'past', 'canceled'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 text-sm font-medium capitalize transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Appointment Cards */}
            <div className="grid gap-4">
                {activeTab === 'upcoming' ? (
                    appointments.map((ppt) => (
                        <div key={ppt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                {/* Doctor Info */}
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-blue-100">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ppt.avatar}`}
                                            alt={ppt.doctor}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-gray-900">{ppt.doctor}</h3>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ${ppt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {ppt.status}
                                            </span>
                                        </div>
                                        <p className="text-blue-600 font-medium text-sm">{ppt.specialty}</p>

                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                                <Calendar size={14} className="text-gray-400" /> {ppt.date}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                                <Clock size={14} className="text-gray-400" /> {ppt.time}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                                <MapPin size={14} className="text-gray-400" />
                                                {ppt.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 md:self-center pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                    <button className="flex-1 md:flex-none px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                                        Reschedule
                                    </button>
                                    <button className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No {activeTab} appointments</h3>
                        <p className="text-gray-500 text-sm mt-1">Your appointment history will appear here.</p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default UserAppointments;
