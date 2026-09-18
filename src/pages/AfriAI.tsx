import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, TrendingUp, HelpCircle, RefreshCw } from 'lucide-react';
import Card from '@/components/Card';
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
];

const RESPONSES: Record<string, string> = {
  default: 'Je suis AfriAI, votre assistant financier AfriPay. Je peux vous aider à comprendre vos transactions, les concepts financiers, et comment utiliser la plateforme. N\'hésitez pas à me poser vos questions !',
  portefeuille: 'Votre portefeuille total est estimé à **1 245 000 FCFA** (~2 073 USD), réparti entre FCFA (59.8%), USDC (24%), USDT (12%) et BTC (4.2%). Sur les 30 derniers jours, votre portefeuille a progressé de +8.4%.',
  usdc_usdt: '**USDC** (USD Coin) est émis par Circle et Coinbase — l\'un des stablecoins les plus audités et réglementés. **USDT** (Tether) est le stablecoin le plus utilisé par volume. Les deux sont indexés au dollar américain (1:1). Pour un usage quotidien en Afrique, USDC est souvent préféré pour sa transparence. Les deux sont acceptés sur AfriPay.',
  stablecoin: 'Un **stablecoin** est une cryptomonnaie dont la valeur est indexée sur une monnaie fiduciaire (souvent le dollar). Contrairement au Bitcoin qui fluctue beaucoup, 1 USDC = 1 dollar américain à tout moment. Pour les paiements et transferts en Afrique, les stablecoins permettent d\'envoyer de la valeur sans les frais et délais des banques traditionnelles.',
  volume: 'Sur les 30 derniers jours, votre volume total de transactions est de **337 000 FCFA** en revenus et **255 000 FCFA** en dépenses. Vos principales sources : dépôts Orange Money (55%), réceptions USDC (25%), conversions (20%).',
  convertir: 'Pour convertir des FCFA en USDC sur AfriPay : \n1. Allez dans **Convertir** dans la sidebar\n2. Sélectionnez FCFA comme source\n3. Sélectionnez USDC comme destination\n4. Saisissez le montant\n5. Vérifiez le taux et les frais (0.3%)\n6. Confirmez la conversion\n\nActuellement : 1 000 FCFA ≈ 1.65 USDC',
  mobile_money: '**Mobile Money** est un service financier mobile très répandu en Afrique subsaharienne. Les principaux opérateurs : **Orange Money** (Mali, Sénégal, CI), **Wave** (Sénégal, CI), **MTN MoMo** (Ghana, Nigeria), **Moov Money** (CI, Bénin). AfriPay vous permet de déposer et retirer via ces services directement dans votre wallet.',
};

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('portefeuille') || lower.includes('wallet') || lower.includes('combien vaut')) return RESPONSES.portefeuille;
  if (lower.includes('usdc') && lower.includes('usdt')) return RESPONSES.usdc_usdt;
  if (lower.includes('stablecoin')) return RESPONSES.stablecoin;
  if (lower.includes('volume') || lower.includes('mois')) return RESPONSES.volume;
  if (lower.includes('convertir') || lower.includes('fcfa') || lower.includes('conversion')) return RESPONSES.convertir;
  if (lower.includes('mobile money') || lower.includes('orange') || lower.includes('wave')) return RESPONSES.mobile_money;
  return RESPONSES.default;
}

function formatMarkdown(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-bold text-[var(--ink)]">{part}</strong> : part
  );
}

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
    await sleep(900 + Math.random() * 600);
    const response = getResponse(text);
    const aiMsg: Message = { id: String(Date.now() + 1), role: 'assistant', content: response, ts: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-[calc(100vh-32px)] p-4 sm:p-6 pb-24 lg:pb-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center flex-shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h2 className="display font-bold text-[var(--ink)]">AfriAI</h2>
          <p className="text-xs text-[var(--muted)]">Assistant financier AfriPay — réponses simulées (MVP)</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-green-700">En ligne</span>
        </div>
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map(q => (
            <button key={q} onClick={() => send(q)}
              className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] text-xs font-medium text-[var(--ink)] hover:border-brand-400 hover:bg-green-50 transition-all">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant' ? 'bg-gradient-to-br from-green-600 to-green-800' : 'bg-[var(--ink-2)]'
              }`}>
                {msg.role === 'assistant' ? <Bot size={14} className="text-white" /> : <User size={14} className="text-white" />}
              </div>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-sm'
                  : 'bg-[var(--surface-muted)] text-[var(--ink)] rounded-tl-sm border border-[var(--border)] whitespace-pre-line'
              }`}>
                {msg.role === 'assistant' ? formatMarkdown(msg.content) : msg.content}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--surface-muted)] border border-[var(--border)] flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--muted)]"
                    animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-100 mb-3">
        <HelpCircle size={12} className="text-yellow-600 flex-shrink-0" />
        <p className="text-[10px] text-yellow-700">AfriAI est pédagogique et ne donne pas de conseils financiers personnalisés.</p>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/10 transition-all">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question à AfriAI..."
            className="flex-1 bg-transparent outline-none text-sm text-[var(--ink)] placeholder:text-[var(--subtle)]"
            disabled={isTyping}
          />
          {messages.length > 2 && (
            <button onClick={() => { setMessages(prev => [prev[0]]); setInput(''); }}
              className="p-1 rounded-lg hover:bg-[var(--surface-muted)] transition-colors flex-shrink-0" title="Réinitialiser">
              <RefreshCw size={13} className="text-[var(--muted)]" />
            </button>
          )}
        </div>
        <button onClick={() => send(input)} disabled={!input.trim() || isTyping}
          className="w-11 h-11 rounded-2xl bg-brand-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-brand-700 active:scale-95 transition-all flex-shrink-0">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
