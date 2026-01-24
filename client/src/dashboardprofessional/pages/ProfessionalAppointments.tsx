import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, User, MessageCircle, FileText, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ProfessionalAppointments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'pending' | 'upcoming'>('pending');
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch Pending
            const pendingRes = await fetch(`${API_BASE_URL}/appointments/professional?status=pending`, { headers });
            if (!pendingRes.ok) throw new Error('Failed to fetch pending requests');
            const pendingData = await pendingRes.json();

            // Fetch Upcoming
            const upcomingRes = await fetch(`${API_BASE_URL}/appointments/professional?status=upcoming`, { headers });
            if (!upcomingRes.ok) throw new Error('Failed to fetch upcoming appointments');
            const upcomingData = await upcomingRes.json();

            setPendingRequests(pendingData);
            setUpcomingAppointments(upcomingData);
        } catch (err: any) {
            console.error("Error fetching appointments:", err);
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                fetchAppointments(); // Refresh list
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert('Error updating status');
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Helper to format date/time
    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        let dayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (isToday) dayStr = 'Today';
        if (isTomorrow) dayStr = 'Tomorrow';

        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return `${dayStr}, ${timeStr}`;
    };

    if (loading) return <div className="flex justify-center p-10"><RefreshCw className="animate-spin text-blue-500" /></div>;
    if (error) return <div className="p-6 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle size={20} />{error}</div>;

    const requests = pendingRequests.map(req => ({
        id: req._id,
        name: req.patient?.nom || 'Unknown User',
        type: req.type || 'Consultation',
        time: formatDateTime(req.time),
        status: 'Pending',
        avatar: req.patient?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.patient?.nom}`,
        reason: req.reason || 'No reason provided'
    }));

    const upcoming = upcomingAppointments.map(apt => ({
        id: apt._id,
        name: apt.patient?.nom || 'Unknown User',
        type: apt.type || 'Consultation',
        time: formatDateTime(apt.time),
        duration: '1h', // Placeholder as duration might not be in model
        status: 'Confirmed',
        avatar: apt.patient?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apt.patient?.nom}`
    }));

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
                                <button
                                    onClick={() => handleStatusUpdate(req.id, 'confirmed')}
                                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} /> Approve
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(req.id, 'cancelled')}
                                    className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
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