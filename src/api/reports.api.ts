import { get, put } from './apiClient';
import { apiClient } from './apiClient';

// ---------- Customer: Submit Report ----------

export const submitReportApi = (formData: FormData) =>
  apiClient.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);

// ---------- Admin: Reports Management ----------

export interface AdminListReportsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const getAdminReportsApi = (params?: AdminListReportsParams) =>
  get<{ reports: Record<string, unknown>[]; total: number; page: number; limit: number }>('/reports', { params });

export const getAdminReportStatsApi = () =>
  get<{ total: number; pending: number; resolved: number; dismissed: number }>('/reports/stats');

export const getAdminReportDetailApi = (id: string) =>
  get<Record<string, unknown>>(`/reports/${id}`);

export const updateReportStatusApi = (id: string, data: {
  status: string;
  admin_note?: string;
  suspend_provider?: boolean;
}) =>
  put<Record<string, unknown>>(`/reports/${id}/status`, data);
