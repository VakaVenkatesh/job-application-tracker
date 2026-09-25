import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'from-indigo-600/20 to-indigo-600/5 text-indigo-400 border-indigo-500/30',
    purple: 'from-purple-600/20 to-purple-600/5 text-purple-400 border-purple-500/30',
    emerald: 'from-emerald-600/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-600/20 to-amber-600/5 text-amber-400 border-amber-500/30',
    blue: 'from-blue-600/20 to-blue-600/5 text-blue-400 border-blue-500/30',
  };

  const styleClass = colorMap[color] || colorMap.indigo;

  return (
    <div className="p-5 rounded-2xl glass-panel glass-panel-hover flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold text-white tracking-tight">{value}</h3>
        {subtext && <p className="text-xs text-slate-500 mt-1.5 font-medium">{subtext}</p>}
      </div>

      <div className={`p-3 rounded-xl bg-gradient-to-br ${styleClass} border shadow-inner`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
