import type { PaymentMethod, PaymentStatus } from './enums';

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
