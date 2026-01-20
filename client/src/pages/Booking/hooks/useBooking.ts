import { useState } from 'react';
import type { BookingFormData } from '../types';

interface UseBookingResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  submitBooking: (formData: BookingFormData) => Promise<void>;
}

export const useBooking = (): UseBookingResult => {
  const [state, setState] = useState<Omit<UseBookingResult, 'submitBooking'>>({
    loading: false,
    error: null,
    success: false,
  });

  const submitBooking = async (formData: BookingFormData) => {
    setState({ loading: true, error: null, success: false });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app: await axios.post('/api/booking', formData);
      console.log('Booking submitted:', formData);
      
      setState({ loading: false, error: null, success: true });
    } catch (err) {
      setState({ 
        loading: false, 
        error: err instanceof Error ? err.message : 'Booking failed', 
        success: false 
      });
    }
  };

  return { ...state, submitBooking };
};