import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiPieChart, FiColumns, FiList, FiCompass, FiBriefcase, FiUser, FiZap, FiShield } from 'react-icons/fi';
import { useApplications } from '../../hooks/useApplications';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { data: responseData } = useApplications();
  const { user } = useAuth();
  const applications = responseData?.data || [];
  const totalCount = applications.length;
  const activeCount = applications.filter(a => !['rejected', 'ghosted', 'accepted'].includes(a.stage)).length;

  const hunterRank = user?.hunterStats?.rank || 'E-Rank';
  const hunterLevel = user?.hunterStats?.level || 1;

  const navItems = [
    { to: '/jobs', label: 'Open Jobs Hub', icon: FiCompass, highlight: true },
    { to: '/dashboard', label: 'Aspirant Dashboard', icon: FiPieChart },
    { to: '/board', label: 'Pipeline Board', icon: FiColumns, badge: activeCount },
    { to: '/applications', label: 'Applications List', icon: FiList, badge: totalCount },
    { to: '/profile', label: 'Profile', icon: FiUser, special: true },
  ];

  return (
    <aside className="w-64 bg-[#040908] border-r border-[#00f5a0]/15 flex flex-col h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-[#00f5a0]/15">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f5a0] to-[#00d294] flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(0,245,160,0.3)]">
          <FiBriefcase className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="font-black text-base text-white tracking-tight">
            JOBTRACK<span className="text-[#00f5a0]">.PRO</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">Aspirant Command Hub</p>
        </div>
      </div>

      {/* User Hunter Rank Snapshot */}
      {user && (
        <NavLink
          to="/profile"
          className="mx-3 mt-4 p-3 rounded-2xl bg-[#08100e] border border-[#00f5a0]/20 hover:border-[#00f5a0]/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00f5a0]/20 text-[#00f5a0] flex items-center justify-center font-bold text-xs border border-[#00f5a0]/40">
              {user.name ? user.name.charAt(0).toUpperCase() : 'H'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white group-hover:text-[#00f5a0] transition-colors truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-[#00f5a0] font-mono">
                {hunterRank} • Lvl {hunterLevel}
              </p>
            </div>
          </div>
          <FiShield className="w-4 h-4 text-[#00f5a0]" />
        </NavLink>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
          COMMAND DIRECTORY
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 ${isActive
                ? 'bg-[#00f5a0] text-black font-bold shadow-[0_0_20px_rgba(0,245,160,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-[#081210]'
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
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${isActive ? 'bg-black text-[#00f5a0]' : 'bg-[#081210] text-gray-300 border border-white/10'
                    }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-ping" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Summary Widget */}
      <div className="p-4 m-3 rounded-2xl bg-[#08100e] border border-[#00f5a0]/20 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-gray-300">Active Pipeline</span>
          <span className="text-xs font-mono font-bold text-[#00f5a0]">{activeCount} / {totalCount}</span>
        </div>
        <div className="w-full bg-[#040908] h-1.5 rounded-full overflow-hidden border border-white/10">
          <div
            className="bg-[#00f5a0] h-full transition-all duration-500 shadow-[0_0_10px_#00f5a0]"
            style={{ width: `${totalCount > 0 ? (activeCount / totalCount) * 100 : 0}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-500 font-mono mt-2">
          Track upcoming exams & rounds to level up your combat stats.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
