import React, { useState } from 'react';
import { FiSearch, FiPlus, FiZap, FiLogOut, FiLogIn } from 'react-icons/fi';
import { useTriggerSeed } from '../../hooks/useSync';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';

export const Header = ({ onOpenCreateModal, searchTerm, setSearchTerm }) => {
  const triggerSeedMutation = useTriggerSeed();
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-[#040908]/90 backdrop-blur-md border-b border-[#00f5a0]/15 px-6 flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f5a0]" />
          <input
            type="text"
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            placeholder="Search company, job title, tags, or location..."
            className="w-full pl-10 pr-4 py-2 bg-[#081210] border border-[#00f5a0]/20 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#00f5a0] transition-all"
          />
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Seed Database Button */}
          <button
            onClick={() => triggerSeedMutation.mutate()}
            disabled={triggerSeedMutation.isPending}
            title="Populate database with live jobs from Remotive API"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#081210] hover:bg-[#0c1a17] border border-[#00f5a0]/20 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-all shadow-sm"
          >
            <FiZap className={`w-3.5 h-3.5 text-[#00f5a0] ${triggerSeedMutation.isPending ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{triggerSeedMutation.isPending ? 'Seeding...' : 'Seed Live Jobs'}</span>
          </button>

          {/* Add Application Button */}
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f5a0] hover:bg-[#00d294] text-black text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all hover:scale-105"
          >
            <FiPlus className="w-4 h-4 text-black" />
            <span className="hidden sm:inline">New Application</span>
          </button>

          {/* User Profile / Logout */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#081210] border border-[#00f5a0]/30 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#00f5a0] flex items-center justify-center text-xs font-black text-black">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-bold text-zinc-200 max-w-[100px] truncate hidden md:inline">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-[#081210] border border-white/10 hover:border-rose-500/30 rounded-xl transition-all"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f5a0] text-black text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all"
            >
              <FiLogIn className="w-3.5 h-3.5" />
              <span>Launch App</span>
            </button>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
