import type { User } from './user';

export interface Location {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Provider {
  id: string;
  user_id: string;
  user?: User;
  business_name?: string | null;
  description?: string | null;
  skills_summary?: string | null;
  skills?: string[];
  experience_years?: number | null;
  is_verified: boolean;
  verified_at?: string | null;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  total_earnings: number;
  completion_rate: number;
  response_time?: number | null;
  is_available: boolean;
  cancellation_policy?: string | null;
  created_at: string;
  updated_at: string;
  /** Flattened location fields */
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  service_radius?: number | null;
}
