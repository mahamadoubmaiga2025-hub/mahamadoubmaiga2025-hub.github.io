import React from 'react';

type Status = 'completed' | 'pending' | 'failed' | 'active' | 'paid' | 'expired';

const CONFIG: Record<Status, { label: string; cls: string }> = {
  completed: { label: 'Complété', cls: 'bg-green-50 text-green-700 border-green-100' },
  pending:   { label: 'En attente', cls: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
  failed:    { label: 'Échoué', cls: 'bg-red-50 text-red-600 border-red-100' },
  active:    { label: 'Actif', cls: 'bg-blue-50 text-blue-700 border-blue-100' },
  paid:      { label: 'Payé', cls: 'bg-green-50 text-green-700 border-green-100' },
  expired:   { label: 'Expiré', cls: 'bg-gray-50 text-gray-500 border-gray-100' },
};

export default function Badge({ status }: { status: Status }) {
  const cfg = CONFIG[status] ?? CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}
