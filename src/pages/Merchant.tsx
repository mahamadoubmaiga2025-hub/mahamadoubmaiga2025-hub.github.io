import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, TrendingUp, Users, Link, QrCode, Copy, Check, Plus, X } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Badge from '@/components/Badge';
import { toast } from 'sonner';

const MERCHANT_STATS = [
  { label: "Ventes aujourd'hui", value: '45 000 FCFA', sub: '3 transactions', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Ventes ce mois', value: '1 240 000 FCFA', sub: '87 transactions', icon: Store, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Clients uniques', value: '34', sub: 'Ce mois', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const RECENT_PAYMENTS = [
  { id: 'pay_001', customer: 'Aminata S.', amount: '15 000 FCFA', method: 'Orange Money', status: 'completed' as const, time: '09:45' },
  { id: 'pay_002', customer: 'Boubacar D.', amount: '7 500 FCFA', method: 'USDC', status: 'completed' as const, time: '09:12' },
  { id: 'pay_003', customer: 'Fatoumata K.', amount: '22 500 FCFA', method: 'Wave', status: 'pending' as const, time: '08:30' },
];

export default function MerchantPage() {
  const [tab, setTab] = useState<'dashboard' | 'create' | 'links'>('dashboard');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('FCFA');
  const [created, setCreated] = useState<{ link: string; amount: string; currency: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function createLink() {
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();
    setCreated({ link: `afriPay.me/pay/${id}`, amount, currency });
    toast.success('Lien de paiement créé');
  }

  function copyLink() {
    if (!created) return;
    navigator.clipboard.writeText(`https://${created.link}`).catch(() => {});
    setCopied(true);
    toast.success('Lien copié');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[var(--ink)] flex items-center justify-center">
          <Store size={18} className="text-white" />
        </div>
        <div>
          <h2 className="display text-xl font-bold text-[var(--ink)]">Espace Marchand</h2>
          <p className="text-xs text-[var(--muted)]">Boutique AfriPay Démo</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--surface-muted)] rounded-2xl p-1">
        {[['dashboard', 'Dashboard'], ['create', 'Créer un lien'], ['links', 'Mes liens']].map(([v, l]) => (
          <button key={v} onClick={() => { setTab(v as typeof tab); setCreated(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${tab === v ? 'bg-[var(--surface-strong)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'}`}>{l}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* KPIs */}
            <div className="grid sm:grid-cols-3 gap-3">
              {MERCHANT_STATS.map(s => (
                <Card key={s.label} padding="md">
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                    <s.icon size={16} className={s.color} />
                  </div>
                  <p className={`display text-xl font-bold tabular ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-[var(--muted)]">{s.label}</p>
                  <p className="text-xs text-[var(--subtle)] mt-0.5">{s.sub}</p>
                </Card>
              ))}
            </div>

            {/* Recent */}
            <Card padding="none">
              <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="display font-bold text-[var(--ink)] text-sm">Paiements récents</h3>
                <button onClick={() => setTab('create')} className="flex items-center gap-1 text-xs text-brand-600 font-semibold hover:underline">
                  <Plus size={12} /> Créer
                </button>
              </div>
              {RECENT_PAYMENTS.map((p, i) => (
                <div key={p.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < RECENT_PAYMENTS.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                  <div className="w-9 h-9 rounded-full bg-[var(--ink)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {p.customer[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--ink)]">{p.customer}</p>
                    <p className="text-xs text-[var(--muted)]">{p.method} · {p.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular text-[var(--ink)]">{p.amount}</p>
                    <Badge status={p.status} />
                  </div>
                </div>
              ))}
            </Card>
          </motion.div>
        )}

        {tab === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {!created ? (
              <Card padding="md" className="space-y-4">
                <h3 className="display font-bold text-[var(--ink)]">Créer une demande de paiement</h3>
                <Input label="Description" placeholder="Commande n°1234, Service..." value={desc} onChange={e => setDesc(e.target.value)} fullWidth />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input label="Montant" type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} fullWidth />
                  </div>
                  <div className="w-32">
                    <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5 block">Devise</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-sm font-medium text-[var(--ink)] outline-none focus:border-brand-400 transition-all">
                      {['FCFA', 'USDC', 'USDT'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <Button variant="primary" size="lg" fullWidth disabled={!amount || !desc} onClick={createLink} icon={<Link size={15} />}>
                  Générer le lien
                </Button>
              </Card>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card padding="lg" className="space-y-5">
                  <h3 className="display font-bold text-[var(--ink)] text-center">Lien créé</h3>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-brand-200 bg-green-50">
                    <Link size={14} className="text-brand-600 flex-shrink-0" />
                    <span className="mono text-sm text-brand-700 flex-1 truncate">{created.link}</span>
                    <button onClick={copyLink} className="flex-shrink-0 w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors">
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="display text-2xl font-bold text-[var(--ink)] tabular">{amount} {currency}</p>
                    {desc && <p className="text-sm text-[var(--muted)] mt-0.5">{desc}</p>}
                  </div>
                  {/* QR */}
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-2xl shadow-inner">
                      <div className="grid grid-cols-9 gap-0.5 w-36">
                        {Array.from({ length: 81 }).map((_, i) => {
                          const row = Math.floor(i / 9), col = i % 9;
                          const corner = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
                          const inner = (row >= 1 && row <= 2 && col >= 1 && col <= 2) || (row >= 1 && row <= 2 && col >= 6 && col <= 7) || (row >= 6 && row <= 7 && col >= 1 && col <= 2);
                          const filled = corner || inner || (i % 3 === 0) || (i % 7 === 0);
                          return <div key={i} className={`w-4 h-4 rounded-sm ${filled ? 'bg-[#0a1628]' : 'bg-transparent'}`} />;
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="md" fullWidth onClick={() => setCreated(null)}>Nouveau</Button>
                    <Button variant="primary" size="md" fullWidth onClick={copyLink} icon={<Copy size={13} />}>Copier</Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {tab === 'links' && (
          <motion.div key="links" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            {[
              { id: 'AB123', amount: '25 000 FCFA', status: 'active' as const, views: 4, created: 'Il y a 2h' },
              { id: 'XK891', amount: '50 USDC', status: 'paid' as const, views: 1, created: 'Hier' },
              { id: 'PQ456', amount: '10 000 FCFA', status: 'expired' as const, views: 0, created: 'Il y a 3j' },
            ].map(link => (
              <Card key={link.id} padding="md" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--ink)] flex items-center justify-center flex-shrink-0">
                  <QrCode size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[var(--ink)] text-sm mono">afriPay.me/pay/{link.id}</p>
                  <p className="text-xs text-[var(--muted)]">{link.amount} · {link.views} vue{link.views !== 1 ? 's' : ''} · {link.created}</p>
                </div>
                <Badge status={link.status} />
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
