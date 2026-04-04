import { get, post, put, del } from './apiClient';

// ---------- Dashboard ----------

export const getDashboardStatsApi = () =>
  get<Record<string, unknown>>('/admin/dashboard/stats');

// ---------- Users ----------

export interface AdminListUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  status?: string;
}

export const adminListUsersApi = (params?: AdminListUsersParams) =>
  get<{ users: Record<string, unknown>[]; total: number; page: number; limit: number }>('/admin/users', { params });

export const verifyProviderApi = (userId: string) =>
  put<Record<string, unknown>>(`/admin/users/${userId}/verify`);

export const adminDeleteUserApi = (userId: string) =>
  del<{ message: string }>(`/admin/users/${userId}`);

export const adminUpdateUserRoleApi = (userId: string, role: string) =>
  put<Record<string, unknown>>(`/admin/users/${userId}/role`, { role });

// ---------- Bookings ----------

export interface AdminListBookingsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const adminListBookingsApi = (params?: AdminListBookingsParams) =>
  get<{ bookings: Record<string, unknown>[]; total: number; page: number; limit: number }>('/admin/bookings', { params });

// ---------- Reviews (admin) ----------

export const adminListReviewsApi = (params?: { page?: number; limit?: number; status?: string }) =>
  get<{ reviews: Record<string, unknown>[]; total: number }>('/admin/reviews', { params });

// ---------- Payments (admin) ----------

export const adminListPaymentsApi = (params?: { page?: number; limit?: number; status?: string }) =>
  get<{ payments: Record<string, unknown>[]; total: number }>('/admin/payments', { params });

// ---------- Reports ----------

export const getReportsApi = (params?: { period?: string; type?: string }) =>
  get<Record<string, unknown>>('/admin/reports', { params });

// ---------- Categories ----------

export const adminCreateCategoryApi = (data: { name: string; description?: string; icon?: string }) =>
  post<Record<string, unknown>>('/admin/categories', data);

// ---------- Analytics ----------

export const getRevenueAnalyticsApi = (params?: { period?: string }) =>
  get<Record<string, unknown>>('/admin/analytics/revenue', { params });

export const getPopularServicesApi = (params?: { limit?: number }) =>
  get<Record<string, unknown>>('/admin/analytics/popular-services', { params });
