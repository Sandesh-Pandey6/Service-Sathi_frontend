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
