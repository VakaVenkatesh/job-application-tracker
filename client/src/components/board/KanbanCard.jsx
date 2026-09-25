import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FiMapPin, FiDollarSign, FiClock, FiMail, FiExternalLink, FiMoreHorizontal } from 'react-icons/fi';
import { ColdEmailBadge } from '../common/Badge';
import { formatSalary, formatRelativeTime } from '../../utils/formatters';

export const KanbanCard = ({ app, index, onClick }) => {
  const salaryText = formatSalary(app.salaryMin, app.salaryMax, app.currency);
  const updatedAgo = formatRelativeTime(app.updatedAt);

  return (
    <Draggable draggableId={app._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(app)}
          className={`p-4 rounded-xl mb-3 glass-panel cursor-pointer transition-all duration-200 select-none group border ${
            snapshot.isDragging
              ? 'bg-slate-800/90 border-indigo-500/80 shadow-2xl scale-[1.02] rotate-1 z-50'
              : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-lg'
          }`}
        >
          {/* Card Header: Company Logo/Name + External Link */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              {app.companyLogo ? (
                <img
                  src={app.companyLogo}
                  alt={app.company}
                  className="w-8 h-8 rounded-lg object-contain bg-slate-800 p-1 border border-slate-700/50"
                  onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-sm flex items-center justify-center">
                  {app.company ? app.company.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <div>
                <h4 className="font-semibold text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                  {app.company}
                </h4>
                <h3 className="font-bold text-sm text-slate-100 line-clamp-1 leading-snug">
                  {app.title}
                </h3>
              </div>
            </div>

            {app.jobUrl && (
              <a
                href={app.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-slate-500 hover:text-indigo-400 p-1 rounded-md hover:bg-slate-800 transition-colors"
                title="View original job posting"
              >
                <FiExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Location & Salary Info */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 my-2.5 text-xs text-slate-400">
            {app.location && (
              <span className="flex items-center gap-1">
                <FiMapPin className="w-3 h-3 text-slate-500" />
                <span className="truncate max-w-[120px]">{app.location}</span>
              </span>
            )}
            {salaryText !== 'Not specified' && (
              <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                <FiDollarSign className="w-3 h-3" />
                <span>{salaryText}</span>
              </span>
            )}
          </div>

          {/* Tags */}
          {app.tags && app.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {app.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] font-medium bg-slate-800/80 text-slate-400 rounded-md border border-slate-700/40">
                  {tag}
                </span>
              ))}
              {app.tags.length > 3 && (
                <span className="text-[10px] text-slate-500 font-medium self-center">+ {app.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Card Footer: Cold Email Badge & Updated Time */}
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-500">
            <ColdEmailBadge statusId={app.coldEmailStatus} />
            <span className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              {updatedAgo}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};
