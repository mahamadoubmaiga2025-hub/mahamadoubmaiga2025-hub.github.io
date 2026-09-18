import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
  className?: string;
  animate?: boolean;
}

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export default function Card({ children, padding = 'md', hover = false, onClick, className, animate = false }: CardProps) {
  const base = clsx(
    'bg-[var(--surface-card)] border border-[var(--border)] rounded-3xl overflow-hidden',
    hover && 'cursor-pointer hover:shadow-card hover:border-[var(--border-strong)] transition-all duration-200',
    onClick && 'cursor-pointer',
    paddings[padding],
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={base}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={base} onClick={onClick}>
      {children}
    </div>
  );
}
