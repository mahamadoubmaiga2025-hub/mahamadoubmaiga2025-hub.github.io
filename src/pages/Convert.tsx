import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Check, RefreshCw, Info } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import CurrencyIcon from '@/components/CurrencyIcon';
import { useApp } from '@/hooks/useApp';
import { CONVERSION_RATES } from '@/data/mockData';
import { formatAmount, sleep } from '@/utils/format';
import { toast } from 'sonner';
import type { Currency } from '@/types';

const PAIRS: { from: Currency; to: Currency }[] = [
  { from: 'FCFA', to: 'USDC' },
  { from: 'FCFA', to: 'USDT' },
  { from: 'FCFA', to: 'BTC' },
  { from: 'FCFA', to: 'ETH' },
  { from: 'USDC', to: 'FCFA' },
  { from: 'USDT', to: 'FCFA' },
  { from: 'BTC', to: 'FCFA' },
  { from: 'ETH', to: 'FCFA' },
];

export default function ConvertPage() {
  const { state } = useApp();
  const [fromCur, setFromCur] = useState<Currency>('FCFA');
  const [toCur, setToCur] = useState<Currency>('USDC');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [loading, setLoading] = useState(false);

  const rateKey = `${fromCur}_${toCur}`;
  const rate = CONVERSION_RATES[rateKey] ?? 1;
  const numAmount = parseFloat(amount) || 0;
  const toAmount = numAmount * rate;
  const fees = numAmount * 0.003; // 0.3%
  const feesDisplay = fees;
  const netAmount = (numAmount - fees) * rate;

  const fromWallet = state.wallets.find(w => w.currency === fromCur);

  function swap() {
    const t = fromCur;
    setFromCur(toCur);
    setToCur(t);
    setAmount('');
  }

  async function confirm() {
    setLoading(true);
    await sleep(1400);
    setLoading(false);
    setStep('success');
    toast.success('Conversion effectuée');
  }

  function reset() {
    setStep('input');
    setAmount('');
  }

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-lg mx-auto space-y-4">
      <h2 className="display text-xl font-bold text-[var(--ink)]">Convertir</h2>

      {/* Pair selector chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {PAIRS.map(p => (
          <button key={`${p.from}_${p.to}`}
            onClick={() => { setFromCur(p.from); setToCur(p.to); setAmount(''); setStep('input'); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              fromCur === p.from && toCur === p.to ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-[var(--border)] text-[var(--muted)] hover:border-brand-300'
            }`}>
            {p.from} → {p.to}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div key="input" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
            <Card padding="md">
              <div className="space-y-3">
                {/* From */}
                <div>
                  <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Vous envoyez</label>
                  <div className="flex items-center gap-3 mt-2 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/10 transition-all">
                    <CurrencyIcon currency={fromCur} size={36} />
                    <div className="flex-1">
                      <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full bg-transparent outline-none display text-2xl font-bold text-[var(--ink)] placeholder:text-[var(--subtle)] tabular"
                      />
                      {fromWallet && (
                        <p className="text-xs text-[var(--muted)] mt-0.5 tabular">
                          Solde: {formatAmount(fromWallet.balance, fromCur)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[var(--ink)]">{fromCur}</span>
                      {fromWallet && (
                        <button onClick={() => setAmount(String(fromWallet.balance))}
                          className="block text-xs text-brand-600 font-semibold hover:underline mt-0.5">Max</button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Swap button */}
                <div className="flex justify-center">
                  <button onClick={swap}
                    className="w-9 h-9 rounded-full border-2 border-[var(--border)] bg-[var(--surface-strong)] flex items-center justify-center hover:border-brand-400 hover:text-brand-600 transition-all text-[var(--muted)]">
                    <ArrowDown size={16} />
                  </button>
                </div>

                {/* To */}
                <div>
                  <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Vous recevez</label>
                  <div className="flex items-center gap-3 mt-2 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]">
                    <CurrencyIcon currency={toCur} size={36} />
                    <div className="flex-1">
                      <p className="display text-2xl font-bold text-[var(--ink)] tabular">
                        {numAmount > 0 ? netAmount.toFixed(toCur === 'BTC' ? 8 : toCur === 'ETH' ? 6 : 2) : '0'}
                      </p>
                    </div>
                    <span className="font-bold text-[var(--ink)]">{toCur}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Rate & fees */}
            {numAmount > 0 && (
              <Card padding="md">
                <div className="space-y-2">
                  {[
                    { label: 'Taux', value: `1 ${fromCur} = ${rate.toFixed(toCur === 'BTC' ? 8 : toCur === 'ETH' ? 6 : 4)} ${toCur}` },
                    { label: 'Frais (0.3%)', value: formatAmount(feesDisplay, fromCur) },
                    { label: 'Montant reçu', value: `${netAmount.toFixed(toCur === 'BTC' ? 8 : 2)} ${toCur}`, bold: true },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-sm text-[var(--muted)]">{row.label}</span>
                      <span className={`text-sm tabular ${row.bold ? 'font-bold text-[var(--ink)]' : 'text-[var(--ink)]'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Button
              variant="primary" size="lg" fullWidth
              disabled={!numAmount || numAmount <= 0}
              onClick={() => setStep('confirm')}
            >
              Convertir
            </Button>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
            <Card padding="md">
              <h3 className="display font-bold text-[var(--ink)] mb-4">Confirmer la conversion</h3>
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="flex items-center gap-3">
                  <CurrencyIcon currency={fromCur} size={40} />
                  <div className="text-center">
                    <p className="display text-xl font-bold text-[var(--ink)] tabular">{formatAmount(numAmount, fromCur)}</p>
                    <p className="text-xs text-[var(--muted)]">Envoyé</p>
                  </div>
                </div>
                <ArrowDown size={20} className="text-[var(--muted)]" />
                <div className="flex items-center gap-3">
                  <CurrencyIcon currency={toCur} size={40} />
                  <div className="text-center">
                    <p className="display text-xl font-bold text-brand-600 tabular">{netAmount.toFixed(toCur === 'BTC' ? 8 : 2)} {toCur}</p>
                    <p className="text-xs text-[var(--muted)]">Reçu</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
                <Info size={13} className="text-[var(--muted)] flex-shrink-0" />
                <p className="text-xs text-[var(--muted)]">Frais: {formatAmount(feesDisplay, fromCur)} · Taux garanti 60s</p>
              </div>
            </Card>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" fullWidth onClick={reset}>Annuler</Button>
              <Button variant="primary" size="lg" fullWidth loading={loading} onClick={confirm}>Confirmer</Button>
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
                <p className="display text-xl font-bold text-[var(--ink)] mb-1">Conversion réussie</p>
                <p className="text-[var(--muted)] text-sm">
                  {formatAmount(numAmount, fromCur)} → {netAmount.toFixed(toCur === 'BTC' ? 8 : 2)} {toCur}
                </p>
              </div>
              <Button variant="primary" size="lg" fullWidth onClick={reset} icon={<RefreshCw size={15} />}>
                Nouvelle conversion
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
