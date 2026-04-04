import { get, post, put } from './apiClient';

// ---------- Types ----------

export interface CreateBookingPayload {
  service_id: string;
  scheduled_date: string;
  scheduled_time: string;
  address?: string;
  special_requests?: string;
  payment_method?: string;
}

export interface BookingsResponse {
  bookings: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
}

// ---------- API Functions ----------

export const createBookingApi = (data: CreateBookingPayload) =>
  post<Record<string, unknown>>('/bookings', data);

export const getCustomerBookingsApi = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) =>
  get<BookingsResponse>('/bookings/customer', { params });

export const getProviderBookingsApi = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) =>
  get<BookingsResponse>('/bookings/provider', { params });

export const getBookingByIdApi = (id: string) =>
  get<Record<string, unknown>>(`/bookings/${id}`);

export const updateBookingStatusApi = (id: string, data: {
  status: string;
  cancellation_reason?: string;
}) =>
  put<Record<string, unknown>>(`/bookings/${id}/status`, data);

export const updateBookingPaymentApi = (id: string, data: {
  payment_method: string;
  transaction_id?: string;
}) =>
  put<Record<string, unknown>>(`/bookings/${id}/payment`, data);
