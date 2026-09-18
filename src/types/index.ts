export type Currency = 'FCFA' | 'USDC' | 'USDT' | 'BTC' | 'ETH' | 'AFRI' | 'USD' | 'EUR' | 'GHS' | 'NGN' | 'KES';

export type TxType =
  | 'mobile_money_in'
  | 'mobile_money_out'
  | 'receive'
  | 'send'
  | 'convert'
  | 'payment'
  | 'merchant';

export type TxStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TxType;
  status: TxStatus;
  description: string;
  amount: number;
  currency: Currency;
  toCurrency?: Currency;
  toAmount?: number;
  fees?: number;
  date: string;
  counterparty?: string;
}

export interface WalletAsset {
  currency: Currency;
  balance: number;
  balanceUSD: number;
  address?: string;
  change24h: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  primaryCurrency: Currency;
  accountType: 'personal' | 'business';
  goals: string[];
  avatar?: string;
  kyc: boolean;
  joinedAt: string;
}

export type AppView =
  | 'landing'
  | 'login'
  | 'register'
  | 'onboarding'
  | 'dashboard'
  | 'wallet'
  | 'buy'
  | 'sell'
  | 'convert'
  | 'send'
  | 'receive'
  | 'payments'
  | 'merchant'
  | 'transactions'
  | 'analytics'
  | 'ai'
  | 'api'
  | 'security'
  | 'settings'
  | 'token'
  | 'admin';

export interface AppState {
  view: AppView;
  user: User | null;
  isAuthenticated: boolean;
  wallets: WalletAsset[];
  transactions: Transaction[];
  isDark: boolean;
}

export type ChartPeriod = '24H' | '7J' | '1M' | '1A';
