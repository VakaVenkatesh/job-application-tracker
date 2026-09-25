import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiPieChart, FiColumns, FiList, FiCompass, FiMail, FiBriefcase } from 'react-icons/fi';
import { useApplications } from '../../hooks/useApplications';

export const Sidebar = () => {
  const { data: applications = [] } = useApplications();
  const totalCount = applications.length;
  const activeCount = applications.filter(a => !['rejected', 'ghosted', 'accepted'].includes(a.stage)).length;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: FiPieChart },
    { to: '/board', label: 'Pipeline Board', icon: FiColumns, badge: activeCount },
    { to: '/applications', label: 'All Applications', icon: FiList, badge: totalCount },
    { to: '/discover', label: 'Job Discovery', icon: FiCompass, highlight: true },
  ];

  return (
    <aside className="w-64 bg-slate-950/90 border-r border-slate-800/80 flex flex-col h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
          <FiBriefcase className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-base text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300">
            JobTrack AI
          </h1>
          <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Pipeline & Cold Email</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Workspace
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/10 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-indigo-400" />
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && (
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                {item.badge}
              </span>
            )}
            {item.highlight && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Summary Widget */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">Active Applications</span>
          <span className="text-xs font-bold text-indigo-400">{activeCount} / {totalCount}</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${totalCount > 0 ? (activeCount / totalCount) * 100 : 0}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          Keep cold emailing recruiters to boost response rates!
        </p>
      </div>
    </aside>
  );
};
