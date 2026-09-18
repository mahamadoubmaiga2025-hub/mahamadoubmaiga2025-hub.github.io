import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, Monitor, AlertTriangle, Key, Bell, Lock, Check, ChevronRight, LogOut } from 'lucide-react';
import Card from '@/components/Card';
import { toast } from 'sonner';

interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; }
function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${checked ? 'bg-brand-600' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${checked ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
    </button>
  );
}

const SESSIONS = [
  { id: 's1', device: 'Chrome · MacBook Pro', location: 'Bamako, Mali', time: 'Actif maintenant', current: true, icon: Monitor },
  { id: 's2', device: 'Safari · iPhone 15', location: 'Bamako, Mali', time: 'Il y a 2h', current: false, icon: Smartphone },
  { id: 's3', device: 'Firefox · Windows', location: 'Dakar, Sénégal', time: 'Il y a 3j', current: false, icon: Monitor },
];

const LOGIN_HISTORY = [
  { id: 'l1', event: 'Connexion réussie', device: 'Chrome · MacBook', location: 'Bamako', time: 'Auj. 09:12', ok: true },
  { id: 'l2', event: 'Connexion réussie', device: 'Safari · iPhone', location: 'Bamako', time: 'Hier 18:34', ok: true },
  { id: 'l3', event: 'Tentative échouée', device: 'Chrome · Inconnu', location: 'Lagos, Nigeria', time: 'Il y a 2j', ok: false },
  { id: 'l4', event: 'Connexion réussie', device: 'Firefox · Windows', location: 'Dakar', time: 'Il y a 3j', ok: true },
];

export default function SecurityPage() {
  const [twoFA, setTwoFA] = useState(false);
  const [loginNotifs, setLoginNotifs] = useState(true);
  const [txNotifs, setTxNotifs] = useState(true);
  const [biometric, setBiometric] = useState(false);

  function revokeSession(id: string) {
    toast.success('Session révoquée');
  }

  function setup2FA() {
    setTwoFA(true);
    toast.success('2FA activé (simulé)');
  }

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[var(--ink)] flex items-center justify-center">
          <Shield size={18} className="text-white" />
        </div>
        <h2 className="display text-xl font-bold text-[var(--ink)]">Sécurité</h2>
      </div>

      {/* Security score */}
      <Card padding="md">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="4" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="#16a34a" strokeWidth="4"
                strokeDasharray={`${(twoFA ? 85 : 60) * 1.76} 176`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center display text-sm font-black text-[var(--ink)]">
              {twoFA ? '85' : '60'}
            </span>
          </div>
          <div>
            <p className="font-bold text-[var(--ink)]">Score de sécurité</p>
            <p className="text-sm text-[var(--muted)]">{twoFA ? 'Bon — continuez à améliorer' : 'Activez le 2FA pour améliorer'}</p>
            {!twoFA && (
              <button onClick={setup2FA} className="mt-1.5 text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
                Activer le 2FA <ChevronRight size={11} />
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Authentication */}
      <Card padding="none">
        <div className="px-5 py-3.5 border-b border-[var(--border)]">
          <h3 className="display font-bold text-[var(--ink)] text-sm">Authentification</h3>
        </div>
        {[
          {
            icon: Smartphone, label: 'Double authentification (2FA)',
            sub: twoFA ? 'Activé via application TOTP' : 'Non activé — recommandé',
            value: twoFA, onChange: (v: boolean) => { setTwoFA(v); toast.success(v ? '2FA activé' : '2FA désactivé'); },
            highlight: !twoFA,
          },
          {
            icon: Lock, label: 'Biométrie',
            sub: 'Déverrouillage par empreinte ou Face ID',
            value: biometric, onChange: (v: boolean) => { setBiometric(v); toast.success(v ? 'Biométrie activée' : 'Biométrie désactivée'); },
          },
        ].map((item, i, arr) => (
          <div key={item.label} className={`flex items-center gap-4 px-5 py-4 ${i < arr.length - 1 ? 'border-b border-[var(--border)]' : ''} ${item.highlight ? 'bg-yellow-50/50' : ''}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.value ? 'bg-green-100' : 'bg-[var(--surface-muted)]'}`}>
              <item.icon size={15} className={item.value ? 'text-green-600' : 'text-[var(--muted)]'} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--ink)]">{item.label}</p>
              <p className="text-xs text-[var(--muted)]">{item.sub}</p>
            </div>
            <Toggle checked={item.value} onChange={item.onChange} />
          </div>
        ))}
      </Card>

      {/* Notifications */}
      <Card padding="none">
        <div className="px-5 py-3.5 border-b border-[var(--border)]">
          <h3 className="display font-bold text-[var(--ink)] text-sm">Notifications de sécurité</h3>
        </div>
        {[
          { icon: Bell, label: 'Alertes de connexion', sub: 'Notification à chaque nouvelle connexion', value: loginNotifs, onChange: setLoginNotifs },
          { icon: AlertTriangle, label: 'Alertes de transaction', sub: 'Notification pour chaque transaction', value: txNotifs, onChange: setTxNotifs },
        ].map((item, i, arr) => (
          <div key={item.label} className={`flex items-center gap-4 px-5 py-4 ${i < arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center flex-shrink-0">
              <item.icon size={15} className="text-[var(--muted)]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--ink)]">{item.label}</p>
              <p className="text-xs text-[var(--muted)]">{item.sub}</p>
            </div>
            <Toggle checked={item.value} onChange={(v) => { item.onChange(v); toast.success(v ? 'Activé' : 'Désactivé'); }} />
          </div>
        ))}
      </Card>

      {/* Sessions */}
      <Card padding="none">
        <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="display font-bold text-[var(--ink)] text-sm">Sessions actives</h3>
          <button onClick={() => toast.success('Toutes les sessions révoquées')}
            className="text-xs text-red-500 font-semibold hover:underline">Tout révoquer</button>
        </div>
        {SESSIONS.map((s, i) => (
          <div key={s.id} className={`flex items-center gap-4 px-5 py-4 ${i < SESSIONS.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.current ? 'bg-green-100' : 'bg-[var(--surface-muted)]'}`}>
              <s.icon size={15} className={s.current ? 'text-green-600' : 'text-[var(--muted)]'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--ink)] truncate">{s.device}</p>
              <p className="text-xs text-[var(--muted)]">{s.location} · {s.time}</p>
            </div>
            {s.current ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Check size={10} /> Actuel
              </span>
            ) : (
              <button onClick={() => revokeSession(s.id)}
                className="text-xs text-red-500 font-semibold hover:underline flex items-center gap-1">
                <LogOut size={11} /> Révoquer
              </button>
            )}
          </div>
        ))}
      </Card>

      {/* Login history */}
      <Card padding="none">
        <div className="px-5 py-3.5 border-b border-[var(--border)]">
          <h3 className="display font-bold text-[var(--ink)] text-sm">Historique de connexion</h3>
        </div>
        {LOGIN_HISTORY.map((l, i) => (
          <div key={l.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < LOGIN_HISTORY.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${l.ok ? 'bg-green-500' : 'bg-red-500'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--ink)]">{l.event}</p>
              <p className="text-xs text-[var(--muted)]">{l.device} · {l.location}</p>
            </div>
            <p className="text-xs text-[var(--muted)] flex-shrink-0">{l.time}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
