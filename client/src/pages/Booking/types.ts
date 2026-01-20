export interface BookingFormData {
  nom: string;
  prenom: string;
  email: string;
  ville: string;
  antecedentsMedicaux: string;
  probleme: string;
  phone: string;
  date: string;
  therapistId: string;
  therapeutename: string;
  specialite: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  id: string;
}

export interface Therapist {
  _id: string;
  nom: string;
  specialite: string;
  // Add other therapist fields as needed
}