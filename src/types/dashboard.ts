import type { Booking } from './booking';

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
