import type { BookingStatus } from '@/types';

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  IN_PROGRESS: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'secondary',
  REJECTED: 'danger',
};

export function getBookingStatusLabel(status: BookingStatus | string): string {
  return STATUS_LABELS[status as BookingStatus] ?? status;
}

export function getBookingStatusColor(status: BookingStatus | string): string {
  return STATUS_COLORS[status as BookingStatus] ?? 'secondary';
}

export function isBookingActive(status: BookingStatus | string): boolean {
  return ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(status);
}

export function isBookingCompleted(status: BookingStatus | string): boolean {
  return status === 'COMPLETED';
}

export function isBookingTerminal(status: BookingStatus | string): boolean {
  return ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(status);
}
