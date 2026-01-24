import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/appointments';

export interface Appointment {
    _id: string;
    professional: any; // User object
    patient: any; // User object
    time: string;
    duration?: string;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
    type: string;
    reason?: string;
    summary?: string;
    createdAt: string;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AppointmentService = {
    getProfessionalAppointments: async (status?: string): Promise<Appointment[]> => {
        const params = status ? { status } : {};
        const response = await axios.get(`${API_URL}/professional`, {
            params,
            headers: getAuthHeaders()
        });
        return response.data;
    },

    updateStatus: async (id: string, status: string): Promise<Appointment> => {
        const response = await axios.patch(`${API_URL}/${id}/status`, { status }, {
            headers: getAuthHeaders()
        });
        return response.data;
    }
};

export default AppointmentService;
