import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/availabilities';

export interface Availability {
    _id: string;
    user: string;
    start: string;
    end: string;
    summary: string;
    description?: string;
    colorId?: string;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const AvailabilityService = {
    addAvailability: async (data: Partial<Availability>): Promise<Availability> => {
        const response = await axios.post(`${API_URL}/add`, data, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getAvailabilities: async (professionalId?: string): Promise<Availability[]> => {
        const params = professionalId ? { professionalId } : {};
        const response = await axios.get(`${API_URL}/`, {
            params,
            headers: getAuthHeaders()
        });
        return response.data;
    },

    updateAvailability: async (id: string, data: Partial<Availability>): Promise<Availability> => {
        const response = await axios.put(`${API_URL}/${id}`, data, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    deleteAvailability: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeaders()
        });
    }
};

export default AvailabilityService;
