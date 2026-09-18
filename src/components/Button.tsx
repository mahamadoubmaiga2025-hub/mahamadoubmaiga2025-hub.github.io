import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98] shadow-sm',
  secondary: 'bg-[var(--surface-muted)] text-[var(--ink)] hover:bg-[var(--surface-strong)] border border-[var(--border)]',
  ghost: 'text-[var(--ink)] hover:bg-[var(--surface-muted)]',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizes = {
  sm: 'px-3.5 py-2 text-xs rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-2xl gap-2',
  lg: 'px-6 py-3.5 text-sm rounded-2xl gap-2',
};

export default function Button({ variant = 'primary', size = 'md', loading, fullWidth, icon, children, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? <Loader2 size={14} className="animate-spin flex-shrink-0" /> : icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
