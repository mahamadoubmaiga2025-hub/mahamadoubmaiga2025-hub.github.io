import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, ArrowDown, ArrowUp, Check, Info } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { sleep } from '@/utils/format';
import { toast } from 'sonner';

const PROVIDERS = [
  { id: 'orange', name: 'Orange Money', color: '#FF6600', countries: ['Mali', 'Sénégal', 'Côte d\'Ivoire'] },
  { id: 'wave', name: 'Wave', color: '#1A9EFF', countries: ['Sénégal', 'Côte d\'Ivoire'] },
  { id: 'moov', name: 'Moov Money', color: '#00A551', countries: ['Côte d\'Ivoire', 'Bénin', 'Togo'] },
  { id: 'mtn', name: 'MTN MoMo', color: '#FFCC00', countries: ['Ghana', 'Nigeria', 'Côte d\'Ivoire'] },
];

type Direction = 'in' | 'out';

export default function MobileMoneyPage() {
  const [provider, setProvider] = useState<string | null>(null);
  const [direction, setDirection] = useState<Direction>('in');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'select' | 'input' | 'confirm' | 'success'>('select');
  const [loading, setLoading] = useState(false);

  const selectedProvider = PROVIDERS.find(p => p.id === provider);
  const numAmount = parseFloat(amount) || 0;
  const fees = Math.round(numAmount * 0.015); // 1.5%

  async function confirm() {
    setLoading(true);
    await sleep(2000);
    setLoading(false);
    setStep('success');
    toast.success(direction === 'in' ? 'Dépôt réussi' : 'Retrait initié');
  }

  function reset() { setStep('select'); setProvider(null); setPhone(''); setAmount(''); }

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-lg mx-auto space-y-5">
      <h2 className="display text-xl font-bold text-[var(--ink)]">Mobile Money</h2>

      {/* Direction toggle */}
      <div className="flex p-1 bg-[var(--surface-muted)] rounded-2xl">
        <button onClick={() => { setDirection('in'); setStep(provider ? 'input' : 'select'); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${direction === 'in' ? 'bg-[var(--surface-strong)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'}`}>
          <ArrowDown size={14} className="text-green-600" /> Mobile Money → AfriPay
        </button>
        <button onClick={() => { setDirection('out'); setStep(provider ? 'input' : 'select'); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${direction === 'out' ? 'bg-[var(--surface-strong)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'}`}>
          <ArrowUp size={14} className="text-[var(--muted)]" /> AfriPay → Mobile Money
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div key="select" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-3">
            <p className="text-sm font-medium text-[var(--muted)]">Choisissez votre fournisseur</p>
            {PROVIDERS.map(p => (
              <button key={p.id} onClick={() => { setProvider(p.id); setStep('input'); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] hover:border-brand-400 hover:shadow-card transition-all text-left">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: p.color }}>
                  {p.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[var(--ink)]">{p.name}</p>
                  <p className="text-xs text-[var(--muted)]">{p.countries.join(', ')}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-[var(--muted)] text-lg">›</div>
              </button>
            ))}
            <p className="text-xs text-center text-[var(--muted)] pt-2">
              Ces intégrations sont simulées dans cette version MVP.
            </p>
          </motion.div>
        )}

        {step === 'input' && selectedProvider && (
          <motion.div key="input" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
            {/* Selected provider */}
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)]">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: selectedProvider.color }}>
                {selectedProvider.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[var(--ink)] text-sm">{selectedProvider.name}</p>
              </div>
              <button onClick={() => { setProvider(null); setStep('select'); }} className="text-xs text-brand-600 font-semibold hover:underline">Changer</button>
            </div>

            <Card padding="md" className="space-y-4">
              <Input label="Numéro de téléphone" placeholder="+223 76 00 00 00" type="tel"
                value={phone} onChange={e => setPhone(e.target.value)} fullWidth
                prefix={<Smartphone size={14} />} />
              <div>
                <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Montant (FCFA)</label>
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] focus-within:border-brand-400 transition-all">
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0" className="flex-1 bg-transparent outline-none display text-2xl font-bold text-[var(--ink)] tabular placeholder:text-[var(--subtle)]" />
                  <span className="font-bold text-[var(--ink)]">FCFA</span>
                </div>
                {numAmount > 0 && (
                  <div className="flex justify-between mt-1.5 px-1 text-xs text-[var(--muted)]">
                    <span>Frais: {fees.toLocaleString('fr-FR')} FCFA (1.5%)</span>
                    <span className="tabular">{direction === 'in' ? 'Crédité' : 'Retiré'}: {(numAmount - fees).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-yellow-50 border border-yellow-100">
              <Info size={13} className="text-yellow-600 flex-shrink-0" />
              <p className="text-xs text-yellow-700">
                {direction === 'in'
                  ? 'Vous recevrez une notification sur votre téléphone pour valider la transaction.'
                  : 'Le montant sera envoyé sur votre numéro après confirmation.'}
              </p>
            </div>

            <Button variant="primary" size="lg" fullWidth
              disabled={!phone.trim() || !numAmount}
              onClick={() => setStep('confirm')}>
              Continuer
            </Button>
          </motion.div>
        )}

        {step === 'confirm' && selectedProvider && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
            <Card padding="md">
              <h3 className="display font-bold text-[var(--ink)] mb-4">Confirmer</h3>
              <div className="space-y-3">
                {[
                  { label: 'Fournisseur', value: selectedProvider.name },
                  { label: 'Numéro', value: phone },
                  { label: direction === 'in' ? 'Dépôt' : 'Retrait', value: `${numAmount.toLocaleString('fr-FR')} FCFA`, bold: true },
                  { label: 'Frais', value: `${fees.toLocaleString('fr-FR')} FCFA` },
                  { label: 'Montant net', value: `${(numAmount - fees).toLocaleString('fr-FR')} FCFA`, bold: true },
                ].map(row => (
                  <div key={row.label} className="flex justify-between">
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

        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <Card padding="lg" className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check size={28} className="text-green-600" />
              </div>
              <div>
                <p className="display text-xl font-bold text-[var(--ink)] mb-1">
                  {direction === 'in' ? 'Dépôt initié' : 'Retrait initié'}
                </p>
                <p className="text-[var(--muted)] text-sm">{numAmount.toLocaleString('fr-FR')} FCFA via {selectedProvider?.name}</p>
              </div>
              <Button variant="primary" fullWidth onClick={reset}>Nouvelle opération</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
