import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, QrCode, ArrowDownLeft, Send, ChevronRight, Eye, EyeOff } from 'lucide-react';
import Card from '@/components/Card';
import CurrencyIcon from '@/components/CurrencyIcon';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { useApp } from '@/hooks/useApp';
import { formatAmount, formatUSD, formatRelativeDate } from '@/utils/format';
import { toast } from 'sonner';
import type { WalletAsset } from '@/types';

function QRCodeMock({ value }: { value: string }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-inner inline-block">
      <div className="grid grid-cols-9 gap-0.5 w-40">
        {Array.from({ length: 81 }).map((_, i) => {
          const row = Math.floor(i / 9), col = i % 9;
          const corner = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
          const inner = (row >= 1 && row <= 2 && col >= 1 && col <= 2) ||
            (row >= 1 && row <= 2 && col >= 6 && col <= 7) ||
            (row >= 6 && row <= 7 && col >= 1 && col <= 2);
          const filled = corner || inner || (i % 3 === 0) || (i % 7 === 0);
          return <div key={i} className={`w-[18px] h-[18px] rounded-sm ${filled ? 'bg-[#0a1628]' : 'bg-transparent'}`} />;
        })}
      </div>
      <p className="text-[8px] text-center text-gray-400 mt-1 mono truncate max-w-[160px]">{value.slice(0, 20)}...</p>
    </div>
  );
}

function WalletCard({ wallet, isSelected, onClick }: { wallet: WalletAsset; isSelected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
        isSelected ? 'border-brand-600 bg-green-50' : 'border-[var(--border)] bg-[var(--surface-strong)] hover:border-brand-300'
      }`}>
      <CurrencyIcon currency={wallet.currency} size={38} />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[var(--ink)] text-sm">{wallet.currency}</p>
        <p className="text-xs text-[var(--muted)] tabular">{formatUSD(wallet.balanceUSD)}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-[var(--ink)] tabular text-sm">{formatAmount(wallet.balance, wallet.currency)}</p>
        <p className={`text-xs font-semibold tabular ${wallet.change24h >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {wallet.change24h > 0 ? '+' : ''}{wallet.change24h}%
        </p>
      </div>
    </button>
  );
}

export default function WalletPage() {
  const { state, navigate } = useApp();
  const [selected, setSelected] = useState<WalletAsset>(state.wallets[0]);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

  function copyAddress() {
    if (!selected.address) return;
    navigator.clipboard.writeText(selected.address).catch(() => {});
    setCopiedAddr(true);
    toast.success('Adresse copiée');
    setTimeout(() => setCopiedAddr(false), 2000);
  }

  const txns = state.transactions.filter(t => t.currency === selected.currency || t.toCurrency === selected.currency).slice(0, 6);

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="display text-xl font-bold text-[var(--ink)]">Wallet</h2>
        <button onClick={() => setHideBalance(!hideBalance)} className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-brand-600 transition-colors">
          {hideBalance ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Left: asset list */}
        <div className="lg:col-span-2 space-y-2">
          {state.wallets.map(w => (
            <WalletCard key={w.currency} wallet={w} isSelected={selected.currency === w.currency} onClick={() => setSelected(w)} />
          ))}
        </div>

        {/* Right: detail */}
        <div className="lg:col-span-3 space-y-4">
          <motion.div
            key={selected.currency}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6"
            style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a3a2a 100%)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <CurrencyIcon currency={selected.currency} size={44} />
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">{selected.currency}</p>
                <p className="display text-3xl font-bold text-white tabular">
                  {hideBalance ? '••••••' : formatAmount(selected.balance, selected.currency)}
                </p>
                <p className="text-gray-400 text-sm tabular">{hideBalance ? '•••' : formatUSD(selected.balanceUSD)}</p>
              </div>
            </div>

            {/* Address */}
            {selected.address && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 mb-4">
                <span className="mono text-xs text-gray-300 flex-1 truncate">{selected.address}</span>
                <button onClick={copyAddress} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                  {copiedAddr ? <Check size={13} className="text-green-400" /> : <Copy size={13} className="text-gray-400" />}
                </button>
                <button onClick={() => setShowQR(!showQR)} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                  <QrCode size={13} className="text-gray-400" />
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button onClick={() => navigate('receive')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-white text-sm font-semibold">
                <ArrowDownLeft size={16} /> Recevoir
              </button>
              <button onClick={() => navigate('send')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 transition-all text-white text-sm font-semibold">
                <Send size={16} /> Envoyer
              </button>
            </div>
          </motion.div>

          {/* QR code */}
          <AnimatePresence>
            {showQR && selected.address && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Card padding="md" className="flex flex-col items-center gap-3">
                  <p className="text-sm font-semibold text-[var(--ink)]">QR Code — {selected.currency}</p>
                  <QRCodeMock value={selected.address} />
                  <p className="text-xs text-[var(--muted)] text-center">Scannez pour recevoir des {selected.currency}</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History */}
          <Card padding="none">
            <div className="px-5 py-3.5 border-b border-[var(--border)]">
              <h3 className="display font-bold text-[var(--ink)] text-sm">Historique {selected.currency}</h3>
            </div>
            {txns.length === 0 ? (
              <div className="py-8 text-center text-[var(--muted)] text-sm">Aucune transaction</div>
            ) : (
              txns.map((tx, i) => {
                const isIn = tx.amount > 0;
                return (
                  <div key={tx.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < txns.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isIn ? 'bg-green-50' : 'bg-[var(--surface-muted)]'}`}>
                      {isIn ? <ArrowDownLeft size={13} className="text-green-600" /> : <Send size={13} className="text-[var(--muted)]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--ink)] truncate">{tx.description}</p>
                      <p className="text-xs text-[var(--muted)]">{formatRelativeDate(tx.date)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold tabular ${isIn ? 'text-green-600' : 'text-[var(--ink)]'}`}>
                        {isIn ? '+' : ''}{formatAmount(Math.abs(tx.amount), tx.currency)}
                      </p>
                      <Badge status={tx.status} />
                    </div>
                  </div>
                );
              })
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
