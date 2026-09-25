import React, { useState } from 'react';
import { FiSearch, FiPlus, FiZap, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import { useTriggerSeed } from '../../hooks/useSync';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';

export const Header = ({ onOpenCreateModal, searchTerm, setSearchTerm }) => {
  const triggerSeedMutation = useTriggerSeed();
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            placeholder="Search company, job title, tags, or location..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Seed Database Button */}
          <button
            onClick={() => triggerSeedMutation.mutate()}
            disabled={triggerSeedMutation.isPending}
            title="Populate database with live jobs from Remotive API"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <FiZap className={`w-3.5 h-3.5 text-amber-400 ${triggerSeedMutation.isPending ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{triggerSeedMutation.isPending ? 'Seeding...' : 'Seed Live Jobs'}</span>
          </button>

          {/* Add Application Button */}
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">New Application</span>
          </button>

          {/* Auth Button / User Profile */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate hidden md:inline">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/30 rounded-xl transition-all"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              <FiLogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
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
