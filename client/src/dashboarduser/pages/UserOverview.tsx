import React from 'react';
import { Calendar, Activity, TrendingUp, Clock } from 'lucide-react';

const UserOverview: React.FC = () => {
    const stats = [
        { label: 'Appointments', value: '3', icon: Calendar, color: 'bg-blue-500', trend: '+1 this week' },
        { label: 'Mood Score', value: '8.2', icon: Activity, color: 'bg-orange-500', trend: '+0.4 average' },
        { label: 'Progress', value: '85%', icon: TrendingUp, color: 'bg-green-500', trend: 'On track' },
        { label: 'Session Time', value: '45m', icon: Clock, color: 'bg-purple-500', trend: 'Avg duration' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                                <stat.icon size={24} className={`${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Calendar className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Dr. Sarah Johnson</h4>
                                    <p className="text-sm text-gray-500">Psychology Session • Tomorrow at 10:00 AM</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserOverview;
