import React from 'react';
import { STAGE_MAP, COLD_EMAIL_STATUSES } from '../../utils/constants';

export const StageBadge = ({ stageId, className = '' }) => {
  const stage = STAGE_MAP[stageId] || { label: stageId, bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${stage.bg} ${stage.text} ${stage.border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage.color || '#94a3b8' }} />
      {stage.label}
    </span>
  );
};

export const ColdEmailBadge = ({ statusId, className = '' }) => {
  const status = COLD_EMAIL_STATUSES.find(s => s.id === statusId) || { label: statusId || 'Not Sent', color: 'text-slate-400', bg: 'bg-slate-800/80' };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.bg} ${status.color} border border-white/5 ${className}`}>
      ✉️ {status.label}
    </span>
  );
};
