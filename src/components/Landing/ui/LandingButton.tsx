import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type LandingButtonBase = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

type PrimaryButtonProps = LandingButtonBase & {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md';
  to?: string;
  href?: string;
  onClick?: () => void;
};

export function LandingButton({
  children,
  variant,
  size = 'md',
  className,
  disabled,
  to,
  href,
  onClick,
}: PrimaryButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-50 disabled:pointer-events-none';

  const padding = size === 'sm' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-sm';

  const styles =
    variant === 'primary'
      ? 'bg-cyan-500 text-white hover:bg-cyan-600'
      : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50';

  const disabledClass = disabled ? 'opacity-50 pointer-events-none' : '';
  const classes = `${base} ${padding} ${styles}${disabledClass}${className ? ` ${className}` : ''}`;

  if (to)
    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    );
  if (href)
    return (
      <a className={classes} href={href} aria-disabled={disabled}>
        {children}
      </a>
    );

  return (
    <button className={classes} onClick={onClick} disabled={disabled} type="button">
      {children}
    </button>
  );
}

