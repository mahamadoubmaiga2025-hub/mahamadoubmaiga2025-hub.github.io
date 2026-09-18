import React from 'react';
import { clsx } from 'clsx';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  white?: boolean;
}

export default function Logo({ size = 'md', className, white }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-3xl' },
  };
  const s = sizes[size];
  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="11" fill={white ? 'rgba(255,255,255,0.15)' : '#16a34a'} />
        {/* A stylized A with a bridge arc */}
        <path d="M12 30L20 10L28 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M15 23H25" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        {/* Bridge arc */}
        <path d="M14 18 Q20 12 26 18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      <span
        className={clsx('font-display font-700 tracking-tight', s.text, white ? 'text-white' : 'text-[var(--ink)]')}
        style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
      >
        Afri<span style={{ color: white ? '#fbbf24' : '#16a34a' }}>Pay</span>
      </span>
    </div>
  );
}
