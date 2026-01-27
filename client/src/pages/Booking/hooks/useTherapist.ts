import { useState, useEffect } from 'react';
import type { Professional } from '../../Professionals/types';
import { getProfessionalById } from '../../Professionals/services/professionalsService';

interface UseTherapistResult {
  therapist: Professional | null;
  loading: boolean;
  error: string | null;
}

export const useTherapist = (therapistId: string | undefined): UseTherapistResult => {
  const [state, setState] = useState<UseTherapistResult>({
    therapist: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!therapistId) {
      setState({ therapist: null, loading: false, error: 'No therapist ID provided' });
      return;
    }

    const fetchTherapist = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await getProfessionalById(therapistId);
        if (!data || !(data as any)._id) {
          setState({ therapist: null, loading: false, error: 'Therapist not found' });
          return;
        }
        // Ensure shape matches Professional interface
        const therapist: Professional = {
          _id: (data as any)._id,
          nom: (data as any).nom,
          specialite: (data as any).specialite,
          adresse: (data as any).adresse,
          photo: (data as any).photo,
          email: (data as any).email,
          telephone: (data as any).telephone,
          bio: (data as any).bio,
          services: (data as any).services,
        };
        setState({ therapist, loading: false, error: null });
      } catch (err) {
        setState({
          therapist: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load therapist',
        });
      }
    };

    fetchTherapist();
  }, [therapistId]);

  return state;
};