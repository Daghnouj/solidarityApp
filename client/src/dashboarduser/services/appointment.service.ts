import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/appointments';

export interface Appointment {
    _id: string;
    professional?: any;
    patient?: any;
    time: string;
    duration?: string;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
    type: string;
    reason?: string;
    summary?: string;
    createdAt?: string;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const UserAppointmentService = {
    getMyAppointments: async (): Promise<Appointment[]> => {
        const response = await axios.get(`${API_URL}/my-appointments`, {
            headers: getAuthHeaders()
        });
        return response.data;
    }
};

export default UserAppointmentService;