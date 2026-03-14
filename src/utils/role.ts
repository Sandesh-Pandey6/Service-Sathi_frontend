import type { UserRole } from '@/types';

export function isCustomer(role: UserRole | string | undefined): boolean {
  return role === 'CUSTOMER';
}

export function isProvider(role: UserRole | string | undefined): boolean {
  return role === 'PROVIDER';
}

export function isAdmin(role: UserRole | string | undefined): boolean {
  return role === 'ADMIN';
}

export function hasProviderAccess(role: UserRole | string | undefined): boolean {
  return role === 'PROVIDER' || role === 'ADMIN';
}

export function hasAdminAccess(role: UserRole | string | undefined): boolean {
  return role === 'ADMIN';
}
