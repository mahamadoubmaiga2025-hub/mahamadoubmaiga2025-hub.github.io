import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wallet, ShoppingBag, TrendingDown, ArrowLeftRight,
  Send, ArrowDownLeft, CreditCard, Store, List, BarChart2, Bot, Code,
  Shield, Settings, Coins, X, Menu, Moon, Sun, ShieldAlert
} from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import type { AppView } from '@/types';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Vue générale', icon: LayoutDashboard, section: 'Principal' },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'buy', label: 'Acheter', icon: ShoppingBag },
  { id: 'sell', label: 'Vendre', icon: TrendingDown },
  { id: 'convert', label: 'Convertir', icon: ArrowLeftRight },
  { id: 'send', label: 'Envoyer', icon: Send },
  { id: 'receive', label: 'Recevoir', icon: ArrowDownLeft },
  { id: 'payments', label: 'Mobile Money', icon: CreditCard, section: 'Paiements' },
  { id: 'merchant', label: 'Marchand', icon: Store },
  { id: 'transactions', label: 'Transactions', icon: List, section: 'Données' },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'ai', label: 'AfriAI', icon: Bot, section: 'Avancé' },
  { id: 'api', label: 'API', icon: Code },
  { id: 'token', label: 'Token AFRI', icon: Coins },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'settings', label: 'Paramètres', icon: Settings },
  { id: 'admin', label: 'Admin', icon: ShieldAlert },
];

const MOBILE_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'convert', label: 'Convertir', icon: ArrowLeftRight },
  { id: 'payments', label: 'Mobile Money', icon: CreditCard },
  { id: 'settings', label: 'Profil', icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { state, navigate, toggleDark } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const grouped: { section: string; items: NavItem[] }[] = [];
  let currentSection = '';
  let currentGroup: NavItem[] = [];
  for (const item of NAV_ITEMS) {
    if (item.section && item.section !== currentSection) {
      if (currentGroup.length) grouped.push({ section: currentSection, items: currentGroup });
      currentSection = item.section;
      currentGroup = [];
    }
    currentGroup.push(item);
  }
  if (currentGroup.length) grouped.push({ section: currentSection, items: currentGroup });

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--ink)] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm display">A</span>
          </div>
          <span className="font-black text-[var(--ink)] text-lg display tracking-tight">AfriPay</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-7 h-7 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center text-[var(--muted)]">
          <X size={13} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {grouped.map(group => (
          <div key={group.section}>
            {group.section && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--subtle)] px-3 mb-1">{group.section}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = state.view === item.id;
                return (
                  <button key={item.id}
                    onClick={() => { navigate(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all text-left ${
                      active
                        ? 'bg-[var(--ink)] text-white shadow-sm'
                        : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)]'
                    }`}>
                    <item.icon size={16} className="flex-shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + dark mode */}
      <div className="p-4 border-t border-[var(--border)] space-y-3">
        <button onClick={() => toggleDark()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)] transition-all">
          {state.isDark ? <Sun size={16} /> : <Moon size={16} />}
          {state.isDark ? 'Mode clair' : 'Mode sombre'}
        </button>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-[var(--surface-muted)]">
          <div className="w-8 h-8 rounded-full bg-[var(--ink)] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
            {state.user?.name?.[0] ?? 'M'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--ink)] truncate">{state.user?.name ?? 'Mamadou Traoré'}</p>
            <p className="text-[10px] text-[var(--muted)] truncate">{state.user?.country ?? 'Mali'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[var(--surface-base)] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-[var(--surface-card)] border-r border-[var(--border)]">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-[var(--surface-card)] border-r border-[var(--border)] z-50 lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--surface-card)] border-b border-[var(--border)] flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center text-[var(--ink)]">
            <Menu size={17} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[var(--ink)] flex items-center justify-center">
              <span className="text-white font-black text-xs display">A</span>
            </div>
            <span className="font-black text-[var(--ink)] display tracking-tight">AfriPay</span>
          </div>
          <div className="w-9 h-9" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={state.view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface-card)] border-t border-[var(--border)] flex z-30 px-2 pb-safe">
        {MOBILE_NAV.map(item => {
          const active = state.view === item.id;
          return (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all ${active ? 'text-brand-600' : 'text-[var(--muted)]'}`}>
              <item.icon size={20} />
              <span className="text-[9px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
