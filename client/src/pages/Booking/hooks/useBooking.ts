import { useState } from 'react';
import axios from 'axios';
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
      const API_URL = `${import.meta.env.VITE_API_URL}/appointments`;
      const token = localStorage.getItem('token');

      // Map Booking form to backend payload
      const payload = {
        professional: formData.therapistId,
        time: formData.date,
        type: 'Consultation',
        reason: formData.probleme,
        // Optional extra patient info snapshot (if backend chooses to store later)
        // nom: formData.nom,
        // prenom: formData.prenom,
        // email: formData.email,
        // ville: formData.ville,
        // antecedentsMedicaux: formData.antecedentsMedicaux,
        // phone: formData.phone,
      };

      await axios.post(API_URL, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setState({ loading: false, error: null, success: true });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Booking failed';
      setState({ loading: false, error: message, success: false });
    }
  };

  return { ...state, submitBooking };
};