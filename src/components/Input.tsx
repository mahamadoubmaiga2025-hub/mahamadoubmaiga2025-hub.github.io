import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export default function Input({ label, error, hint, fullWidth, prefix, suffix, className, ...props }: InputProps) {
  return (
    <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
      {label && <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">{label}</label>}
      <div className={clsx(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-[var(--surface-muted)] transition-all',
        error ? 'border-red-400 ring-2 ring-red-400/10' : 'border-[var(--border)] focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/10',
      )}>
        {prefix && <span className="text-[var(--muted)] flex-shrink-0">{prefix}</span>}
        <input
          {...props}
          className={clsx(
            'flex-1 bg-transparent outline-none text-sm text-[var(--ink)] placeholder:text-[var(--subtle)]',
            className,
          )}
        />
        {suffix && <span className="text-[var(--muted)] flex-shrink-0">{suffix}</span>}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--muted)]">{hint}</p>}
    </div>
  );
}
