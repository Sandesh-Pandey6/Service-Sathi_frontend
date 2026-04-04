import { get, put } from './apiClient';
import apiClient from './apiClient';

// ---------- Profile ----------

export const getProfileApi = () =>
  get<{ user: Record<string, unknown> }>('/users/profile');

export const updateProfileApi = (data: {
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  business_name?: string;
  description?: string;
  skills_summary?: string;
  experience_years?: number;
  service_radius?: number;
  cancellation_policy?: string;
  is_available?: boolean;
}) =>
  put<{ user: Record<string, unknown> }>('/users/profile', data);

export const changePasswordApi = (data: { current_password: string; new_password: string }) =>
  put<{ message: string }>('/users/change-password', data);

export const uploadAvatarApi = (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return apiClient.post('/users/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data);
};

// ---------- Providers (public) ----------

export interface ListProvidersParams {
  page?: number;
  limit?: number;
  city?: string;
  is_verified?: boolean;
  min_rating?: number;
  category_id?: string;
  search?: string;
}

export const listProvidersApi = (params?: ListProvidersParams) =>
  get<{ providers: Record<string, unknown>[]; total: number; page: number; limit: number }>('/users/providers', { params });

export const getProviderByIdApi = (id: string) =>
  get<{ provider: Record<string, unknown> }>(`/users/providers/${id}`);

// ---------- Provider Analytics (authenticated) ----------

export const getProviderStatsApi = () =>
  get<Record<string, unknown>>('/users/provider-stats');

export const getProviderEarningsApi = () =>
  get<Record<string, unknown>>('/users/provider-earnings');
