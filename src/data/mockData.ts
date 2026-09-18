import type { User, WalletAsset, Transaction, ChartPeriod } from '@/types';

export const DEMO_USER: User = {
  id: 'user_MT001',
  name: 'Mamadou Traoré',
  email: 'mamadou.traore@gmail.com',
  phone: '+223 76 12 34 56',
  country: 'Mali',
  primaryCurrency: 'FCFA',
  accountType: 'personal',
  goals: ['paiements', 'transfert', 'crypto'],
  kyc: true,
  joinedAt: '2026-03-15',
};

export const DEMO_WALLETS: WalletAsset[] = [
  {
    currency: 'FCFA',
    balance: 745_000,
    balanceUSD: 1241.42,
    address: undefined,
    change24h: +1.2,
  },
  {
    currency: 'USDC',
    balance: 500.00,
    balanceUSD: 500.00,
    address: '0xaBcD...1234',
    change24h: 0,
  },
  {
    currency: 'USDT',
    balance: 250.00,
    balanceUSD: 250.00,
    address: '0xEfGh...5678',
    change24h: 0,
  },
  {
    currency: 'BTC',
    balance: 0.012,
    balanceUSD: 739.44,
    address: 'bc1q...xkZ7',
    change24h: +2.8,
  },
  {
    currency: 'ETH',
    balance: 0,
    balanceUSD: 0,
    address: '0x9Ijk...LmNo',
    change24h: -0.4,
  },
];

export const TOTAL_BALANCE_FCFA = 1_245_000;
export const TOTAL_BALANCE_USD = 2073.00;

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_001',
    type: 'mobile_money_in',
    status: 'completed',
    description: 'Dépôt Orange Money',
    amount: 150_000,
    currency: 'FCFA',
    fees: 0,
    date: '2026-09-18T08:22:00Z',
    counterparty: 'Orange Money',
  },
  {
    id: 'tx_002',
    type: 'payment',
    status: 'completed',
    description: 'Paiement Shopify Store',
    amount: -25,
    currency: 'USDC',
    fees: 0.05,
    date: '2026-09-17T16:45:00Z',
    counterparty: 'Shopify',
  },
  {
    id: 'tx_003',
    type: 'receive',
    status: 'completed',
    description: 'Réception USDC',
    amount: 100,
    currency: 'USDC',
    fees: 0,
    date: '2026-09-17T09:10:00Z',
    counterparty: '0xAbCd...5678',
  },
  {
    id: 'tx_004',
    type: 'mobile_money_out',
    status: 'completed',
    description: 'Retrait Wave',
    amount: -50_000,
    currency: 'FCFA',
    fees: 250,
    date: '2026-09-16T14:33:00Z',
    counterparty: 'Wave',
  },
  {
    id: 'tx_005',
    type: 'convert',
    status: 'completed',
    description: 'Conversion FCFA → USDC',
    amount: -100_000,
    currency: 'FCFA',
    toCurrency: 'USDC',
    toAmount: 164.50,
    fees: 300,
    date: '2026-09-15T11:05:00Z',
  },
  {
    id: 'tx_006',
    type: 'send',
    status: 'pending',
    description: 'Transfert vers Kofi Asante',
    amount: -50,
    currency: 'USDC',
    fees: 0.10,
    date: '2026-09-15T08:55:00Z',
    counterparty: 'Kofi A.',
  },
  {
    id: 'tx_007',
    type: 'mobile_money_in',
    status: 'completed',
    description: 'Dépôt MTN MoMo',
    amount: 75_000,
    currency: 'FCFA',
    fees: 0,
    date: '2026-09-14T17:20:00Z',
    counterparty: 'MTN MoMo',
  },
  {
    id: 'tx_008',
    type: 'payment',
    status: 'failed',
    description: 'Paiement marchand AB12',
    amount: -15_000,
    currency: 'FCFA',
    fees: 75,
    date: '2026-09-13T12:00:00Z',
    counterparty: 'AfriPay Merchant',
  },
  {
    id: 'tx_009',
    type: 'receive',
    status: 'completed',
    description: 'Réception USDT',
    amount: 200,
    currency: 'USDT',
    fees: 0,
    date: '2026-09-12T09:30:00Z',
    counterparty: '0xXyZa...BCDE',
  },
  {
    id: 'tx_010',
    type: 'convert',
    status: 'completed',
    description: 'Conversion USDT → FCFA',
    amount: -50,
    currency: 'USDT',
    toCurrency: 'FCFA',
    toAmount: 30_250,
    fees: 150,
    date: '2026-09-11T15:44:00Z',
  },
];

// Chart data
type ChartPoint = { label: string; value: number };

function buildChartData(points: number[], labels: string[]): ChartPoint[] {
  return labels.map((label, i) => ({ label, value: points[i] }));
}

export const CHART_DATA: Record<Exclude<ChartPeriod, '24H'> | '24H', ChartPoint[]> = {
  '24H': buildChartData(
    [2040, 2015, 2050, 2035, 2060, 2045, 2073, 2080, 2068, 2073, 2078, 2073],
    ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h']
  ),
  '7J': buildChartData(
    [1890, 1920, 1975, 1960, 2010, 2045, 2073],
    ['L', 'M', 'Me', 'J', 'V', 'S', 'D']
  ),
  '1M': buildChartData(
    [1650, 1710, 1680, 1740, 1800, 1780, 1850, 1900, 1875, 1940, 1980, 1960, 2010, 2050, 2073],
    ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23', '25', '27', '30']
  ),
  '1A': buildChartData(
    [980, 1050, 1120, 1240, 1350, 1280, 1420, 1550, 1680, 1820, 1950, 2073],
    ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep']
  ),
};

export const CONVERSION_RATES: Partial<Record<string, number>> = {
  'FCFA_USDC': 0.001645,
  'FCFA_USDT': 0.001643,
  'FCFA_BTC': 0.00000134,
  'FCFA_ETH': 0.000020,
  'USDC_FCFA': 607.9,
  'USDT_FCFA': 608.5,
  'BTC_FCFA': 746_500,
  'ETH_FCFA': 50_000,
};
