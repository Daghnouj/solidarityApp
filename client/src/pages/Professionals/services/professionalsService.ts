import type { Professional } from '../types';
import { mockProfessionals } from '../data/mockProfessionals';

// Simulate API call with delay
export const getProfessionals = (): Promise<Professional[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProfessionals);
    }, 1000); // 1 second delay to simulate network
  });
};