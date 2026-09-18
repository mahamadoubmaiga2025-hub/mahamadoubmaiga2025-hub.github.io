import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Store, Activity, Wallet, BarChart2, AlertTriangle, Settings, TrendingUp, TrendingDown, Eye, Ban, Check, Shield } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/Card';
import Badge from '@/components/Badge';

const ADMIN_STATS = [
  { label: 'Utilisateurs', value: '12,847', change: +14.2, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Marchands', value: '384', change: +22.5, icon: Store, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Transactions/j', value: '2,140', change: +8.1, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Volume (30j)', value: '847M FCFA', change: +31.4, icon: BarChart2, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const USERS_DATA = [
  { day: 'L', users: 1200, txn: 450 },
  { day: 'M', users: 1350, txn: 520 },
  { day: 'Me', users: 1280, txn: 490 },
  { day: 'J', users: 1420, txn: 610 },
  { day: 'V', users: 1680, txn: 720 },
  { day: 'S', users: 1580, txn: 680 },
  { day: 'D', users: 1200, txn: 380 },
];

const RECENT_USERS = [
  { id: 'u1', name: 'Amadou Koné', email: 'amadou@gmail.com', country: 'Mali', status: 'active', joined: 'Auj. 09:12', kyc: true },
  { id: 'u2', name: 'Fatima Diallo', email: 'fatima@yahoo.fr', country: 'Sénégal', status: 'active', joined: 'Auj. 07:45', kyc: false },
  { id: 'u3', name: 'Ibrahim Touré', email: 'ibrahim@hotmail.com', country: 'CI', status: 'pending', joined: 'Hier 22:10', kyc: false },
  { id: 'u4', name: 'Mariam Coulibaly', email: 'mariam@gmail.com', country: 'Burkina', status: 'active', joined: 'Hier 14:30', kyc: true },
];

const FLAGS = [
  { id: 'f1', type: 'Connexion suspecte', user: 'user_XK912', country: 'Nigeria → Mali', severity: 'high', time: '08:32' },
  { id: 'f2', type: 'Volume anormal', user: 'merchant_PY44', country: 'CI', severity: 'medium', time: 'Hier 23:11' },
  { id: 'f3', type: 'Doublon KYC', user: 'user_AB124', country: 'Mali', severity: 'low', time: 'Il y a 2j' },
];

const TABS = ['Vue générale', 'Utilisateurs', 'Marchands', 'Transactions', 'Signalements', 'Paramètres'];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Vue générale');

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-5xl mx-auto space-y-5">
      {/* Admin badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200">
          <Shield size={14} className="text-red-600" />
          <span className="text-xs font-bold text-red-700">ADMIN</span>
        </div>
        <h2 className="display text-xl font-bold text-[var(--ink)]">Dashboard Administrateur</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--ink)]'
            }`}>{tab}</button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ADMIN_STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card padding="md">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon size={16} className={s.color} />
              </div>
              <p className={`display text-xl font-bold ${s.color} tabular`}>{s.value}</p>
              <p className="text-xs text-[var(--muted)]">{s.label}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${s.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {s.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {s.change > 0 ? '+' : ''}{s.change}% cette semaine
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card padding="md">
          <h3 className="display font-bold text-[var(--ink)] mb-4">Nouveaux utilisateurs / 7j</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={USERS_DATA}>
              <defs>
                <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--surface-strong)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} fill="url(#ug)" dot={false} name="Utilisateurs" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="md">
          <h3 className="display font-bold text-[var(--ink)] mb-4">Transactions / 7j</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={USERS_DATA}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--surface-strong)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="txn" fill="#16a34a" radius={[4, 4, 0, 0]} name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent users */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="display font-bold text-[var(--ink)]">Utilisateurs récents</h3>
          <button className="text-xs text-brand-600 font-semibold hover:underline">Voir tous</button>
        </div>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="text-left">
                {['Utilisateur', 'Pays', 'Statut', 'KYC', 'Inscrit', 'Actions'].map(h => (
                  <th key={h} className="pb-2 pr-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_USERS.map(u => (
                <tr key={u.id} className="border-t border-[var(--border)] hover:bg-[var(--surface-muted)] transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--ink)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--ink)]">{u.name}</p>
                        <p className="text-xs text-[var(--muted)]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-[var(--muted)] text-xs">{u.country}</td>
                  <td className="py-3 pr-4"><Badge status={u.status as 'active' | 'pending'} /></td>
                  <td className="py-3 pr-4">
                    {u.kyc ? <span className="text-green-600 text-xs font-semibold flex items-center gap-1"><Check size={11} />Vérifié</span>
                      : <span className="text-yellow-600 text-xs font-semibold">En attente</span>}
                  </td>
                  <td className="py-3 pr-4 text-xs text-[var(--muted)]">{u.joined}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-[var(--muted)] hover:text-blue-600 transition-colors" title="Voir"><Eye size={13} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--muted)] hover:text-red-500 transition-colors" title="Bloquer"><Ban size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Signalements */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="display font-bold text-[var(--ink)] flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" />Signalements</h3>
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">{FLAGS.length}</span>
        </div>
        <div className="space-y-3">
          {FLAGS.map(f => (
            <div key={f.id} className="flex items-center gap-3 py-2.5 border-b border-[var(--border)] last:border-0">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${f.severity === 'high' ? 'bg-red-500' : f.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-400'}`} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--ink)]">{f.type}</p>
                <p className="text-xs text-[var(--muted)]">{f.user} · {f.country}</p>
              </div>
              <p className="text-xs text-[var(--muted)]">{f.time}</p>
              <div className="flex gap-1">
                <button className="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors">Résoudre</button>
                <button className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors">Bloquer</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
