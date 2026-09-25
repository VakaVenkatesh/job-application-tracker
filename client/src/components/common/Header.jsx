import React from 'react';
import { FiSearch, FiPlus, FiRefreshCw, FiZap, FiBriefcase } from 'react-icons/fi';
import { useTriggerSeed } from '../../hooks/useSync';

export const Header = ({ onOpenCreateModal, searchTerm, setSearchTerm }) => {
  const triggerSeedMutation = useTriggerSeed();

  return (
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
          <span>{triggerSeedMutation.isPending ? 'Seeding...' : 'Seed Live Jobs'}</span>
        </button>

        {/* Add Application Button */}
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <FiPlus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>
    </header>
  );
};
