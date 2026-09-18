import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ChevronDown, ChevronUp, Shield, Zap, Globe, Smartphone,
  ArrowLeftRight, Store, Bot, Lock, Users, TrendingUp, Check
} from 'lucide-react';
import { useApp } from '@/hooks/useApp';

function NavBar() {
  const { navigate } = useApp();
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface-card)]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate('landing')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-sm">A</div>
          <span className="display font-black text-[var(--ink)] text-lg tracking-tight">AfriPay</span>
        </button>
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-[var(--muted)]">
          <button onClick={() => {}} className="hover:text-[var(--ink)] transition-colors">Fonctionnalités</button>
          <button onClick={() => {}} className="hover:text-[var(--ink)] transition-colors">Mobile Money</button>
          <button onClick={() => {}} className="hover:text-[var(--ink)] transition-colors">API</button>
          <button onClick={() => {}} className="hover:text-[var(--ink)] transition-colors">Token AFRI</button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('login')} className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition-colors hidden sm:block">Connexion</button>
          <button onClick={() => navigate('register')} className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 active:scale-95 transition-all">
            Commencer gratuitement
          </button>
        </div>
      </div>
    </nav>
  );
}

function HeroDashboardPreview() {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="relative mx-auto max-w-sm">
      {/* Card glow */}
      <div className="absolute inset-0 blur-3xl opacity-20 rounded-3xl"
        style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)' }} />
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        style={{ background: 'linear-gradient(160deg, #0d1f12 0%, #0a1628 100%)' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-xs">A</div>
            <span className="text-white font-black text-sm display">AfriPay</span>
          </div>
          <div className="flex gap-1.5">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/20" />)}</div>
        </div>
        {/* Balance */}
        <div className="px-5 py-4">
          <p className="text-gray-500 text-xs uppercase tracking-widest">Balance totale</p>
          <p className="display text-3xl font-black text-white mt-0.5 tabular">1 245 000 <span className="text-gray-400 text-xl">FCFA</span></p>
          <p className="text-gray-500 text-xs mt-0.5">≈ $2 073,42 USD</p>
          {/* Mini chart */}
          <div className="flex items-end gap-0.5 h-8 mt-3">
            {[40,55,35,65,50,75,60,80,70,90,75,95].map((h, i) => (
              <div key={i} className="flex-1 rounded-full" style={{ height: `${h}%`, background: i > 9 ? '#16a34a' : 'rgba(255,255,255,0.12)' }} />
            ))}
          </div>
        </div>
        {/* Assets */}
        <div className="px-5 pb-5 space-y-2">
          {[
            { cur: 'USDC', bal: '500.00', usd: '$500', color: '#2563eb', pct: '+0.1%' },
            { cur: 'USDT', bal: '250.00', usd: '$250', color: '#26a17b', pct: '+0.0%' },
            { cur: 'BTC',  bal: '0.012', usd: '$720', color: '#f7931a', pct: '+2.3%' },
          ].map(a => (
            <div key={a.cur} className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                style={{ background: a.color }}>{a.cur[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold">{a.cur}</p>
                <p className="text-gray-500 text-[10px]">{a.bal}</p>
              </div>
              <div className="text-right">
                <p className="text-white text-xs font-bold tabular">{a.usd}</p>
                <p className="text-green-400 text-[10px] font-semibold">{a.pct}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Bottom actions */}
        <div className="grid grid-cols-4 gap-2 px-5 pb-5">
          {['Envoyer','Recevoir','Convertir','Mobile'].map(a => (
            <div key={a} className="flex flex-col items-center gap-1.5 py-2 rounded-xl bg-white/5">
              <div className="w-6 h-6 rounded-lg bg-white/10" />
              <span className="text-[9px] text-gray-400 font-medium">{a}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const FEATURES = [
  { icon: Smartphone, title: 'Mobile Money', desc: 'Orange Money, Wave, MTN MoMo, Moov. Déposez et retirez en quelques secondes.', color: '#FF6600', bg: '#FFF3E0' },
  { icon: ArrowLeftRight, title: 'Conversion instantanée', desc: 'FCFA, USDC, USDT, BTC, ETH. Taux compétitifs, frais transparents.', color: '#16a34a', bg: '#F0FDF4' },
  { icon: Store, title: 'Paiements marchands', desc: 'Créez des liens de paiement, QR codes et intégrez AfriPay en quelques lignes de code.', color: '#6366f1', bg: '#EEF2FF' },
  { icon: Globe, title: 'Transferts internationaux', desc: 'Envoyez de l\'argent à travers l\'Afrique avec les frais les plus bas du marché.', color: '#0d9488', bg: '#F0FDFA' },
  { icon: Bot, title: 'Assistant IA', desc: 'AfriAI vous aide à comprendre vos finances, décrypter vos transactions et répondre à vos questions.', color: '#f59e0b', bg: '#FFFBEB' },
  { icon: Lock, title: 'Sécurité avancée', desc: '2FA, chiffrement end-to-end, alertes en temps réel. Votre argent est entre de bonnes mains.', color: '#0a1628', bg: '#F8FAFC' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Créez votre compte', desc: 'Inscription en 2 minutes. Aucune paperasse, aucun frais d\'ouverture de compte.' },
  { step: '02', title: 'Connectez votre Mobile Money', desc: 'Reliez Orange Money, Wave ou MTN MoMo. Déposez instantanément.' },
  { step: '03', title: 'Gérez vos actifs', desc: 'Convertissez, envoyez, recevez. FCFA, stablecoins, crypto — tout en un seul endroit.' },
];

const TESTIMONIALS = [
  { name: 'Aminata S.', role: 'Commerçante, Dakar', text: 'AfriPay a révolutionné mes paiements. Mes clients peuvent payer en USDC ou Wave, et je récupère en FCFA immédiatement.', avatar: 'A' },
  { name: 'Boubacar D.', role: 'Développeur, Bamako', text: 'L\'API AfriPay est propre, bien documentée. J\'ai intégré les paiements dans mon app en une journée.', avatar: 'B' },
  { name: 'Fatou K.', role: 'Entrepreneur, Abidjan', text: 'Envoyer de l\'argent à Bamako coûtait cher. Avec AfriPay, je fais le transfert en 3 clics pour moins de 1%.', avatar: 'F' },
];

const FAQS = [
  { q: 'AfriPay est-il disponible dans mon pays ?', a: 'AfriPay est actuellement en phase MVP et accepte les utilisateurs de tout le continent africain. Les intégrations Mobile Money démarrent avec le Mali, le Sénégal, la Côte d\'Ivoire et le Burkina Faso.' },
  { q: 'Mes fonds sont-ils en sécurité ?', a: 'Cette version est une démonstration — aucun fonds réel n\'est manipulé. En production, les fonds seront protégés par un chiffrement de niveau bancaire, un 2FA, et des audits réguliers.' },
  { q: 'Quels sont les frais ?', a: 'Conversions : 0.3%. Transferts : 0.5% (max 2 500 FCFA). Mobile Money : selon le fournisseur (1-1.5%). Les marchands sur le plan Gratuit paient 1.5% par transaction.' },
  { q: 'Puis-je utiliser AfriPay sans compte bancaire ?', a: 'Oui. AfriPay fonctionne avec Mobile Money uniquement. Aucun compte bancaire requis.' },
  { q: 'Qu\'est-ce que le token AFRI ?', a: 'AFRI est le token utilitaire de l\'écosystème AfriPay. Il permet de réduire les frais, de participer à la gouvernance et d\'accéder à des fonctionnalités premium. Il n\'est pas encore disponible (Testnet à venir).' },
];

const STATS = [
  { val: '12 847', label: 'Utilisateurs inscrits' },
  { val: '842M FCFA', label: 'Volume traité' },
  { val: '11 pays', label: 'Afrique couverts' },
  { val: '99.98%', label: 'Uptime' },
];

export default function LandingPage() {
  const { navigate } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <NavBar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-200 bg-green-50 text-brand-700 text-xs font-bold mb-5">
              <div className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
              MVP en ligne · Version démo
            </div>
            <h1 className="display text-4xl sm:text-5xl font-black text-[var(--ink)] leading-[1.08] tracking-tight">
              Le pont entre<br />
              <span className="text-brand-600">Mobile Money</span> et<br />
              l&apos;économie numérique africaine.
            </h1>
            <p className="text-[var(--muted)] text-lg mt-5 leading-relaxed max-w-lg">
              Gérez vos paiements numériques, stablecoins et actifs numériques depuis une seule plateforme pensée pour l&apos;Afrique.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <button onClick={() => navigate('register')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 active:scale-95 transition-all shadow-lg shadow-brand-600/20">
                Commencer gratuitement <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('login')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-[var(--border)] text-[var(--ink)] font-bold text-sm hover:border-brand-400 hover:bg-green-50 transition-all">
                Découvrir AfriPay
              </button>
            </div>
            {/* Social proof */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {['A','B','F','I','M'].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[var(--ink)] border-2 border-[var(--surface-bg)] flex items-center justify-center text-white text-xs font-black">{l}</div>
                ))}
              </div>
              <p className="text-sm text-[var(--muted)]"><span className="font-bold text-[var(--ink)]">12 847+</span> utilisateurs en phase beta</p>
            </div>
          </motion.div>
          <div className="hidden lg:block">
            <HeroDashboardPreview />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[var(--border)] bg-[var(--surface-card)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={s.val} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="text-center">
              <p className="display text-2xl font-black text-[var(--ink)] tabular">{s.val}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Simple & rapide</p>
          <h2 className="display text-3xl font-black text-[var(--ink)]">Comment fonctionne AfriPay ?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div key={step.step} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="w-14 h-14 rounded-3xl bg-brand-600 flex items-center justify-center mx-auto mb-4">
                <span className="display text-white font-black text-lg">{step.step}</span>
              </div>
              <h3 className="display font-bold text-[var(--ink)] mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-[var(--surface-card)] border-y border-[var(--border)] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Tout-en-un</p>
            <h2 className="display text-3xl font-black text-[var(--ink)]">Une plateforme, toutes vos finances</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="rounded-3xl border border-[var(--border)] p-6 hover:shadow-card hover:border-brand-200 hover:-translate-y-0.5 transition-all bg-[var(--surface-bg)]">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: f.bg }}>
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <h3 className="display font-bold text-[var(--ink)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Money flow */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Mobile Money</p>
            <h2 className="display text-3xl font-black text-[var(--ink)] mb-4">Dépôt & retrait Mobile Money en secondes</h2>
            <p className="text-[var(--muted)] leading-relaxed mb-6">
              Connectez Orange Money, Wave, MTN MoMo ou Moov Money. Déposez du FCFA sur AfriPay ou retirez en quelques secondes, 24h/24.
            </p>
            <ul className="space-y-3">
              {[
                { color: '#FF6600', label: 'Orange Money — Mali, Sénégal, Côte d\'Ivoire' },
                { color: '#1A9EFF', label: 'Wave — Sénégal, Côte d\'Ivoire, Mali' },
                { color: '#FFCC00', label: 'MTN MoMo — Ghana, Nigeria, Bénin' },
                { color: '#00A551', label: 'Moov Money — Côte d\'Ivoire, Bénin, Togo' },
              ].map(m => (
                <li key={m.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: m.color }} />
                  <span className="text-sm font-semibold text-[var(--ink)]">{m.label}</span>
                  <Check size={13} className="text-brand-600 flex-shrink-0 ml-auto" />
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('register')} className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition-all">
              Connecter mon Mobile Money <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { dir: '→', from: 'Orange Money', to: 'FCFA AfriPay', time: '~30s', fee: '1.5%' },
              { dir: '→', from: 'FCFA AfriPay', to: 'USDC', time: '~5s', fee: '0.3%' },
              { dir: '→', from: 'USDC', to: 'Wave Sénégal', time: '~45s', fee: '1.0%' },
            ].map((flow, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface-card)] border border-[var(--border)]">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--ink)] flex items-center gap-2">
                    <span>{flow.from}</span>
                    <ArrowRight size={12} className="text-brand-600 flex-shrink-0" />
                    <span>{flow.to}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0 space-y-0.5">
                  <p className="text-xs font-bold text-green-600">{flow.time}</p>
                  <p className="text-[10px] text-[var(--muted)]">Frais {flow.fee}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For who */}
      <section className="bg-[var(--surface-card)] border-y border-[var(--border)] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="display text-3xl font-black text-[var(--ink)]">Pour qui est AfriPay ?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Users, title: 'Particuliers', items: ['Envoyer de l\'argent à la famille', 'Convertir FCFA en crypto', 'Payer en ligne', 'Épargner en stablecoins'] },
              { icon: Store, title: 'Marchands', items: ['Accepter crypto + Mobile Money', 'Liens de paiement', 'Dashboard complet', 'Intégration API facile'] },
              { icon: TrendingUp, title: 'Développeurs', items: ['API RESTful documentée', 'Webhooks en temps réel', 'SDK mobile & web', 'Sandbox disponible'] },
            ].map((g, i) => (
              <motion.div key={g.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-[var(--border)] p-6 bg-[var(--surface-bg)]">
                <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
                  <g.icon size={20} className="text-brand-600" />
                </div>
                <h3 className="display font-bold text-[var(--ink)] text-lg mb-3">{g.title}</h3>
                <ul className="space-y-2">
                  {g.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <Check size={12} className="text-brand-600 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Sécurité</p>
            <h2 className="display text-3xl font-black text-[var(--ink)] mb-4">Votre argent, sous haute protection</h2>
            <div className="space-y-4">
              {[
                { icon: Shield, title: 'Chiffrement bout-en-bout', desc: 'Toutes les données sont chiffrées avec AES-256.' },
                { icon: Smartphone, title: '2FA activé par défaut', desc: 'OTP SMS ou authenticator à chaque connexion.' },
                { icon: Zap, title: 'Alertes en temps réel', desc: 'Notification instantanée pour chaque transaction.' },
              ].map(s => (
                <div key={s.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <s.icon size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--ink)]">{s.title}</p>
                    <p className="text-sm text-[var(--muted)]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2d1e 100%)' }}>
            <Shield size={48} className="text-green-400 mx-auto mb-4" />
            <p className="display text-5xl font-black text-white">99.98%</p>
            <p className="text-gray-400 text-sm mt-1">Uptime garanti</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[['SOC 2', 'En cours'], ['ISO 27001', 'En cours'], ['Audits', 'Trimestriels'], ['RGPD', 'Conforme']].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white/5 p-3">
                  <p className="text-white font-bold text-sm">{k}</p>
                  <p className="text-gray-400 text-xs">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[var(--surface-card)] border-y border-[var(--border)] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="display text-3xl font-black text-[var(--ink)]">Ils font confiance à AfriPay</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-[var(--border)] p-6 bg-[var(--surface-bg)]">
                <div className="flex mb-3">
                  {[0,1,2,3,4].map(j => <span key={j} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-sm text-[var(--muted)] italic leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--ink)] flex items-center justify-center text-white font-black text-sm">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-bold text-[var(--ink)]">{t.name}</p>
                    <p className="text-xs text-[var(--muted)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Questions fréquentes</p>
          <h2 className="display text-3xl font-black text-[var(--ink)]">FAQ</h2>
        </div>
        <div className="rounded-3xl border border-[var(--border)] overflow-hidden bg-[var(--surface-card)] divide-y divide-[var(--border)]">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[var(--surface-muted)] transition-colors">
                <span className="font-semibold text-[var(--ink)] text-sm pr-4">{faq.q}</span>
                {openFaq === i ? <ChevronUp size={16} className="text-[var(--muted)] flex-shrink-0" /> : <ChevronDown size={16} className="text-[var(--muted)] flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 pb-5">
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-10 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2d1e 60%, #0a1628 100%)' }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #16a34a, transparent)', transform: 'translate(30%,-30%)' }} />
          <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-3">Rejoignez la révolution</p>
          <h2 className="display text-3xl sm:text-4xl font-black text-white mb-4">Prêt à gérer vos finances africaines autrement ?</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">Inscription gratuite · Aucune carte bancaire requise · Mobile Money en quelques secondes</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('register')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 active:scale-95 transition-all shadow-lg shadow-brand-600/30">
              Commencer gratuitement <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('login')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-white/20 text-white font-bold text-sm hover:border-white/40 transition-all">
              Se connecter
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface-card)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-xs">A</div>
              <span className="display font-black text-[var(--ink)]">AfriPay</span>
            </div>
            <p className="text-xs text-[var(--muted)]">© 2026 AfriPay · MVP Demo · Toutes les transactions sont simulées</p>
            <div className="flex gap-4 text-xs text-[var(--muted)]">
              <button className="hover:text-[var(--ink)] transition-colors">Confidentialité</button>
              <button className="hover:text-[var(--ink)] transition-colors">CGU</button>
              <button className="hover:text-[var(--ink)] transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
