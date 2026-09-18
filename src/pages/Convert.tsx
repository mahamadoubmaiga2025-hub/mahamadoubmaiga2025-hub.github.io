import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Check, RefreshCw, Info, ArrowLeftRight, TrendingUp } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import CurrencyIcon from '@/components/CurrencyIcon';
import { useApp } from '@/hooks/useApp';
import { CONVERSION_RATES } from '@/data/mockData';
import { formatAmount, sleep } from '@/utils/format';
import { toast } from 'sonner';
import type { Currency } from '@/types';

const PAIRS: { from: Currency; to: Currency; label: string }[] = [
  { from: 'FCFA', to: 'USDC', label: 'FCFA → USDC' },
  { from: 'FCFA', to: 'USDT', label: 'FCFA → USDT' },
  { from: 'FCFA', to: 'BTC',  label: 'FCFA → BTC' },
  { from: 'FCFA', to: 'ETH',  label: 'FCFA → ETH' },
  { from: 'USDC', to: 'FCFA', label: 'USDC → FCFA' },
  { from: 'USDT', to: 'FCFA', label: 'USDT → FCFA' },
  { from: 'BTC',  to: 'FCFA', label: 'BTC → FCFA' },
  { from: 'ETH',  to: 'FCFA', label: 'ETH → FCFA' },
  { from: 'USDC', to: 'USDT', label: 'USDC → USDT' },
  { from: 'USDT', to: 'USDC', label: 'USDT → USDC' },
];

const QUICK_AMOUNTS: Record<Currency, number[]> = {
  FCFA: [25000, 50000, 100000, 250000],
  USDC: [10, 25, 50, 100],
  USDT: [10, 25, 50, 100],
  BTC:  [0.001, 0.005, 0.01, 0.05],
  ETH:  [0.01, 0.05, 0.1, 0.5],
  AFRI: [100, 500, 1000, 5000],
  USD:  [10, 25, 50, 100],
  EUR:  [10, 25, 50, 100],
  GHS:  [50, 100, 200, 500],
  NGN:  [5000, 10000, 25000, 50000],
  KES:  [500, 1000, 2500, 5000],
};

export default function ConvertPage() {
  const { state } = useApp();
  const [fromCur, setFromCur] = useState<Currency>('FCFA');
  const [toCur, setToCur] = useState<Currency>('USDC');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [loading, setLoading] = useState(false);
  const [rateLoading, setRateLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const rateKey = `${fromCur}_${toCur}`;
  const rate = (CONVERSION_RATES as Record<string, number>)[rateKey] ?? 1;
  const numAmount = parseFloat(amount) || 0;
  const fees = parseFloat((numAmount * 0.003).toFixed(fromCur === 'BTC' ? 8 : 2));
  const received = parseFloat(((numAmount - fees) * rate).toFixed(toCur === 'BTC' ? 8 : 4));
  const wallet = state.wallets.find(w => w.currency === fromCur);

  const refreshRate = useCallback(async () => {
    setRateLoading(true);
    await sleep(800);
    setRateLoading(false);
    setLastRefresh(new Date());
    toast.success('Taux mis à jour');
  }, []);

  // Auto-refresh rate every 30s
  useEffect(() => {
    const interval = setInterval(refreshRate, 30000);
    return () => clearInterval(interval);
  }, [refreshRate]);

  async function confirm() {
    setLoading(true);
    await sleep(2000);
    setLoading(false);
    setStep('success');
    toast.success(`Conversion réussie — ${received} ${toCur}`);
  }

  function swap() {
    const pair = PAIRS.find(p => p.from === toCur && p.to === fromCur);
    if (pair) { setFromCur(toCur); setToCur(fromCur); setAmount(''); }
    else { toast.error('Paire non disponible dans ce sens'); }
  }

  function reset() { setStep('input'); setAmount(''); }

  const formatTime = (d: Date) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (step === 'success') return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-10 text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={40} className="text-green-600" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
            <TrendingUp size={14} className="text-white" />
          </div>
        </div>
        <div>
          <p className="display text-3xl font-black text-[var(--ink)]">+{received} {toCur}</p>
          <p className="text-[var(--muted)] text-sm mt-2">Converti depuis {numAmount} {fromCur}</p>
        </div>
        <Card padding="md" className="w-full text-left space-y-2.5">
          {[
            { label: 'Montant source', value: `${numAmount} ${fromCur}` },
            { label: 'Taux appliqué', value: `1 ${fromCur} = ${rate} ${toCur}` },
            { label: 'Frais (0.3%)', value: `${fees} ${fromCur}` },
            { label: 'Reçu', value: `${received} ${toCur}`, bold: true },
            { label: 'Référence', value: `CVT-${Date.now().toString(36).toUpperCase()}` },
          ].map(row => (
            <div key={row.label} className="flex justify-between">
              <span className="text-sm text-[var(--muted)]">{row.label}</span>
              <span className={`text-sm tabular ${row.bold ? 'font-bold text-[var(--ink)]' : 'text-[var(--ink)]'}`}>{row.value}</span>
            </div>
          ))}
        </Card>
        <Button variant="primary" fullWidth onClick={reset}>Nouvelle conversion</Button>
      </motion.div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="display text-xl font-bold text-[var(--ink)]">Convertir</h2>
        <button onClick={refreshRate} disabled={rateLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--border-strong)] transition-all disabled:opacity-50">
          <RefreshCw size={12} className={rateLoading ? 'animate-spin' : ''} />
          {formatTime(lastRefresh)}
        </button>
      </div>

      {/* Quick pair buttons */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {PAIRS.slice(0, 6).map(p => (
          <button key={p.label}
            onClick={() => { setFromCur(p.from); setToCur(p.to); setAmount(''); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${fromCur === p.from && toCur === p.to ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-[var(--border)] text-[var(--muted)] hover:border-brand-300 hover:text-[var(--ink)]'}`}>
            {p.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div key="input" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            {/* From */}
            <Card padding="md" className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CurrencyIcon currency={fromCur} size={32} />
                  <div>
                    <p className="text-xs text-[var(--muted)]">De</p>
                    <p className="font-bold text-[var(--ink)]">{fromCur}</p>
                  </div>
                </div>
                {wallet && (
                  <p className="text-xs text-[var(--muted)]">
                    Solde: <span className="font-semibold text-[var(--ink)]">{formatAmount(wallet.balance, wallet.currency)}</span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/10 transition-all">
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0" className="flex-1 bg-transparent outline-none display text-2xl font-bold text-[var(--ink)] tabular placeholder:text-[var(--subtle)]" />
                <span className="font-bold text-[var(--muted)] text-sm">{fromCur}</span>
              </div>

              {/* Quick amounts */}
              {(QUICK_AMOUNTS[fromCur] ?? []).length > 0 && (
                <div className="flex gap-2">
                  {(QUICK_AMOUNTS[fromCur] ?? []).map(q => (
                    <button key={q} onClick={() => setAmount(String(q))}
                      className={`flex-1 py-1.5 rounded-xl border text-[10px] font-semibold transition-all ${amount === String(q) ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-[var(--border)] text-[var(--muted)] hover:border-brand-300 hover:text-[var(--ink)]'}`}>
                      {q.toLocaleString('fr-FR')}
                    </button>
                  ))}
                  {wallet && (
                    <button onClick={() => setAmount(String(wallet.balance))}
                      className="flex-1 py-1.5 rounded-xl border border-[var(--border)] text-[10px] font-semibold text-[var(--muted)] hover:border-brand-300 hover:text-[var(--ink)] transition-all">
                      Max
                    </button>
                  )}
                </div>
              )}
            </Card>

            {/* Swap button */}
            <div className="flex justify-center">
              <button onClick={swap}
                className="w-10 h-10 rounded-full border-2 border-[var(--border)] bg-[var(--surface-card)] flex items-center justify-center text-[var(--muted)] hover:text-brand-600 hover:border-brand-400 hover:rotate-180 transition-all duration-300 shadow-sm">
                <ArrowLeftRight size={16} />
              </button>
            </div>

            {/* To */}
            <Card padding="md" className="space-y-3">
              <div className="flex items-center gap-2">
                <CurrencyIcon currency={toCur} size={32} />
                <div>
                  <p className="text-xs text-[var(--muted)]">Vers</p>
                  <p className="font-bold text-[var(--ink)]">{toCur}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)]">
                <div className="flex-1">
                  <p className="display text-2xl font-bold text-[var(--ink)] tabular">
                    {numAmount > 0 ? received.toLocaleString('fr-FR', { maximumFractionDigits: 8 }) : '0'}
                  </p>
                </div>
                <span className="font-bold text-[var(--muted)] text-sm">{toCur}</span>
              </div>
            </Card>

            {/* Rate info */}
            {numAmount > 0 && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)]">
                <Info size={13} className="text-[var(--muted)] flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-[var(--muted)]">
                  <p>Taux : <span className="font-semibold text-[var(--ink)]">1 {fromCur} = {rate} {toCur}</span></p>
                  <p>Frais (0.3%) : <span className="font-semibold text-[var(--ink)]">{fees} {fromCur}</span></p>
                  <p>Vous recevez : <span className="font-bold text-brand-600">{received} {toCur}</span></p>
                </div>
              </motion.div>
            )}

            <Button variant="primary" size="lg" fullWidth disabled={!numAmount || numAmount <= 0}
              onClick={() => setStep('confirm')} icon={<ArrowDown size={15} />}>
              Continuer
            </Button>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <Card padding="lg">
              <h3 className="display font-bold text-[var(--ink)] mb-5 text-center">Confirmer la conversion</h3>
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col items-center gap-2">
                  <CurrencyIcon currency={fromCur} size={48} />
                  <p className="display text-lg font-black text-[var(--ink)] tabular">{numAmount} {fromCur}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
                    <ArrowDown size={16} className="text-white" />
                  </div>
                  <p className="text-[10px] text-[var(--muted)] mt-1">0.3% frais</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CurrencyIcon currency={toCur} size={48} />
                  <p className="display text-lg font-black text-brand-600 tabular">+{received} {toCur}</p>
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-4 space-y-3">
                {[
                  { label: 'Taux', value: `1 ${fromCur} = ${rate} ${toCur}` },
                  { label: 'Frais', value: `${fees} ${fromCur}` },
                  { label: 'Vous recevez', value: `${received} ${toCur}`, bold: true },
                ].map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-sm text-[var(--muted)]">{row.label}</span>
                    <span className={`text-sm tabular ${row.bold ? 'font-bold text-brand-600' : 'text-[var(--ink)]'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <p className="text-xs text-center text-[var(--muted)]">Cette conversion est simulée. Aucun fonds réel ne sera déplacé.</p>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" fullWidth onClick={() => setStep('input')}>Annuler</Button>
              <Button variant="primary" size="lg" fullWidth loading={loading} onClick={confirm}>Convertir</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
