import { get, post, put, del } from './apiClient';

// ---------- API Functions ----------

export const createReviewApi = (data: {
  booking_id: string;
  rating: number;
  comment?: string;
}) =>
  post<Record<string, unknown>>('/reviews', data);

export const getServiceReviewsApi = (serviceId: string, params?: { page?: number; limit?: number }) =>
  get<{ reviews: Record<string, unknown>[]; total: number }>(`/reviews/service/${serviceId}`, { params });

export const getProviderReviewsApi = (providerId: string, params?: { page?: number; limit?: number }) =>
  get<{ reviews: Record<string, unknown>[]; total: number }>(`/reviews/provider/${providerId}`, { params });

export const checkBookingReviewApi = (bookingId: string) =>
  get<{ hasReview: boolean; review?: Record<string, unknown> }>(`/reviews/check/${bookingId}`);

export const getReviewByIdApi = (id: string) =>
  get<Record<string, unknown>>(`/reviews/${id}`);

export const updateReviewApi = (id: string, data: { rating?: number; comment?: string }) =>
  put<Record<string, unknown>>(`/reviews/${id}`, data);

export const deleteReviewApi = (id: string) =>
  del<{ message: string }>(`/reviews/${id}`);

export const moderateReviewApi = (id: string, data: { is_flagged?: boolean; flag_reason?: string }) =>
  put<Record<string, unknown>>(`/reviews/${id}/moderate`, data);
