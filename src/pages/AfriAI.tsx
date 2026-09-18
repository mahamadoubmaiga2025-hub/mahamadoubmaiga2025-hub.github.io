import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, HelpCircle, RefreshCw, TrendingUp, Wallet, ArrowLeftRight, CreditCard, Shield, Zap } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { sleep } from '@/utils/format';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ts: number;
}

const QUICK_QUESTIONS = [
  'Combien vaut mon portefeuille ?',
  'Quelle est la différence entre USDC et USDT ?',
  'Comment fonctionne un stablecoin ?',
  'Quel est mon volume ce mois-ci ?',
  'Comment convertir des FCFA en USDC ?',
  'Qu\'est-ce que le Mobile Money ?',
  'Quels sont les frais sur AfriPay ?',
  'Comment sécuriser mon compte ?',
];

const TOPIC_SUGGESTIONS: Record<string, string[]> = {
  portefeuille: ['Comment augmenter ma balance ?', 'Comment envoyer des fonds ?', 'Qu\'est-ce que USDC ?'],
  usdc_usdt: ['Comment acheter de l\'USDC ?', 'Comment convertir USDC en FCFA ?', 'Quel stablecoin utiliser ?'],
  stablecoin: ['Quel stablecoin choisir ?', 'USDC vs USDT ?', 'Comment acheter des stablecoins ?'],
  volume: ['Comment exporter mes transactions ?', 'Voir mes analytics ?', 'Qu\'est-ce que le token AFRI ?'],
  convertir: ['Quels sont les taux actuels ?', 'Quels sont les frais ?', 'Comment envoyer de l\'argent ?'],
  mobile_money: ['Comment déposer via Orange Money ?', 'Combien ça coûte ?', 'Retirer vers Wave ?'],
  frais: ['Comment réduire mes frais ?', 'Qu\'est-ce que le token AFRI ?', 'Comparer les opérateurs Mobile Money'],
  securite: ['Activer le 2FA ?', 'Voir mes sessions actives ?', 'Notifications de sécurité ?'],
  btc: ['Combien vaut mon BTC ?', 'Convertir BTC en FCFA ?', 'Comment recevoir du Bitcoin ?'],
  transfert: ['Envoyer vers l\'international ?', 'Quels sont les délais ?', 'Frais de transfert ?'],
  afri: ['Quand sera disponible AFRI ?', 'Comment participer au testnet ?', 'Avantages du token ?'],
  default: ['Voir mes transactions ?', 'Comment convertir des devises ?', 'Contacter le support ?'],
};

const RESPONSES: Record<string, { text: string; suggestions: string[] }> = {
  default: {
    text: 'Je suis AfriAI, votre assistant financier AfriPay. Je peux vous aider à comprendre vos transactions, les stablecoins, le Mobile Money et comment utiliser la plateforme. N\'hésitez pas à me poser vos questions !',
    suggestions: TOPIC_SUGGESTIONS.default,
  },
  portefeuille: {
    text: 'Votre portefeuille total est estimé à **1 245 000 FCFA** (~2 073 USD), réparti entre :\n\n• FCFA : 745 000 FCFA (~59.8%)\n• USDC : 500 USDC (~24.1%)\n• USDT : 250 USDT (~12.1%)\n• BTC : 0.012 BTC (~4.0%)\n\nSur les 30 derniers jours, votre portefeuille a progressé de **+8.4%**. Continuez comme ça !',
    suggestions: TOPIC_SUGGESTIONS.portefeuille,
  },
  usdc_usdt: {
    text: '**USDC** (USD Coin) est émis par Circle et Coinbase — l\'un des stablecoins les plus audités et réglementés au monde. Réserves vérifiées mensuellement.\n\n**USDT** (Tether) est le stablecoin le plus utilisé par volume, mais historiquement moins transparent sur ses réserves.\n\nLes deux sont indexés au dollar américain (1:1). Pour un usage quotidien en Afrique, **USDC est souvent préféré** pour sa transparence et sa conformité réglementaire.\n\nAfriPay accepte les deux.',
    suggestions: TOPIC_SUGGESTIONS.usdc_usdt,
  },
  stablecoin: {
    text: 'Un **stablecoin** est une cryptomonnaie dont la valeur est indexée sur une monnaie fiduciaire, souvent le dollar américain.\n\nContrairement au Bitcoin qui peut varier de ±10% en une journée, **1 USDC = 1 dollar américain** à tout moment.\n\nPourquoi c\'est utile en Afrique ?\n• Envoyer de la valeur sans frais bancaires élevés\n• Se protéger contre la dépréciation de certaines monnaies locales\n• Payer en ligne sur des plateformes internationales\n• Accumuler une épargne en dollar stable\n\n⚠️ AfriAI ne donne pas de conseils d\'investissement personnalisés.',
    suggestions: TOPIC_SUGGESTIONS.stablecoin,
  },
  volume: {
    text: 'Sur les **30 derniers jours**, voici votre activité :\n\n📥 **Revenus** : 337 000 FCFA\n📤 **Dépenses** : 255 000 FCFA\n💹 **Solde net** : +82 000 FCFA\n\nRépartition des revenus :\n• Dépôts Orange Money — 55%\n• Réceptions USDC — 25%\n• Conversions — 20%\n\nVotre activité est en hausse de **+12%** par rapport au mois précédent. Consultez la page Analytics pour les graphiques complets.',
    suggestions: TOPIC_SUGGESTIONS.volume,
  },
  convertir: {
    text: 'Pour convertir des FCFA en USDC sur AfriPay :\n\n1. Allez dans **Convertir** dans la sidebar\n2. Sélectionnez **FCFA** comme devise source\n3. Sélectionnez **USDC** comme destination\n4. Saisissez le montant\n5. Vérifiez le taux et les frais **(0.3%)**\n6. Confirmez la conversion\n\n**Taux actuels (simulés) :**\n• 1 000 FCFA ≈ 1.645 USDC\n• 1 USDC ≈ 607.9 FCFA\n\n⚠️ Ces taux sont simulés pour la démo.',
    suggestions: TOPIC_SUGGESTIONS.convertir,
  },
  mobile_money: {
    text: '**Mobile Money** est un service financier mobile très répandu en Afrique subsaharienne. Il permet de stocker de l\'argent, payer des services et envoyer des fonds via son téléphone portable, sans compte bancaire.\n\nPrincipaux opérateurs sur AfriPay :\n• 🟠 **Orange Money** — Mali, Sénégal, Côte d\'Ivoire\n• 🔵 **Wave** — Sénégal, Côte d\'Ivoire, Mali\n• 🟡 **MTN MoMo** — Ghana, Nigeria, Bénin\n• 🟢 **Moov Money** — Côte d\'Ivoire, Bénin, Togo\n\nAvec AfriPay, déposez et retirez via ces services 24h/24 (simulation dans cette version).',
    suggestions: TOPIC_SUGGESTIONS.mobile_money,
  },
  frais: {
    text: 'Voici la grille tarifaire AfriPay :\n\n💱 **Conversions** : 0.3% du montant\n📤 **Transferts** : 0.5% (max 2 500 FCFA)\n📱 **Mobile Money** : 1.0–1.5% selon l\'opérateur\n🏪 **Paiements marchands** : 1.5% (plan Gratuit) / 0.8% (plan Pro)\n\n💡 **Astuce** : Détenir des tokens **AFRI** permettra de réduire jusqu\'à 50% de ces frais lorsque le token sera lancé.\n\n⚠️ Ces frais sont simulés pour le MVP.',
    suggestions: TOPIC_SUGGESTIONS.frais,
  },
  securite: {
    text: 'Votre compte AfriPay bénéficie de plusieurs niveaux de sécurité :\n\n🔐 **2FA activé** — Code OTP à chaque connexion\n🛡️ **Chiffrement AES-256** — Toutes les données sont chiffrées\n🔔 **Alertes en temps réel** — Notification pour chaque transaction\n📍 **Sessions actives** — Gérez vos appareils connectés\n🔑 **Gestion des clés API** — Contrôle granulaire des accès\n\nConseils de sécurité :\n• Activez le 2FA si ce n\'est pas fait\n• Vérifiez régulièrement vos sessions actives\n• Ne partagez jamais votre mot de passe\n\nConsultez la page **Sécurité** pour tout gérer.',
    suggestions: TOPIC_SUGGESTIONS.securite,
  },
  btc: {
    text: 'Votre solde Bitcoin actuel est de **0.012 BTC**, soit environ **~$720 USD** au cours simulé actuel.\n\n**Taux simulé** : 1 BTC ≈ 60 000 USD\n\nPour convertir votre BTC en FCFA :\n• Allez dans **Convertir**\n• Sélectionnez BTC → FCFA\n• 0.012 BTC ≈ **895 800 FCFA** (taux simulé)\n\n⚠️ Les prix crypto fluctuent. AfriAI ne donne pas de conseils d\'investissement.',
    suggestions: TOPIC_SUGGESTIONS.btc,
  },
  transfert: {
    text: 'AfriPay permet d\'envoyer des fonds à travers l\'Afrique en quelques secondes.\n\n**Comment envoyer :**\n1. Allez dans **Envoyer** dans la sidebar\n2. Choisissez la devise (FCFA, USDC, USDT...)\n3. Saisissez l\'adresse ou le numéro Mobile Money\n4. Confirmez le montant et les frais\n\n**Délais simulés :**\n• USDC/USDT : quasi-instantané (~5s)\n• FCFA vers Mobile Money : 30–60s\n• BTC : quelques minutes\n\n**Frais** : 0.5% du montant (max 2 500 FCFA)',
    suggestions: TOPIC_SUGGESTIONS.transfert,
  },
  afri: {
    text: '**AFRI** est le token utilitaire de l\'écosystème AfriPay.\n\n**Utilités prévues :**\n⚡ Réduction des frais jusqu\'à 50%\n⭐ Récompenses d\'utilisation\n🔓 Accès à des fonctionnalités premium\n🗳️ Gouvernance (votes communauté)\n🏪 Avantages marchands spéciaux\n\n**Informations :**\n• Supply totale : 1 000 000 000 AFRI\n• Standard : ERC-20\n• Réseau : EVM Layer 2\n\n🟡 **Statut : Coming soon — Testnet T4 2026**\n\nConsultez la page **Token AFRI** pour plus de détails.\n\n⚠️ AFRI n\'est pas encore disponible. Aucun achat n\'est possible actuellement.',
    suggestions: TOPIC_SUGGESTIONS.afri,
  },
};

function getResponseKey(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('portefeuille') || lower.includes('wallet') || lower.includes('combien vaut') || lower.includes('balance')) return 'portefeuille';
  if (lower.includes('usdc') && lower.includes('usdt')) return 'usdc_usdt';
  if (lower.includes('stablecoin')) return 'stablecoin';
  if (lower.includes('volume') || (lower.includes('mois') && lower.includes('transactions'))) return 'volume';
  if (lower.includes('convertir') || lower.includes('conversion') || lower.includes('changer')) return 'convertir';
  if (lower.includes('mobile money') || lower.includes('orange') || lower.includes('wave') || lower.includes('mtn') || lower.includes('moov')) return 'mobile_money';
  if (lower.includes('frais') || lower.includes('commission') || lower.includes('tarif') || lower.includes('coût')) return 'frais';
  if (lower.includes('sécur') || lower.includes('2fa') || lower.includes('mot de passe') || lower.includes('connexion')) return 'securite';
  if (lower.includes('btc') || lower.includes('bitcoin')) return 'btc';
  if (lower.includes('transfert') || lower.includes('envoyer') || lower.includes('transférer')) return 'transfert';
  if (lower.includes('afri') || lower.includes('token') || lower.includes('governan')) return 'afri';
  if (lower.includes('fcfa') && lower.includes('usdc')) return 'convertir';
  return 'default';
}

function formatMarkdown(text: string) {
  return text.split('\n').map((line, li) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <React.Fragment key={li}>
        {parts.map((part, i) =>
          i % 2 === 1
            ? <strong key={i} className="font-bold text-[var(--ink)]">{part}</strong>
            : part
        )}
        {li < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });
}

const CAPABILITY_CARDS = [
  { icon: Wallet, label: 'Portefeuille', desc: 'Solde & actifs', key: 'Combien vaut mon portefeuille ?' },
  { icon: ArrowLeftRight, label: 'Conversion', desc: 'Taux & frais', key: 'Comment convertir des FCFA en USDC ?' },
  { icon: CreditCard, label: 'Mobile Money', desc: 'Opérateurs', key: 'Qu\'est-ce que le Mobile Money ?' },
  { icon: Shield, label: 'Sécurité', desc: 'Protéger son compte', key: 'Comment sécuriser mon compte ?' },
  { icon: TrendingUp, label: 'Analyse', desc: 'Volume & stats', key: 'Quel est mon volume ce mois-ci ?' },
  { icon: Zap, label: 'Token AFRI', desc: 'Utilités', key: 'Qu\'est-ce que le token AFRI ?' },
];

export default function AfriAIPage() {
  const { state } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Bonjour ${state.user?.name?.split(' ')[0] ?? ''} ! Je suis **AfriAI**, votre assistant financier personnel. Je peux vous aider à comprendre vos finances, les stablecoins, le Mobile Money, et comment utiliser AfriPay. Comment puis-je vous aider ?`,
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastKey, setLastKey] = useState<string>('default');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function send(text: string) {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: String(Date.now()), role: 'user', content: text.trim(), ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    await sleep(700 + Math.random() * 700);
    const key = getResponseKey(text);
    setLastKey(key);
    const resp = RESPONSES[key] ?? RESPONSES.default;
    const aiMsg: Message = { id: String(Date.now() + 1), role: 'assistant', content: resp.text, ts: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  const suggestions = RESPONSES[lastKey]?.suggestions ?? TOPIC_SUGGESTIONS.default;
  const showWelcome = messages.length <= 1;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen p-4 sm:p-6 pb-[max(24px,env(safe-area-inset-bottom))] lg:pb-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-600 to-teal-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-600/20">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h2 className="display font-bold text-[var(--ink)] text-lg">AfriAI</h2>
          <p className="text-xs text-[var(--muted)]">Assistant financier AfriPay · MVP</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {messages.length > 1 && (
            <button onClick={() => { setMessages(prev => [prev[0]]); setLastKey('default'); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)] transition-all">
              <RefreshCw size={11} /> Réinitialiser
            </button>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-700">En ligne</span>
          </div>
        </div>
      </div>

      {/* Capability cards (welcome) */}
      {showWelcome && (
        <div className="grid grid-cols-3 gap-2 mb-4 flex-shrink-0">
          {CAPABILITY_CARDS.map(c => (
            <button key={c.label} onClick={() => send(c.key)}
              className="flex flex-col items-start gap-1 p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] hover:border-brand-300 hover:bg-green-50 transition-all text-left group">
              <div className="w-7 h-7 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                <c.icon size={13} className="text-[var(--muted)] group-hover:text-brand-600 transition-colors" />
              </div>
              <p className="text-xs font-bold text-[var(--ink)] leading-tight">{c.label}</p>
              <p className="text-[10px] text-[var(--muted)] leading-tight">{c.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-3 pr-1 no-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                msg.role === 'assistant' ? 'bg-gradient-to-br from-green-600 to-teal-700' : 'bg-[var(--ink)]'
              }`}>
                {msg.role === 'assistant' ? <Bot size={13} className="text-white" /> : <User size={13} className="text-white" />}
              </div>
              <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-sm'
                  : 'bg-[var(--surface-muted)] text-[var(--ink)] rounded-tl-sm border border-[var(--border)]'
              }`}>
                {msg.role === 'assistant' ? formatMarkdown(msg.content) : msg.content}
                <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/60 text-right' : 'text-[var(--subtle)]'}`}>
                  {new Date(msg.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-600 to-teal-700 flex items-center justify-center flex-shrink-0">
                <Bot size={13} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--surface-muted)] border border-[var(--border)] flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--muted)]"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Follow-up suggestions (after first reply) */}
      {!showWelcome && !isTyping && suggestions.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1.5 flex-shrink-0">
          {suggestions.slice(0, 3).map(s => (
            <button key={s} onClick={() => send(s)}
              className="px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] text-[10px] font-medium text-[var(--muted)] hover:border-brand-400 hover:text-brand-600 hover:bg-green-50 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 mb-2.5 flex-shrink-0">
        <HelpCircle size={11} className="text-amber-600 flex-shrink-0" />
        <p className="text-[10px] text-amber-700">AfriAI est pédagogique et ne donne pas de conseils financiers personnalisés. Réponses simulées.</p>
      </div>

      {/* Input */}
      <div className="flex gap-2 flex-shrink-0">
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/10 transition-all shadow-sm">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question à AfriAI..."
            className="flex-1 bg-transparent outline-none text-sm text-[var(--ink)] placeholder:text-[var(--subtle)]"
            disabled={isTyping}
          />
        </div>
        <button onClick={() => send(input)} disabled={!input.trim() || isTyping}
          className="w-11 h-11 rounded-2xl bg-brand-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-brand-700 active:scale-95 transition-all flex-shrink-0 shadow-lg shadow-brand-600/20">
          <Send size={15} />
        </button>
      </div>

      {/* Quick questions (welcome state) */}
      {showWelcome && (
        <div className="mt-2 flex flex-wrap gap-1.5 flex-shrink-0">
          {QUICK_QUESTIONS.slice(0, 4).map(q => (
            <button key={q} onClick={() => send(q)}
              className="px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[10px] font-medium text-[var(--ink)] hover:border-brand-400 hover:bg-green-50 transition-all">
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
