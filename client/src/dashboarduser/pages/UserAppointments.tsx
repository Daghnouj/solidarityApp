import React from 'react';
import { Calendar, Clock, MapPin, Video, Phone } from 'lucide-react';

const UserAppointments: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                    Book New Appointment
                </button>
            </div>

            <div className="grid gap-4">
                {/* Upcoming Appointment */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-orange-500 border-gray-100">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl">
                                24
                                <span className="text-xs font-normal ml-1">Jan</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Dr. Sarah Johnson</h3>
                                <p className="text-blue-600 font-medium">Psychology Session</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Clock size={16} /> 10:00 AM</span>
                                    <span className="flex items-center gap-1"><Video size={16} /> Online Meeting</span>
                                </div>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Confirmed</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                        <button className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors">
                            Join Call
                        </button>
                        <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50">
                            Reschedule
                        </button>
                    </div>
                </div>

                {/* Past Appointment */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-75">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 font-bold text-xl">
                                12
                                <span className="text-xs font-normal ml-1">Jan</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Dr. Ahmed Ben Ali</h3>
                                <p className="text-gray-600 font-medium">General Checkup</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Clock size={16} /> 2:30 PM</span>
                                    <span className="flex items-center gap-1"><MapPin size={16} /> Health Center A</span>
                                </div>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">Completed</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAppointments;
