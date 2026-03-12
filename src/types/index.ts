// ==================== ENUMS ====================

export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE' | 'WALLET';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'REFUNDED'
  | 'FAILED'
  | 'PARTIALLY_PAID';

export type SenderRole = 'CUSTOMER' | 'PROVIDER' | 'SYSTEM';

export type PriceType = 'fixed' | 'hourly' | 'per_session' | 'negotiable';

// ==================== USER ====================

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  profile_image?: string | null;
  role: UserRole;
  is_verified: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
}

// ==================== PROVIDER ====================

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

// ==================== SERVICE ====================

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

// ==================== BOOKING ====================

export interface Booking {
  id: string;
  booking_number: string;
  customer_id: string;
  provider_id: string;
  service_id: string;
  customer?: { id: string; user?: User };
  provider?: Provider;
  service?: Service;
  booking_datetime: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes?: number | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  special_requests?: string | null;
  status: BookingStatus;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  confirmed_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  payment?: Payment;
  created_at: string;
  updated_at: string;
}

// ==================== PAYMENT ====================

export interface Payment {
  id: string;
  booking_id: string;
  payment_number: string;
  transaction_id?: string | null;
  payment_date: string;
  amount: number;
  tax_amount: number;
  service_fee: number;
  total_amount: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  refund_amount?: number;
  refund_reason?: string | null;
  refunded_at?: string | null;
  invoice_url?: string | null;
  receipt_url?: string | null;
  created_at: string;
  updated_at: string;
}

// ==================== REVIEW ====================

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  provider_id: string;
  service_id: string;
  rating: number;
  comment?: string | null;
  images: string[];
  provider_response?: string | null;
  responded_at?: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== MESSAGE ====================

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  receiver_id: string;
  sender_role: SenderRole;
  message_text: string;
  attachments: string[];
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}

// ==================== AUTH ====================

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

// ==================== DASHBOARD (ADMIN) ====================

export interface DashboardStats {
  total_users: number;
  total_providers: number;
  total_customers: number;
  total_services: number;
  total_bookings: number;
  completed_bookings: number;
  pending_bookings: number;
  total_revenue: number;
  total_categories?: number;
  recent_bookings?: Booking[];
}
