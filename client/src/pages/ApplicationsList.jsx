import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApplications, useCreateApplication, useDeleteApplication } from '../hooks/useApplications';
import { STAGES, JOB_TYPE_LABELS } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import ApplicationFormModal from '../components/forms/ApplicationFormModal';
import {
  FiSearch,
  FiPlus,
  FiTrash2,
  FiExternalLink,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiBriefcase,
  FiClock,
  FiMapPin,
  FiFilter
} from 'react-icons/fi';

const NEXT_ROUND_LABELS = {
  online_assessment: 'Online Assessment / Test',
  technical_interview: 'Technical Interview',
  hr_screening: 'HR Screening',
  system_design: 'System Design Round',
  managerial: 'Managerial Round',
  final_round: 'Final Executive Round',
  assignment: 'Take-home Assignment',
  offer_discussion: 'Offer Negotiation',
  none: 'No Round Scheduled'
};

export default function ApplicationsList() {
  const [filters, setFilters] = useState({
    search: '',
    stage: 'all',
    sort: 'newest',
    page: 1,
    limit: 50
  });

  const { data, isLoading } = useApplications(filters);
  const applications = data?.data || [];

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const deleteMutation = useDeleteApplication();

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const getCompanyLogo = (app) => {
    if (app.companyLogo) return app.companyLogo;
    const clean = (app.company || 'tech').toLowerCase().replace(/[^a-z0-9]/g, '');
    return `https://logo.clearbit.com/${clean}.com`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Tracked Job Applications
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Review application history, scheduled exams, next interview rounds, and skill insights.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00f5a0] hover:bg-[#00d88d] text-black font-bold rounded-xl text-xs font-mono shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all active:scale-95 cursor-pointer"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Custom Application</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            placeholder="Search by job title, company name, or tech tag..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#08100e] border border-white/10 text-white placeholder-gray-500 text-sm focus:border-[#00f5a0] focus:outline-none"
          />
        </div>

        <select
          value={filters.stage}
          onChange={(e) => setFilters({ ...filters, stage: e.target.value, page: 1 })}
          className="px-4 py-3 rounded-2xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none"
        >
          <option value="all">All Stages ({applications.length})</option>
          {Object.entries(STAGES).map(([key, info]) => (
            <option key={key} value={key}>{info.label}</option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
          className="px-4 py-3 rounded-2xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none"
        >
          <option value="newest">Applied: Newest First</option>
          <option value="oldest">Applied: Oldest First</option>
          <option value="next_round">Upcoming Next Round</option>
          <option value="company">Company Name (A-Z)</option>
        </select>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-[#00f5a0] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FiBriefcase}
          title="No applications tracked yet"
          description="Start exploring open positions in the Job Discovery hub or record a manual application."
          actionText="Browse Open Postings"
          actionLink="/jobs"
        />
      ) : (
        /* Applications Table / Cards View */
        <div className="rounded-2xl bg-[#08100e] border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#040807] border-b border-white/10 text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-5">Role & Company</th>
                  <th className="py-4 px-4">Stage</th>
                  <th className="py-4 px-4">Date Applied</th>
                  <th className="py-4 px-4">Next Round / Exam</th>
                  <th className="py-4 px-4">Missing Skills</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {applications.map((app) => {
                  const stageInfo = STAGES[app.stage] || { label: app.stage, color: '#94a3b8' };
                  const hasNextRound = app.nextRoundDate && new Date(app.nextRoundDate) > new Date();

                  return (
                    <tr
                      key={app._id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Company & Role */}
                      <td className="py-4 px-5">
                        <Link to={`/applications/${app._id}`} className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-[#040807] border border-white/10 p-1.5 flex items-center justify-center shrink-0">
                            <img
                              src={getCompanyLogo(app)}
                              alt={app.company}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.company)}&background=00f5a0&color=000&bold=true`;
                              }}
                            />
                          </div>
                          <div>
                            <span className="text-white font-bold group-hover:text-[#00f5a0] transition-colors line-clamp-1">
                              {app.title}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-2">
                              <span>{app.company}</span>
                              <span>•</span>
                              <span>{app.location || 'Remote'}</span>
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Stage Badge */}
                      <td className="py-4 px-4">
                        <Badge
                          label={stageInfo.label}
                          color={stageInfo.color}
                        />
                      </td>

                      {/* Date Applied */}
                      <td className="py-4 px-4 text-xs text-gray-300">
                        {app.dateApplied ? (
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <FiClock className="w-3.5 h-3.5 text-gray-500" />
                            <span>{formatDate(app.dateApplied)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>

                      {/* Next Round / Exam Schedule */}
                      <td className="py-4 px-4">
                        {app.nextRoundDate ? (
                          <div className={`text-xs flex flex-col gap-0.5 ${hasNextRound ? 'text-[#00f5a0]' : 'text-gray-400'}`}>
                            <span className="font-bold flex items-center gap-1">
                              <FiCalendar className="w-3.5 h-3.5" />
                              {formatDate(app.nextRoundDate)}
                            </span>
                            <span className="text-[10px] text-gray-400 font-sans">
                              {NEXT_ROUND_LABELS[app.nextRoundType] || app.nextRoundType}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-600">None Scheduled</span>
                        )}
                      </td>

                      {/* Missing Skills Warning */}
                      <td className="py-4 px-4">
                        {app.missingSkills && app.missingSkills.length > 0 ? (
                          <span className="text-xs text-amber-400/90 flex items-center gap-1">
                            <FiAlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{app.missingSkills.slice(0, 2).join(', ')}</span>
                            {app.missingSkills.length > 2 && <span className="text-[10px] text-gray-500">+{app.missingSkills.length - 2}</span>}
                          </span>
                        ) : (
                          <span className="text-xs text-[#00f5a0] flex items-center gap-1">
                            <FiCheckCircle className="w-3.5 h-3.5 text-[#00f5a0]" /> 100% Ready
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {app.jobUrl && (
                            <a
                              href={app.jobUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-white/5 hover:bg-[#00f5a0]/15 text-gray-400 hover:text-[#00f5a0] transition-colors"
                              title="Original Job Link"
                            >
                              <FiExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <Link
                            to={`/applications/${app._id}`}
                            className="px-3 py-1.5 rounded-lg bg-[#00f5a0]/10 hover:bg-[#00f5a0] text-[#00f5a0] hover:text-black font-bold text-xs transition-colors"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => setDeleteId(app._id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Application"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Custom Application Modal */}
      <ApplicationFormModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Application"
        message="Are you sure you want to delete this tracked application? All associated notes and round schedules will be permanently removed."
      />
    </div>
  );
}
