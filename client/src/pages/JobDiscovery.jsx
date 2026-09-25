import React, { useState } from 'react';
import { useFetchLiveJobs, useImportJob } from '../hooks/useSync';
import { useApplications } from '../hooks/useApplications';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { formatSalary } from '../utils/formatters';
import { FiCompass, FiPlus, FiExternalLink, FiCheck, FiMapPin, FiBriefcase, FiDollarSign, FiZap } from 'react-icons/fi';

export const JobDiscovery = ({ onSelectApplication }) => {
  const [source, setSource] = useState('remotive');
  const [previewJob, setPreviewJob] = useState(null);

  const { data: liveJobs = [], isLoading, error, refetch } = useFetchLiveJobs(source);
  const { data: existingApps = [] } = useApplications();
  const importJobMutation = useImportJob();

  // Create a map of existing company+title for deduplication check
  const importedMap = new Set(
    existingApps.map(a => `${a.company.toLowerCase()}-${a.title.toLowerCase()}`)
  );

  const isAlreadyImported = (job) => {
    const key = `${job.company.toLowerCase()}-${job.title.toLowerCase()}`;
    return importedMap.has(key);
  };

  const handleImport = (job) => {
    importJobMutation.mutate(job);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-950 border border-purple-500/20 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Live Job Discovery Portal <FiCompass className="text-purple-400" />
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Browse real active job postings directly from remote public APIs and import them into your Wishlist pipeline with a single click.
          </p>
        </div>

        {/* API Source Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setSource('remotive')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              source === 'remotive'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Remotive API
          </button>
          <button
            onClick={() => setSource('arbeitnow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              source === 'arbeitnow'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Arbeitnow API
          </button>
        </div>
      </div>

      {/* Live Jobs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-56 bg-slate-900/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center glass-panel rounded-2xl">
          <p className="text-red-400 font-semibold mb-2">Failed to fetch live job postings</p>
          <p className="text-slate-400 text-xs mb-4">{error.message}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
            Retry Fetching
          </button>
        </div>
      ) : liveJobs.length === 0 ? (
        <EmptyState
          title="No live jobs retrieved"
          description="Try switching the API provider source or refresh."
          actionLabel="Refresh Jobs"
          onAction={() => refetch()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveJobs.map((job, idx) => {
            const imported = isAlreadyImported(job);
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Company & Title */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-10 h-10 rounded-xl object-contain bg-slate-900 p-1 border border-slate-800"
                          onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold text-base flex items-center justify-center">
                          {job.company ? job.company.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-xs text-slate-400">{job.company}</h4>
                        <h3 className="font-bold text-sm text-slate-100 line-clamp-1 group-hover:text-purple-300 transition-colors">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {job.jobUrl && (
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-purple-400 p-1 rounded-md hover:bg-slate-800"
                        title="View external job post"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Location & Salary */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-slate-500" /> {job.location || 'Remote'}
                    </span>
                    {(job.salaryMin || job.salaryMax) && (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <FiDollarSign /> {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                      </span>
                    )}
                  </div>

                  {/* Description Snippet */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description || 'No detailed description available.'}
                  </p>

                  {/* Tags */}
                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] font-medium bg-slate-900 text-purple-300 rounded-md border border-purple-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewJob(job)}
                    className="text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Preview Details
                  </button>

                  <button
                    onClick={() => handleImport(job)}
                    disabled={imported || importJobMutation.isPending}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      imported
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20'
                    }`}
                  >
                    {imported ? (
                      <>
                        <FiCheck className="w-3.5 h-3.5" />
                        <span>In Wishlist</span>
                      </>
                    ) : (
                      <>
                        <FiPlus className="w-3.5 h-3.5" />
                        <span>Import to Wishlist</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Job Modal */}
      {previewJob && (
        <Modal
          isOpen={!!previewJob}
          onClose={() => setPreviewJob(null)}
          title={`Job Preview: ${previewJob.title}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {previewJob.companyLogo && (
                <img src={previewJob.companyLogo} alt={previewJob.company} className="w-12 h-12 rounded-xl bg-slate-900 p-1 border border-slate-800" />
              )}
              <div>
                <h3 className="font-bold text-lg text-white">{previewJob.title}</h3>
                <p className="text-sm text-purple-400 font-semibold">{previewJob.company} • {previewJob.location}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 max-h-80 overflow-y-auto custom-scrollbar text-xs text-slate-300 leading-relaxed space-y-2">
              <h4 className="font-bold text-slate-200 text-sm">Description</h4>
              <p className="whitespace-pre-wrap">{previewJob.description}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setPreviewJob(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleImport(previewJob);
                  setPreviewJob(null);
                }}
                disabled={isAlreadyImported(previewJob)}
                className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20"
              >
                {isAlreadyImported(previewJob) ? 'Already in Wishlist' : 'Import Job Now'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
