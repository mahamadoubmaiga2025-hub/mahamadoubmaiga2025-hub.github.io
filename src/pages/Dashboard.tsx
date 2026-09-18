import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, RefreshCw,
  ChevronRight, ArrowLeftRight, Send, Bell, Wallet, CreditCard, Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/Card';
import CurrencyIcon from '@/components/CurrencyIcon';
import Badge from '@/components/Badge';
import { useApp } from '@/hooks/useApp';
import { CHART_DATA, TOTAL_BALANCE_FCFA, TOTAL_BALANCE_USD } from '@/data/mockData';
import { formatAmount, formatUSD, formatRelativeDate } from '@/utils/format';
import type { ChartPeriod } from '@/types';

const PERIODS: ChartPeriod[] = ['24H', '7J', '1M', '1A'];

const NOTIFICATIONS = [
  { id: 1, text: '+150 000 FCFA reçu via Orange Money', time: 'Il y a 5min', unread: true },
  { id: 2, text: 'Conversion FCFA → USDC confirmée', time: 'Il y a 2h', unread: true },
  { id: 3, text: 'Votre compte est sécurisé (2FA actif)', time: 'Hier', unread: false },
];

const QUICK_STATS = [
  { label: 'Revenus ce mois', value: '337 000 FCFA', change: +12.4, up: true, icon: ArrowDownLeft, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Dépenses ce mois', value: '255 000 FCFA', change: -3.2, up: false, icon: ArrowUpRight, color: 'text-[var(--ink)]', bg: 'bg-[var(--surface-muted)]' },
  { label: 'Transferts', value: '12 transactions', change: +8.1, up: true, icon: ArrowLeftRight, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Frais payés', value: '3 825 FCFA', change: -5.0, up: true, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
];

export default function DashboardPage() {
  const { state, navigate } = useApp();
  const [period, setPeriod] = useState<ChartPeriod>('1M');
  const [showNotif, setShowNotif] = useState(false);
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  const chartData = CHART_DATA[period];
  const firstName = state.user?.name?.split(' ')[0] ?? 'Mamadou';
  const recentTxns = state.transactions.slice(0, 6);
  const currentVal = chartData[chartData.length - 1]?.value ?? 0;
  const prevVal = chartData[0]?.value ?? 0;
  const pctChange = prevVal ? (((currentVal - prevVal) / prevVal) * 100).toFixed(1) : '0.0';
  const isPositive = parseFloat(pctChange) >= 0;

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-5xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--muted)] font-medium">Bonjour,</p>
          <h2 className="display text-2xl font-bold text-[var(--ink)] tracking-tight">{firstName} 👋</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowNotif(v => !v)}
              className="w-10 h-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--border-strong)] transition-all">
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
            {showNotif && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 top-12 w-72 bg-[var(--surface-card)] border border-[var(--border)] rounded-3xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                  <p className="font-bold text-[var(--ink)] text-sm">Notifications</p>
                  <span className="text-[10px] font-bold text-brand-600">{unreadCount} nouvelles</span>
                </div>
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 ${n.unread ? 'bg-green-50/40' : ''}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${n.unread ? 'bg-brand-600' : 'bg-transparent'}`} />
                    <div>
                      <p className="text-xs font-medium text-[var(--ink)]">{n.text}</p>
                      <p className="text-[10px] text-[var(--muted)] mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
          <button onClick={() => window.location.reload()}
            className="w-10 h-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] flex items-center justify-center text-[var(--muted)] hover:text-brand-600 hover:border-brand-300 transition-all">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Balance hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2d1e 50%, #0a1628 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-[0.07] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #16a34a, transparent)', transform: 'translate(35%, -35%)' }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', transform: 'translate(-35%, 35%)' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full opacity-[0.03] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #16a34a, transparent)', transform: 'translate(-50%, -50%)' }} />

        <div className="relative">
          <div className="flex items-start justify-between mb-1">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">Balance totale</p>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {isPositive ? '+' : ''}{pctChange}%
            </div>
          </div>
          <p className="display text-4xl sm:text-5xl font-black text-white tabular mb-0.5 tracking-tight">
            {TOTAL_BALANCE_FCFA.toLocaleString('fr-FR')}
            <span className="text-2xl font-semibold text-gray-400 ml-2">FCFA</span>
          </p>
          <p className="text-gray-400 text-sm tabular">≈ {formatUSD(TOTAL_BALANCE_USD)}</p>

          {/* Quick action row */}
          <div className="grid grid-cols-4 gap-2 mt-6">
            {[
              { icon: ArrowDownLeft, label: 'Recevoir', view: 'receive' as const },
              { icon: Send, label: 'Envoyer', view: 'send' as const },
              { icon: ArrowLeftRight, label: 'Convertir', view: 'convert' as const },
              { icon: CreditCard, label: 'Mobile Money', view: 'payments' as const },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.view)}
                className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-white/8 hover:bg-white/15 active:scale-95 transition-all border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <a.icon size={15} className="text-white" />
                </div>
                <span className="text-[10px] text-gray-300 font-medium leading-tight text-center">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card padding="md">
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2.5`}>
                <s.icon size={14} className={s.color} />
              </div>
              <p className="display font-bold text-[var(--ink)] text-sm tabular leading-tight">{s.value}</p>
              <p className="text-[10px] text-[var(--muted)] mt-0.5">{s.label}</p>
              <div className={`flex items-center gap-0.5 mt-1.5 text-[10px] font-semibold ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                {s.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                {s.change > 0 ? '+' : ''}{s.change}% vs mois
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="display font-bold text-[var(--ink)] text-sm">Évolution du portefeuille</h3>
            <p className="text-xs text-[var(--muted)]">En USD · Période sélectionnée</p>
          </div>
          <div className="flex gap-1 bg-[var(--surface-muted)] rounded-xl p-1">
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${period === p ? 'bg-[var(--surface-card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-dash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--subtle)' }} axisLine={false} tickLine={false} />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
              formatter={(v: number) => [`$${v.toFixed(0)}`, 'Valeur']}
              labelStyle={{ color: 'var(--muted)', fontSize: 11 }}
            />
            <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2.5} fill="url(#grad-dash)" dot={false} activeDot={{ r: 4, fill: '#16a34a', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Assets grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="display font-bold text-[var(--ink)]">Mes actifs</h3>
          <button onClick={() => navigate('wallet')} className="flex items-center gap-0.5 text-xs text-brand-600 font-semibold hover:underline">
            Gérer <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {state.wallets.map((wallet, i) => (
            <motion.div key={wallet.currency} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover padding="md" onClick={() => navigate('wallet')} className="group">
                <div className="flex items-center justify-between mb-3">
                  <CurrencyIcon currency={wallet.currency} size={32} />
                  <span className={`text-[10px] font-bold tabular px-1.5 py-0.5 rounded-full ${wallet.change24h >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {wallet.change24h > 0 ? '+' : ''}{wallet.change24h}%
                  </span>
                </div>
                <p className="display font-bold text-[var(--ink)] text-sm tabular truncate">{formatAmount(wallet.balance, wallet.currency)}</p>
                <p className="text-[10px] text-[var(--muted)] tabular">{formatUSD(wallet.balanceUSD)}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="display font-bold text-[var(--ink)]">Activité récente</h3>
          <button onClick={() => navigate('transactions')} className="flex items-center gap-0.5 text-xs text-brand-600 font-semibold hover:underline">
            Tout voir <ChevronRight size={13} />
          </button>
        </div>
        <Card padding="none" className="divide-y divide-[var(--border)]">
          {recentTxns.map((tx) => {
            const isIn = tx.amount > 0;
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
                onClick={() => navigate('transactions')}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isIn ? 'bg-green-50' : 'bg-[var(--surface-muted)]'}`}>
                  {isIn
                    ? <ArrowDownLeft size={15} className="text-green-600" />
                    : <ArrowUpRight size={15} className="text-[var(--muted)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--ink)] truncate">{tx.description}</p>
                  <p className="text-xs text-[var(--muted)]">{formatRelativeDate(tx.date)}</p>
                </div>
                <div className="text-right flex-shrink-0 space-y-0.5">
                  <p className={`text-sm font-bold tabular ${isIn ? 'text-green-600' : 'text-[var(--ink)]'}`}>
                    {isIn ? '+' : ''}{formatAmount(Math.abs(tx.amount), tx.currency)}
                  </p>
                  <Badge status={tx.status} />
                </div>
              </motion.div>
            );
          })}
        </Card>
      </div>

      {/* Mobile Money banner */}
      <button onClick={() => navigate('payments')}
        className="w-full flex items-center gap-4 p-5 rounded-3xl border border-dashed border-brand-300 bg-green-50/50 hover:bg-green-50 hover:border-brand-400 transition-all text-left group">
        <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center flex-shrink-0">
          <Wallet size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-brand-700 text-sm">Connecter Mobile Money</p>
          <p className="text-xs text-brand-600/70">Orange Money, Wave, MTN MoMo, Moov Money</p>
        </div>
        <ChevronRight size={16} className="text-brand-600 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
