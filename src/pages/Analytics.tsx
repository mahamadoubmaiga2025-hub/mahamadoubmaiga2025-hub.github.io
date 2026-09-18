import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, CreditCard } from 'lucide-react';
import Card from '@/components/Card';
import { useApp } from '@/hooks/useApp';
import { CHART_DATA } from '@/data/mockData';
import { formatUSD } from '@/utils/format';

type Period = '7j' | '30j' | '90j' | '1a';
const PERIODS: { val: Period; label: string }[] = [
  { val: '7j', label: '7 jours' },
  { val: '30j', label: '30 jours' },
  { val: '90j', label: '90 jours' },
  { val: '1a', label: '1 an' },
];

const EXPENSE_CATEGORIES = [
  { name: 'Transferts', value: 42, color: '#16a34a' },
  { name: 'Paiements', value: 28, color: '#0d9488' },
  { name: 'Conversions', value: 18, color: '#f59e0b' },
  { name: 'Mobile Money', value: 12, color: '#6366f1' },
];

// Monthly bar data
const MONTHLY_DATA = [
  { month: 'Avr', revenus: 210000, depenses: 145000 },
  { month: 'Mai', revenus: 285000, depenses: 198000 },
  { month: 'Jun', revenus: 320000, depenses: 175000 },
  { month: 'Jul', revenus: 195000, depenses: 220000 },
  { month: 'Aoû', revenus: 410000, depenses: 260000 },
  { month: 'Sep', revenus: 337000, depenses: 255000 },
];

const WEEKLY_DATA = [
  { day: 'Lun', revenus: 45000, depenses: 32000 },
  { day: 'Mar', revenus: 68000, depenses: 41000 },
  { day: 'Mer', revenus: 52000, depenses: 55000 },
  { day: 'Jeu', revenus: 71000, depenses: 38000 },
  { day: 'Ven', revenus: 89000, depenses: 62000 },
  { day: 'Sam', revenus: 34000, depenses: 18000 },
  { day: 'Dim', revenus: 22000, depenses: 9000 },
];

function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--surface-card)] border border-[var(--border)] rounded-xl p-2.5 shadow text-xs">
      <p className="font-bold text-[var(--ink)]">{payload[0].name}</p>
      <p className="text-brand-600 font-black">{payload[0].value}%</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const { state } = useApp();
  const [period, setPeriod] = useState<Period>('30j');
  const chartData = period === '7j' ? CHART_DATA['7J'] : period === '1a' ? CHART_DATA['1A'] : period === '90j' ? CHART_DATA['1M'] : CHART_DATA['1M'];
  const barData = period === '7j' ? WEEKLY_DATA : MONTHLY_DATA;
  const barKey = period === '7j' ? 'day' : 'month';

  // KPIs
  const totalRev = MONTHLY_DATA.reduce((s, d) => s + d.revenus, 0);
  const totalDep = MONTHLY_DATA.reduce((s, d) => s + d.depenses, 0);
  const txCount = state.transactions.length;
  const avgTx = txCount ? Math.round(totalRev / txCount) : 0;

  const kpis = [
    { label: 'Revenus totaux', value: `${totalRev.toLocaleString('fr-FR')} FCFA`, change: +18.4, icon: ArrowDownLeft, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Dépenses totales', value: `${totalDep.toLocaleString('fr-FR')} FCFA`, change: -5.2, icon: ArrowUpRight, color: 'text-[var(--ink)]', bg: 'bg-[var(--surface-muted)]' },
    { label: 'Transactions', value: `${txCount}`, change: +12.0, icon: ArrowLeftRight, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tx. moyenne', value: `${avgTx.toLocaleString('fr-FR')} FCFA`, change: +3.7, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="display text-xl font-bold text-[var(--ink)]">Analytics</h2>
        <div className="flex gap-1 bg-[var(--surface-muted)] rounded-xl p-1">
          {PERIODS.map(p => (
            <button key={p.val} onClick={() => setPeriod(p.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${period === p.val ? 'bg-[var(--surface-card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card padding="md">
              <div className={`w-8 h-8 rounded-xl ${k.bg} flex items-center justify-center mb-2.5`}>
                <k.icon size={14} className={k.color} />
              </div>
              <p className="display font-bold text-[var(--ink)] text-sm tabular leading-tight">{k.value}</p>
              <p className="text-[10px] text-[var(--muted)] mt-0.5">{k.label}</p>
              <div className={`flex items-center gap-0.5 mt-1.5 text-[10px] font-semibold ${k.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {k.change >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                {k.change > 0 ? '+' : ''}{k.change}%
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Portfolio evolution */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="display font-bold text-[var(--ink)] text-sm">Évolution du portefeuille</h3>
            <p className="text-xs text-[var(--muted)]">En USD</p>
          </div>
          <div className="text-right">
            <p className="display font-black text-[var(--ink)]">{formatUSD(chartData[chartData.length - 1]?.value ?? 0)}</p>
            <p className="text-[10px] text-green-600 font-semibold">+14.3% sur la période</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-analytics" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--subtle)' }} axisLine={false} tickLine={false} />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
              formatter={(v: number) => [`$${v.toFixed(0)}`, 'Valeur']} />
            <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2.5} fill="url(#grad-analytics)" dot={false} activeDot={{ r: 4, fill: '#16a34a', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Revenus vs Dépenses */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="display font-bold text-[var(--ink)] text-sm">Revenus vs Dépenses</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-brand-600" /><span className="text-[var(--muted)]">Revenus</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[var(--ink)]" /><span className="text-[var(--muted)]">Dépenses</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={16} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey={barKey} tick={{ fontSize: 10, fill: 'var(--subtle)' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 11 }}
              formatter={(v: number) => [`${v.toLocaleString('fr-FR')} FCFA`]} />
            <Bar dataKey="revenus" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="depenses" fill="#0a1628" radius={[4, 4, 0, 0]} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Asset allocation + Category breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Asset allocation */}
        <Card padding="md">
          <h3 className="display font-bold text-[var(--ink)] text-sm mb-3">Allocation des actifs</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={state.wallets.map(w => ({ name: w.currency, value: Math.round(w.balanceUSD) }))}
                cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                {state.wallets.map((_, i) => (
                  <Cell key={i} fill={['#16a34a', '#0d9488', '#26a17b', '#f7931a', '#627eea'][i % 5]} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11 }}
                formatter={(v: number) => [formatUSD(v)]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {state.wallets.map((w, i) => (
              <div key={w.currency} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: ['#16a34a','#0d9488','#26a17b','#f7931a','#627eea'][i % 5] }} />
                  <span className="text-[var(--muted)]">{w.currency}</span>
                </div>
                <span className="font-semibold text-[var(--ink)] tabular">{formatUSD(w.balanceUSD)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Expense categories */}
        <Card padding="md">
          <h3 className="display font-bold text-[var(--ink)] text-sm mb-3">Catégories de dépenses</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={EXPENSE_CATEGORIES} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                {EXPENSE_CATEGORIES.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {EXPENSE_CATEGORIES.map(e => (
              <div key={e.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                <div className="flex-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--muted)]">{e.name}</span>
                    <span className="font-semibold text-[var(--ink)] tabular">{e.value}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-[var(--surface-muted)] overflow-hidden mt-0.5">
                    <motion.div className="h-full rounded-full" style={{ background: e.color }}
                      initial={{ width: 0 }} animate={{ width: `${e.value}%` }} transition={{ duration: 0.8 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent top transactions */}
      <Card padding="none">
        <div className="px-5 py-3.5 border-b border-[var(--border)]">
          <h3 className="display font-bold text-[var(--ink)] text-sm">Top transactions</h3>
        </div>
        {state.transactions.slice(0, 5).map((tx, i) => (
          <div key={tx.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < 4 ? 'border-b border-[var(--border)]' : ''}`}>
            <span className="w-5 text-xs text-[var(--muted)] tabular font-bold">{i + 1}</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tx.amount > 0 ? 'bg-green-50' : 'bg-[var(--surface-muted)]'}`}>
              {tx.amount > 0 ? <ArrowDownLeft size={13} className="text-green-600" /> : <ArrowUpRight size={13} className="text-[var(--muted)]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--ink)] truncate">{tx.description}</p>
              <p className="text-xs text-[var(--muted)]">{new Date(tx.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <p className={`text-sm font-bold tabular flex-shrink-0 ${tx.amount > 0 ? 'text-green-600' : 'text-[var(--ink)]'}`}>
              {tx.amount > 0 ? '+' : ''}{Math.abs(tx.amount).toLocaleString('fr-FR')} {tx.currency}
            </p>
          </div>
        ))}
      </Card>
    </div>
  );
}
