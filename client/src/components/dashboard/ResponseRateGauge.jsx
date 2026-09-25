import React from 'react';
import { FiMail, FiCheckCircle, FiSend, FiMessageSquare } from 'react-icons/fi';

export const ResponseRateGauge = ({ stats = {} }) => {
  const { totalColdEmailsSent = 0, openRate = 0, replyRate = 0, interviewRate = 0 } = stats;

  const metrics = [
    {
      label: 'Cold Emails Sent',
      value: totalColdEmailsSent,
      target: 'Active outreach',
      icon: FiSend,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20'
    },
    {
      label: 'Email Open Rate',
      value: `${openRate}%`,
      percentage: openRate,
      icon: FiMail,
      color: 'text-amber-400',
      bg: 'bg-amber-500/20'
    },
    {
      label: 'Recruiter Reply Rate',
      value: `${replyRate}%`,
      percentage: replyRate,
      icon: FiMessageSquare,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20'
    },
    {
      label: 'Application -> Interview Rate',
      value: `${interviewRate}%`,
      percentage: interviewRate,
      icon: FiCheckCircle,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => (
        <div key={idx} className="p-4 rounded-xl glass-panel border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">{m.label}</span>
            <div className={`p-2 rounded-lg ${m.bg} ${m.color}`}>
              <m.icon className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black text-white mb-2">{m.value}</div>
            {m.percentage !== undefined && (
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 bg-gradient-to-r ${
                    m.percentage > 30 ? 'from-emerald-500 to-green-400' : 'from-indigo-500 to-purple-400'
                  }`}
                  style={{ width: `${Math.min(m.percentage, 100)}%` }}
                />
              </div>
            )}
            {m.target && <span className="text-[11px] text-slate-500">{m.target}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
