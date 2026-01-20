// src/pages/auth/auth.types.ts

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
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
  recaptchaToken: string;
  document?: File;
}

export interface LoginData {
  email: string;
  password: string;
  recaptchaToken: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SocialAuthResponse {
  user: User;
  token: string;
  isNewUser: boolean;
}