import { useState, useEffect } from 'react';

interface Professional {
    id: string;
    name: string;
    specialty: string;
    bio?: string;
    email?: string;
    phone?: string;
    location?: string;
    experience?: string;
    education?: string;
    languages?: string[];
    services?: Array<{
        name: string;
        description: string;
        price?: string;
    }>;
    availability?: string;
    image?: string;
    rating?: number;
    reviewsCount?: number;
}

interface UseProfessionalReturn {
    professional: Professional | null;
    loading: boolean;
    error: string | null;
}

export const useProfessional = (id: string | undefined): UseProfessionalReturn => {
    const [professional, setProfessional] = useState<Professional | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfessional = async () => {
            if (!id) {
                setError('No professional ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const API_BASE_URL = import.meta.env.VITE_API_URL;
                const response = await fetch(`${API_BASE_URL}/professionals/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch professional');
                }

                const data = await response.json();
                setProfessional(data);
            } catch (err) {
                console.error('Error fetching professional:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
                setProfessional(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfessional();
    }, [id]);

    return { professional, loading, error };
};
