import type { User } from './user';

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role?: 'CUSTOMER' | 'PROVIDER';
}

export interface ProviderSignupPayload extends SignupPayload {
  role: 'PROVIDER';
  business_name?: string;
  description?: string;
  skills_summary?: string;
  address?: string;
  city?: string;
  country?: string;
}
