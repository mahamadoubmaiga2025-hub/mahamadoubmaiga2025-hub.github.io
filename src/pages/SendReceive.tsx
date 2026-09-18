import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowDownLeft, Copy, Check, QrCode, ArrowLeft } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import CurrencyIcon from '@/components/CurrencyIcon';
import { useApp } from '@/hooks/useApp';
import { formatAmount, sleep } from '@/utils/format';
import { toast } from 'sonner';
import type { Currency } from '@/types';

type Mode = 'send' | 'receive';

export default function SendReceivePage() {
  const { state } = useApp();
  const [mode, setMode] = useState<Mode>('send');
  const [currency, setCurrency] = useState<Currency>('USDC');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [loading, setLoading] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  const wallet = state.wallets.find(w => w.currency === currency);
  const receiveAddress = wallet?.address ?? '0xAfRiPaY...0001';

  async function submit() {
    setLoading(true);
    await sleep(1600);
    setLoading(false);
    setStep('success');
    toast.success(mode === 'send' ? 'Transfert envoyé' : '');
  }

  function reset() { setStep('input'); setAddress(''); setAmount(''); }

  function copyAddr() {
    navigator.clipboard.writeText(receiveAddress).catch(() => {});
    setCopiedAddr(true);
    toast.success('Adresse copiée');
    setTimeout(() => setCopiedAddr(false), 2000);
  }

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-lg mx-auto space-y-5">
      {/* Mode toggle */}
      <div className="flex p-1 bg-[var(--surface-muted)] rounded-2xl">
        {(['send', 'receive'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); reset(); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m ? 'bg-[var(--surface-strong)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'}`}>
            {m === 'send' ? <Send size={14} /> : <ArrowDownLeft size={14} />}
            {m === 'send' ? 'Envoyer' : 'Recevoir'}
          </button>
        ))}
      </div>

      {/* Currency selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {state.wallets.map(w => (
          <button key={w.currency} onClick={() => setCurrency(w.currency)}
            className={`flex items-center gap-2 flex-shrink-0 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
              currency === w.currency ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-[var(--border)] text-[var(--muted)] hover:border-brand-300'
            }`}>
            <CurrencyIcon currency={w.currency} size={18} />
            {w.currency}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'send' && (
          <motion.div key="send" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {step === 'input' && (
              <>
                <Card padding="md" className="space-y-4">
                  <Input label="Adresse de destination" placeholder="0x... ou adresse AfriPay"
                    value={address} onChange={e => setAddress(e.target.value)} fullWidth />
                  <div>
                    <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block">Montant</label>
                    <div className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] focus-within:border-brand-400 transition-all">
                      <CurrencyIcon currency={currency} size={32} />
                      <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                        placeholder="0.00" className="flex-1 bg-transparent outline-none display text-2xl font-bold text-[var(--ink)] tabular placeholder:text-[var(--subtle)]" />
                      <span className="font-bold text-[var(--ink)]">{currency}</span>
                    </div>
                    {wallet && (
                      <div className="flex justify-between mt-1.5 px-1">
                        <span className="text-xs text-[var(--muted)] tabular">Solde: {formatAmount(wallet.balance, currency)}</span>
                        <button onClick={() => setAmount(String(wallet.balance))} className="text-xs text-brand-600 font-semibold hover:underline">Max</button>
                      </div>
                    )}
                  </div>
                </Card>
                <Button variant="primary" size="lg" fullWidth
                  disabled={!address.trim() || !parseFloat(amount)}
                  onClick={() => setStep('confirm')}>
                  Continuer
                </Button>
              </>
            )}

            {step === 'confirm' && (
              <Card padding="md" className="space-y-4">
                <h3 className="display font-bold text-[var(--ink)]">Confirmer le transfert</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Destinataire', value: address.length > 20 ? address.slice(0, 10) + '...' + address.slice(-6) : address },
                    { label: 'Montant', value: `${amount} ${currency}`, bold: true },
                    { label: 'Frais réseau', value: `~0.10 ${currency}` },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-sm text-[var(--muted)]">{row.label}</span>
                      <span className={`text-sm tabular ${row.bold ? 'font-bold text-[var(--ink)]' : 'text-[var(--ink)]'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  <Button variant="secondary" size="md" fullWidth onClick={() => setStep('input')}>Modifier</Button>
                  <Button variant="primary" size="md" fullWidth loading={loading} onClick={submit}>Envoyer</Button>
                </div>
              </Card>
            )}

            {step === 'success' && (
              <Card padding="lg" className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={28} className="text-green-600" />
                </div>
                <div>
                  <p className="display text-xl font-bold text-[var(--ink)] mb-1">Transfert envoyé</p>
                  <p className="text-[var(--muted)] text-sm">{amount} {currency} → {address.slice(0, 10)}...</p>
                </div>
                <Button variant="primary" fullWidth onClick={reset}>Nouveau transfert</Button>
              </Card>
            )}
          </motion.div>
        )}

        {mode === 'receive' && (
          <motion.div key="receive" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <Card padding="md" className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-2 self-start">
                <CurrencyIcon currency={currency} size={28} />
                <p className="display font-bold text-[var(--ink)]">Recevoir {currency}</p>
              </div>

              {/* QR */}
              <div className="p-4 bg-white rounded-3xl shadow-md">
                <div className="grid grid-cols-9 gap-0.5">
                  {Array.from({ length: 81 }).map((_, i) => {
                    const row = Math.floor(i / 9), col = i % 9;
                    const corner = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
                    const inner = (row >= 1 && row <= 2 && col >= 1 && col <= 2) ||
                      (row >= 1 && row <= 2 && col >= 6 && col <= 7) ||
                      (row >= 6 && row <= 7 && col >= 1 && col <= 2);
                    const filled = corner || inner || (i % 3 === 0) || (i % 7 === 0);
                    return <div key={i} className={`w-5 h-5 rounded-sm ${filled ? 'bg-[#0a1628]' : 'bg-transparent'}`} />;
                  })}
                </div>
              </div>

              <div className="w-full">
                <p className="text-xs text-[var(--muted)] mb-1 text-center">Votre adresse {currency}</p>
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]">
                  <span className="mono text-xs text-[var(--ink)] flex-1 break-all">{receiveAddress}</span>
                  <button onClick={copyAddr} className="flex-shrink-0 w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors">
                    {copiedAddr ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--muted)] text-center">Envoyez uniquement du {currency} à cette adresse. Ne pas envoyer d'autres actifs.</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
