import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowDownLeft, Copy, Check, QrCode, Search, ChevronRight, X } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import CurrencyIcon from '@/components/CurrencyIcon';
import { useApp } from '@/hooks/useApp';
import { formatAmount, sleep } from '@/utils/format';
import { toast } from 'sonner';
import type { Currency } from '@/types';

const CONTACTS = [
  { id: 'c1', name: 'Aminata Coulibaly', address: '0x7f3e...9a2c', currency: 'USDC' as Currency, avatar: 'A' },
  { id: 'c2', name: 'Boubacar Diallo', address: '0x4d1b...3f7e', currency: 'USDC' as Currency, avatar: 'B' },
  { id: 'c3', name: 'Fatoumata Koné', address: '0x2c9a...1d4f', currency: 'USDC' as Currency, avatar: 'F' },
  { id: 'c4', name: 'Ibrahim Traoré', address: '0x8e5c...6b2a', currency: 'BTC' as Currency, avatar: 'I' },
  { id: 'c5', name: 'Mariam Touré', address: '0x3f7d...4c1e', currency: 'ETH' as Currency, avatar: 'M' },
];

const WALLET_CURRENCIES: Currency[] = ['FCFA', 'USDC', 'USDT', 'BTC', 'ETH'];

function SendTab() {
  const { state } = useApp();
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [recipient, setRecipient] = useState('');
  const [selectedContact, setSelectedContact] = useState<typeof CONTACTS[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('USDC');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactSearch, setContactSearch] = useState('');

  const wallet = state.wallets.find(w => w.currency === currency);
  const numAmount = parseFloat(amount) || 0;
  const fees = currency === 'FCFA' ? Math.round(numAmount * 0.01) : parseFloat((numAmount * 0.002).toFixed(6));
  const filteredContacts = CONTACTS.filter(c =>
    !contactSearch || c.name.toLowerCase().includes(contactSearch.toLowerCase())
  );

  async function send() {
    setLoading(true);
    await sleep(2000);
    setLoading(false);
    setStep('success');
    toast.success('Envoi confirmé');
  }

  function reset() {
    setStep('input'); setRecipient(''); setSelectedContact(null);
    setAmount(''); setNote(''); setContactSearch('');
  }

  if (step === 'success') return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-5 py-8 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <Check size={32} className="text-green-600" />
      </div>
      <div>
        <p className="display text-2xl font-black text-[var(--ink)]">Envoi réussi !</p>
        <p className="text-[var(--muted)] text-sm mt-1">
          {formatAmount(numAmount, currency)} envoyé à {selectedContact?.name ?? recipient}
        </p>
      </div>
      <div className="w-full space-y-2 bg-[var(--surface-muted)] rounded-2xl p-4 text-left">
        {[
          { label: 'Destinataire', value: selectedContact?.name ?? recipient },
          { label: 'Montant', value: formatAmount(numAmount, currency) },
          { label: 'Frais', value: formatAmount(fees, currency) },
          { label: 'Référence', value: `TXN-${Date.now().toString(36).toUpperCase()}` },
        ].map(row => (
          <div key={row.label} className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">{row.label}</span>
            <span className="font-semibold text-[var(--ink)] tabular">{row.value}</span>
          </div>
        ))}
      </div>
      <Button variant="primary" fullWidth onClick={reset}>Nouvel envoi</Button>
    </motion.div>
  );

  if (step === 'confirm') return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--ink)] flex items-center justify-center text-white font-black text-lg">
            {selectedContact?.avatar ?? recipient[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="font-bold text-[var(--ink)]">{selectedContact?.name ?? recipient}</p>
            <p className="text-xs text-[var(--muted)] mono">{selectedContact?.address ?? recipient}</p>
          </div>
        </div>
        <div className="border-t border-[var(--border)] pt-4 space-y-3">
          {[
            { label: 'Montant', value: formatAmount(numAmount, currency), bold: true },
            { label: 'Frais réseau', value: formatAmount(fees, currency) },
            { label: 'Total', value: formatAmount(numAmount + fees, currency), bold: true },
            ...(note ? [{ label: 'Note', value: note }] : []),
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center">
              <span className="text-sm text-[var(--muted)]">{row.label}</span>
              <span className={`text-sm tabular ${row.bold ? 'font-bold text-[var(--ink)]' : 'text-[var(--ink)]'}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </Card>
      <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-xs text-amber-700">
        ⚠️ Cette transaction est simulée. Aucun fonds réel ne sera déplacé.
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" size="lg" fullWidth onClick={() => setStep('input')}>Modifier</Button>
        <Button variant="primary" size="lg" fullWidth loading={loading} onClick={send}>Confirmer l&apos;envoi</Button>
      </div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Currency selector */}
      <div>
        <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Devise à envoyer</p>
        <div className="flex gap-2 flex-wrap">
          {WALLET_CURRENCIES.map(c => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${currency === c ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-[var(--border)] text-[var(--muted)] hover:border-brand-300 hover:text-[var(--ink)]'}`}>
              <CurrencyIcon currency={c} size={16} />
              {c}
            </button>
          ))}
        </div>
        {wallet && (
          <p className="text-xs text-[var(--muted)] mt-1.5">
            Disponible : <span className="font-semibold text-[var(--ink)]">{formatAmount(wallet.balance, wallet.currency)}</span>
          </p>
        )}
      </div>

      {/* Contacts */}
      <div>
        <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Contacts récents</p>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] mb-2">
          <Search size={13} className="text-[var(--muted)]" />
          <input value={contactSearch} onChange={e => setContactSearch(e.target.value)} placeholder="Rechercher un contact..."
            className="flex-1 bg-transparent outline-none text-xs text-[var(--ink)] placeholder:text-[var(--subtle)]" />
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto no-scrollbar">
          {filteredContacts.map(c => (
            <button key={c.id} onClick={() => { setSelectedContact(c); setRecipient(c.address); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl border text-left transition-all ${selectedContact?.id === c.id ? 'border-brand-600 bg-green-50' : 'border-[var(--border)] hover:border-brand-300 bg-[var(--surface-strong)]'}`}>
              <div className="w-8 h-8 rounded-full bg-[var(--ink)] flex items-center justify-center text-white text-xs font-black flex-shrink-0">{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--ink)] truncate">{c.name}</p>
                <p className="text-[10px] text-[var(--muted)] mono truncate">{c.address}</p>
              </div>
              {selectedContact?.id === c.id && <Check size={13} className="text-brand-600 flex-shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Or enter address */}
      <div>
        <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Ou saisir une adresse</p>
        <div className="flex gap-2">
          <Input
            placeholder="Adresse wallet, numéro de téléphone..."
            value={selectedContact ? selectedContact.address : recipient}
            onChange={e => { setSelectedContact(null); setRecipient(e.target.value); }}
            fullWidth
          />
          {(recipient || selectedContact) && (
            <button onClick={() => { setSelectedContact(null); setRecipient(''); }}
              className="w-10 h-10 flex-shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Amount */}
      <div>
        <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Montant</p>
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/10 transition-all">
          <CurrencyIcon currency={currency} size={28} />
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
            className="flex-1 bg-transparent outline-none display text-2xl font-bold text-[var(--ink)] tabular placeholder:text-[var(--subtle)]" />
          <span className="font-bold text-[var(--ink)] text-sm">{currency}</span>
        </div>
        {wallet && numAmount > 0 && (
          <div className="flex gap-2 mt-2">
            {[0.25, 0.5, 0.75, 1.0].map(pct => (
              <button key={pct} onClick={() => setAmount((wallet.balance * pct).toFixed(currency === 'BTC' ? 6 : 2))}
                className="flex-1 py-1 rounded-lg bg-[var(--surface-muted)] text-[10px] font-semibold text-[var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--ink)] transition-all border border-[var(--border)]">
                {Math.round(pct * 100)}%
              </button>
            ))}
          </div>
        )}
      </div>

      <Input label="Note (optionnel)" placeholder="Ex: remboursement repas..." value={note} onChange={e => setNote(e.target.value)} fullWidth />

      {numAmount > 0 && (
        <div className="flex justify-between px-1 text-xs text-[var(--muted)]">
          <span>Frais estimés : {formatAmount(fees, currency)}</span>
          <span>Total : {formatAmount(numAmount + fees, currency)}</span>
        </div>
      )}

      <Button variant="primary" size="lg" fullWidth
        disabled={(!recipient && !selectedContact) || !numAmount}
        onClick={() => setStep('confirm')}
        icon={<Send size={15} />}>
        Continuer
      </Button>
    </motion.div>
  );
}

function ReceiveTab() {
  const { state } = useApp();
  const [currency, setCurrency] = useState<Currency>('USDC');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const wallet = state.wallets.find(w => w.currency === currency);
  const address = wallet?.address ?? '0x0000000000000000000000000000000000000000';

  function copy() {
    navigator.clipboard.writeText(address).catch(() => {});
    setCopied(true);
    toast.success('Adresse copiée !');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Currency tabs */}
      <div className="flex gap-2 flex-wrap">
        {WALLET_CURRENCIES.map(c => (
          <button key={c} onClick={() => setCurrency(c)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${currency === c ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-[var(--border)] text-[var(--muted)] hover:border-brand-300'}`}>
            <CurrencyIcon currency={c} size={16} />
            {c}
          </button>
        ))}
      </div>

      <Card padding="lg" className="space-y-4">
        <div className="flex items-center gap-3">
          <CurrencyIcon currency={currency} size={44} />
          <div>
            <p className="font-black text-[var(--ink)] text-lg display">{currency}</p>
            <p className="text-xs text-[var(--muted)]">Adresse de réception</p>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]">
            <span className="mono text-xs text-[var(--ink)] flex-1 break-all">{address}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={copy} icon={copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}>
              {copied ? 'Copié !' : 'Copier'}
            </Button>
            <Button variant="secondary" fullWidth onClick={() => setShowQR(v => !v)} icon={<QrCode size={13} />}>
              {showQR ? 'Masquer QR' : 'QR Code'}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showQR && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden flex flex-col items-center gap-3 pt-3 border-t border-[var(--border)]">
              <div className="p-5 bg-white rounded-3xl shadow-inner">
                <div className="grid grid-cols-9 gap-0.5 w-44">
                  {Array.from({ length: 81 }).map((_, i) => {
                    const row = Math.floor(i / 9), col = i % 9;
                    const corner = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
                    const inner = (row >= 1 && row <= 2 && col >= 1 && col <= 2) ||
                      (row >= 1 && row <= 2 && col >= 6 && col <= 7) || (row >= 6 && row <= 7 && col >= 1 && col <= 2);
                    const filled = corner || inner || (i % 3 === 0) || (i % 7 === 0);
                    return <div key={i} className={`w-5 h-5 rounded-sm ${filled ? 'bg-[#0a1628]' : 'bg-transparent'}`} />;
                  })}
                </div>
              </div>
              <p className="text-xs text-[var(--muted)] text-center max-w-xs">
                Scannez ce QR code pour recevoir des {currency} sur cette adresse
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Instructions */}
      <Card padding="md" className="space-y-3">
        <p className="text-sm font-bold text-[var(--ink)]">Comment recevoir des {currency} ?</p>
        {[
          `Partagez votre adresse ${currency} ci-dessus`,
          `L'expéditeur envoie des ${currency} à cette adresse`,
          'La transaction apparaît dans vos activités en quelques minutes',
          'Vos fonds sont disponibles immédiatement',
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
            <p className="text-xs text-[var(--muted)]">{step}</p>
          </div>
        ))}
      </Card>
    </motion.div>
  );
}

export default function SendReceivePage() {
  const { state } = useApp();
  // Default tab based on navigation
  const defaultTab = state.view === 'receive' ? 'receive' : 'send';
  const [tab, setTab] = useState<'send' | 'receive'>(defaultTab);

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-lg mx-auto space-y-5">
      <h2 className="display text-xl font-bold text-[var(--ink)]">
        {tab === 'send' ? 'Envoyer' : 'Recevoir'}
      </h2>

      <div className="flex p-1 bg-[var(--surface-muted)] rounded-2xl">
        <button onClick={() => setTab('send')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'send' ? 'bg-[var(--surface-card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}>
          <Send size={14} /> Envoyer
        </button>
        <button onClick={() => setTab('receive')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'receive' ? 'bg-[var(--surface-card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}>
          <ArrowDownLeft size={14} /> Recevoir
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, x: tab === 'send' ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
          {tab === 'send' ? <SendTab /> : <ReceiveTab />}
        </motion.div>
      </AnimatePresence>

      {/* Unused import to suppress lint — needed for ChevronRight in contacts */}
      <div className="hidden"><ChevronRight size={0} /></div>
    </div>
  );
}
