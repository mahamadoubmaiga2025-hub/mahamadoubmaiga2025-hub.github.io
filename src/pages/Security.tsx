import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Smartphone, Key, Bell, Eye, LogOut, Monitor,
  CheckCircle, AlertTriangle, Clock, X, Lock, Fingerprint
} from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { toast } from 'sonner';

interface Toggle {
  id: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  value: boolean;
}

const SESSIONS = [
  { id: 's1', device: 'Chrome · MacBook Pro', location: 'Bamako, Mali', ip: '192.168.1.1', time: 'Maintenant', current: true },
  { id: 's2', device: 'Safari · iPhone 14', location: 'Bamako, Mali', ip: '192.168.1.2', time: 'Il y a 2h', current: false },
  { id: 's3', device: 'Firefox · Windows 11', location: 'Dakar, Sénégal', ip: '41.82.33.12', time: 'Il y a 1j', current: false },
];

const LOGIN_HISTORY = [
  { id: 'l1', device: 'Chrome · MacBook', ip: '192.168.1.1', location: 'Bamako', time: 'Aujourd\'hui 08:32', success: true },
  { id: 'l2', device: 'iPhone 14', ip: '192.168.1.2', location: 'Bamako', time: 'Hier 21:15', success: true },
  { id: 'l3', device: 'Inconnu', ip: '41.202.14.3', location: 'Lagos, Nigeria', time: 'Il y a 3j 14:02', success: false },
  { id: 'l4', device: 'Firefox · Windows', ip: '41.82.33.12', location: 'Dakar', time: 'Il y a 5j 10:45', success: true },
];

function Toggle2FA() {
  const [enabled, setEnabled] = useState(true);
  const [step, setStep] = useState<'idle' | 'setup' | 'verify'>('idle');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function setup() {
    if (!enabled) { setStep('setup'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setEnabled(false);
    toast.success('2FA désactivé');
  }

  async function verify() {
    if (code.length < 6) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setEnabled(true);
    setStep('idle');
    setCode('');
    toast.success('2FA activé avec succès !');
  }

  return (
    <Card padding="md" className="space-y-4">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${enabled ? 'bg-green-100' : 'bg-[var(--surface-muted)]'}`}>
          <Smartphone size={18} className={enabled ? 'text-green-600' : 'text-[var(--muted)]'} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-bold text-[var(--ink)]">Authentification 2 facteurs</p>
            <button onClick={setup} disabled={loading}
              className={`relative w-12 h-6 rounded-full transition-all ${enabled ? 'bg-brand-600' : 'bg-[var(--surface-muted)]'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${enabled ? 'left-[26px]' : 'left-0.5'}`} />
            </button>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">Sécurisez votre compte avec un code OTP à chaque connexion</p>
          {enabled && <div className="flex items-center gap-1.5 mt-1.5 text-xs text-green-600 font-semibold"><CheckCircle size={11} /> Actif via SMS</div>}
        </div>
      </div>

      <AnimatePresence>
        {step === 'setup' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[var(--border)] pt-4 space-y-3">
            <p className="text-sm font-semibold text-[var(--ink)]">Configurer la 2FA</p>
            <div className="flex justify-center p-4 bg-[var(--surface-muted)] rounded-2xl">
              <div className="text-center">
                <div className="inline-grid grid-cols-9 gap-0.5 mb-3">
                  {Array.from({ length: 81 }).map((_, i) => {
                    const row = Math.floor(i / 9), col = i % 9;
                    const filled = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3) || (i % 3 === 0) || (i % 7 === 0);
                    return <div key={i} className={`w-4 h-4 rounded-sm ${filled ? 'bg-[var(--ink)]' : 'bg-transparent'}`} />;
                  })}
                </div>
                <p className="text-xs text-[var(--muted)]">Scannez ce QR avec votre appli authenticator</p>
                <p className="mono text-xs mt-1 text-[var(--ink)] font-bold">JBSWY3DPEHPK3PXP</p>
              </div>
            </div>
            <div className="flex gap-2">
              {[0,1,2,3,4,5].map(i => (
                <input key={i} maxLength={1} type="text" inputMode="numeric"
                  value={code[i] ?? ''}
                  onChange={e => { const v = e.target.value.replace(/\D/g,''); setCode(c => { const a = c.split(''); a[i] = v; return a.join('').slice(0,6); }); }}
                  className="flex-1 aspect-square text-center display font-black text-[var(--ink)] text-xl rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 outline-none transition-all" />
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="md" fullWidth onClick={() => setStep('idle')}>Annuler</Button>
              <Button variant="primary" size="md" fullWidth loading={loading} disabled={code.length < 6} onClick={verify}>Vérifier</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function SecurityPage() {
  const [toggles, setToggles] = useState<Toggle[]>([
    { id: 'notif_login', label: 'Alertes de connexion', desc: 'Notification à chaque nouvelle connexion', icon: Bell, value: true },
    { id: 'notif_tx', label: 'Alertes transactions', desc: 'Notification pour chaque transaction', icon: Bell, value: true },
    { id: 'biometrics', label: 'Biométrie', desc: 'Déverrouillez avec Face ID ou empreinte', icon: Fingerprint, value: false },
    { id: 'auto_lock', label: 'Verrouillage auto', desc: 'Verrouiller après 5 minutes d\'inactivité', icon: Lock, value: true },
  ]);
  const [sessions, setSessions] = useState(SESSIONS);
  const [showRevokeAll, setShowRevokeAll] = useState(false);

  function toggle(id: string) {
    setToggles(t => t.map(item =>
      item.id === id ? { ...item, value: !item.value } : item
    ));
    const item = toggles.find(t => t.id === id);
    if (item) toast.success(`${item.label} ${item.value ? 'désactivé' : 'activé'}`);
  }

  function revokeSession(id: string) {
    setSessions(s => s.filter(sess => sess.id !== id));
    toast.success('Session révoquée');
  }

  function revokeAll() {
    setSessions(s => s.filter(sess => sess.current));
    setShowRevokeAll(false);
    toast.success('Toutes les autres sessions révoquées');
  }

  // Security score
  const score = Math.round((toggles.filter(t => t.value).length / toggles.length) * 50 + 50);
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-500' : 'text-red-500';
  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Bon' : 'À améliorer';

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-2xl mx-auto space-y-5">
      <h2 className="display text-xl font-bold text-[var(--ink)]">Sécurité</h2>

      {/* Security score */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2d1e 100%)' }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #16a34a, transparent)', transform: 'translate(40%, -40%)' }} />
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <motion.circle cx="40" cy="40" r="32" fill="none" stroke="#16a34a" strokeWidth="8"
                strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 32}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - score / 100) }}
                transition={{ duration: 1.2, ease: 'easeOut' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="display text-white font-black text-xl">{score}</span>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Score de sécurité</p>
            <p className={`display text-2xl font-black ${scoreColor}`}>{scoreLabel}</p>
            <p className="text-gray-400 text-xs mt-1">{toggles.filter(t => t.value).length}/{toggles.length} protections actives</p>
          </div>
          <div className="ml-auto flex-shrink-0">
            <Shield size={32} className="text-green-400 opacity-60" />
          </div>
        </div>
      </motion.div>

      {/* 2FA */}
      <div>
        <h3 className="text-sm font-bold text-[var(--ink)] mb-2 px-1">Authentification</h3>
        <Toggle2FA />
      </div>

      {/* Security toggles */}
      <div>
        <h3 className="text-sm font-bold text-[var(--ink)] mb-2 px-1">Protections & alertes</h3>
        <Card padding="none" className="divide-y divide-[var(--border)]">
          {toggles.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.value ? 'bg-green-50' : 'bg-[var(--surface-muted)]'}`}>
                <item.icon size={16} className={item.value ? 'text-green-600' : 'text-[var(--muted)]'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--ink)]">{item.label}</p>
                <p className="text-xs text-[var(--muted)] truncate">{item.desc}</p>
              </div>
              <button onClick={() => toggle(item.id)}
                className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${item.value ? 'bg-brand-600' : 'bg-[var(--surface-muted)] border border-[var(--border)]'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${item.value ? 'left-[26px]' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </Card>
      </div>

      {/* Active sessions */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-bold text-[var(--ink)]">Sessions actives ({sessions.length})</h3>
          {sessions.filter(s => !s.current).length > 0 && (
            <button onClick={() => setShowRevokeAll(true)} className="text-xs text-red-500 font-semibold hover:underline">
              Tout révoquer
            </button>
          )}
        </div>
        <Card padding="none" className="divide-y divide-[var(--border)]">
          {sessions.map(sess => (
            <div key={sess.id} className="flex items-center gap-3 px-5 py-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${sess.current ? 'bg-green-50' : 'bg-[var(--surface-muted)]'}`}>
                <Monitor size={15} className={sess.current ? 'text-green-600' : 'text-[var(--muted)]'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[var(--ink)] truncate">{sess.device}</p>
                  {sess.current && <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">Actuelle</span>}
                </div>
                <p className="text-xs text-[var(--muted)]">{sess.location} · {sess.ip} · {sess.time}</p>
              </div>
              {!sess.current && (
                <button onClick={() => revokeSession(sess.id)}
                  className="w-7 h-7 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center text-[var(--muted)] hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
                  <X size={13} />
                </button>
              )}
            </div>
          ))}
        </Card>
      </div>

      {/* Login history */}
      <div>
        <h3 className="text-sm font-bold text-[var(--ink)] mb-2 px-1">Historique des connexions</h3>
        <Card padding="none" className="divide-y divide-[var(--border)]">
          {LOGIN_HISTORY.map(entry => (
            <div key={entry.id} className="flex items-center gap-3 px-5 py-3.5">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.success ? 'bg-green-500' : 'bg-red-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--ink)] truncate">{entry.device}</p>
                <p className="text-xs text-[var(--muted)]">{entry.location} · {entry.ip}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-[var(--muted)]">{entry.time}</p>
                <p className={`text-[10px] font-bold mt-0.5 ${entry.success ? 'text-green-600' : 'text-red-500'}`}>
                  {entry.success ? 'Succès' : '⚠ Échec'}
                </p>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* API Keys */}
      <div>
        <h3 className="text-sm font-bold text-[var(--ink)] mb-2 px-1">Clés API actives</h3>
        <Card padding="md" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Key size={15} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--ink)]">Production key</p>
            <p className="mono text-xs text-[var(--muted)] truncate">ap_live_****************************3f2e</p>
          </div>
          <Button variant="secondary" size="sm" icon={<Eye size={12} />}>Voir</Button>
        </Card>
      </div>

      {/* Danger zone */}
      <div>
        <h3 className="text-sm font-bold text-red-500 mb-2 px-1">Zone dangereuse</h3>
        <Card padding="md" className="border-red-100 space-y-3">
          <div className="flex items-center gap-3">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-xs text-[var(--muted)]">Ces actions sont irréversibles. Procédez avec précaution.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" icon={<Clock size={13} />} onClick={() => toast.info('Demande envoyée à notre équipe')}>Désactiver le compte</Button>
            <Button variant="secondary" size="sm" icon={<LogOut size={13} />} onClick={() => toast.error('Fonctionnalité désactivée en MVP')}>Supprimer le compte</Button>
          </div>
        </Card>
      </div>

      {/* Revoke all modal */}
      <AnimatePresence>
        {showRevokeAll && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-sm">
              <Card padding="lg" className="space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                  <LogOut size={22} className="text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-[var(--ink)]">Révoquer toutes les sessions ?</p>
                  <p className="text-xs text-[var(--muted)] mt-1">Tous les autres appareils seront déconnectés immédiatement.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" fullWidth onClick={() => setShowRevokeAll(false)}>Annuler</Button>
                  <Button fullWidth onClick={revokeAll} className="bg-red-500 hover:bg-red-600 text-white">Révoquer</Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
