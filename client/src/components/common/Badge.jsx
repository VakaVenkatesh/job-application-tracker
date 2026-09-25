import React from 'react';
import { STAGES } from '../../utils/constants';

export const Badge = ({ label, color = '#00f5a0', bg, text, border, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${className}`}
      style={{
        backgroundColor: bg ? undefined : `${color}15`,
        color: text ? undefined : color,
        borderColor: border ? undefined : `${color}40`
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
};

export const StageBadge = ({ stageId, className = '' }) => {
  const stage = STAGES[stageId] || { label: stageId, color: '#94a3b8' };
  return <Badge label={stage.label} color={stage.color} className={className} />;
};

export const ColdEmailBadge = ({ statusId, className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-gray-400 bg-white/5 border border-white/10 ${className}`}>
      {statusId || 'Active'}
    </span>
  );
};

export default Badge;
