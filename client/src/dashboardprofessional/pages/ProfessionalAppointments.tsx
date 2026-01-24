import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, User, MessageCircle, FileText, ChevronRight } from 'lucide-react';

const ProfessionalAppointments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'pending' | 'upcoming'>('pending');

    const requests = [
        {
            id: 1,
            name: 'Sarah Parker',
            type: 'Initial Consultation',
            time: 'Tomorrow, 10:00 AM',
            status: 'Pending',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            reason: 'Experiencing anxiety and sleep issues recently.'
        },
        {
            id: 2,
            name: 'James Wilson',
            type: 'Follow-up Session',
            time: 'Jan 26, 2:30 PM',
            status: 'Pending',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
            reason: 'Progress check on cognitive behavioral therapy.'
        },
        {
            id: 3,
            name: 'Emma Thompson',
            type: 'Urgent Care',
            time: 'Jan 27, 09:15 AM',
            status: 'Pending',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
            reason: 'Having panic attacks frequently this week.'
        },
    ];

    const upcoming = [
        { id: 1, name: 'John Doe', type: 'Therapy Session', time: 'Today, 02:00 PM', duration: '1h', status: 'Confirmed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
        { id: 2, name: 'Michael Chen', type: 'Check-up', time: 'Tomorrow, 11:30 AM', duration: '30m', status: 'Confirmed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
        { id: 3, name: 'Lisa Anderson', type: 'Consultation', time: 'Jan 26, 04:00 PM', duration: '45m', status: 'Confirmed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Appointment Requests</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'pending' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        Pending ({requests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        Upcoming ({upcoming.length})
                    </button>
                </div>
            </div>

            {activeTab === 'pending' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {requests.map((req) => (
                        <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 rounded-full border-2 border-orange-100 p-0.5">
                                        <img src={req.avatar} alt={req.name} className="w-full h-full rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{req.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Clock size={14} />
                                            <span>{req.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                                    Action Required
                                </span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Type:</span>
                                    <span className="font-medium text-gray-900">{req.type}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <span className="text-gray-500 text-sm block mb-1">Reason:</span>
                                    <p className="text-gray-700 text-sm italic">"{req.reason}"</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                    <CheckCircle size={18} /> Approve
                                </button>
                                <button className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    <XCircle size={18} /> Reject
                                </button>
                                <button className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors" title="View Details">
                                    <FileText size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'upcoming' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {upcoming.map((item) => (
                            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row items-center gap-6">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {item.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                                        <p className="text-sm text-gray-500">{item.type}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full sm:w-auto mt-4 sm:mt-0">
                                    <div className="text-center sm:text-right">
                                        <p className="font-bold text-gray-900">{item.time.split(',')[1]}</p>
                                        <p className="text-xs text-gray-500">{item.time.split(',')[0]} • {item.duration}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                            <MessageCircle size={18} />
                                        </button>
                                        <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessionalAppointments;