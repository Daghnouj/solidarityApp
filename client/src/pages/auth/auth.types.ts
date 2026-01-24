// src/pages/auth/auth.types.ts

export interface User {
  _id?: string;
  name: string;
  email: string;
  role?: string; // Added role
  birthday?: string;
  address?: string;
  phoneNumber?: string;
  isProfessional?: boolean;
  professionalInfo?: ProfessionalInfo;
  profilePicture?: string;
}

export interface ProfessionalInfo {
  specialty: string;
  professionalSituation: string;
  diplomaTitle: string;
  institutionName: string;
  graduationDate: string;
  biography: string;
  documentUrl?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  birthday: string;
  address: string;
  phoneNumber: string;
  isProfessional: boolean;
  professionalInfo?: ProfessionalInfo;
  document?: File;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
  success?: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userType?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}