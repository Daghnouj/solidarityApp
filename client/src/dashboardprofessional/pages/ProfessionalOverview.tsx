import React, { useState, useEffect } from 'react';
import { Calendar, Users, Activity, Clock, MoreVertical, RefreshCw } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ProfessionalOverview: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/appointments/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Refresh stats to reflect changes
                fetchStats();
                // Close modal
                setSelectedAppointment(null);
                // Optionally show success message
                alert(`Appointment ${newStatus}`);
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const stats = [
        { label: 'Total Patients', value: data?.totalPatients?.toString() || '0', icon: Users, color: 'bg-blue-500', trend: '+5 this month' },
        { label: 'Appointments', value: data?.appointmentsToday?.toString() || '0', icon: Calendar, color: 'bg-orange-500', trend: 'Today' },
        { label: 'Rating', value: data?.rating?.toString() || '4.9', icon: Activity, color: 'bg-green-500', trend: 'Excellent' },
        { label: 'Hours', value: data?.totalHours?.toString() || '0', icon: Clock, color: 'bg-purple-500', trend: 'This week' },
    ];

    const todayAppointments = data?.todaySchedule?.map((apt: any) => ({
        time: new Date(apt.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        patient: apt.patient?.nom || 'Unknown',
        type: apt.type || 'Consultation',
        status: apt.status === 'confirmed' ? 'In Progress' : apt.status === 'completed' ? 'Completed' : 'Pending'
    })) || [];

    const recentRequests = data?.recentRequests || [];

    if (loading) return <div className="flex justify-center p-10"><RefreshCw className="animate-spin text-blue-500" /></div>;

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
                        {todayAppointments.length > 0 ? (
                            todayAppointments.map((apt: any, index: number) => (
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
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No appointments today</p>
                        )}
                    </div>
                </div>

                {/* Notifications / Requests */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Requests</h3>
                    <div className="space-y-4">
                        {recentRequests.length > 0 ? (
                            recentRequests.map((req: any, i: number) => (
                                <div
                                    key={i}
                                    className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors"
                                    onClick={() => setSelectedAppointment(req)}
                                >
                                    <div className="flex gap-3 mb-2">
                                        <img
                                            src={req.patient?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.patient?.nom}`}
                                            alt="User"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-900">{req.patient?.nom}</h4>
                                            <p className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusUpdate(req._id, 'confirmed');
                                            }}
                                            className="flex-1 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusUpdate(req._id, 'cancelled');
                                            }}
                                            className="flex-1 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Fallback to static if no data, or show empty state? User said "change nothing" so maybe keep the static ones if empty? 
                               Actually, dynamic means dynamic. I'll stick to dynamic empty state. */
                            <p className="text-gray-500 text-center">No recent requests</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
                        <button
                            onClick={() => setSelectedAppointment(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 mb-6">Appointment Request</h3>

                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src={selectedAppointment.patient?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAppointment.patient?.nom}`}
                                alt="User"
                                className="w-16 h-16 rounded-full bg-gray-100"
                            />
                            <div>
                                <h4 className="font-bold text-lg text-gray-900">{selectedAppointment.patient?.nom}</h4>
                                <p className="text-gray-500 text-sm">{selectedAppointment.patient?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-gray-700">
                                <Calendar className="text-blue-500" size={20} />
                                <span className="font-medium">{new Date(selectedAppointment.time).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Clock className="text-orange-500" size={20} />
                                <span className="font-medium">{new Date(selectedAppointment.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Activity className="text-green-500" size={20} />
                                <span className="font-medium">{selectedAppointment.type || 'Consultation'}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleStatusUpdate(selectedAppointment._id, 'confirmed')}
                                className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Accept Request
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedAppointment._id, 'cancelled')}
                                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessionalOverview;
