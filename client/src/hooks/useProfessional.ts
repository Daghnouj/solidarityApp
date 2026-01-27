import { useState, useEffect } from 'react';
import { getProfessionalById } from '../pages/Professionals/services/professionalsService';

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

                const data = await getProfessionalById(id);
                setProfessional({
                    id: (data as any)._id || (data as any).id,
                    name: (data as any).nom,
                    specialty: (data as any).specialite,
                    bio: (data as any).bio,
                    email: (data as any).email,
                    phone: (data as any).telephone,
                    location: (data as any).clinicAddress || (data as any).adresse,
                    languages: (data as any).languages,
                    services: (data as any).services,
                    image: (data as any).photo,
                });
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
