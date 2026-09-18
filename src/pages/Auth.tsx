import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useApp } from '@/hooks/useApp';
import { DEMO_USER } from '@/data/mockData';
import { sleep } from '@/utils/format';
import type { User } from '@/types';

// -------- LOGIN --------
export function LoginPage() {
  const { navigate, login } = useApp();
  const [email, setEmail] = useState('mamadou.traore@gmail.com');
  const [password, setPassword] = useState('Demo1234');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await sleep(1200);
    login(DEMO_USER);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#0a1628] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black text-xl display">A</span>
          </div>
          <h1 className="display font-black text-2xl text-[#0a1628]">Bon retour</h1>
          <p className="text-sm text-gray-500 mt-1">Connectez-vous à votre compte AfriPay</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth placeholder="vous@exemple.com" />
            <div className="relative">
              <Input label="Mot de passe" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} fullWidth placeholder="••••••••"
                suffix={<button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-400 hover:text-gray-600">{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>} />
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => navigate('login')} className="text-xs text-brand-600 font-semibold hover:underline">
                Mot de passe oublié ?
              </button>
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>Se connecter</Button>
          </form>

          <div className="relative flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Demo login */}
          <button onClick={async () => { setLoading(true); await sleep(800); login(DEMO_USER); }}
            className="w-full py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            Continuer avec le compte démo
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Pas de compte ?{' '}
          <button onClick={() => navigate('register')} className="text-brand-600 font-semibold hover:underline">S'inscrire</button>
        </p>
        <button onClick={() => navigate('landing')} className="flex items-center gap-1 mx-auto mt-3 text-xs text-gray-400 hover:text-gray-600">
          <ArrowLeft size={11} /> Retour à l'accueil
        </button>
      </motion.div>
    </div>
  );
}

// -------- REGISTER --------
export function RegisterPage() {
  const { navigate } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await sleep(1200);
    // Go to onboarding
    navigate('onboarding');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#0a1628] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black text-xl display">A</span>
          </div>
          <h1 className="display font-black text-2xl text-[#0a1628]">Créer un compte</h1>
          <p className="text-sm text-gray-500 mt-1">Rejoignez l'avenir financier africain</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Nom complet" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} fullWidth placeholder="Mamadou Traoré" />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} fullWidth placeholder="vous@exemple.com" />
            <Input label="Mot de passe" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} fullWidth placeholder="Min. 8 caractères" />
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>Créer mon compte</Button>
          </form>
          <p className="text-[10px] text-gray-400 text-center">En vous inscrivant, vous acceptez nos CGU et notre politique de confidentialité.</p>
        </div>
        <p className="text-center text-sm text-gray-500 mt-5">
          Déjà un compte ?{' '}
          <button onClick={() => navigate('login')} className="text-brand-600 font-semibold hover:underline">Se connecter</button>
        </p>
      </motion.div>
    </div>
  );
}

// -------- ONBOARDING --------
const STEPS = [
  { id: 'name', label: 'Votre nom', placeholder: 'Mamadou Traoré', type: 'text' },
  { id: 'country', label: 'Votre pays', type: 'select', options: ['Mali', 'Sénégal', 'Côte d\'Ivoire', 'Burkina Faso', 'Ghana', 'Nigeria', 'Kenya', 'Autre'] },
  { id: 'currency', label: 'Devise principale', type: 'select', options: ['FCFA', 'GHS (Cedi)', 'NGN (Naira)', 'KES (Shilling)', 'USD'] },
  { id: 'accountType', label: 'Type de compte', type: 'choice', options: [{ value: 'personal', label: 'Particulier', desc: 'Pour usage personnel et familial' }, { value: 'business', label: 'Entreprise', desc: 'Pour les commerces et PME' }] },
  { id: 'goals', label: 'Vos objectifs', type: 'multi', options: [{ value: 'paiements', label: 'Paiements' }, { value: 'transfert', label: 'Transferts' }, { value: 'epargne', label: 'Épargne' }, { value: 'crypto', label: 'Crypto' }, { value: 'commerce', label: 'Commerce' }] },
];

export function OnboardingPage() {
  const { login } = useApp();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string | string[]>>({ name: '', country: 'Mali', currency: 'FCFA', accountType: '', goals: [] });
  const [loading, setLoading] = useState(false);

  const current = STEPS[step];
  const progress = ((step) / STEPS.length) * 100;

  function setValue(val: string | string[]) { setValues(v => ({ ...v, [current.id]: val })); }

  function toggleGoal(g: string) {
    const goals = (values.goals as string[]);
    setValue(goals.includes(g) ? goals.filter(x => x !== g) : [...goals, g]);
  }

  async function finish() {
    setLoading(true);
    await sleep(1200);
    const user: User = {
      ...DEMO_USER,
      name: (values.name as string) || DEMO_USER.name,
      country: (values.country as string) || DEMO_USER.country,
      primaryCurrency: (values.currency as string).split(' ')[0] as User['primaryCurrency'],
      accountType: (values.accountType as 'personal' | 'business') || 'personal',
      goals: values.goals as string[],
    };
    login(user);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">Étape {step + 1} sur {STEPS.length}</span>
            <span className="text-xs font-semibold text-brand-600">{Math.round(progress + 20)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <motion.div className="h-full rounded-full bg-brand-600" animate={{ width: `${progress + 20}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="display font-black text-xl text-[#0a1628]">{current.label}</h2>

              {current.type === 'text' && (
                <Input fullWidth value={values[current.id] as string} onChange={e => setValue(e.target.value)} placeholder={current.placeholder} />
              )}

              {current.type === 'select' && (
                <select value={values[current.id] as string} onChange={e => setValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-[#0a1628] outline-none focus:border-brand-400 transition-all">
                  {current.options!.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : null)}
                </select>
              )}

              {current.type === 'choice' && (
                <div className="space-y-3">
                  {(current.options as { value: string; label: string; desc: string }[]).map(o => (
                    <button key={o.value} onClick={() => setValue(o.value)}
                      className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
                        values[current.id] === o.value ? 'border-brand-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${values[current.id] === o.value ? 'border-brand-600 bg-brand-600' : 'border-gray-300'}`}>
                        {values[current.id] === o.value && <Check size={10} className="text-white" />}
                      </div>
                      <div>
                        <p className="font-bold text-[#0a1628] text-sm">{o.label}</p>
                        <p className="text-xs text-gray-500">{o.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {current.type === 'multi' && (
                <div className="flex flex-wrap gap-2">
                  {(current.options as { value: string; label: string }[]).map(o => {
                    const selected = (values.goals as string[]).includes(o.value);
                    return (
                      <button key={o.value} onClick={() => toggleGoal(o.value)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all ${
                          selected ? 'border-brand-600 bg-green-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>
                        {selected && <Check size={12} />} {o.label}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {step > 0 && (
                  <Button variant="secondary" size="lg" onClick={() => setStep(s => s - 1)} icon={<ArrowLeft size={14} />}>
                    Retour
                  </Button>
                )}
                {step < STEPS.length - 1 ? (
                  <Button variant="primary" size="lg" fullWidth onClick={() => setStep(s => s + 1)} icon={<ArrowRight size={14} />}>
                    Continuer
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" fullWidth loading={loading} onClick={finish}>
                    Accéder à mon dashboard
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
