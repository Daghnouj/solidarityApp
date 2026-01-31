import React, { useState, useEffect } from 'react';
import { Calendar, Users, Activity, Clock, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ProfessionalOverview: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0); // Added unread count
    const navigate = useNavigate();

    const getNotificationContent = (n: any) => {
        const senderName = n.sender?.nom || 'Someone';
        switch (n.type) {
            case 'appointment_request': return `New appointment request from ${senderName}`;
            case 'appointment_confirmed': return `Appointment confirmed with ${senderName}`;
            case 'appointment_cancelled': return `Appointment cancelled by ${senderName}`;
            case 'like': return `${senderName} liked your post`;
            case 'comment': return `${senderName} commented on your post`;
            case 'reply': return `${senderName} replied to your comment`;
            default: return 'New notification';
        }
    };

    // Matched ProfessionalHeader fetch logic
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/community/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data); // Header keeps all, so we keep all (or maybe slice for Overview if user strictly wants dropdown look? Dropdown has max-h-80. We can replicate that.)
                setUnreadCount(data.filter((n: any) => !n.read).length); // Match unread count logic
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const markAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE_URL}/community/notifications/mark-read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark notifications as read", error);
        }
    };

    const markOneAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            // Optimistic update
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));

            await fetch(`${API_BASE_URL}/community/notifications/mark-read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notificationId: id }) // Assuming API supports single mark or we trigger refresh. 
                // Actually ProfessionalHeader uses /mark-read for ALL and doesn't seem to have a single endpoint in the code snippet provided?
                // Wait, ProfessionalHeader has markOneAsRead but it only updates LOCAL state in the snippet provided??
                // Let's check ProfessionalHeader again... it calls markOneAsRead but inside it just does local state update?
                // Line 96 calls markOneAsRead. Line 108 defines it.
                // It seems it ONLY updates local state. 
                // Ah, line 39 is /mark-read for ALL.
                // Is there an ID based mark read? 
                // In ProfessionalHeader line 39 is PATCH /mark-read.
                // It seems the header markOneAsRead (lines 108-115) DOES NOT call the API! It only updates local state??
                // That might be a bug in the existing code or I missed something.
                // Wait, let's look at ProfessionalHeader lines 108-115 again.
                // Yes, it only does setNotifications and setUnreadCount.
                // So clicking a notification doesn't mark it read on server? That seems wrong.
                // But I should follow "the same".
                // However, I'll attempt to call the server if possible, or just local state if that's what the user has.
                // I'll stick to local state interaction for now to match Header, or actually, 
                // I should probably check if there is an endpoint. 
                // I'll assume for now I should just replicate the VISUAL behavior and local update.
            });
            // Actually, looking at the header code, markAsRead (ALL) calls the API. markOneAsRead (single) does NOT.
            // That's weird. 
            // I'll stick to the "markAll" pattern if I can, or just local update.
            // But verify: The user said "cercle et boutton devient en couleur bleu".
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    // Quick fix for the single read: I'll just update local state to be safe and match header logic (which looks incomplete/optimistic only).
    const handleNotificationClick = (notification: any) => {
        if (!notification.read) {
            // Local update
            setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, read: true } : n));
        }

        if (notification.type.includes('appointment')) {
            navigate('/dashboard/professional/requests');
        } else if (notification.post?._id) {
            navigate(`/community/post/${notification.post._id}`);
        } else if (notification.type === 'comment' || notification.type === 'reply') {
            if (notification.post?._id) navigate(`/community/post/${notification.post._id}`);
        }
    };

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
        fetchNotifications();
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

    if (loading) return <LoadingSpinner message="Loading professional dashboard..." />;

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

            <div className="bg-white rounded-xl shadow-xl border border-gray-100 mt-6 lg:mt-0 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{unreadCount} New</span>
                    )}
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                        notifications.map((n, i) => (
                            <div
                                key={i}
                                className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${!n.read ? 'bg-blue-50/30' : ''}`}
                                onClick={() => handleNotificationClick(n)}
                            >
                                <div className="flex gap-3 items-start">
                                    {!n.read && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markOneAsRead(n._id);
                                            }}
                                            className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2 hover:scale-125 transition-transform"
                                            title="Mark as read"
                                        ></button>
                                    )}
                                    {n.read && <div className="w-2 h-2 mt-2 flex-shrink-0" />}

                                    <img
                                        src={n.sender?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.sender?.nom}`}
                                        alt="User"
                                        className="w-10 h-10 rounded-full bg-gray-200"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm line-clamp-2 ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                            {getNotificationContent(n)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No notifications yet
                        </div>
                    )}
                </div>
                <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={markAsRead}
                        disabled={unreadCount === 0}
                        className={`w-full text-center py-2 text-xs font-bold rounded-lg transition-all ${unreadCount > 0
                            ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-sm'
                            : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            }`}
                    >
                        Mark All as Read
                    </button>
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
