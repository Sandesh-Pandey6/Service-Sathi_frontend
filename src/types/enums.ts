/** User/account role */
export type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

/** User role alias for backward compatibility */
export type UserRole = Role;

/** Booking lifecycle status */
export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

/** Payment transaction status */
export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'REFUNDED'
  | 'FAILED'
  | 'PARTIALLY_PAID';

/** Payment method type */
export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE' | 'WALLET';

/** Message sender role (chat) */
export type SenderRole = 'CUSTOMER' | 'PROVIDER' | 'SYSTEM';

/** Service pricing model */
export type PriceType = 'fixed' | 'hourly' | 'per_session' | 'negotiable';

/** Notification type/category */
export type NotificationType =
  | 'BOOKING_NEW'
  | 'BOOKING_UPDATED'
  | 'BOOKING_CANCELLED'
  | 'PAYMENT_CONFIRMED'
  | 'REVIEW_RECEIVED'
  | 'MESSAGE'
  | 'SYSTEM';
