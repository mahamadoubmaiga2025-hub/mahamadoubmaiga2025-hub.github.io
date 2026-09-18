import React from 'react';
import type { Currency } from '@/types';

const CONFIG: Record<Currency, { label: string; bg: string; text: string; symbol: string }> = {
  FCFA: { label: 'CFA', bg: '#16a34a', text: '#fff', symbol: '₣' },
  USDC: { label: 'USDC', bg: '#2563eb', text: '#fff', symbol: '$' },
  USDT: { label: 'USDT', bg: '#26a17b', text: '#fff', symbol: '₮' },
  BTC:  { label: 'BTC', bg: '#f7931a', text: '#fff', symbol: '₿' },
  ETH:  { label: 'ETH', bg: '#627eea', text: '#fff', symbol: 'Ξ' },
  AFRI: { label: 'AFRI', bg: '#f59e0b', text: '#fff', symbol: 'A' },
  USD:  { label: 'USD', bg: '#16a34a', text: '#fff', symbol: '$' },
  EUR:  { label: 'EUR', bg: '#003399', text: '#fff', symbol: '€' },
  GHS:  { label: 'GHS', bg: '#006b3f', text: '#fff', symbol: '₵' },
  NGN:  { label: 'NGN', bg: '#008751', text: '#fff', symbol: '₦' },
  KES:  { label: 'KES', bg: '#006600', text: '#fff', symbol: 'K' },
};

interface Props { currency: Currency; size?: number; }

export default function CurrencyIcon({ currency, size = 36 }: Props) {
  const cfg = CONFIG[currency] ?? { label: currency, bg: '#6b7280', text: '#fff', symbol: currency[0] };
  return (
    <div
      className="flex items-center justify-center rounded-full font-black flex-shrink-0"
      style={{ width: size, height: size, background: cfg.bg, color: cfg.text, fontSize: size * 0.38 }}
    >
      {cfg.symbol}
    </div>
  );
}
