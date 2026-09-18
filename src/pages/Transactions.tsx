import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ArrowUpRight, ArrowDownLeft, ChevronRight } from 'lucide-react';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import CurrencyIcon from '@/components/CurrencyIcon';
import { useApp } from '@/hooks/useApp';
import { formatAmount, formatRelativeDate } from '@/utils/format';
import type { Transaction, TxStatus, TxType } from '@/types';

const TYPE_LABELS: Record<TxType, string> = {
  mobile_money_in: 'Mobile Money In',
  mobile_money_out: 'Mobile Money Out',
  receive: 'Réception',
  send: 'Envoi',
  convert: 'Conversion',
  payment: 'Paiement',
  merchant: 'Marchand',
};

const STATUS_OPTIONS: TxStatus[] = ['completed', 'pending', 'failed'];
const STATUS_FR: Record<TxStatus, string> = { completed: 'Complété', pending: 'En attente', failed: 'Échoué' };
const TYPE_OPTIONS: TxType[] = ['mobile_money_in', 'mobile_money_out', 'receive', 'send', 'convert', 'payment'];

export default function TransactionsPage() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TxStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TxType | 'all'>('all');
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return state.transactions.filter(tx => {
      const matchSearch = !search || tx.description.toLowerCase().includes(search.toLowerCase()) || tx.currency.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || tx.status === statusFilter;
      const matchType = typeFilter === 'all' || tx.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [state.transactions, search, statusFilter, typeFilter]);

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="display text-xl font-bold text-[var(--ink)]">Transactions</h2>
        <span className="text-xs text-[var(--muted)] font-medium tabular">{filtered.length} résultats</span>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/10 transition-all">
          <Search size={15} className="text-[var(--muted)] flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            className="flex-1 bg-transparent outline-none text-sm text-[var(--ink)] placeholder:text-[var(--subtle)]" />
          {search && <button onClick={() => setSearch('')}><X size={13} className="text-[var(--muted)]" /></button>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all ${showFilters ? 'border-brand-600 bg-green-50 text-brand-600' : 'border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]'}`}>
          <Filter size={15} />
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card padding="md" className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Statut</p>
                <div className="flex flex-wrap gap-2">
                  {(['all', ...STATUS_OPTIONS] as const).map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${statusFilter === s ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--ink)]'}`}>
                      {s === 'all' ? 'Tous' : STATUS_FR[s]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Type</p>
                <div className="flex flex-wrap gap-2">
                  {(['all', ...TYPE_OPTIONS] as const).map(t => (
                    <button key={t} onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${typeFilter === t ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--ink)]'}`}>
                      {t === 'all' ? 'Tous' : TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <Card padding="none">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-[var(--muted)] text-sm">Aucune transaction trouvée</div>
        ) : (
          filtered.map((tx, i) => {
            const isIn = tx.amount > 0;
            return (
              <motion.button key={tx.id}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(tx)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-[var(--surface-muted)] transition-colors ${i < filtered.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isIn ? 'bg-green-50' : 'bg-[var(--surface-muted)]'}`}>
                  {isIn ? <ArrowDownLeft size={16} className="text-green-600" /> : <ArrowUpRight size={16} className="text-[var(--muted)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--ink)] truncate">{tx.description}</p>
                  <p className="text-xs text-[var(--muted)]">{TYPE_LABELS[tx.type]} · {formatRelativeDate(tx.date)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold tabular ${isIn ? 'text-green-600' : 'text-[var(--ink)]'}`}>
                    {isIn ? '+' : ''}{formatAmount(Math.abs(tx.amount), tx.currency)}
                  </p>
                  <Badge status={tx.status} />
                </div>
                <ChevronRight size={14} className="text-[var(--muted)] flex-shrink-0 ml-1" />
              </motion.button>
            );
          })
        )}
      </Card>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
            <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              className="w-full max-w-md">
              <Card padding="lg" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="display font-bold text-[var(--ink)]">Détail</h3>
                  <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
                    <X size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <CurrencyIcon currency={selected.currency} size={48} />
                  <div>
                    <p className={`display text-2xl font-bold tabular ${selected.amount > 0 ? 'text-green-600' : 'text-[var(--ink)]'}`}>
                      {selected.amount > 0 ? '+' : ''}{formatAmount(Math.abs(selected.amount), selected.currency)}
                    </p>
                    <p className="text-sm text-[var(--muted)]">{selected.description}</p>
                  </div>
                </div>
                <div className="space-y-2.5 border-t border-[var(--border)] pt-3">
                  {[
                    { label: 'Type', value: TYPE_LABELS[selected.type] },
                    { label: 'Statut', value: <Badge status={selected.status} /> },
                    { label: 'ID', value: <span className="mono text-xs">{selected.id}</span> },
                    { label: 'Date', value: new Date(selected.date).toLocaleString('fr-FR') },
                    selected.fees ? { label: 'Frais', value: `${selected.fees} ${selected.currency}` } : null,
                    selected.counterparty ? { label: 'Contrepartie', value: selected.counterparty } : null,
                    selected.toCurrency ? { label: 'Converti en', value: `${selected.toAmount} ${selected.toCurrency}` } : null,
                  ].filter(Boolean).map((row, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm text-[var(--muted)]">{row!.label}</span>
                      <span className="text-sm text-[var(--ink)] font-medium">{row!.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
