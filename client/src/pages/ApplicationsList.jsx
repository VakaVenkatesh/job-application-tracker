import React, { useState } from 'react';
import { useApplications, useDeleteApplication, useMoveStage } from '../hooks/useApplications';
import { StageBadge, ColdEmailBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { STAGES, COLD_EMAIL_STATUSES } from '../utils/constants';
import { formatDate, formatSalary } from '../utils/formatters';
import { FiSearch, FiFilter, FiTrash2, FiEdit2, FiExternalLink, FiPlus } from 'react-icons/fi';

export const ApplicationsList = ({ onOpenCreateModal, onSelectApplication, searchTerm, setSearchTerm }) => {
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedEmailStatus, setSelectedEmailStatus] = useState('');
  const [sortBy, setSortBy] = useState('-updatedAt');
  const [deletingId, setDeletingId] = useState(null);

  const filters = {
    search: searchTerm,
    stage: selectedStage,
    coldEmailStatus: selectedEmailStatus,
    sort: sortBy
  };

  const { data: applications = [], isLoading, error } = useApplications(filters);
  const deleteMutation = useDeleteApplication();
  const moveStageMutation = useMoveStage();

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => setDeletingId(null)
      });
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/20 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f5a0] animate-ping" />
            <span className="text-[10px] font-extrabold text-[#00f5a0] uppercase tracking-wider">
              DATABASE RECORDS
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">All Applications</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Filter, search, and manage all your job application entries stored in MongoDB
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00f5a0] hover:bg-[#00d294] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.35)] transition-all hover:scale-105 self-start md:self-auto"
        >
          <FiPlus className="w-4 h-4 text-black" />
          Add Application
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/20 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        {/* Stage Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar max-w-full pb-1">
          <button
            onClick={() => setSelectedStage('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
              selectedStage === ''
                ? 'bg-[#00f5a0] text-black shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                : 'bg-[#040908] text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            All Stages ({applications.length})
          </button>
          {STAGES.map(stage => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedStage === stage.id
                  ? 'bg-[#00f5a0] text-black shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                  : 'bg-[#040908] text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#00f5a0]" />
              {stage.label}
            </button>
          ))}
        </div>

        {/* Sorting & Cold Email Select */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedEmailStatus}
            onChange={(e) => setSelectedEmailStatus(e.target.value)}
            className="px-3 py-2 bg-[#040908] border border-[#00f5a0]/20 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-[#00f5a0]"
          >
            <option value="">All Cold Email Statuses</option>
            {COLD_EMAIL_STATUSES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-[#040908] border border-[#00f5a0]/20 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-[#00f5a0]"
          >
            <option value="-updatedAt">Recently Updated</option>
            <option value="-createdAt">Recently Created</option>
            <option value="company">Company (A-Z)</option>
            <option value="-salaryMax">Highest Salary</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      {isLoading ? (
        <div className="p-8 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-[#081210] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications matched your filter"
          description="Try resetting your stage or cold email filters, or add a new application entry."
          actionLabel="Add New Application"
          onAction={onOpenCreateModal}
        />
      ) : (
        <div className="rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/20 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-[#040908] text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-[#00f5a0]/15">
                <tr>
                  <th className="px-6 py-4">Company & Job Title</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Cold Email</th>
                  <th className="px-6 py-4">Location & Salary</th>
                  <th className="px-6 py-4">Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map(app => (
                  <tr
                    key={app._id}
                    onClick={() => onSelectApplication(app)}
                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {app.companyLogo ? (
                          <img
                            src={app.companyLogo}
                            alt={app.company}
                            className="w-9 h-9 rounded-xl object-contain bg-[#040908] p-1 border border-white/10"
                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-[#040908] border border-[#00f5a0]/30 text-[#00f5a0] font-bold text-sm flex items-center justify-center">
                            {app.company ? app.company.charAt(0).toUpperCase() : '?'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white group-hover:text-[#00f5a0] transition-colors flex items-center gap-1.5">
                            {app.company}
                            {app.jobUrl && (
                              <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-zinc-500 hover:text-[#00f5a0] inline-block"
                              >
                                <FiExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                          <div className="text-xs text-zinc-400 font-medium">{app.title}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={app.stage}
                        onChange={(e) => moveStageMutation.mutate({ id: app._id, stage: e.target.value })}
                        className="px-3 py-1.5 bg-[#040908] border border-[#00f5a0]/30 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#00f5a0]"
                      >
                        {STAGES.map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <ColdEmailBadge statusId={app.coldEmailStatus} />
                    </td>

                    <td className="px-6 py-4 text-xs text-zinc-400">
                      <div>{app.location || 'Remote'}</div>
                      <div className="font-bold text-[#00f5a0] mt-0.5">
                        {formatSalary(app.salaryMin, app.salaryMax, app.currency)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-zinc-400">
                      {formatDate(app.updatedAt)}
                    </td>

                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectApplication(app)}
                          className="p-2 text-zinc-400 hover:text-[#00f5a0] rounded-xl hover:bg-[#040908] transition-colors"
                          title="View / Edit Details"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(app._id)}
                          className="p-2 text-zinc-400 hover:text-rose-400 rounded-xl hover:bg-[#040908] transition-colors"
                          title="Delete Application"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Application"
        message="Are you sure you want to delete this job application? All logged contacts and notes for this entry will be permanently removed."
        confirmText="Delete Entry"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
