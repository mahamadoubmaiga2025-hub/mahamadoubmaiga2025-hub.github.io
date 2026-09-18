import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe, Bell, Palette, HelpCircle, LogOut, ChevronRight,
  Moon, Sun, Check, User, Mail, Phone, MapPin, Camera,
  CreditCard, Zap, Languages
} from 'lucide-react';
import Card from '@/components/Card';
import type { Currency } from '@/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useApp } from '@/hooks/useApp';
import { toast } from 'sonner';

const CURRENCIES = ['FCFA', 'USD', 'EUR', 'GHS', 'NGN', 'KES'];
const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'wo', label: 'Wolof' },
  { code: 'bm', label: 'Bambara' },
];
const COUNTRIES = ['Mali', 'Sénégal', 'Côte d\'Ivoire', 'Burkina Faso', 'Ghana', 'Nigeria', 'Kenya'];
const THEMES = [
  { id: 'light', label: 'Clair', icon: Sun },
  { id: 'dark', label: 'Sombre', icon: Moon },
  { id: 'auto', label: 'Auto', icon: Palette },
];

export default function SettingsPage() {
  const { state, toggleDark } = useApp();
  const [activeSection, setActiveSection] = useState<string | null>('profile');

  // Profile form
  const [name, setName] = useState(state.user?.name ?? 'Mamadou Traoré');
  const [email, setEmail] = useState(state.user?.email ?? 'mamadou@example.com');
  const [phone, setPhone] = useState('+223 76 00 00 00');
  const [country, setCountry] = useState(state.user?.country ?? 'Mali');
  const [currency, setCurrency] = useState<Currency>(state.user?.primaryCurrency ?? 'FCFA');
  const [lang, setLang] = useState('fr');
  const [theme, setTheme] = useState(state.isDark ? 'dark' : 'light');

  // Notifications
  const [notifs, setNotifs] = useState({
    transactions: true,
    security: true,
    marketing: false,
    merchant: true,
    rates: false,
  });

  function saveProfile() {
    toast.success('Profil mis à jour !');
  }

  function handleTheme(t: string) {
    setTheme(t);
    const wantDark = t === 'dark' || (t === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (wantDark !== state.isDark) toggleDark();
  }

  const MENU_SECTIONS = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'preferences', label: 'Préférences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'payment', label: 'Méthodes de paiement', icon: CreditCard },
    { id: 'plan', label: 'Mon plan', icon: Zap },
    { id: 'help', label: 'Aide & Support', icon: HelpCircle },
  ];

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-3xl mx-auto">
      <h2 className="display text-xl font-bold text-[var(--ink)] mb-5">Paramètres</h2>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar menu */}
        <div className="lg:w-52 flex-shrink-0">
          <Card padding="none" className="divide-y divide-[var(--border)]">
            {MENU_SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${activeSection === s.id ? 'bg-green-50' : 'hover:bg-[var(--surface-muted)]'}`}>
                <s.icon size={15} className={activeSection === s.id ? 'text-brand-600' : 'text-[var(--muted)]'} />
                <span className={`text-sm font-semibold flex-1 ${activeSection === s.id ? 'text-brand-700' : 'text-[var(--ink)]'}`}>{s.label}</span>
                <ChevronRight size={13} className="text-[var(--muted)]" />
              </button>
            ))}
            <button onClick={() => toast.success('Déconnexion simulée')}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={15} />
              <span className="text-sm font-semibold">Déconnexion</span>
            </button>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Profile */}
          {activeSection === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h3 className="display font-bold text-[var(--ink)]">Profil</h3>
              {/* Avatar */}
              <Card padding="md">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-[var(--ink)] flex items-center justify-center text-white font-black text-2xl">
                      {name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <button onClick={() => toast.info('Upload photo — bientôt disponible')}
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center border-2 border-white">
                      <Camera size={10} className="text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="font-bold text-[var(--ink)]">{name}</p>
                    <p className="text-xs text-[var(--muted)]">{email}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 mt-1 inline-block">Compte vérifié</span>
                  </div>
                </div>
              </Card>

              <Card padding="md" className="space-y-3">
                <Input label="Nom complet" value={name} onChange={e => setName(e.target.value)} fullWidth prefix={<User size={13} />} />
                <Input label="Adresse email" value={email} onChange={e => setEmail(e.target.value)} type="email" fullWidth prefix={<Mail size={13} />} />
                <Input label="Téléphone" value={phone} onChange={e => setPhone(e.target.value)} type="tel" fullWidth prefix={<Phone size={13} />} />
                <div>
                  <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-1.5 block">Pays</label>
                  <div className="relative">
                    <MapPin size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <select value={country} onChange={e => setCountry(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-sm text-[var(--ink)] outline-none focus:border-brand-400 transition-all">
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <Button variant="primary" size="md" fullWidth onClick={saveProfile} icon={<Check size={13} />}>Sauvegarder</Button>
              </Card>
            </motion.div>
          )}

          {/* Preferences */}
          {activeSection === 'preferences' && (
            <motion.div key="preferences" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h3 className="display font-bold text-[var(--ink)]">Préférences</h3>
              <Card padding="md" className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                    <CreditCard size={11} /> Devise principale
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CURRENCIES.map(c => (
                      <button key={c} onClick={() => setCurrency(c as Currency)}
                        className={`py-2 rounded-xl border text-sm font-bold transition-all ${currency === c ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-[var(--border)] text-[var(--muted)] hover:border-brand-300 hover:text-[var(--ink)]'}`}>
                        {c as string}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                    <Languages size={11} /> Langue
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGUAGES.map(l => (
                      <button key={l.code} onClick={() => setLang(l.code)}
                        className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${lang === l.code ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-[var(--border)] text-[var(--muted)] hover:border-brand-300 hover:text-[var(--ink)]'}`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-[var(--muted)] mt-1.5">Support complet du français · Autres langues à venir</p>
                </div>
                <Button variant="primary" size="md" fullWidth onClick={() => toast.success('Préférences sauvegardées')} icon={<Check size={13} />}>Sauvegarder</Button>
              </Card>
            </motion.div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <motion.div key="notifs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h3 className="display font-bold text-[var(--ink)]">Notifications</h3>
              <Card padding="none" className="divide-y divide-[var(--border)]">
                {[
                  { id: 'transactions', label: 'Transactions', desc: 'Chaque envoi, réception ou conversion' },
                  { id: 'security', label: 'Sécurité', desc: 'Connexions et alertes de compte' },
                  { id: 'merchant', label: 'Marchand', desc: 'Paiements et nouvelles commandes' },
                  { id: 'rates', label: 'Taux de change', desc: 'Variations importantes des taux' },
                  { id: 'marketing', label: 'Nouveautés & promos', desc: 'Offres et nouvelles fonctionnalités' },
                ].map(item => (
                  <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--ink)]">{item.label}</p>
                      <p className="text-xs text-[var(--muted)]">{item.desc}</p>
                    </div>
                    <button onClick={() => {
                      setNotifs(n => ({ ...n, [item.id]: !n[item.id as keyof typeof n] }));
                      toast.success('Préférence mise à jour');
                    }}
                      className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${notifs[item.id as keyof typeof notifs] ? 'bg-brand-600' : 'bg-[var(--surface-muted)] border border-[var(--border)]'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notifs[item.id as keyof typeof notifs] ? 'left-[26px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </Card>
            </motion.div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <motion.div key="appearance" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h3 className="display font-bold text-[var(--ink)]">Apparence</h3>
              <Card padding="md" className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Thème</p>
                  <div className="grid grid-cols-3 gap-3">
                    {THEMES.map(t => (
                      <button key={t.id} onClick={() => handleTheme(t.id)}
                        className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${theme === t.id ? 'border-brand-600 bg-green-50' : 'border-[var(--border)] hover:border-brand-300'}`}>
                        <t.icon size={20} className={theme === t.id ? 'text-brand-600' : 'text-[var(--muted)]'} />
                        <span className={`text-xs font-bold ${theme === t.id ? 'text-brand-700' : 'text-[var(--muted)]'}`}>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Taille de texte</p>
                  <div className="flex gap-2">
                    {['Petit', 'Normal', 'Grand'].map((s, i) => (
                      <button key={s}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${i === 1 ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-[var(--border)] text-[var(--muted)] hover:border-brand-300'}`}
                        onClick={() => toast.info('Fonctionnalité bientôt disponible')}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Payment methods */}
          {activeSection === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h3 className="display font-bold text-[var(--ink)]">Méthodes de paiement</h3>
              <Card padding="none" className="divide-y divide-[var(--border)]">
                {[
                  { label: 'Orange Money', sub: '+223 76 00 00 00', tag: 'Principale', color: '#FF6600' },
                  { label: 'Wave', sub: '+223 76 11 22 33', tag: null, color: '#1A9EFF' },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-3 px-5 py-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                      style={{ background: m.color }}>{m.label[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--ink)]">{m.label}</p>
                      <p className="text-xs text-[var(--muted)]">{m.sub}</p>
                    </div>
                    {m.tag && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{m.tag}</span>}
                    <ChevronRight size={14} className="text-[var(--muted)]" />
                  </div>
                ))}
                <button onClick={() => toast.info('Bientôt disponible')}
                  className="w-full flex items-center gap-3 px-5 py-4 text-brand-600 hover:bg-green-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl border-2 border-dashed border-brand-300 flex items-center justify-center text-brand-400 font-bold text-lg flex-shrink-0">+</div>
                  <span className="text-sm font-semibold">Ajouter une méthode</span>
                </button>
              </Card>
            </motion.div>
          )}

          {/* Plan */}
          {activeSection === 'plan' && (
            <motion.div key="plan" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h3 className="display font-bold text-[var(--ink)]">Mon plan</h3>
              <Card padding="md" className="relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2d1e 100%)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                  style={{ background: 'radial-gradient(circle, #16a34a, transparent)', transform: 'translate(40%,-40%)' }} />
                <p className="text-gray-400 text-xs uppercase tracking-widest">Plan actuel</p>
                <p className="display text-2xl font-black text-white mt-1">AfriPay Gratuit</p>
                <p className="text-gray-400 text-sm mt-1">5 transactions/mois · Frais 1.5%</p>
                <button onClick={() => toast.info('Plans premium bientôt disponibles !')}
                  className="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors">
                  Passer à Pro →
                </button>
              </Card>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Pro', price: '5 000 FCFA/mois', features: ['50 transactions', 'Frais 0.8%', 'API access', 'Support prioritaire'], color: 'brand-600' },
                  { label: 'Business', price: '20 000 FCFA/mois', features: ['Illimité', 'Frais 0.5%', 'API + Webhooks', 'Manager dédié'], color: 'amber-500' },
                ].map(plan => (
                  <Card key={plan.label} padding="md" hover>
                    <div className="flex items-center justify-between mb-2">
                      <p className="display font-bold text-[var(--ink)]">{plan.label}</p>
                      <p className="text-sm font-bold text-[var(--ink)] tabular">{plan.price}</p>
                    </div>
                    <div className="space-y-1 mb-3">
                      {plan.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-[var(--muted)]">
                          <Check size={11} className="text-brand-600 flex-shrink-0" /> {f}
                        </div>
                      ))}
                    </div>
                    <Button variant="secondary" size="sm" fullWidth onClick={() => toast.info('Bientôt disponible')}>Choisir</Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Help */}
          {activeSection === 'help' && (
            <motion.div key="help" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h3 className="display font-bold text-[var(--ink)]">Aide & Support</h3>
              <Card padding="none" className="divide-y divide-[var(--border)]">
                {[
                  { label: 'Centre d\'aide', desc: 'Articles et guides détaillés' },
                  { label: 'Chat avec l\'équipe', desc: 'Réponse en moins de 2h' },
                  { label: 'Signaler un problème', desc: 'Bug, erreur ou anomalie' },
                  { label: 'Conditions d\'utilisation', desc: 'CGU AfriPay' },
                  { label: 'Politique de confidentialité', desc: 'Comment nous protégeons vos données' },
                ].map(item => (
                  <button key={item.label} onClick={() => toast.info('Bientôt disponible')}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--surface-muted)] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--ink)]">{item.label}</p>
                      <p className="text-xs text-[var(--muted)]">{item.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-[var(--muted)] flex-shrink-0" />
                  </button>
                ))}
              </Card>
              <p className="text-center text-xs text-[var(--muted)]">AfriPay v1.0.0 · MVP Demo</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
