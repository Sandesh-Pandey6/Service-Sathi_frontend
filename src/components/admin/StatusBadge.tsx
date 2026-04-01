// src/components/admin/StatusBadge.tsx
import React from 'react';

type BadgeVariant =
  | 'active' | 'inactive' | 'blocked' | 'banned'
  | 'verified' | 'pending' | 'rejected' | 'suspended'
  | 'completed' | 'confirmed' | 'cancelled'
  | 'paid' | 'refunded'
  | 'published' | 'hidden' | 'reported' | 'flagged'
  | 'card' | 'cash' | 'wallet' | 'disabled';

const variantStyles: Record<BadgeVariant, string> = {
  active:    'bg-emerald-100 text-emerald-700',
  inactive:  'bg-slate-100 text-slate-600',
  blocked:   'bg-red-100 text-red-700',
  banned:    'bg-rose-100 text-rose-700',
  verified:  'bg-emerald-100 text-emerald-700',
  pending:   'bg-amber-100 text-amber-700',
  rejected:  'bg-rose-100 text-rose-700',
  suspended: 'bg-orange-100 text-orange-700',
  completed: 'bg-emerald-100 text-emerald-700',
  confirmed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-rose-100 text-rose-700',
  paid:      'bg-emerald-100 text-emerald-700',
  refunded:  'bg-purple-100 text-purple-700',
  published: 'bg-emerald-100 text-emerald-700',
  hidden:    'bg-slate-100 text-slate-600',
  reported:  'bg-rose-100 text-rose-700',
  flagged:   'bg-rose-100 text-rose-700',
  card:      'bg-blue-100 text-blue-700',
  cash:      'bg-slate-100 text-slate-600',
  wallet:    'bg-violet-100 text-violet-700',
  disabled:  'bg-slate-100 text-slate-600',
};

interface Props {
  status: BadgeVariant;
  className?: string;
}

export const StatusBadge: React.FC<Props> = ({ status, className = '' }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold capitalize ${variantStyles[status] || 'bg-slate-100 text-slate-600'} ${className}`}>
    {status}
  </span>
);
