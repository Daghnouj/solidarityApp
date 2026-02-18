import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ActivityCenter } from '../types';

interface BackendEvent {
    _id: string;
    name: string;
    images: string[];
    address: string;
    coordinates?: string;
    activities: Array<{
        name: string;
        day: string;
    }>;
    category?: string;
    description: string;
    website?: string;
    phone?: string;
    email?: string;
    participants?: string[];
    averageRating?: number;
    numberOfRatings?: number;
    createdAt: string;
    updatedAt: string;
}

export const useActivities = () => {
    const [centers, setCenters] = useState<ActivityCenter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await axios.get<{ success: boolean; data: BackendEvent[] }>(`${apiUrl}/events`);

                if (response.data.success) {
                    const adaptedCenters: ActivityCenter[] = response.data.data.map((event) => ({
                        _id: event._id,
                        name: event.name,
                        address: event.address,
                        description: event.description,
                        // Use event images or fallback
                        images: event.images && event.images.length > 0
                            ? event.images
                            : ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500'],
                        coordinates: event.coordinates,
                        activities: event.activities && event.activities.length > 0
                            ? event.activities
                            : [{ name: 'General Activity', day: 'Flexible' }],
                        website: event.website,
                        category: event.category,
                        phone: event.phone,
                        email: event.email,
                        participants: event.participants || [],
                        averageRating: event.averageRating || 0,
                        numberOfRatings: event.numberOfRatings || 0
                    }));

                    setCenters(adaptedCenters);
                }
            } catch (err) {
                console.error('Error fetching activities:', err);
                setError('Failed to load activity centers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    return { centers, loading, error };
};
