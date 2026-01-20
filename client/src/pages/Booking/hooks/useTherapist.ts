import { useState, useEffect } from 'react';
import type { Professional } from '../../Professionals/types';
import { mockProfessionals } from '../../Professionals/data/mockProfessionals';

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
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundTherapist = mockProfessionals.find(pro => pro._id === therapistId);
        
        if (!foundTherapist) {
          setState({ therapist: null, loading: false, error: 'Therapist not found' });
          return;
        }

        setState({ therapist: foundTherapist, loading: false, error: null });
      } catch (err) {
        setState({ 
          therapist: null, 
          loading: false, 
          error: err instanceof Error ? err.message : 'Failed to load therapist' 
        });
      }
    };

    fetchTherapist();
  }, [therapistId]);

  return state;
};