// src/pages/auth/services/auth.service.ts
import axios from "axios";
import type {
  RegisterData,
  LoginData,
  AuthResponse,
  RegisterResponse,
  User
} from "../auth.types";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AuthService = {
  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    const formData = new FormData();
    formData.append("nom", userData.name);
    formData.append("email", userData.email);
    formData.append("mdp", userData.password);
    formData.append("telephone", userData.phoneNumber);
    formData.append("adresse", userData.address);
    if (userData.birthday) {
      formData.append("dateNaissance", userData.birthday);
    }

    if (userData.isProfessional) {
      formData.append("role", "professional");
      if (userData.professionalInfo) {
        formData.append("specialite", userData.professionalInfo.specialty);
        formData.append("situation_professionnelle", userData.professionalInfo.professionalSituation);
        formData.append("intitule_diplome", userData.professionalInfo.diplomaTitle);
        formData.append("nom_etablissement", userData.professionalInfo.institutionName);
        formData.append("date_obtention_diplome", userData.professionalInfo.graduationDate);
        formData.append("biographie", userData.professionalInfo.biography);

        if (userData.document) {
          formData.append("documents", userData.document);
        }
      }
    } else {
      formData.append("role", "patient");
    }

    const response = await axios.post(`${API_URL}/signup`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/login`, {
      email: credentials.email,
      mdp: credentials.password
    });
    // Map backend 'nom' to frontend 'name'
    if (response.data.user && response.data.user.nom) {
      response.data.user.name = response.data.user.nom;
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.post(`${API_URL}/logout`, {}, {
      headers: getAuthHeaders()
    });
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/me`, {
      headers: getAuthHeaders()
    });
    // Map backend 'nom' to frontend 'name'
    if (response.data && response.data.nom) {
      response.data.name = response.data.nom;
    }
    return response.data;
  },

  // Password Management
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string; id?: string }> => {
    const response = await axios.post(`${API_URL}/password/forgot-password`, {
      email,
      userType: 'user'
    });
    return response.data;
  },

  verifyOtp: async (userId: string, otp: string): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`${API_URL}/password/verify-otp/${userId}`, {
      otp,
      userType: 'user'
    });
    return response.data;
  },

  resetPassword: async (userId: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`${API_URL}/password/change-password/${userId}`, {
      newPassword,
      confirmPassword,
      userType: 'user'
    });
    return response.data;
  }
};

export default AuthService;