import { get, post, put, del } from './apiClient';
import type { ServiceCategory, Service } from '@/types';

// ---------- Categories ----------

export const listCategoriesApi = () =>
  get<ServiceCategory[]>('/services/categories');

export const listCategoriesAdminApi = () =>
  get<{ categories: (ServiceCategory & { _count?: { services: number } })[] }>('/services/categories/admin');

export const getCategoryByIdApi = (id: string) =>
  get<ServiceCategory>(`/services/categories/${id}`);

export const createCategoryApi = (data: { name: string; description?: string; icon?: string; image?: string }) =>
  post<ServiceCategory>('/services/categories', data);

export const updateCategoryApi = (id: string, data: Partial<{ name: string; description: string; icon: string; image: string; is_active: boolean }>) =>
  put<ServiceCategory>(`/services/categories/${id}`, data);

// ---------- Services ----------

export interface ListServicesParams {
  page?: number;
  limit?: number;
  category_id?: string;
  provider_id?: string;
  min_price?: number;
  max_price?: number;
  city?: string;
  is_featured?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export const listServicesApi = (params?: ListServicesParams) =>
  get<{ services: Service[]; total: number; page: number; limit: number }>('/services', { params });

export const searchServicesApi = (params: { q: string; page?: number; limit?: number }) =>
  get<{ services: Service[]; total: number }>('/services/search', { params });

export const getServiceByIdApi = (id: string) =>
  get<Service>(`/services/${id}`);

export const getProviderServicesApi = (providerId: string) =>
  get<Service[]>(`/services/provider/${providerId}`);

export const createServiceApi = (data: {
  category_id: string;
  title: string;
  description: string;
  price: number;
  price_type?: string;
  duration_minutes?: number;
  is_online?: boolean;
  is_onsite?: boolean;
  available_days?: string[];
  tags?: string[];
}) =>
  post<Service>('/services', data);

export const updateServiceApi = (id: string, data: Partial<{
  title: string;
  description: string;
  price: number;
  price_type: string;
  discount_price: number;
  duration_minutes: number;
  is_available: boolean;
  is_active: boolean;
  tags: string[];
}>) =>
  put<Service>(`/services/${id}`, data);

export const deleteServiceApi = (id: string) =>
  del<{ message: string }>(`/services/${id}`);

// ---------- Availability ----------

export interface AvailabilitySlot {
  id: string;
  provider_id: string;
  available_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  is_recurring: boolean;
  recurring_day?: string | null;
  slot_duration?: number | null;
  break_time?: number | null;
  max_bookings_per_slot?: number | null;
  current_bookings: number;
}

export const listAvailabilityApi = (providerId: string) =>
  get<AvailabilitySlot[]>(`/services/providers/${providerId}/availability`);

export const createAvailabilityApi = (providerId: string, data: {
  available_date: string;
  start_time: string;
  end_time: string;
  is_recurring?: boolean;
  recurring_day?: string;
  slot_duration?: number;
  break_time?: number;
  max_bookings_per_slot?: number;
}) =>
  post<AvailabilitySlot>(`/services/providers/${providerId}/availability`, data);

export const updateAvailabilityApi = (id: string, data: Partial<{
  start_time: string;
  end_time: string;
  is_available: boolean;
  slot_duration: number;
  break_time: number;
  max_bookings_per_slot: number;
}>) =>
  put<AvailabilitySlot>(`/services/availability/${id}`, data);

export const deleteAvailabilityApi = (id: string) =>
  del<{ message: string }>(`/services/availability/${id}`);
