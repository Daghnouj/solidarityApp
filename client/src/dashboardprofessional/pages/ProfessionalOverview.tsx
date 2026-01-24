import React from 'react';
import { Calendar, Users, Activity, Clock, MoreVertical } from 'lucide-react';

const ProfessionalOverview: React.FC = () => {
    const stats = [
        { label: 'Total Patients', value: '124', icon: Users, color: 'bg-blue-500', trend: '+5 this month' },
        { label: 'Appointments', value: '5', icon: Calendar, color: 'bg-orange-500', trend: 'Today' },
        { label: 'Rating', value: '4.9', icon: Activity, color: 'bg-green-500', trend: 'Excellent' },
        { label: 'Hours', value: '32', icon: Clock, color: 'bg-purple-500', trend: 'This week' },
    ];

    const todayAppointments = [
        { time: '09:00 AM', patient: 'John Doe', type: 'Initial Consultation', status: 'Completed' },
        { time: '10:30 AM', patient: 'Jane Smith', type: 'Follow-up', status: 'In Progress' },
        { time: '02:00 PM', patient: 'Mike Johnson', type: 'Therapy Session', status: 'Pending' },
        { time: '04:00 PM', patient: 'Emily Davis', type: 'Check-up', status: 'Pending' }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                                <stat.icon size={24} className={`${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Today's Schedule</h3>
                        <button className="text-sm text-blue-600 font-semibold hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {todayAppointments.map((apt, index) => (
                            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="w-20 font-semibold text-gray-700">{apt.time}</div>
                                <div className="flex-1 px-4 border-l border-gray-200 ml-4">
                                    <h4 className="font-semibold text-gray-900">{apt.patient}</h4>
                                    <p className="text-sm text-gray-500">{apt.type}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                        apt.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-orange-100 text-orange-700'
                                    }`}>
                                    {apt.status}
                                </span>
                                <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications / Requests */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Requests</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                <div className="flex gap-3 mb-2">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Req${i}`} alt="User" className="w-8 h-8 rounded-full" />
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-900">New Appointment Request</h4>
                                        <p className="text-xs text-gray-500">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button className="flex-1 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">Accept</button>
                                    <button className="flex-1 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50">Decline</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalOverview;
