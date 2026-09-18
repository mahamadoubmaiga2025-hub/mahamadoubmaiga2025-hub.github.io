import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, TrendingUp, Users, Link2, QrCode, Copy, Check,
  Plus, CreditCard, Wallet, BarChart2, X
} from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Badge from '@/components/Badge';
import { toast } from 'sonner';

const MERCHANT_STATS = [
  { label: "Ventes aujourd'hui", value: '45 000 FCFA', sub: '3 transactions', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', change: '+18%' },
  { label: 'Ventes ce mois', value: '1 240 000 FCFA', sub: '87 transactions', icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50', change: '+24%' },
  { label: 'Clients uniques', value: '34', sub: 'Ce mois', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', change: '+7' },
  { label: 'Balance marchande', value: '380 000 FCFA', sub: 'Disponible', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50', change: 'Actif' },
];

const RECENT_PAYMENTS = [
  { id: 'pay_001', customer: 'Aminata S.', amount: '15 000 FCFA', method: 'Orange Money', status: 'completed' as const, time: '09:45', avatar: 'A' },
  { id: 'pay_002', customer: 'Boubacar D.', amount: '7 500 FCFA', method: 'USDC', status: 'completed' as const, time: '09:12', avatar: 'B' },
  { id: 'pay_003', customer: 'Fatoumata K.', amount: '22 500 FCFA', method: 'Wave', status: 'pending' as const, time: '08:30', avatar: 'F' },
  { id: 'pay_004', customer: 'Seydou M.', amount: '5 000 FCFA', method: 'MTN MoMo', status: 'completed' as const, time: '07:55', avatar: 'S' },
  { id: 'pay_005', customer: 'Kadiatou B.', amount: '30 000 FCFA', method: 'USDT', status: 'failed' as const, time: '07:10', avatar: 'K' },
];

const METHOD_COLORS: Record<string, string> = {
  'Orange Money': '#FF6600',
  'Wave': '#1A9EFF',
  'MTN MoMo': '#FFCC00',
  'Moov Money': '#00A551',
  'USDC': '#2563eb',
  'USDT': '#26a17b',
};

const SAVED_LINKS = [
  { id: 'AB123', desc: 'Commande n°1234', amount: '25 000 FCFA', status: 'active' as const, views: 4, created: 'Il y a 2h' },
  { id: 'XK891', desc: 'Service consultation', amount: '50 USDC', status: 'paid' as const, views: 1, created: 'Hier' },
  { id: 'PQ456', desc: 'Livraison express', amount: '10 000 FCFA', status: 'expired' as const, views: 0, created: 'Il y a 3j' },
];

function QRMini() {
  return (
    <div className="p-3 bg-white rounded-2xl shadow-inner inline-block">
      <div className="grid grid-cols-9 gap-0.5 w-32">
        {Array.from({ length: 81 }).map((_, i) => {
          const row = Math.floor(i / 9), col = i % 9;
          const corner = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
          const inner = (row >= 1 && row <= 2 && col >= 1 && col <= 2) || (row >= 1 && row <= 2 && col >= 6 && col <= 7) || (row >= 6 && row <= 7 && col >= 1 && col <= 2);
          const filled = corner || inner || (i % 3 === 0) || (i % 7 === 0);
          return <div key={i} className={`w-3.5 h-3.5 rounded-sm ${filled ? 'bg-[#0a1628]' : 'bg-transparent'}`} />;
        })}
      </div>
    </div>
  );
}

export default function MerchantPage() {
  const [tab, setTab] = useState<'dashboard' | 'create' | 'links'>('dashboard');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('FCFA');
  const [created, setCreated] = useState<{ link: string; amount: string; currency: string; desc: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<typeof RECENT_PAYMENTS[0] | null>(null);

  function createLink() {
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();
    setCreated({ link: `afriPay.me/pay/${id}`, amount, currency, desc });
    toast.success('Lien de paiement créé !');
  }

  function copyLink() {
    if (!created) return;
    navigator.clipboard.writeText(`https://${created.link}`).catch(() => {});
    setCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--ink)] flex items-center justify-center flex-shrink-0">
            <Store size={18} className="text-white" />
          </div>
          <div>
            <h2 className="display text-xl font-bold text-[var(--ink)]">Espace Marchand</h2>
            <p className="text-xs text-[var(--muted)]">Boutique AfriPay Démo · Vérifié</p>
          </div>
        </div>
        <button onClick={() => { setTab('create'); setCreated(null); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 active:scale-95 transition-all">
          <Plus size={13} /> Créer un lien
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--surface-muted)] rounded-2xl p-1">
        {[['dashboard', 'Dashboard'], ['create', 'Créer un lien'], ['links', 'Mes liens']] .map(([v, l]) => (
          <button key={v} onClick={() => { setTab(v as typeof tab); setCreated(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${tab === v ? 'bg-[var(--surface-card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}>{l}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Dashboard tab */}
        {tab === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {MERCHANT_STATS.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card padding="md">
                    <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2.5`}>
                      <s.icon size={16} className={s.color} />
                    </div>
                    <p className={`display text-lg font-bold tabular leading-tight ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-[var(--muted)] mt-0.5">{s.label}</p>
                    <p className="text-[10px] text-green-600 font-semibold mt-1">{s.change}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Payment methods breakdown */}
            <Card padding="md">
              <h3 className="display font-bold text-[var(--ink)] text-sm mb-3">Méthodes de paiement</h3>
              <div className="space-y-2.5">
                {[
                  { method: 'Orange Money', pct: 45, amount: '558 000 FCFA' },
                  { method: 'Wave', pct: 25, amount: '310 000 FCFA' },
                  { method: 'USDC', pct: 18, amount: '223 200 FCFA' },
                  { method: 'MTN MoMo', pct: 12, amount: '148 800 FCFA' },
                ].map(m => (
                  <div key={m.method}>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: METHOD_COLORS[m.method] ?? '#9ca3af' }} />
                        <span className="text-xs font-semibold text-[var(--ink)]">{m.method}</span>
                      </div>
                      <span className="text-xs text-[var(--muted)] tabular">{m.amount} · {m.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: METHOD_COLORS[m.method] ?? '#9ca3af' }}
                        initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent payments */}
            <Card padding="none">
              <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="display font-bold text-[var(--ink)] text-sm">Paiements récents</h3>
                <span className="text-xs text-[var(--muted)]">Aujourd&apos;hui</span>
              </div>
              {RECENT_PAYMENTS.map((p, i) => (
                <motion.button key={p.id}
                  onClick={() => setSelectedPayment(p)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-[var(--surface-muted)] transition-colors ${i < RECENT_PAYMENTS.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                  <div className="w-9 h-9 rounded-full bg-[var(--ink)] flex items-center justify-center text-white text-xs font-black flex-shrink-0">{p.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--ink)]">{p.customer}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: METHOD_COLORS[p.method] ?? '#9ca3af' }} />
                      <p className="text-xs text-[var(--muted)]">{p.method} · {p.time}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold tabular text-[var(--ink)]">{p.amount}</p>
                    <Badge status={p.status} />
                  </div>
                </motion.button>
              ))}
            </Card>
          </motion.div>
        )}

        {/* Create link tab */}
        {tab === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {!created ? (
              <Card padding="lg" className="space-y-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-2xl bg-brand-600 flex items-center justify-center">
                    <Link2 size={16} className="text-white" />
                  </div>
                  <h3 className="display font-bold text-[var(--ink)]">Créer une demande de paiement</h3>
                </div>
                <Input label="Description" placeholder="Commande n°1234, Consultation, Produit..." value={desc} onChange={e => setDesc(e.target.value)} fullWidth />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input label="Montant" type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} fullWidth />
                  </div>
                  <div className="w-28">
                    <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5 block">Devise</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-sm font-medium text-[var(--ink)] outline-none focus:border-brand-400 transition-all">
                      {['FCFA', 'USDC', 'USDT', 'USD'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                {/* Quick amounts */}
                <div>
                  <p className="text-xs text-[var(--muted)] mb-2">Montants rapides</p>
                  <div className="flex gap-2 flex-wrap">
                    {(currency === 'FCFA' ? [5000, 10000, 25000, 50000] : [10, 25, 50, 100]).map(q => (
                      <button key={q} onClick={() => setAmount(String(q))}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${amount === String(q) ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-[var(--border)] text-[var(--muted)] hover:border-brand-300 hover:text-[var(--ink)]'}`}>
                        {q.toLocaleString('fr-FR')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accepted methods */}
                <div>
                  <p className="text-xs text-[var(--muted)] mb-2">Méthodes acceptées automatiquement</p>
                  <div className="flex gap-2 flex-wrap">
                    {['Orange Money', 'Wave', 'MTN MoMo', 'USDC', 'USDT'].map(m => (
                      <span key={m} className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--border)] text-[10px] font-semibold text-[var(--ink)]">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: METHOD_COLORS[m] ?? '#9ca3af' }} />
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <Button variant="primary" size="lg" fullWidth disabled={!amount || !desc} onClick={createLink} icon={<Link2 size={15} />}>
                  Générer le lien de paiement
                </Button>
              </Card>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                <Card padding="lg" className="space-y-5">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <Check size={22} className="text-green-600" />
                    </div>
                    <h3 className="display font-bold text-[var(--ink)]">Lien créé !</h3>
                    {created.desc && <p className="text-sm text-[var(--muted)] mt-1">{created.desc}</p>}
                  </div>

                  <div className="text-center">
                    <p className="display text-3xl font-black text-[var(--ink)] tabular">{created.amount} {created.currency}</p>
                  </div>

                  {/* Link */}
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-brand-200 bg-green-50">
                    <CreditCard size={14} className="text-brand-600 flex-shrink-0" />
                    <span className="mono text-sm text-brand-700 flex-1 truncate">{created.link}</span>
                    <button onClick={copyLink} className="flex-shrink-0 w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors">
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>

                  {/* QR */}
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <QRMini />
                      <p className="text-xs text-[var(--muted)]">QR Code de paiement</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="secondary" size="md" fullWidth onClick={() => setCreated(null)} icon={<Plus size={13} />}>Nouveau</Button>
                    <Button variant="primary" size="md" fullWidth onClick={copyLink} icon={<Copy size={13} />}>Copier le lien</Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Links tab */}
        {tab === 'links' && (
          <motion.div key="links" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--ink)]">{SAVED_LINKS.length} liens créés</p>
              <button onClick={() => { setTab('create'); setCreated(null); }}
                className="flex items-center gap-1 text-xs text-brand-600 font-semibold hover:underline">
                <Plus size={12} /> Nouveau
              </button>
            </div>
            {SAVED_LINKS.map((link, i) => (
              <motion.div key={link.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Card padding="md" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--ink)] flex items-center justify-center flex-shrink-0">
                    <QrCode size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--ink)] text-sm mono truncate">afriPay.me/pay/{link.id}</p>
                    <p className="text-xs text-[var(--muted)]">{link.desc} · {link.amount}</p>
                    <p className="text-[10px] text-[var(--subtle)]">{link.views} vue{link.views !== 1 ? 's' : ''} · {link.created}</p>
                  </div>
                  <Badge status={link.status} />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment detail modal */}
      <AnimatePresence>
        {selectedPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setSelectedPayment(null); }}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="w-full max-w-sm">
              <Card padding="lg" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="display font-bold text-[var(--ink)]">Détail paiement</h3>
                  <button onClick={() => setSelectedPayment(null)} className="w-8 h-8 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)]">
                    <X size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[var(--ink)] flex items-center justify-center text-white font-black text-xl">{selectedPayment.avatar}</div>
                  <div>
                    <p className="font-bold text-[var(--ink)]">{selectedPayment.customer}</p>
                    <p className="display text-2xl font-black text-brand-600 tabular">{selectedPayment.amount}</p>
                  </div>
                </div>
                <div className="space-y-2.5 border-t border-[var(--border)] pt-3">
                  {[
                    { label: 'Méthode', value: selectedPayment.method },
                    { label: 'Statut', value: <Badge status={selectedPayment.status} /> },
                    { label: 'Heure', value: selectedPayment.time },
                    { label: 'Référence', value: selectedPayment.id },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-sm text-[var(--muted)]">{row.label}</span>
                      <span className="text-sm font-medium text-[var(--ink)]">{row.value}</span>
                    </div>
                  ))}
                </div>
                <Button variant="secondary" fullWidth onClick={() => setSelectedPayment(null)}>Fermer</Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
