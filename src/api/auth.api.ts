import { post, get } from './apiClient';

// ---------- Types ----------
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'CUSTOMER' | 'PROVIDER';
  // Provider-specific
  business_name?: string;
  description?: string;
  experience_years?: number;
  city?: string;
  address?: string;
  skills_summary?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    phone?: string | null;
    profile_image?: string | null;
    role: string;
    is_verified: boolean;
    email_verified: boolean;
    created_at: string;
    updated_at: string;
    last_login?: string | null;
    customer_profile?: Record<string, unknown> | null;
    provider_profile?: Record<string, unknown> | null;
    admin_profile?: Record<string, unknown> | null;
  };
  access_token: string;
  refresh_token: string;
}

// ---------- API Functions ----------

export const loginApi = (data: LoginPayload) =>
  post<AuthResponse>('/auth/login', data);

export const registerApi = (data: RegisterPayload) =>
  post<AuthResponse>('/auth/register', data);

export const getMeApi = () =>
  get<{ user: AuthResponse['user'] }>('/auth/me');

export const refreshTokenApi = (refresh_token: string) =>
  post<{ access_token: string }>('/auth/refresh', { refresh_token });

export const logoutApi = (refresh_token?: string) =>
  post('/auth/logout', { refresh_token });

export const forgotPasswordApi = (email: string) =>
  post<{ message: string }>('/auth/forgot-password', { email });

export const resetPasswordApi = (token: string, password: string) =>
  post<{ message: string }>('/auth/reset-password', { token, password });

export const verifyOtpApi = (data: { email: string; otp: string }) =>
  post<AuthResponse>('/auth/verify-otp', data);

export const resendOtpApi = (data: { email: string }) =>
  post<{ message: string }>('/auth/resend-otp', data);
