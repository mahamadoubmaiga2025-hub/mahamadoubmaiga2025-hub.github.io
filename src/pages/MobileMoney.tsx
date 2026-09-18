import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp, Check, Info, ChevronRight, Smartphone } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { sleep } from '@/utils/format';
import { toast } from 'sonner';

const PROVIDERS = [
  {
    id: 'orange',
    name: 'Orange Money',
    shortName: 'OM',
    color: '#FF6600',
    bg: '#FFF3E0',
    countries: ['Mali', 'Sénégal', 'Côte d\'Ivoire', 'Burkina Faso'],
    minAmount: 500,
    maxAmount: 2000000,
    fees: 0.015,
    desc: 'Disponible 24h/24',
  },
  {
    id: 'wave',
    name: 'Wave',
    shortName: 'W',
    color: '#1A9EFF',
    bg: '#E3F2FD',
    countries: ['Sénégal', 'Côte d\'Ivoire', 'Mali'],
    minAmount: 200,
    maxAmount: 1500000,
    fees: 0.01,
    desc: 'Frais réduits 1%',
  },
  {
    id: 'moov',
    name: 'Moov Money',
    shortName: 'MM',
    color: '#00A551',
    bg: '#E8F5E9',
    countries: ['Côte d\'Ivoire', 'Bénin', 'Togo', 'Burkina Faso'],
    minAmount: 500,
    maxAmount: 1000000,
    fees: 0.015,
    desc: 'Réseau étendu',
  },
  {
    id: 'mtn',
    name: 'MTN MoMo',
    shortName: 'MTN',
    color: '#FFCC00',
    bg: '#FFFDE7',
    countries: ['Ghana', 'Nigeria', 'Côte d\'Ivoire', 'Bénin'],
    minAmount: 1000,
    maxAmount: 3000000,
    fees: 0.015,
    desc: 'Leader en Afrique',
  },
];

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000, 250000];

type Direction = 'in' | 'out';
type Step = 'select' | 'input' | 'confirm' | 'success';

export default function MobileMoneyPage() {
  const [provider, setProvider] = useState<string | null>(null);
  const [direction, setDirection] = useState<Direction>('in');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<Step>('select');
  const [loading, setLoading] = useState(false);

  const sel = PROVIDERS.find(p => p.id === provider);
  const num = parseFloat(amount) || 0;
  const fees = Math.round(num * (sel?.fees ?? 0.015));
  const net = num - fees;

  async function confirm() {
    setLoading(true);
    await sleep(2000);
    setLoading(false);
    setStep('success');
    toast.success(direction === 'in' ? 'Dépôt initié avec succès' : 'Retrait initié avec succès');
  }

  function reset() { setStep('select'); setProvider(null); setPhone(''); setAmount(''); }

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-lg mx-auto space-y-5">
      <div>
        <h2 className="display text-xl font-bold text-[var(--ink)]">Mobile Money</h2>
        <p className="text-xs text-[var(--muted)] mt-0.5">Dépôts et retraits simulés — MVP</p>
      </div>

      {/* Direction toggle */}
      <div className="flex p-1 bg-[var(--surface-muted)] rounded-2xl">
        {[
          { val: 'in' as Direction, label: 'Mobile Money → AfriPay', icon: ArrowDown, iconColor: 'text-green-600' },
          { val: 'out' as Direction, label: 'AfriPay → Mobile Money', icon: ArrowUp, iconColor: 'text-blue-500' },
        ].map(d => (
          <button key={d.val}
            onClick={() => { setDirection(d.val); if (provider) setStep('input'); else setStep('select'); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${direction === d.val ? 'bg-[var(--surface-card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}>
            <d.icon size={13} className={direction === d.val ? d.iconColor : ''} />
            <span className="hidden sm:inline">{d.label}</span>
            <span className="sm:hidden">{d.val === 'in' ? 'Dépôt' : 'Retrait'}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1 — Select provider */}
        {step === 'select' && (
          <motion.div key="select" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
            <p className="text-sm font-semibold text-[var(--ink)]">Choisissez votre fournisseur</p>
            {PROVIDERS.map((p, i) => (
              <motion.button key={p.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => { setProvider(p.id); setStep('input'); }}
                className="w-full flex items-center gap-4 p-4 rounded-3xl border border-[var(--border)] bg-[var(--surface-card)] hover:border-brand-400 hover:shadow-card active:scale-[0.99] transition-all text-left">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-black text-sm"
                  style={{ background: p.color }}>
                  {p.shortName}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[var(--ink)]">{p.name}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-700">{(p.fees * 100).toFixed(0)}% frais</span>
                  </div>
                  <p className="text-xs text-[var(--muted)] truncate">{p.countries.join(' · ')}</p>
                  <p className="text-[10px] text-[var(--subtle)] mt-0.5">{p.desc}</p>
                </div>
                <ChevronRight size={16} className="text-[var(--muted)] flex-shrink-0" />
              </motion.button>
            ))}
            <p className="text-xs text-center text-[var(--muted)] px-4 py-2 bg-amber-50 border border-amber-100 rounded-2xl">
              Ces intégrations sont simulées dans cette version MVP.
            </p>
          </motion.div>
        )}

        {/* Step 2 — Input */}
        {step === 'input' && sel && (
          <motion.div key="input" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            {/* Selected provider */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                style={{ background: sel.color }}>
                {sel.shortName}
              </div>
              <p className="font-bold text-[var(--ink)] flex-1">{sel.name}</p>
              <button onClick={() => { setProvider(null); setStep('select'); }} className="text-xs text-brand-600 font-semibold hover:underline">Changer</button>
            </div>

            <Input label="Numéro de téléphone"
              placeholder="+223 76 00 00 00" type="tel"
              value={phone} onChange={e => setPhone(e.target.value)} fullWidth
              prefix={<Smartphone size={14} />} />

            <div>
              <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Montant (FCFA)</label>
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/10 transition-all">
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0" className="flex-1 bg-transparent outline-none display text-2xl font-bold text-[var(--ink)] tabular placeholder:text-[var(--subtle)]" />
                <span className="font-bold text-[var(--muted)]">FCFA</span>
              </div>
              {/* Quick amounts */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                {QUICK_AMOUNTS.map(q => (
                  <button key={q} onClick={() => setAmount(String(q))}
                    className={`py-1.5 rounded-xl border text-xs font-semibold transition-all ${amount === String(q) ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-[var(--border)] text-[var(--muted)] hover:border-brand-300 hover:text-[var(--ink)]'}`}>
                    {q.toLocaleString('fr-FR')}
                  </button>
                ))}
              </div>
              {num > 0 && (
                <div className="flex justify-between mt-2 px-1 text-xs text-[var(--muted)]">
                  <span>Frais : <span className="font-semibold text-[var(--ink)]">{fees.toLocaleString('fr-FR')} FCFA</span></span>
                  <span>{direction === 'in' ? 'Crédit' : 'Retrait net'} : <span className="font-bold text-brand-600">{net.toLocaleString('fr-FR')} FCFA</span></span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
              <Info size={13} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                {direction === 'in'
                  ? 'Vous recevrez une notification USSD sur votre téléphone pour confirmer.'
                  : 'Le montant net sera envoyé sur votre numéro dans quelques instants.'}
              </p>
            </div>

            <Button variant="primary" size="lg" fullWidth
              disabled={!phone.trim() || !num || num < (sel.minAmount ?? 0)}
              onClick={() => setStep('confirm')}>
              Continuer
            </Button>
          </motion.div>
        )}

        {/* Step 3 — Confirm */}
        {step === 'confirm' && sel && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <Card padding="lg">
              <h3 className="display font-bold text-[var(--ink)] mb-4 text-center">Confirmer</h3>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black mx-auto mb-4"
                style={{ background: sel.color }}>
                <span className="text-lg">{sel.shortName}</span>
              </div>
              <div className="space-y-3 border-t border-[var(--border)] pt-4">
                {[
                  { label: 'Opération', value: direction === 'in' ? 'Dépôt depuis Mobile Money' : 'Retrait vers Mobile Money' },
                  { label: 'Fournisseur', value: sel.name },
                  { label: 'Numéro', value: phone },
                  { label: direction === 'in' ? 'Montant déposé' : 'Montant retiré', value: `${num.toLocaleString('fr-FR')} FCFA`, bold: true },
                  { label: `Frais (${(sel.fees * 100).toFixed(0)}%)`, value: `${fees.toLocaleString('fr-FR')} FCFA` },
                  { label: 'Montant net', value: `${net.toLocaleString('fr-FR')} FCFA`, bold: true },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted)]">{row.label}</span>
                    <span className={`text-sm tabular ${row.bold ? 'font-bold text-[var(--ink)]' : 'text-[var(--ink)]'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" fullWidth onClick={() => setStep('input')}>Modifier</Button>
              <Button variant="primary" size="lg" fullWidth loading={loading} onClick={confirm}>
                {direction === 'in' ? 'Déposer' : 'Retirer'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4 — Success */}
        {step === 'success' && sel && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-5 py-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={32} className="text-green-600" />
            </div>
            <div>
              <p className="display text-2xl font-black text-[var(--ink)]">
                {direction === 'in' ? 'Dépôt initié !' : 'Retrait initié !'}
              </p>
              <p className="text-[var(--muted)] text-sm mt-1">
                {num.toLocaleString('fr-FR')} FCFA via {sel.name}
              </p>
            </div>
            <Card padding="md" className="w-full text-left space-y-2">
              {[
                { label: 'Fournisseur', value: sel.name },
                { label: 'Numéro', value: phone },
                { label: 'Net', value: `${net.toLocaleString('fr-FR')} FCFA` },
                { label: 'Référence', value: `MM-${Date.now().toString(36).toUpperCase()}` },
                { label: 'Statut', value: '⏳ En attente de confirmation USSD' },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">{row.label}</span>
                  <span className="font-semibold text-[var(--ink)]">{row.value}</span>
                </div>
              ))}
            </Card>
            <Button variant="primary" fullWidth onClick={reset}>Nouvelle opération</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
