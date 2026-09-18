import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Card from '@/components/Card';

type Period = '7J' | '30J' | '90J' | '1A';

const PORTFOLIO_DATA: Record<Period, { label: string; value: number }[]> = {
  '7J': [
    { label: 'L', value: 1890 }, { label: 'M', value: 1920 }, { label: 'Me', value: 1975 },
    { label: 'J', value: 1960 }, { label: 'V', value: 2010 }, { label: 'S', value: 2045 }, { label: 'D', value: 2073 },
  ],
  '30J': Array.from({ length: 15 }, (_, i) => ({ label: String(i * 2 + 1), value: 1650 + i * 28 + Math.random() * 20 })),
  '90J': Array.from({ length: 12 }, (_, i) => ({ label: `S${i + 1}`, value: 1200 + i * 80 + Math.random() * 30 })),
  '1A': [
    { label: 'Oct', value: 980 }, { label: 'Nov', value: 1050 }, { label: 'Déc', value: 1120 },
    { label: 'Jan', value: 1240 }, { label: 'Fév', value: 1350 }, { label: 'Mar', value: 1280 },
    { label: 'Avr', value: 1420 }, { label: 'Mai', value: 1550 }, { label: 'Jun', value: 1680 },
    { label: 'Jul', value: 1820 }, { label: 'Aoû', value: 1950 }, { label: 'Sep', value: 2073 },
  ],
};

const SPEND_DATA: Record<Period, { label: string; revenus: number; depenses: number }[]> = {
  '7J': [
    { label: 'L', revenus: 75000, depenses: 45000 }, { label: 'M', revenus: 50000, depenses: 25000 },
    { label: 'Me', revenus: 120000, depenses: 60000 }, { label: 'J', revenus: 80000, depenses: 40000 },
    { label: 'V', revenus: 95000, depenses: 70000 }, { label: 'S', revenus: 60000, depenses: 30000 },
    { label: 'D', revenus: 40000, depenses: 20000 },
  ],
  '30J': Array.from({ length: 10 }, (_, i) => ({ label: String(i * 3 + 1), revenus: 80000 + i * 8000, depenses: 40000 + i * 4000 })),
  '90J': Array.from({ length: 9 }, (_, i) => ({ label: `S${i * 2 + 1}`, revenus: 250000 + i * 20000, depenses: 150000 + i * 10000 })),
  '1A': [
    { label: 'Oct', revenus: 420000, depenses: 280000 }, { label: 'Nov', revenus: 460000, depenses: 310000 },
    { label: 'Déc', revenus: 520000, depenses: 380000 }, { label: 'Jan', revenus: 490000, depenses: 340000 },
    { label: 'Fév', revenus: 550000, depenses: 360000 }, { label: 'Mar', revenus: 580000, depenses: 390000 },
    { label: 'Avr', revenus: 620000, depenses: 410000 }, { label: 'Mai', revenus: 680000, depenses: 440000 },
    { label: 'Jun', revenus: 720000, depenses: 470000 }, { label: 'Jul', revenus: 760000, depenses: 490000 },
    { label: 'Aoû', revenus: 800000, depenses: 510000 }, { label: 'Sep', revenus: 840000, depenses: 520000 },
  ],
};

const ASSET_DISTRIBUTION = [
  { name: 'FCFA', value: 59.8, color: '#16a34a' },
  { name: 'USDC', value: 24.1, color: '#2563eb' },
  { name: 'USDT', value: 12.1, color: '#7c3aed' },
  { name: 'BTC', value: 4.0, color: '#f59e0b' },
];

const KPI_DATA: Record<Period, { total: string; revenus: string; depenses: string; transfers: string; revChange: number; depChange: number }> = {
  '7J':  { total: '2 073 USD', revenus: '520 000 FCFA', depenses: '290 000 FCFA', transfers: '250 USD',  revChange: +12.4, depChange: -3.2 },
  '30J': { total: '2 073 USD', revenus: '3 370 000 FCFA', depenses: '2 550 000 FCFA', transfers: '1 250 USD', revChange: +8.7, depChange: +2.1 },
  '90J': { total: '2 073 USD', revenus: '8 100 000 FCFA', depenses: '5 400 000 FCFA', transfers: '3 740 USD', revChange: +22.1, depChange: -1.4 },
  '1A':  { total: '2 073 USD', revenus: '26 800 000 FCFA', depenses: '17 200 000 FCFA', transfers: '12 000 USD', revChange: +31.4, depChange: +4.8 },
};

const PERIODS: Period[] = ['7J', '30J', '90J', '1A'];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30J');
  const kpi = KPI_DATA[period];

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="display text-xl font-bold text-[var(--ink)]">Analytics</h2>
        <div className="flex gap-1 bg-[var(--surface-muted)] rounded-xl p-1">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${period === p ? 'bg-[var(--surface-strong)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Valeur portfolio', value: kpi.total, icon: RefreshCw, change: +8.4, color: 'text-[var(--ink)]' },
          { label: 'Revenus', value: kpi.revenus, icon: ArrowDownLeft, change: kpi.revChange, color: 'text-green-600' },
          { label: 'Dépenses', value: kpi.depenses, icon: ArrowUpRight, change: kpi.depChange, color: 'text-[var(--ink)]' },
          { label: 'Transferts', value: kpi.transfers, icon: TrendingUp, change: +14.2, color: 'text-blue-600' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card padding="md">
              <p className="text-xs text-[var(--muted)] font-medium mb-1">{k.label}</p>
              <p className={`display text-lg font-bold tabular ${k.color}`}>{k.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${k.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {k.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {k.change > 0 ? '+' : ''}{k.change}% vs période préc.
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Portfolio chart */}
      <Card padding="md">
        <h3 className="display font-bold text-[var(--ink)] mb-4 text-sm">Évolution du portefeuille (USD)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={PORTFOLIO_DATA[period]}>
            <defs>
              <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ background: 'var(--surface-strong)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
              formatter={(v: number) => [`$${v.toFixed(0)}`, 'Valeur']} />
            <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} fill="url(#pg)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Revenus vs Dépenses */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card padding="md">
          <h3 className="display font-bold text-[var(--ink)] mb-4 text-sm">Revenus vs Dépenses (FCFA)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={SPEND_DATA[period]}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--surface-strong)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [v.toLocaleString('fr-FR') + ' FCFA']} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="revenus" fill="#16a34a" radius={[4, 4, 0, 0]} name="Revenus" />
              <Bar dataKey="depenses" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Dépenses" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Asset distribution */}
        <Card padding="md">
          <h3 className="display font-bold text-[var(--ink)] mb-4 text-sm">Répartition des actifs</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={ASSET_DISTRIBUTION} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={68} strokeWidth={0}>
                  {ASSET_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {ASSET_DISTRIBUTION.map(a => (
                <div key={a.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: a.color }} />
                    <span className="text-xs font-semibold text-[var(--ink)]">{a.name}</span>
                  </div>
                  <span className="text-xs text-[var(--muted)] tabular font-medium">{a.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Payment methods breakdown */}
      <Card padding="md">
        <h3 className="display font-bold text-[var(--ink)] mb-4 text-sm">Sources de revenus</h3>
        <div className="space-y-3">
          {[
            { label: 'Orange Money', pct: 55, amount: '185 350 FCFA', color: '#FF6600' },
            { label: 'USDC / Crypto', pct: 25, amount: '84 250 FCFA', color: '#2563eb' },
            { label: 'Wave', pct: 13, amount: '43 810 FCFA', color: '#1A9EFF' },
            { label: 'Autres', pct: 7, amount: '23 590 FCFA', color: '#9ca3af' },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold text-[var(--ink)]">{s.label}</span>
                <span className="text-xs text-[var(--muted)] tabular">{s.amount} · {s.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: s.color }}
                  initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
