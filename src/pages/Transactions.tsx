import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, ArrowUpRight, ArrowDownLeft, ChevronRight,
  Download, Calendar, ArrowLeftRight, Smartphone, Store, CreditCard
} from 'lucide-react';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import CurrencyIcon from '@/components/CurrencyIcon';
import { useApp } from '@/hooks/useApp';
import { formatAmount, formatRelativeDate } from '@/utils/format';
import { toast } from 'sonner';
import type { Transaction, TxStatus, TxType } from '@/types';

const TYPE_LABELS: Record<TxType, string> = {
  mobile_money_in:  'Mobile Money In',
  mobile_money_out: 'Mobile Money Out',
  receive:  'Réception',
  send:     'Envoi',
  convert:  'Conversion',
  payment:  'Paiement',
  merchant: 'Marchand',
};

const TYPE_ICONS: Record<TxType, React.ElementType> = {
  mobile_money_in:  Smartphone,
  mobile_money_out: Smartphone,
  receive:    ArrowDownLeft,
  send:       ArrowUpRight,
  convert:    ArrowLeftRight,
  payment:    CreditCard,
  merchant:   Store,
};

const STATUS_OPTIONS: TxStatus[] = ['completed', 'pending', 'failed'];
const STATUS_FR: Record<TxStatus, string> = { completed: 'Complété', pending: 'En attente', failed: 'Échoué' };
const TYPE_OPTIONS: TxType[] = ['mobile_money_in', 'mobile_money_out', 'receive', 'send', 'convert', 'payment'];

type DateRange = 'all' | '7j' | '30j' | '90j';
const DATE_LABELS: Record<DateRange, string> = { all: 'Toutes', '7j': '7 jours', '30j': '30 jours', '90j': '90 jours' };

function typeIconBg(type: TxType, isIn: boolean): string {
  if (type === 'mobile_money_in') return 'bg-orange-50 text-orange-600';
  if (type === 'mobile_money_out') return 'bg-orange-50 text-orange-400';
  if (type === 'convert') return 'bg-blue-50 text-blue-600';
  if (type === 'payment' || type === 'merchant') return 'bg-purple-50 text-purple-600';
  if (isIn) return 'bg-green-50 text-green-600';
  return 'bg-[var(--surface-muted)] text-[var(--muted)]';
}

export default function TransactionsPage() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TxStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TxType | 'all'>('all');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const cutoff = dateRange === 'all' ? null :
      dateRange === '7j' ? 7 : dateRange === '30j' ? 30 : 90;
    const cutoffDate = cutoff ? new Date(Date.now() - cutoff * 86400000) : null;

    return state.transactions.filter(tx => {
      const matchSearch = !search ||
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        tx.currency.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || tx.status === statusFilter;
      const matchType = typeFilter === 'all' || tx.type === typeFilter;
      const matchDate = !cutoffDate || new Date(tx.date) >= cutoffDate;
      return matchSearch && matchStatus && matchType && matchDate;
    });
  }, [state.transactions, search, statusFilter, typeFilter, dateRange]);

  // Grouped by date
  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filtered.forEach(tx => {
      const d = new Date(tx.date);
      const key = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });
    return Object.entries(groups);
  }, [filtered]);

  const activeFilters = (statusFilter !== 'all' ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0) + (dateRange !== 'all' ? 1 : 0);

  function exportCSV() {
    const rows = ['Date,Description,Type,Montant,Devise,Statut', ...filtered.map(tx =>
      `${tx.date},${tx.description},${TYPE_LABELS[tx.type]},${tx.amount},${tx.currency},${tx.status}`
    )].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'transactions-afripay.csv'; a.click();
    toast.success('Export CSV téléchargé');
  }

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-xl font-bold text-[var(--ink)]">Transactions</h2>
          <p className="text-xs text-[var(--muted)]">{filtered.length} résultats{activeFilters > 0 ? ` · ${activeFilters} filtre${activeFilters > 1 ? 's' : ''}` : ''}</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--border-strong)] transition-all">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/10 transition-all">
          <Search size={15} className="text-[var(--muted)] flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            className="flex-1 bg-transparent outline-none text-sm text-[var(--ink)] placeholder:text-[var(--subtle)]" />
          {search && <button onClick={() => setSearch('')}><X size={13} className="text-[var(--muted)]" /></button>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`relative w-11 h-11 rounded-2xl border flex items-center justify-center transition-all ${showFilters || activeFilters > 0 ? 'border-brand-600 bg-green-50 text-brand-600' : 'border-[var(--border)] bg-[var(--surface-card)] text-[var(--muted)] hover:text-[var(--ink)]'}`}>
          <Filter size={15} />
          {activeFilters > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center">{activeFilters}</span>
          )}
        </button>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card padding="md" className="space-y-4">
              {/* Date range */}
              <div>
                <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar size={11} /> Période
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(DATE_LABELS) as DateRange[]).map(d => (
                    <button key={d} onClick={() => setDateRange(d)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${dateRange === d ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--ink)]'}`}>
                      {DATE_LABELS[d]}
                    </button>
                  ))}
                </div>
              </div>
              {/* Status */}
              <div>
                <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Statut</p>
                <div className="flex flex-wrap gap-2">
                  {(['all', ...STATUS_OPTIONS] as const).map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${statusFilter === s ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--ink)]'}`}>
                      {s === 'all' ? 'Tous' : STATUS_FR[s]}
                    </button>
                  ))}
                </div>
              </div>
              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Type</p>
                <div className="flex flex-wrap gap-2">
                  {(['all', ...TYPE_OPTIONS] as const).map(t => (
                    <button key={t} onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${typeFilter === t ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--ink)]'}`}>
                      {t === 'all' ? 'Tous' : TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
              {activeFilters > 0 && (
                <button onClick={() => { setStatusFilter('all'); setTypeFilter('all'); setDateRange('all'); }}
                  className="text-xs text-red-500 font-semibold hover:underline">
                  Effacer les filtres
                </button>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction list grouped by date */}
      {filtered.length === 0 ? (
        <Card padding="lg" className="flex flex-col items-center gap-3 py-12">
          <div className="w-14 h-14 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-[var(--muted)]">
            <Search size={22} />
          </div>
          <p className="text-sm font-semibold text-[var(--ink)]">Aucune transaction trouvée</p>
          <p className="text-xs text-[var(--muted)] text-center">Essayez de modifier vos filtres ou votre recherche</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {grouped.map(([dateLabel, txns]) => (
            <div key={dateLabel}>
              <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2 px-1 capitalize">{dateLabel}</p>
              <Card padding="none" className="divide-y divide-[var(--border)]">
                {txns.map((tx, i) => {
                  const isIn = tx.amount > 0;
                  const Icon = TYPE_ICONS[tx.type] ?? (isIn ? ArrowDownLeft : ArrowUpRight);
                  const iconCls = typeIconBg(tx.type, isIn);
                  return (
                    <motion.button key={tx.id}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                      onClick={() => setSelected(tx)}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-[var(--surface-muted)] transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconCls}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--ink)] truncate">{tx.description}</p>
                        <p className="text-xs text-[var(--muted)]">{TYPE_LABELS[tx.type]} · {formatRelativeDate(tx.date)}</p>
                      </div>
                      <div className="text-right flex-shrink-0 space-y-0.5">
                        <p className={`text-sm font-bold tabular ${isIn ? 'text-green-600' : 'text-[var(--ink)]'}`}>
                          {isIn ? '+' : ''}{formatAmount(Math.abs(tx.amount), tx.currency)}
                        </p>
                        <Badge status={tx.status} />
                      </div>
                      <ChevronRight size={14} className="text-[var(--muted)] flex-shrink-0 ml-1" />
                    </motion.button>
                  );
                })}
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Transaction detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
            <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              className="w-full max-w-md">
              <Card padding="lg" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="display font-bold text-[var(--ink)]">Détail transaction</h3>
                  <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
                    <X size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <CurrencyIcon currency={selected.currency} size={52} />
                  <div>
                    <p className={`display text-2xl font-black tabular ${selected.amount > 0 ? 'text-green-600' : 'text-[var(--ink)]'}`}>
                      {selected.amount > 0 ? '+' : ''}{formatAmount(Math.abs(selected.amount), selected.currency)}
                    </p>
                    <p className="text-sm text-[var(--muted)] mt-0.5">{selected.description}</p>
                  </div>
                </div>
                <div className="space-y-3 border-t border-[var(--border)] pt-4">
                  {[
                    { label: 'Type', value: TYPE_LABELS[selected.type] },
                    { label: 'Statut', value: <Badge status={selected.status} /> },
                    { label: 'Date', value: new Date(selected.date).toLocaleString('fr-FR') },
                    { label: 'ID', value: <span className="mono text-xs">{selected.id}</span> },
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
                <Button variant="secondary" fullWidth onClick={() => setSelected(null)}>Fermer</Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
