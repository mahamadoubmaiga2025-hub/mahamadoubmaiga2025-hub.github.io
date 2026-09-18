import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, RefreshCw, ChevronRight, Wallet, ArrowLeftRight, Send } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/Card';
import CurrencyIcon from '@/components/CurrencyIcon';
import Badge from '@/components/Badge';
import { useApp } from '@/hooks/useApp';
import { CHART_DATA, TOTAL_BALANCE_FCFA, TOTAL_BALANCE_USD } from '@/data/mockData';
import { formatAmount, formatUSD, formatRelativeDate } from '@/utils/format';
import type { ChartPeriod } from '@/types';

const PERIODS: ChartPeriod[] = ['24H', '7J', '1M', '1A'];

export default function DashboardPage() {
  const { state, navigate } = useApp();
  const [period, setPeriod] = useState<ChartPeriod>('1M');

  const chartData = period === '24H' ? CHART_DATA['24H'] : period === '7J' ? CHART_DATA['7J'] : period === '1M' ? CHART_DATA['1M'] : CHART_DATA['1A'];
  const firstName = state.user?.name?.split(' ')[0] ?? 'Mamadou';
  const recentTxns = state.transactions.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-5xl mx-auto space-y-5">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--muted)] font-medium">Bonjour,</p>
          <h2 className="display text-2xl font-bold text-[var(--ink)] tracking-tight">{firstName}</h2>
        </div>
        <button onClick={() => window.location.reload()}
          className="w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] flex items-center justify-center text-[var(--muted)] hover:text-brand-600 transition-colors">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Balance hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a3a2a 100%)' }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #16a34a, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', transform: 'translate(-30%, 30%)' }} />

        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1 font-medium">Balance totale</p>
        <p className="display text-4xl font-bold text-white tabular mb-0.5">
          {TOTAL_BALANCE_FCFA.toLocaleString('fr-FR')} <span className="text-2xl font-semibold text-gray-400">FCFA</span>
        </p>
        <p className="text-gray-400 text-sm tabular">≈ {formatUSD(TOTAL_BALANCE_USD)}</p>

        {/* Quick action row */}
        <div className="flex gap-3 mt-5">
          {[
            { icon: ArrowDownLeft, label: 'Recevoir', view: 'receive' as const, color: 'bg-white/10 hover:bg-white/20' },
            { icon: Send, label: 'Envoyer', view: 'send' as const, color: 'bg-white/10 hover:bg-white/20' },
            { icon: ArrowLeftRight, label: 'Convertir', view: 'convert' as const, color: 'bg-white/10 hover:bg-white/20' },
            { icon: Wallet, label: 'Wallet', view: 'wallet' as const, color: 'bg-white/10 hover:bg-white/20' },
          ].map(a => (
            <button key={a.label} onClick={() => navigate(a.view)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-2xl ${a.color} transition-all`}>
              <a.icon size={16} className="text-white" />
              <span className="text-[10px] text-gray-300 font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chart */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="display font-bold text-[var(--ink)] text-sm">Évolution du portefeuille</h3>
            <p className="text-xs text-[var(--muted)]">En USD</p>
          </div>
          <div className="flex gap-1 bg-[var(--surface-muted)] rounded-xl p-1">
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${period === p ? 'bg-[var(--surface-strong)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: 'var(--surface-strong)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
              formatter={(v: number) => [`$${v}`, 'Valeur']}
            />
            <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} fill="url(#grad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Assets grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="display font-bold text-[var(--ink)]">Mes actifs</h3>
          <button onClick={() => navigate('wallet')} className="text-xs text-brand-600 font-semibold flex items-center gap-0.5 hover:underline">
            Voir tout <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {state.wallets.filter(w => w.balance > 0 || w.currency === 'ETH').map((wallet, i) => (
            <motion.div key={wallet.currency} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover padding="md" onClick={() => navigate('wallet')}>
                <div className="flex items-center justify-between mb-2">
                  <CurrencyIcon currency={wallet.currency} size={32} />
                  <span className={`text-xs font-bold tabular ${wallet.change24h >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {wallet.change24h > 0 ? '+' : ''}{wallet.change24h}%
                  </span>
                </div>
                <p className="display font-bold text-[var(--ink)] text-sm tabular">{formatAmount(wallet.balance, wallet.currency)}</p>
                <p className="text-xs text-[var(--muted)] tabular">{formatUSD(wallet.balanceUSD)}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="display font-bold text-[var(--ink)]">Activité récente</h3>
          <button onClick={() => navigate('transactions')} className="text-xs text-brand-600 font-semibold flex items-center gap-0.5 hover:underline">
            Voir tout <ChevronRight size={13} />
          </button>
        </div>
        <Card padding="none">
          {recentTxns.map((tx, i) => {
            const isIn = tx.amount > 0;
            return (
              <div key={tx.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < recentTxns.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isIn ? 'bg-green-50' : 'bg-[var(--surface-muted)]'}`}>
                  {isIn ? <ArrowDownLeft size={15} className="text-green-600" /> : <ArrowUpRight size={15} className="text-[var(--muted)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--ink)] truncate">{tx.description}</p>
                  <p className="text-xs text-[var(--muted)]">{formatRelativeDate(tx.date)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold tabular ${isIn ? 'text-green-600' : 'text-[var(--ink)]'}`}>
                    {isIn ? '+' : ''}{formatAmount(Math.abs(tx.amount), tx.currency)}
                  </p>
                  <Badge status={tx.status} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
