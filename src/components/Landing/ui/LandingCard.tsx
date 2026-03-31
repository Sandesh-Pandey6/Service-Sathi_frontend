import type { ReactNode } from 'react';

type LandingCardProps = {
  children: ReactNode;
  className?: string;
};

export function LandingCard({ children, className }: LandingCardProps) {
  const base =
    'rounded-2xl bg-white shadow-sm border border-slate-100 transition-shadow';
  return <div className={`${base}${className ? ` ${className}` : ''}`}>{children}</div>;
}

