import type { BookingStatus } from './enums';
import type { Payment } from './payment';
import type { Provider } from './provider';
import type { Service } from './service';
import type { User } from './user';

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
