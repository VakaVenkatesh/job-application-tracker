import React from 'react';
import { FiInbox, FiPlus, FiRefreshCw } from 'react-icons/fi';

export const EmptyState = ({
  title = 'No applications found',
  description = 'Get started by creating a new job application or importing live jobs from the discovery tab.',
  actionLabel = 'Add New Application',
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl glass-panel my-6">
      <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 animate-pulse-subtle">
        <FiInbox className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-md mb-6 text-sm leading-relaxed">{description}</p>
      
      <div className="flex flex-wrap items-center gap-3">
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
          >
            <FiPlus className="w-4 h-4" />
            {actionLabel}
          </button>
        )}

        {onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 font-medium text-sm rounded-xl transition-all"
          >
            <FiRefreshCw className="w-4 h-4" />
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
