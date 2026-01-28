import axios from 'axios';
import type { Professional } from '../types';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  specialty?: string;
  sort?: 'name_asc' | 'name_desc' | 'latest';
  role?: string; // default 'professional'
}

export interface ListResponse {
  success: boolean;
  data: Professional[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const listProfessionals = async (params: ListParams = {}): Promise<ListResponse> => {
  const {
    page = 1,
    limit = 12,
    search = '',
    specialty = '',
    sort = 'latest',
    role = 'professional',
  } = params;

  const response = await axios.get(API_URL, {
    params: { page, limit, search, specialty, sort, role },
  });
  return response.data as ListResponse;
};

export const getProfessionalById = async (id: string): Promise<Professional> => {
  const response = await axios.get(`${API_URL}/public/${id}`);
  const payload = response.data;
  return (payload.data || payload) as Professional;
};