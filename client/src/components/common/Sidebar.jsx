import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiPieChart, FiColumns, FiList, FiCompass, FiBriefcase } from 'react-icons/fi';
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
    <aside className="w-64 bg-[#040908] border-r border-[#00f5a0]/15 flex flex-col h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-[#00f5a0]/15">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f5a0] to-[#00d294] flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(0,245,160,0.3)]">
          <FiBriefcase className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="font-extrabold text-base text-white tracking-tight">
            JOBTRACK<span className="text-[#00f5a0]">.AI</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase">Career OS Workspace</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="px-3 pb-2 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
          WORKSPACE NAVIGATION
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? 'bg-[#00f5a0] text-black shadow-[0_0_20px_rgba(0,245,160,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-[#081210]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#00f5a0]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    isActive ? 'bg-black text-[#00f5a0]' : 'bg-[#081210] text-zinc-300 border border-white/10'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-ping" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Summary Widget */}
      <div className="p-4 m-3 rounded-2xl bg-[#081210] border border-[#00f5a0]/20 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-zinc-300">Active Pipeline</span>
          <span className="text-xs font-extrabold text-[#00f5a0]">{activeCount} / {totalCount}</span>
        </div>
        <div className="w-full bg-[#040908] h-1.5 rounded-full overflow-hidden border border-white/10">
          <div
            className="bg-gradient-to-r from-[#00f5a0] to-[#00d294] h-full transition-all duration-500 shadow-[0_0_10px_#00f5a0]"
            style={{ width: `${totalCount > 0 ? (activeCount / totalCount) * 100 : 0}%` }}
          />
        </div>
        <p className="text-[10px] text-zinc-500 mt-2">
          Keep updating application stages to maintain real-time response metrics!
        </p>
      </div>
    </aside>
  );
};
