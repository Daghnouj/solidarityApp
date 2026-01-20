import { useState, useEffect } from 'react';
import type { Professional } from '../pages/Professionals/types';
import { mockProfessionals } from '../pages/Professionals/data/mockProfessionals';

interface UseProfessionalResult {
  professional: Professional | null;
  loading: boolean;
  error: string | null;
}

export const useProfessional = (id: string | undefined): UseProfessionalResult => {
  const [state, setState] = useState<UseProfessionalResult>({
    professional: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) {
      setState({ professional: null, loading: false, error: 'No professional ID provided' });
      return;
    }

    const fetchProfessional = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundProfessional = mockProfessionals.find(pro => pro._id === id);
        
        if (!foundProfessional) {
          setState({ professional: null, loading: false, error: 'Professional not found' });
          return;
        }

        setState({ professional: foundProfessional, loading: false, error: null });
      } catch (err) {
        setState({ 
          professional: null, 
          loading: false, 
          error: err instanceof Error ? err.message : 'Failed to load professional' 
        });
      }
    };

    fetchProfessional();
  }, [id]);

  return state;
};