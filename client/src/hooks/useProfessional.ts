import { useState, useEffect } from 'react';
import { getProfessionalById } from '../pages/Professionals/services/professionalsService';
import type { Professional } from '../pages/Professionals/types';

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

                const data = await getProfessionalById(id);
                // Assume data matches the shape, or simple cast if we are confident the API returns the fields
                setProfessional(data as unknown as Professional);
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
