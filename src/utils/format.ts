import type { Currency } from '@/types';

export function formatAmount(amount: number, currency: Currency): string {
  if (currency === 'FCFA' || currency === 'NGN' || currency === 'KES' || currency === 'GHS') {
    return `${amount.toLocaleString('fr-FR')} ${currency}`;
  }
  if (currency === 'BTC') {
    return `${amount.toFixed(6)} BTC`;
  }
  if (currency === 'ETH') {
    return `${amount.toFixed(4)} ETH`;
  }
  return `${amount.toFixed(2)} ${currency}`;
}

export function formatUSD(usd: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(usd);
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'À l\'instant';
  if (diffMinutes < 60) return `Il y a ${diffMinutes}min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
