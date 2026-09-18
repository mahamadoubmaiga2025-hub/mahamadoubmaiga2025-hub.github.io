import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Key, Copy, Check, Terminal, Webhook, CreditCard, Wallet, ArrowLeftRight, Store, Plus } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { toast } from 'sonner';

const ENDPOINTS = [
  {
    id: 'payments',
    icon: CreditCard,
    title: 'Payments API',
    method: 'POST',
    path: '/v1/payments/initiate',
    desc: 'Initiez un paiement USDC ou Mobile Money depuis votre application.',
    request: `POST /v1/payments/initiate
Authorization: Bearer afri_sk_live_...

{
  "amount": 50000,
  "currency": "FCFA",
  "recipient": {
    "type": "mobile_money",
    "provider": "orange",
    "phone": "+223761234567"
  },
  "description": "Commande #1234",
  "idempotency_key": "order_1234"
}`,
    response: `{
  "id": "pay_01HX4K9B2Z...",
  "status": "pending",
  "amount": 50000,
  "currency": "FCFA",
  "fees": 750,
  "created_at": "2026-09-18T09:12:00Z",
  "estimated_completion": "2026-09-18T09:14:00Z"
}`,
  },
  {
    id: 'wallet',
    icon: Wallet,
    title: 'Wallet API',
    method: 'GET',
    path: '/v1/wallets/{id}/balance',
    desc: 'Consultez les balances, adresses et historique de transactions.',
    request: `GET /v1/wallets/wlt_01HX4K/balance
Authorization: Bearer afri_sk_live_...`,
    response: `{
  "wallet_id": "wlt_01HX4K...",
  "balances": [
    { "currency": "FCFA", "amount": 745000 },
    { "currency": "USDC", "amount": 500.00 },
    { "currency": "BTC", "amount": 0.012 }
  ],
  "updated_at": "2026-09-18T09:00:00Z"
}`,
  },
  {
    id: 'convert',
    icon: ArrowLeftRight,
    title: 'Conversion API',
    method: 'POST',
    path: '/v1/conversions/quote',
    desc: 'Obtenez un devis de conversion et exécutez la conversion.',
    request: `POST /v1/conversions/quote
Authorization: Bearer afri_sk_live_...

{
  "from_currency": "FCFA",
  "to_currency": "USDC",
  "amount": 100000,
  "lock_rate": true
}`,
    response: `{
  "quote_id": "qte_01HX...",
  "rate": 0.001645,
  "from_amount": 100000,
  "to_amount": 164.18,
  "fees": 300,
  "expires_at": "2026-09-18T09:13:00Z"
}`,
  },
  {
    id: 'merchant',
    icon: Store,
    title: 'Merchant API',
    method: 'POST',
    path: '/v1/merchant/payment-links',
    desc: 'Créez des liens de paiement et gérez vos transactions marchandes.',
    request: `POST /v1/merchant/payment-links
Authorization: Bearer afri_sk_live_...

{
  "amount": 25000,
  "currency": "FCFA",
  "description": "Abonnement mensuel",
  "expires_in": 3600,
  "callback_url": "https://votresite.com/webhook"
}`,
    response: `{
  "id": "lnk_01HX...",
  "url": "https://afriPay.me/pay/AB123",
  "amount": 25000,
  "currency": "FCFA",
  "expires_at": "2026-09-18T10:12:00Z",
  "status": "active"
}`,
  },
];

const API_KEY_MOCK = 'afri_sk_test_abCdEfGh1234567890XyZpQrStUv';

export default function APIPage() {
  const [activeEndpoint, setActiveEndpoint] = useState(ENDPOINTS[0].id);
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedReq, setCopiedReq] = useState(false);
  const [copiedRes, setCopiedRes] = useState(false);
  const active = ENDPOINTS.find(e => e.id === activeEndpoint)!;

  function copyKey() {
    navigator.clipboard.writeText(API_KEY_MOCK).catch(() => {});
    setCopiedKey(true);
    toast.success('Clé API copiée');
    setTimeout(() => setCopiedKey(false), 2000);
  }

  function copy(text: string, which: 'req' | 'res') {
    navigator.clipboard.writeText(text).catch(() => {});
    if (which === 'req') { setCopiedReq(true); setTimeout(() => setCopiedReq(false), 2000); }
    else { setCopiedRes(true); setTimeout(() => setCopiedRes(false), 2000); }
    toast.success('Copié');
  }

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[var(--ink)] flex items-center justify-center">
          <Terminal size={18} className="text-white" />
        </div>
        <div>
          <h2 className="display text-xl font-bold text-[var(--ink)]">AfriPay API</h2>
          <p className="text-xs text-[var(--muted)]">Documentation de référence · Version 1.0</p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs font-semibold text-green-700">API opérationnelle</span>
        </div>
      </div>

      {/* API Key */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Key size={15} className="text-[var(--muted)]" />
            <h3 className="display font-bold text-[var(--ink)] text-sm">Clé API</h3>
          </div>
          <Button variant="secondary" size="sm" icon={<Plus size={12} />}>Nouvelle clé</Button>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]">
          <Code size={13} className="text-[var(--muted)] flex-shrink-0" />
          <span className="mono text-sm text-[var(--ink)] flex-1 truncate">
            {showKey ? API_KEY_MOCK : 'afri_sk_test_' + '•'.repeat(24)}
          </span>
          <button onClick={() => setShowKey(!showKey)} className="text-xs text-[var(--muted)] hover:text-[var(--ink)] font-medium flex-shrink-0">
            {showKey ? 'Masquer' : 'Afficher'}
          </button>
          <button onClick={copyKey} className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors flex-shrink-0">
            {copiedKey ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
        <p className="text-xs text-[var(--muted)] mt-2">Clé de test — utiliser <span className="mono">afri_sk_live_...</span> en production.</p>
      </Card>

      {/* Endpoints grid + detail */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left: endpoint list */}
        <div className="space-y-2">
          {ENDPOINTS.map(e => (
            <button key={e.id} onClick={() => setActiveEndpoint(e.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                activeEndpoint === e.id ? 'border-brand-600 bg-green-50' : 'border-[var(--border)] bg-[var(--surface-strong)] hover:border-brand-300'
              }`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${activeEndpoint === e.id ? 'bg-brand-600' : 'bg-[var(--surface-muted)]'}`}>
                <e.icon size={14} className={activeEndpoint === e.id ? 'text-white' : 'text-[var(--muted)]'} />
              </div>
              <div>
                <p className="font-bold text-[var(--ink)] text-xs">{e.title}</p>
                <p className="text-[10px] text-[var(--muted)] mono">{e.method}</p>
              </div>
            </button>
          ))}

          {/* Webhooks */}
          <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center flex-shrink-0">
                <Webhook size={14} className="text-[var(--muted)]" />
              </div>
              <div>
                <p className="font-bold text-[var(--ink)] text-xs">Webhooks</p>
                <p className="text-[10px] text-[var(--muted)]">Événements temps réel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: code panels */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence mode="wait">
            <motion.div key={activeEndpoint} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              <Card padding="md">
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-black mono flex-shrink-0 ${active.method === 'POST' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{active.method}</span>
                  <div>
                    <p className="mono text-sm font-bold text-[var(--ink)]">{active.path}</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{active.desc}</p>
                  </div>
                </div>
              </Card>

              {/* Request */}
              <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--ink)]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500/60" /><span className="w-3 h-3 rounded-full bg-yellow-500/60" /><span className="w-3 h-3 rounded-full bg-green-500/60" /></div>
                    <span className="text-gray-400 text-xs font-medium">Requête</span>
                  </div>
                  <button onClick={() => copy(active.request, 'req')} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors">
                    {copiedReq ? <><Check size={11} /> Copié</> : <><Copy size={11} /> Copier</>}
                  </button>
                </div>
                <pre className="p-4 text-[11px] mono text-green-300 bg-[#0d1f14] overflow-x-auto leading-relaxed">{active.request}</pre>
              </div>

              {/* Response */}
              <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a2e]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-green-900 text-green-400 text-[10px] font-bold mono">200 OK</span>
                    <span className="text-gray-400 text-xs font-medium">Réponse</span>
                  </div>
                  <button onClick={() => copy(active.response, 'res')} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors">
                    {copiedRes ? <><Check size={11} /> Copié</> : <><Copy size={11} /> Copier</>}
                  </button>
                </div>
                <pre className="p-4 text-[11px] mono text-blue-200 bg-[#0a0a1a] overflow-x-auto leading-relaxed">{active.response}</pre>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Auth section */}
      <Card padding="md">
        <h3 className="display font-bold text-[var(--ink)] mb-2 flex items-center gap-2"><Key size={15} /> Authentification</h3>
        <p className="text-sm text-[var(--muted)] mb-3">Toutes les requêtes doivent inclure votre clé API dans le header <span className="mono bg-[var(--surface-muted)] px-1.5 py-0.5 rounded text-xs">Authorization</span>.</p>
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <pre className="p-3 text-[11px] mono text-green-300 bg-[#0d1f14] overflow-x-auto">
{`Authorization: Bearer afri_sk_live_votreCleAPI
Content-Type: application/json`}
          </pre>
        </div>
      </Card>
    </div>
  );
}
