import React from 'react';
import { Calendar, Activity, TrendingUp, Clock, ArrowRight } from 'lucide-react';

const UserOverview: React.FC = () => {
    const stats = [
        { label: 'Upcoming Sessions', value: '3', icon: Calendar, color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50', iconColor: 'text-blue-600', trend: '+1 this week' },
        { label: 'Wellness Score', value: '8.2', icon: Activity, color: 'from-orange-500 to-orange-600', lightColor: 'bg-orange-50', iconColor: 'text-orange-600', trend: '+0.4 average' },
        { label: 'Engagement', value: '85%', icon: TrendingUp, color: 'from-green-500 to-green-600', lightColor: 'bg-green-50', iconColor: 'text-green-600', trend: 'On track' },
        { label: 'Total Time', value: '12h', icon: Clock, color: 'from-purple-500 to-purple-600', lightColor: 'bg-purple-50', iconColor: 'text-purple-600', trend: 'Last 30 days' },
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">John</span>
                    </h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your wellness journey today.</p>
                </div>
                <button className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold shadow-lg shadow-gray-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                    Find a Specialist
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.lightColor} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={22} className={stat.iconColor} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Section */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Your Schedule</h3>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            View all <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { doctor: "Dr. Sarah Johnson", type: "Psychology Session", time: "Tomorrow at 10:00 AM", status: "Confirmed", bg: "bg-blue-50", text: "text-blue-700" },
                            { doctor: "Dr. Ahmed Ben Ali", type: "General Consultation", time: "Jan 28, 2:00 PM", status: "Pending", bg: "bg-orange-50", text: "text-orange-700" }
                        ].map((ppt, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-md group">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-gray-400 font-bold text-xl shadow-sm border border-gray-100 group-hover:border-blue-200 transition-colors">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ppt.doctor}`}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{ppt.doctor}</h4>
                                        <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-0.5">
                                            {ppt.type}
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            {ppt.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0 flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${ppt.bg} ${ppt.text}`}>
                                        {ppt.status}
                                    </span>
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Daily Tip / Right Column */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 rounded-2xl text-white shadow-lg shadow-blue-200 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl -ml-6 -mb-6"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold mb-6">
                            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                            Daily Wellness Tip
                        </div>

                        <h3 className="text-2xl font-bold mb-4 leading-tight">Small steps lead to big changes.</h3>
                        <p className="text-white/80 leading-relaxed mb-8">
                            Take 5 minutes today to practice deep breathing. It reduces cortisol and helps reset your focus.
                        </p>
                    </div>

                    <button className="w-full py-3 bg-white text-blue-700 rounded-xl font-bold text-sm shadow-xl hover:bg-gray-50 transition-colors relative z-10">
                        Read More Tips
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default UserOverview;
