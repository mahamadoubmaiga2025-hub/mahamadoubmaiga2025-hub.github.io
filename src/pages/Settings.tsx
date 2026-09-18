import React, { useState } from 'react';
import { User, Globe, Bell, Palette, HelpCircle, LogOut, ChevronRight, Moon, Sun, Check } from 'lucide-react';
import Card from '@/components/Card';
import { useApp } from '@/hooks/useApp';
import { toast } from 'sonner';

const CURRENCIES = ['FCFA', 'USD', 'EUR', 'GHS', 'NGN', 'KES'];
const LANGUAGES = ['Français', 'English', 'Hausa', 'Swahili'];
const COUNTRIES = ['Mali', 'Sénégal', 'Côte d\'Ivoire', 'Burkina Faso', 'Ghana', 'Nigeria', 'Kenya'];

export default function SettingsPage() {
  const { state, toggleDark, logout } = useApp();
  const user = state.user;
  const [currency, setCurrency] = useState(user?.primaryCurrency ?? 'FCFA');
  const [language, setLanguage] = useState('Français');
  const [country, setCountry] = useState(user?.country ?? 'Mali');
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifSMS, setNotifSMS] = useState(true);

  function saveProfile() { toast.success('Profil mis à jour'); }

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-lg mx-auto space-y-5">
      <h2 className="display text-xl font-bold text-[var(--ink)]">Paramètres</h2>

      {/* Profile */}
      <Card padding="md">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-[var(--ink)] flex items-center justify-center text-white text-xl font-black flex-shrink-0">
            {user?.name?.[0] ?? 'M'}
          </div>
          <div>
            <p className="font-bold text-[var(--ink)]">{user?.name ?? 'Mamadou Traoré'}</p>
            <p className="text-sm text-[var(--muted)]">{user?.email ?? 'mamadou@gmail.com'}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Check size={11} className="text-green-600" />
              <span className="text-xs text-green-600 font-semibold">KYC vérifié</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5 block">Pays</label>
            <select value={country} onChange={e => setCountry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-sm font-medium text-[var(--ink)] outline-none focus:border-brand-400 transition-all">
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5 block">Devise principale</label>
            <select value={currency} onChange={e => setCurrency(e.target.value as typeof currency)}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-sm font-medium text-[var(--ink)] outline-none focus:border-brand-400 transition-all">
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5 block">Langue</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-sm font-medium text-[var(--ink)] outline-none focus:border-brand-400 transition-all">
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button onClick={saveProfile}
            className="w-full py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 active:scale-[0.99] transition-all">
            Sauvegarder
          </button>
        </div>
      </Card>

      {/* Appearance */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Palette size={15} className="text-[var(--muted)]" />
            <h3 className="display font-bold text-[var(--ink)] text-sm">Apparence</h3>
          </div>
        </div>
        <div className="flex gap-2">
          {[
            { label: 'Clair', icon: Sun, value: false },
            { label: 'Sombre', icon: Moon, value: true },
          ].map(opt => (
            <button key={opt.label} onClick={() => toggleDark(opt.value)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                state.isDark === opt.value ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-[var(--border)] text-[var(--muted)] hover:border-brand-300'
              }`}>
              <opt.icon size={15} /> {opt.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card padding="none">
        <div className="px-5 py-3.5 border-b border-[var(--border)]">
          <h3 className="display font-bold text-[var(--ink)] text-sm flex items-center gap-2"><Bell size={14} /> Notifications</h3>
        </div>
        {[
          { label: 'Notifications push', sub: 'Sur cet appareil', value: notifPush, onChange: setNotifPush },
          { label: 'Email', sub: user?.email ?? '', value: notifEmail, onChange: setNotifEmail },
          { label: 'SMS', sub: user?.phone ?? '+223 76 12 34 56', value: notifSMS, onChange: setNotifSMS },
        ].map((n, i, arr) => (
          <div key={n.label} className={`flex items-center justify-between px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">{n.label}</p>
              <p className="text-xs text-[var(--muted)]">{n.sub}</p>
            </div>
            <button onClick={() => { n.onChange(!n.value); toast.success(n.value ? 'Désactivé' : 'Activé'); }}
              className={`relative w-11 h-6 rounded-full transition-all duration-200 ${n.value ? 'bg-brand-600' : 'bg-gray-200'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${n.value ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </Card>

      {/* Help & Logout */}
      <Card padding="none">
        {[
          { icon: HelpCircle, label: 'Centre d\'aide', action: () => toast('Bientôt disponible') },
          { icon: Globe, label: 'Mentions légales', action: () => toast('Bientôt disponible') },
        ].map((item, i) => (
          <button key={item.label} onClick={item.action}
            className={`w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--surface-muted)] transition-colors ${i === 0 ? 'border-b border-[var(--border)]' : ''}`}>
            <div className="flex items-center gap-3">
              <item.icon size={15} className="text-[var(--muted)]" />
              <span className="text-sm font-medium text-[var(--ink)]">{item.label}</span>
            </div>
            <ChevronRight size={14} className="text-[var(--muted)]" />
          </button>
        ))}
      </Card>

      <button onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-all">
        <LogOut size={15} /> Se déconnecter
      </button>

      <p className="text-center text-xs text-[var(--subtle)]">AfriPay v1.0.0 · MVP Demo · Toutes les transactions sont simulées</p>
    </div>
  );
}
