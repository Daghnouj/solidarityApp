import type { Professional } from "../pages/Professionals/types";

export const normalizeProfessional = (professional: any): Professional => ({
  _id: professional._id || '',
  nom: professional.nom || '',
  specialite: professional.specialite || '',
  adresse: professional.adresse || '',
  email: professional.email || 'Not provided',
  telephone: professional.telephone || 'Not provided',
  bio: professional.bio || 'No biography available.',
  services: professional.services || [],
  photo: professional.photo,
});

export const validateProfessional = (professional: Professional): boolean => {
  return !!(professional._id && professional.nom && professional.specialite && professional.adresse);
};