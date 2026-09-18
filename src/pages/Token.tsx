import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Shield, Vote, Star, Store, ArrowRight, Lock } from 'lucide-react';
import Card from '@/components/Card';

const DISTRIBUTION = [
  { name: 'Communauté', value: 40, color: '#16a34a' },
  { name: 'Écosystème', value: 25, color: '#2563eb' },
  { name: 'Liquidité', value: 15, color: '#7c3aed' },
  { name: 'Trésorerie', value: 10, color: '#f59e0b' },
  { name: 'Équipe', value: 10, color: '#6b7280' },
];

const ROADMAP = [
  { phase: 'Phase 1', title: 'Conception & Audit', status: 'done', date: 'T3 2026', desc: 'Conception tokenomics, audit smart contract, whitepaper' },
  { phase: 'Phase 2', title: 'Testnet AfriPay', status: 'active', date: 'T4 2026', desc: 'Déploiement testnet, distribution communauté early, tests' },
  { phase: 'Phase 3', title: 'Mainnet & Listing', status: 'upcoming', date: 'T1 2027', desc: 'Déploiement mainnet, listing DEX, programme de récompenses' },
  { phase: 'Phase 4', title: 'Gouvernance DAO', status: 'upcoming', date: 'T2 2027', desc: 'DAO, votes communauté, expansion protocole' },
];

const UTILITIES = [
  { icon: Zap, title: 'Réduction de frais', desc: 'Jusqu\'à 50% de réduction sur les frais de transaction pour les détenteurs AFRI.' },
  { icon: Star, title: 'Récompenses d\'usage', desc: 'Gagnez des AFRI en utilisant la plateforme : paiements, conversions, dépôts.' },
  { icon: Lock, title: 'Accès Premium', desc: 'Débloquez des fonctionnalités avancées : API haut débit, analytics avancés, limites augmentées.' },
  { icon: Vote, title: 'Gouvernance', desc: 'Participez aux votes sur l\'évolution du protocole, les frais et les nouvelles fonctionnalités.' },
  { icon: Store, title: 'Avantages Marchands', desc: 'Frais réduits pour les paiements AFRI, badge marchand certifié, visibilité boostée.' },
  { icon: Shield, title: 'Staking', desc: 'Stakez vos AFRI pour contribuer à la sécurité du réseau et recevoir des récompenses.' },
];

export default function TokenPage() {
  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-4xl mx-auto space-y-6">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-8 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a3a2a 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest">Coming soon — Testnet</span>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white display">A</div>
          <h2 className="display text-3xl font-black text-white mb-2">AFRI Token</h2>
          <p className="text-gray-300 text-sm max-w-md mx-auto">Le token utilitaire de l'écosystème AfriPay. Conçu pour récompenser les utilisateurs africains et alimenter l'économie numérique du continent.</p>
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-sm mx-auto">
            {[
              { label: 'Supply totale', value: '1B AFRI' },
              { label: 'Réseau', value: 'EVM L2' },
              { label: 'Standard', value: 'ERC-20' },
            ].map(s => (
              <div key={s.label}>
                <p className="display text-lg font-black text-white">{s.value}</p>
                <p className="text-gray-400 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Utility */}
      <div>
        <h3 className="display text-lg font-bold text-[var(--ink)] mb-3">Utilité du Token</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {UTILITIES.map((u, i) => (
            <motion.div key={u.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card padding="md" hover>
                <div className="w-9 h-9 rounded-xl bg-[var(--ink)] flex items-center justify-center mb-3">
                  <u.icon size={16} className="text-white" />
                </div>
                <p className="font-bold text-[var(--ink)] text-sm mb-1">{u.title}</p>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{u.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tokenomics */}
      <Card padding="md">
        <h3 className="display text-lg font-bold text-[var(--ink)] mb-4">Tokenomics</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie data={DISTRIBUTION} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={88} strokeWidth={2} stroke="var(--surface-card)">
                {DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface-strong)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-3 w-full">
            {DISTRIBUTION.map(d => (
              <div key={d.name}>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-sm font-semibold text-[var(--ink)]">{d.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold tabular text-[var(--ink)]">{d.value}%</span>
                    <span className="text-xs text-[var(--muted)] ml-2 tabular">{(d.value * 10_000_000).toLocaleString('fr-FR')} AFRI</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: d.color }}
                    initial={{ width: 0 }} animate={{ width: `${d.value}%` }} transition={{ duration: 0.8, ease: 'easeOut', delay: DISTRIBUTION.indexOf(d) * 0.1 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Roadmap */}
      <div>
        <h3 className="display text-lg font-bold text-[var(--ink)] mb-4">Roadmap</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)]" />
          <div className="space-y-4">
            {ROADMAP.map((r, i) => (
              <motion.div key={r.phase} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex gap-4 pl-10 relative">
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 ${
                  r.status === 'done' ? 'bg-green-600 border-green-600 text-white' :
                  r.status === 'active' ? 'bg-yellow-400 border-yellow-400 text-[var(--ink)]' :
                  'bg-[var(--surface-strong)] border-[var(--border)] text-[var(--muted)]'
                }`}>{i + 1}</div>
                <Card padding="md" className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          r.status === 'done' ? 'bg-green-100 text-green-700' :
                          r.status === 'active' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-[var(--surface-muted)] text-[var(--muted)]'
                        }`}>{r.status === 'done' ? 'Terminé' : r.status === 'active' ? 'En cours' : 'À venir'}</span>
                        <span className="text-xs text-[var(--muted)]">{r.date}</span>
                      </div>
                      <p className="font-bold text-[var(--ink)] text-sm">{r.title}</p>
                      <p className="text-xs text-[var(--muted)] mt-0.5">{r.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]">
        <p className="text-xs text-[var(--muted)] text-center leading-relaxed">
          AFRI Token est un token utilitaire. Il ne constitue pas un investissement, une valeur mobilière ou une promesse de rendement. Cette page est présentée à des fins de démonstration produit uniquement.
        </p>
      </div>
    </div>
  );
}
