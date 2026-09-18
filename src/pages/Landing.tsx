import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Smartphone, ArrowLeftRight, Shield, Zap, Globe,
  ChevronDown, Star, Store, Bot, Code, Check
} from 'lucide-react';
import { useApp } from '@/hooks/useApp';

const FEATURES = [
  { icon: Smartphone, title: 'Mobile Money', desc: 'Connectez Orange Money, Wave, MTN MoMo et Moov Money directement à votre wallet numérique.' },
  { icon: ArrowLeftRight, title: 'Conversion instantanée', desc: 'Convertissez FCFA ↔ USDC ↔ USDT en quelques secondes avec les meilleurs taux du marché.' },
  { icon: Globe, title: 'Transferts internationaux', desc: "Envoyez des fonds à travers toute l'Afrique et dans le monde entier, sans frais excessifs." },
  { icon: Store, title: 'Paiements marchands', desc: 'Créez des liens de paiement et acceptez FCFA, USDC, crypto et Mobile Money.' },
  { icon: Bot, title: 'Assistant AfriAI', desc: 'Votre conseiller financier personnel pour comprendre vos finances et l\'économie numérique.' },
  { icon: Code, title: 'API AfriPay', desc: 'Intégrez AfriPay dans votre application avec notre API simple et puissante.' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Créez votre compte', desc: "Inscription en 2 minutes, vérification d'identité simplifiée." },
  { step: '02', title: 'Connectez Mobile Money', desc: 'Liez Orange Money, Wave ou MTN en quelques clics.' },
  { step: '03', title: 'Gérez vos actifs', desc: 'Convertissez, envoyez, recevez et suivez tout depuis un seul endroit.' },
];

const FAQS = [
  { q: 'AfriPay est-il sécurisé ?', a: 'Oui. AfriPay utilise le chiffrement de bout en bout, une authentification à deux facteurs et des partenariats avec des prestataires régulés.' },
  { q: 'Quels pays sont supportés ?', a: 'Mali, Sénégal, Côte d\'Ivoire, Burkina Faso, Ghana, Nigeria, Kenya et en expansion continue.' },
  { q: 'Quels sont les frais ?', a: 'Les conversions FCFA/USDC : 0.3%. Les transferts Mobile Money : 1.5%. Les paiements marchands : 1.0%.' },
  { q: 'Puis-je utiliser AfriPay pour mon business ?', a: 'Oui. AfriPay propose un espace marchand complet avec liens de paiement, QR codes, et une API dédiée.' },
  { q: 'Qu\'est-ce que le token AFRI ?', a: 'AFRI est le token utilitaire d\'AfriPay. Il permet de réduire les frais, d\'accéder à des fonctionnalités premium et de participer à la gouvernance. Lancement sur testnet prévu T4 2026.' },
];

export default function LandingPage() {
  const { navigate } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0a1628] flex items-center justify-center">
            <span className="text-white font-black text-sm display">A</span>
          </div>
          <span className="font-black text-[#0a1628] text-lg display tracking-tight">AfriPay</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
          {['Fonctionnalités', 'Marchands', 'API', 'Token AFRI'].map(l => (
            <button key={l} className="hover:text-[#0a1628] transition-colors">{l}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('login')} className="hidden sm:block px-4 py-2 text-sm font-semibold text-[#0a1628] hover:bg-gray-50 rounded-xl transition-colors">
            Connexion
          </button>
          <button onClick={() => navigate('register')}
            className="px-4 py-2 text-sm font-semibold bg-[#0a1628] text-white rounded-xl hover:bg-[#1a2a3a] transition-all active:scale-95">
            Commencer
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-5 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-green-50 text-green-700 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Bêta — Rejoignez les premiers utilisateurs
          </div>
          <h1 className="display font-black text-5xl sm:text-6xl lg:text-7xl text-[#0a1628] leading-[1.1] tracking-tighter mb-5">
            Le pont entre{' '}
            <span className="relative">
              <span className="relative z-10">Mobile Money</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-green-200/60 rounded-full -z-0" />
            </span>
            <br />
            et l&apos;économie{' '}
            <span className="text-brand-600">numérique africaine.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            Gérez vos paiements numériques, stablecoins et actifs numériques depuis une seule plateforme pensée pour l&apos;Afrique.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => navigate('register')}
              className="flex items-center gap-2 px-7 py-4 bg-[#0a1628] text-white font-semibold rounded-2xl hover:bg-[#1a2a3a] transition-all active:scale-95 shadow-lg shadow-[#0a1628]/10 text-sm">
              Commencer gratuitement <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('login')}
              className="flex items-center gap-2 px-7 py-4 border border-gray-200 text-[#0a1628] font-semibold rounded-2xl hover:bg-gray-50 transition-all text-sm">
              Découvrir AfriPay
            </button>
          </div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-16 relative mx-auto max-w-2xl">
          <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/60 bg-white p-5">
            {/* Mock dashboard */}
            <div className="rounded-2xl p-5 mb-4" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a3a2a 100%)' }}>
              <p className="text-gray-400 text-xs mb-1">Balance totale</p>
              <p className="display text-3xl font-black text-white">1 245 000 <span className="text-xl font-semibold text-gray-400">FCFA</span></p>
              <p className="text-gray-400 text-sm mt-0.5">≈ $2 073.00</p>
              <div className="flex gap-2 mt-4">
                {['Recevoir', 'Envoyer', 'Convertir'].map(a => (
                  <div key={a} className="flex-1 py-2 rounded-xl bg-white/10 text-center text-white text-xs font-semibold">{a}</div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'FCFA', val: '745 000', color: '#16a34a' },
                { label: 'USDC', val: '500.00', color: '#2563eb' },
                { label: 'BTC', val: '0.012', color: '#f7931a' },
              ].map(a => (
                <div key={a.label} className="p-3 rounded-2xl border border-gray-100 bg-gray-50">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center mb-1.5 text-white text-xs font-black" style={{ background: a.color }}>
                    {a.label[0]}
                  </div>
                  <p className="text-[10px] text-gray-400">{a.label}</p>
                  <p className="font-bold text-gray-800 text-xs tabular">{a.val}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { desc: 'Dépôt Orange Money', amount: '+150 000 FCFA', color: 'text-green-600' },
                { desc: 'Paiement Shopify', amount: '-25 USDC', color: 'text-gray-700' },
                { desc: 'Réception USDC', amount: '+100 USDC', color: 'text-green-600' },
              ].map(t => (
                <div key={t.desc} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                  <p className="text-xs text-gray-600">{t.desc}</p>
                  <p className={`text-xs font-bold tabular ${t.color}`}>{t.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-20 px-5 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Processus</p>
            <h2 className="display font-black text-3xl text-[#0a1628]">Comment fonctionne AfriPay</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <p className="display text-4xl font-black text-gray-100 mb-3">{s.step}</p>
                  <p className="font-bold text-[#0a1628] mb-1">{s.title}</p>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-5 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Fonctionnalités</p>
          <h2 className="display font-black text-3xl text-[#0a1628]">Tout ce dont vous avez besoin</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}
              className="p-6 rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all bg-white">
              <div className="w-10 h-10 rounded-2xl bg-[#0a1628] flex items-center justify-center mb-4">
                <f.icon size={18} className="text-white" />
              </div>
              <p className="font-bold text-[#0a1628] mb-1">{f.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* For individuals / businesses */}
      <section className="py-20 px-5 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          {[
            {
              tag: 'Particuliers',
              title: 'Gérez vos finances numériques',
              points: ['Mobile Money ↔ Stablecoins', 'Transferts internationaux', 'Wallet multi-actifs', 'Assistant IA personnel'],
            },
            {
              tag: 'Entreprises',
              title: 'Développez votre business',
              points: ['Liens de paiement instantanés', 'Dashboard marchand', 'API complète', 'Paiements crypto et Mobile Money'],
            },
          ].map(s => (
            <div key={s.tag} className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">{s.tag}</p>
              <p className="display font-black text-2xl text-white mb-4">{s.title}</p>
              <ul className="space-y-2">
                {s.points.map(p => (
                  <li key={p} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={14} className="text-green-400 flex-shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-5 max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
        </div>
        <p className="text-xl font-semibold text-[#0a1628] max-w-lg mx-auto">&laquo;AfriPay révolutionne la façon dont nous gérons l&apos;argent en Afrique. Simple, rapide, fiable.&raquo;</p>
        <p className="text-sm text-gray-400 mt-3">Amadou K. · Entrepreneur, Bamako</p>
      </section>

      {/* FAQ */}
      <section className="py-20 px-5 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="display font-black text-3xl text-[#0a1628]">Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <p className="font-semibold text-[#0a1628] text-sm pr-4">{faq.q}</p>
                  <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="overflow-hidden">
                    <p className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="display font-black text-4xl text-[#0a1628] mb-4">Prêt à rejoindre l&apos;avenir financier africain&nbsp;?</h2>
          <p className="text-gray-500 mb-8">Rejoignez des milliers d&apos;utilisateurs qui font confiance à AfriPay pour leurs finances numériques.</p>
          <button onClick={() => navigate('register')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all active:scale-95 shadow-lg shadow-brand-600/20 text-sm">
            Commencer gratuitement <ArrowRight size={16} />
          </button>
          <p className="text-xs text-gray-400 mt-4">Gratuit · Sans carte bancaire · Toutes les transactions sont simulées</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 px-5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#0a1628] flex items-center justify-center">
              <span className="text-white font-black text-xs display">A</span>
            </div>
            <span className="font-black text-[#0a1628] display tracking-tight">AfriPay</span>
          </div>
          <p className="text-xs text-gray-400 text-center">© 2026 AfriPay · MVP Démo · Les transactions sont simulées</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <button className="hover:text-gray-600">Confidentialité</button>
            <button className="hover:text-gray-600">CGU</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
