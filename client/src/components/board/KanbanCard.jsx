import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FiMapPin, FiDollarSign, FiClock, FiCalendar, FiAlertCircle, FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';

const NEXT_ROUND_SHORT = {
  online_assessment: 'OA / Exam',
  technical_interview: 'Tech Round',
  system_design: 'Sys Design',
  hr_screening: 'HR Screen',
  managerial: 'Managerial',
  final_round: 'Final Call',
  assignment: 'Assignment',
  offer_discussion: 'Offer Call'
};

export const KanbanCard = ({ app, index, onClick }) => {
  const getCompanyLogo = () => {
    if (app.companyLogo) return app.companyLogo;
    const clean = (app.company || 'tech').toLowerCase().replace(/[^a-z0-9]/g, '');
    return `https://logo.clearbit.com/${clean}.com`;
  };

  const hasNextRound = app.nextRoundDate && new Date(app.nextRoundDate) > new Date();

  return (
    <Draggable draggableId={app._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(app)}
          className={`p-4 rounded-2xl mb-3 bg-[#08100e] cursor-pointer transition-all duration-200 select-none group border ${
            snapshot.isDragging
              ? 'bg-[#0c1c18] border-[#00f5a0] shadow-[0_0_25px_rgba(0,245,160,0.3)] scale-[1.02] rotate-1 z-50'
              : 'border-white/10 hover:border-[#00f5a0]/40 hover:bg-[#0c1815] shadow-md'
          }`}
        >
          {/* Card Header: Company Logo/Name + External Link */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#040807] border border-white/10 p-1 flex items-center justify-center shrink-0">
                <img
                  src={getCompanyLogo()}
                  alt={app.company}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.company)}&background=00f5a0&color=000&bold=true`;
                  }}
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-mono text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors truncate">
                  {app.company}
                </h4>
                <h3 className="font-bold text-xs text-white line-clamp-1 leading-snug">
                  {app.title}
                </h3>
              </div>
            </div>

            {app.jobUrl && (
              <a
                href={app.jobUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-500 hover:text-[#00f5a0] p-1 rounded-md transition-colors"
                title="View original job posting"
              >
                <FiExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Location & Compensation */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 my-2 text-[11px] font-mono text-gray-400">
            {app.location && (
              <span className="flex items-center gap-1">
                <FiMapPin className="w-3 h-3 text-[#00f5a0]" />
                <span className="truncate max-w-[100px]">{app.location}</span>
              </span>
            )}
            {app.salary && (
              <span className="flex items-center gap-0.5 text-white">
                <FiDollarSign className="w-3 h-3 text-cyan-400" />
                <span>{app.salary}</span>
              </span>
            )}
          </div>

          {/* Next Round Radar (if scheduled) */}
          {app.nextRoundDate && (
            <div className={`p-2 rounded-xl mb-2 flex items-center justify-between text-[10px] font-mono border ${
              hasNextRound
                ? 'bg-[#00f5a0]/10 border-[#00f5a0]/30 text-[#00f5a0]'
                : 'bg-white/5 border-white/5 text-gray-400'
            }`}>
              <span className="flex items-center gap-1 font-bold">
                <FiCalendar className="w-3 h-3" />
                {NEXT_ROUND_SHORT[app.nextRoundType] || 'Next Round'}
              </span>
              <span>{formatDate(app.nextRoundDate)}</span>
            </div>
          )}

          {/* Footer: Date Applied & Skills Summary */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-gray-500">
            <span className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              {formatDate(app.dateApplied || app.createdAt)}
            </span>

            {app.missingSkills && app.missingSkills.length > 0 ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <FiAlertCircle className="w-3 h-3" />
                {app.missingSkills.length} Missing
              </span>
            ) : (
              <span className="text-[#00f5a0] flex items-center gap-1">
                <FiCheckCircle className="w-3 h-3" /> Ready
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
