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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/20 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f5a0] animate-ping" />
            <span className="text-[10px] font-extrabold text-[#00f5a0] uppercase tracking-wider">
              PUBLIC API AGGREGATOR
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Live Job Discovery Portal <FiCompass className="text-[#00f5a0]" />
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Browse real active job postings directly from remote public APIs and import them into your Wishlist pipeline with a single click.
          </p>
        </div>

        {/* API Source Switcher */}
        <div className="flex items-center gap-2 bg-[#040908] p-1.5 rounded-2xl border border-[#00f5a0]/20 self-start md:self-auto">
          <button
            onClick={() => setSource('remotive')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all ${
              source === 'remotive'
                ? 'bg-[#00f5a0] text-black shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Remotive API
          </button>
          <button
            onClick={() => setSource('arbeitnow')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all ${
              source === 'arbeitnow'
                ? 'bg-[#00f5a0] text-black shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                : 'text-zinc-400 hover:text-white'
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
            <div key={i} className="h-56 bg-[#081210] rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-[#081210] rounded-3xl border border-rose-900/50">
          <p className="text-rose-400 font-semibold mb-2">Failed to fetch live job postings</p>
          <p className="text-zinc-400 text-xs mb-4">{error.message}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-[#00f5a0] text-black rounded-xl text-xs font-bold uppercase">
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
                className="p-5 rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/15 hover:border-[#00f5a0]/40 transition-all flex flex-col justify-between space-y-4 group shadow-xl hover:shadow-[0_0_25px_rgba(0,245,160,0.15)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-10 h-10 rounded-xl object-contain bg-[#040908] p-1 border border-white/10"
                          onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#040908] border border-[#00f5a0]/30 text-[#00f5a0] font-bold text-base flex items-center justify-center">
                          {job.company ? job.company.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-xs text-zinc-400">{job.company}</h4>
                        <h3 className="font-extrabold text-sm text-white line-clamp-1 group-hover:text-[#00f5a0] transition-colors">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {job.jobUrl && (
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-[#00f5a0] p-1 rounded-lg hover:bg-[#040908]"
                        title="View external job post"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-zinc-500" /> {job.location || 'Remote'}
                    </span>
                    {(job.salaryMin || job.salaryMax) && (
                      <span className="flex items-center gap-1 text-[#00f5a0] font-bold">
                        <FiDollarSign /> {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {job.description || 'No detailed description available.'}
                  </p>

                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] font-semibold bg-[#040908] text-zinc-300 rounded-lg border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewJob(job)}
                    className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider"
                  >
                    Preview Details
                  </button>

                  <button
                    onClick={() => handleImport(job)}
                    disabled={imported || importJobMutation.isPending}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                      imported
                        ? 'bg-[#040908] text-[#00f5a0] border border-[#00f5a0]/30 cursor-default'
                        : 'bg-[#00f5a0] hover:bg-[#00d294] text-black shadow-[0_0_15px_rgba(0,245,160,0.3)]'
                    }`}
                  >
                    {imported ? (
                      <>
                        <FiCheck className="w-3.5 h-3.5" />
                        <span>In Wishlist</span>
                      </>
                    ) : (
                      <>
                        <FiPlus className="w-3.5 h-3.5 text-black" />
                        <span>Import Job</span>
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
                <img src={previewJob.companyLogo} alt={previewJob.company} className="w-12 h-12 rounded-xl bg-[#040908] p-1 border border-white/10" />
              )}
              <div>
                <h3 className="font-bold text-lg text-white">{previewJob.title}</h3>
                <p className="text-sm text-[#00f5a0] font-semibold">{previewJob.company} • {previewJob.location}</p>
              </div>
            </div>

            <div className="p-4 bg-[#040908] rounded-2xl border border-[#00f5a0]/20 max-h-80 overflow-y-auto custom-scrollbar text-xs text-zinc-300 leading-relaxed space-y-2">
              <h4 className="font-bold text-white text-sm">Description</h4>
              <p className="whitespace-pre-wrap">{previewJob.description}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setPreviewJob(null)}
                className="px-4 py-2 bg-[#040908] text-zinc-400 hover:text-white rounded-xl text-xs font-bold uppercase"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleImport(previewJob);
                  setPreviewJob(null);
                }}
                disabled={isAlreadyImported(previewJob)}
                className="px-5 py-2 bg-[#00f5a0] hover:bg-[#00d294] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,245,160,0.3)]"
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
