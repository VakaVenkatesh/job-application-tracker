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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">All Applications</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Filter, search, and manage all your job application entries
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] self-start md:self-auto"
        >
          <FiPlus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        {/* Stage Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar max-w-full pb-1">
          <button
            onClick={() => setSelectedStage('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedStage === ''
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Stages ({applications.length})
          </button>
          {STAGES.map(stage => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedStage === stage.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
              {stage.label}
            </button>
          ))}
        </div>

        {/* Sorting & Cold Email Select */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedEmailStatus}
            onChange={(e) => setSelectedEmailStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Cold Email Statuses</option>
            {COLD_EMAIL_STATUSES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
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
            <div key={i} className="h-16 bg-slate-900 rounded-xl animate-pulse" />
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
        <div className="rounded-2xl glass-panel border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Company & Job Title</th>
                  <th className="px-6 py-4 font-semibold">Stage</th>
                  <th className="px-6 py-4 font-semibold">Cold Email</th>
                  <th className="px-6 py-4 font-semibold">Location & Salary</th>
                  <th className="px-6 py-4 font-semibold">Updated</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {applications.map(app => (
                  <tr
                    key={app._id}
                    onClick={() => onSelectApplication(app)}
                    className="hover:bg-slate-900/60 cursor-pointer transition-colors group"
                  >
                    {/* Company & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {app.companyLogo ? (
                          <img
                            src={app.companyLogo}
                            alt={app.company}
                            className="w-9 h-9 rounded-lg object-contain bg-slate-900 p-1 border border-slate-800"
                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-sm flex items-center justify-center">
                            {app.company ? app.company.charAt(0).toUpperCase() : '?'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                            {app.company}
                            {app.jobUrl && (
                              <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-slate-500 hover:text-indigo-400 inline-block"
                              >
                                <FiExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">{app.title}</div>
                        </div>
                      </div>
                    </td>

                    {/* Stage Dropdown Select */}
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={app.stage}
                        onChange={(e) => moveStageMutation.mutate({ id: app._id, stage: e.target.value })}
                        className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        {STAGES.map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </td>

                    {/* Cold Email Badge */}
                    <td className="px-6 py-4">
                      <ColdEmailBadge statusId={app.coldEmailStatus} />
                    </td>

                    {/* Location & Salary */}
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <div>{app.location || 'Remote'}</div>
                      <div className="font-semibold text-emerald-400 mt-0.5">
                        {formatSalary(app.salaryMin, app.salaryMax, app.currency)}
                      </div>
                    </td>

                    {/* Updated Date */}
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(app.updatedAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectApplication(app)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="View / Edit Application Details"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(app._id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
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

      {/* Delete Confirmation Modal */}
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
