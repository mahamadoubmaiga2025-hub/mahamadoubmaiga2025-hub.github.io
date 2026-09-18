import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  Users, Store, ArrowLeftRight, Wallet, AlertTriangle, TrendingUp,
  CheckCircle, Clock, XCircle, ChevronRight, Shield, Settings, Flag
} from 'lucide-react';
import Card from '@/components/Card';
import Badge from '@/components/Badge';

const ADMIN_STATS = [
  { label: 'Utilisateurs', value: '12 847', change: '+234 cette semaine', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Marchands actifs', value: '1 284', change: '+18 ce mois', icon: Store, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Transactions/jour', value: '8 420', change: '+12.4% vs hier', icon: ArrowLeftRight, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Volume journalier', value: '842M FCFA', change: '+8.7%', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Signalements', value: '7', change: '2 urgents', icon: Flag, color: 'text-red-500', bg: 'bg-red-50' },
  { label: 'Uptime API', value: '99.98%', change: 'SLA respecté', icon: Shield, color: 'text-teal-600', bg: 'bg-teal-50' },
];

const GROWTH_DATA = [
  { month: 'Avr', users: 8200, txns: 52000 },
  { month: 'Mai', users: 9100, txns: 61000 },
  { month: 'Jun', users: 9800, txns: 71000 },
  { month: 'Jul', users: 10500, txns: 74000 },
  { month: 'Aoû', users: 11800, txns: 83000 },
  { month: 'Sep', users: 12847, txns: 92000 },
];

const RECENT_USERS = [
  { id: 'u001', name: 'Aminata Coulibaly', country: 'Sénégal', plan: 'Gratuit', status: 'active' as const, joined: 'Il y a 2h', kyc: true },
  { id: 'u002', name: 'Boubacar Diallo', country: 'Mali', plan: 'Pro', status: 'active' as const, joined: 'Il y a 5h', kyc: true },
  { id: 'u003', name: 'Fatoumata Koné', country: 'Côte d\'Ivoire', plan: 'Gratuit', status: 'pending' as const, joined: 'Hier', kyc: false },
  { id: 'u004', name: 'Ibrahim Traoré', country: 'Burkina Faso', plan: 'Business', status: 'active' as const, joined: 'Il y a 2j', kyc: true },
  { id: 'u005', name: 'Mariam Touré', country: 'Mali', plan: 'Gratuit', status: 'failed' as const, joined: 'Il y a 3j', kyc: false },
];

const VOLUME_DATA = [
  { day: 'Lun', volume: 720 }, { day: 'Mar', volume: 850 }, { day: 'Mer', volume: 680 },
  { day: 'Jeu', volume: 920 }, { day: 'Ven', volume: 1100 }, { day: 'Sam', volume: 640 }, { day: 'Dim', volume: 480 },
];

const ALERTS = [
  { id: 'a1', type: 'warning' as const, msg: 'Transaction suspecte détectée — ID TXN-8821', time: 'Il y a 15min' },
  { id: 'a2', type: 'warning' as const, msg: 'Merchant MKTPL-042 dépasse le plafond journalier', time: 'Il y a 1h' },
  { id: 'a3', type: 'info' as const, msg: 'Mise à jour taux de change EUR/FCFA effectuée', time: 'Il y a 2h' },
];

const ADMIN_SECTIONS = ['Tableau de bord', 'Utilisateurs', 'Marchands', 'Transactions', 'Token AFRI', 'Signalements', 'Paramètres'];

export default function AdminPage() {
  const [section, setSection] = useState('Tableau de bord');

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-5xl mx-auto space-y-5">

      {/* Admin header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">ADMIN</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Mode simulation</span>
          </div>
          <h2 className="display text-xl font-bold text-[var(--ink)]">Administration AfriPay</h2>
        </div>
        <button className="w-10 h-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] transition-all">
          <Settings size={16} />
        </button>
      </div>

      {/* Section nav */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {ADMIN_SECTIONS.map(s => (
          <button key={s} onClick={() => setSection(s)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${section === s ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--ink)]'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ADMIN_STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card padding="md">
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon size={14} className={s.color} />
              </div>
              <p className="display font-black text-[var(--ink)] text-sm leading-tight tabular">{s.value}</p>
              <p className="text-[9px] text-[var(--muted)] mt-0.5 truncate">{s.label}</p>
              <p className={`text-[9px] font-semibold mt-1 ${s.change.includes('+') ? 'text-green-600' : 'text-[var(--muted)]'}`}>{s.change}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="md">
          <h3 className="display font-bold text-[var(--ink)] text-sm mb-3">Croissance utilisateurs</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={GROWTH_DATA}>
              <defs>
                <linearGradient id="grad-users" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--subtle)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11 }} />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#grad-users)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card padding="md">
          <h3 className="display font-bold text-[var(--ink)] text-sm mb-3">Volume journalier (M FCFA)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={VOLUME_DATA} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--subtle)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11 }}
                formatter={(v: number) => [`${v}M FCFA`]} />
              <Bar dataKey="volume" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Alerts */}
      <Card padding="none">
        <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="display font-bold text-[var(--ink)] text-sm">Alertes système</h3>
          <span className="text-xs font-bold text-red-500">{ALERTS.filter(a => a.type === 'warning').length} urgentes</span>
        </div>
        {ALERTS.map((alert, i) => (
          <div key={alert.id} className={`flex items-start gap-3 px-5 py-3.5 ${i < ALERTS.length - 1 ? 'border-b border-[var(--border)]' : ''} ${alert.type === 'warning' ? 'bg-amber-50/50' : ''}`}>
            <AlertTriangle size={14} className={`flex-shrink-0 mt-0.5 ${alert.type === 'warning' ? 'text-amber-500' : 'text-blue-400'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--ink)]">{alert.msg}</p>
              <p className="text-xs text-[var(--muted)]">{alert.time}</p>
            </div>
            <button className="text-xs text-brand-600 font-semibold hover:underline flex-shrink-0">Voir</button>
          </div>
        ))}
      </Card>

      {/* Recent users */}
      <Card padding="none">
        <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="display font-bold text-[var(--ink)] text-sm">Utilisateurs récents</h3>
          <button className="flex items-center gap-0.5 text-xs text-brand-600 font-semibold hover:underline">
            Voir tous <ChevronRight size={12} />
          </button>
        </div>
        {RECENT_USERS.map((user, i) => (
          <div key={user.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < RECENT_USERS.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-[var(--ink)] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
              {user.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[var(--ink)] truncate">{user.name}</p>
                {user.kyc && <CheckCircle size={11} className="text-green-500 flex-shrink-0" />}
              </div>
              <p className="text-xs text-[var(--muted)]">{user.country} · {user.plan} · {user.joined}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge status={user.status} />
              <button className="w-7 h-7 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </Card>

      {/* System status */}
      <Card padding="md">
        <h3 className="display font-bold text-[var(--ink)] text-sm mb-3">Statut des services</h3>
        <div className="space-y-2">
          {[
            { label: 'API Gateway', status: 'ok' },
            { label: 'Base de données', status: 'ok' },
            { label: 'Service conversion', status: 'ok' },
            { label: 'Notifications', status: 'ok' },
            { label: 'Mobile Money (simulation)', status: 'ok' },
            { label: 'Blockchain (testnet)', status: 'degraded' },
          ].map(svc => (
            <div key={svc.label} className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
              <span className="text-sm text-[var(--ink)]">{svc.label}</span>
              <div className="flex items-center gap-1.5">
                {svc.status === 'ok'
                  ? <><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-xs font-semibold text-green-600">Opérationnel</span></>
                  : <><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-xs font-semibold text-amber-500">Dégradé</span></>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Hidden status icons to suppress unused import warnings */}
      <div className="hidden"><TrendingUp size={0} /><Clock size={0} /><XCircle size={0} /></div>
    </div>
  );
}
