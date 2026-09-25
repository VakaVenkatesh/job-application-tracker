import React from 'react';
import { Link } from 'react-router-dom';
import { FiInbox, FiPlus, FiBriefcase } from 'react-icons/fi';

export const EmptyState = ({
  icon: Icon = FiBriefcase,
  title = 'No applications found',
  description = 'Start tracking your dream jobs or explore open postings in the discovery hub.',
  actionLabel,
  actionText,
  actionLink,
  onAction,
}) => {
  const btnLabel = actionLabel || actionText;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-white/10 rounded-3xl bg-[#08100e]/60 my-6">
      <div className="w-16 h-16 rounded-2xl bg-[#00f5a0]/10 border border-[#00f5a0]/20 flex items-center justify-center text-[#00f5a0] mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md mb-6 text-xs sm:text-sm leading-relaxed">{description}</p>
      
      <div className="flex flex-wrap items-center gap-3">
        {actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00f5a0] hover:bg-[#00d88d] text-black font-bold text-xs font-mono rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all"
          >
            {btnLabel || 'Browse Postings'}
          </Link>
        ) : onAction ? (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00f5a0] hover:bg-[#00d88d] text-black font-bold text-xs font-mono rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all"
          >
            <FiPlus className="w-4 h-4" />
            {btnLabel || 'Add Application'}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default EmptyState;
