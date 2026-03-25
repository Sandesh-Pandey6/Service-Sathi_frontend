import type { PriceType } from './enums';
import type { Provider } from './provider';

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Service {
  id: string;
  provider_id: string;
  category_id: string;
  provider?: Provider;
  category?: ServiceCategory;
  title: string;
  description: string;
  short_description?: string | null;
  price: number;
  price_type: PriceType;
  discount_price?: number | null;
  currency: string;
  duration_minutes?: number | null;
  images: string[];
  videos?: string[];
  documents?: string[];
  is_online: boolean;
  is_onsite: boolean;
  service_location?: string | null;
  is_available: boolean;
  available_days: string[];
  tags: string[];
  rating: number;
  total_reviews: number;
  total_bookings: number;
  view_count?: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
