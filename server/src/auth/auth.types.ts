
// ==================== REQUEST BODIES ====================
export interface SignupBody {
  nom: string;
  email: string;
  mdp: string;
  dateNaissance?: string;
  adresse?: string;
  telephone?: string;
  role: 'patient' | 'professional';
  specialite?: string;
  situation_professionnelle?: string;
  intitule_diplome?: string;
  nom_etablissement?: string;
  date_obtention_diplome?: string;
  biographie?: string;
}

export interface LoginBody {
  email: string;
  mdp: string;
  reactivate?: boolean;
}

export interface RequestBody {
  specialite: string;
  situation_professionnelle: string;
  intitule_diplome: string;
  nom_etablissement: string;
  date_obtention_diplome: string;
  biographie: string;
}

// ==================== SERVICE DATA ====================
export interface SignupData {
 nom: string;
  email: string;
  mdp: string;
  dateNaissance?: Date;
  adresse?: string;
  telephone?: string;
  role?: 'patient' | 'professional'; 
  specialite?: string;
  situation_professionnelle?: string;
  intitule_diplome?: string;
  nom_etablissement?: string;
  date_obtention_diplome?: Date;
  biographie?: string;
}
 
export interface LoginData {
  email: string;
  mdp: string;
  reactivate?: boolean;
}

export interface RequestData {
  specialite: string;
  situation_professionnelle: string;
  intitule_diplome: string;
  nom_etablissement: string;
  date_obtention_diplome: string;
  biographie: string;
}

// ==================== RESPONSE TYPES ====================
export interface AuthResponse {
  success: boolean;
  message: string;
  userType?: 'patient' | 'professional';
  token?: string;
  role?: string;
  user?: any; // User sans mot de passe
}

export interface LoginResponse {
  success: boolean;
  token: string;
  role: string;
  user: any;
  message?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface RequestResponse {
  success: boolean;
  message: string;
  requestId?: string;
}

export interface MeResponse {
  success: boolean;
  user: any;
}

// ==================== ERROR TYPES ====================
export interface ErrorWithReactivate {
  success: false;
  message: string;
  canReactivate: boolean;
}

export interface AuthError {
  success: false;
  message: string;
  code?: string;
}

// ==================== UTILITY TYPES ====================
export interface TokenPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  success: boolean;
  message: string;
  userType?: string;
  token?: string;
  role?: string;
}