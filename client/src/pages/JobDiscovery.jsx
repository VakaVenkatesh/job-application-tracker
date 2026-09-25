import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobs, useGlobalJobStats } from '../hooks/useJobs';
import { useAuth } from '../context/AuthContext';
import {
  FiSearch,
  FiFilter,
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiExternalLink,
  FiCheckCircle,
  FiAlertCircle,
  FiZap,
  FiUsers,
  FiClock,
  FiPlus,
  FiTag,
  FiShield,
  FiX
} from 'react-icons/fi';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { JOB_TYPE_LABELS } from '../utils/constants';

export default function JobDiscovery() {
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    jobType: 'all',
    experienceLevel: 'all',
    location: 'all',
    sort: 'newest',
    page: 1,
    limit: 24
  });

  const { jobs, total, pages, currentPage, isLoading, applyToJob, isApplying } = useJobs(filters);
  const { data: globalStats } = useGlobalJobStats();

  const [selectedJob, setSelectedJob] = useState(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  const handleApply = (job) => {
    // Record application in DB
    applyToJob({ jobId: job._id });
    // Open external URL in new tab
    if (job.jobUrl) {
      window.open(job.jobUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getCompanyLogo = (job) => {
    if (job.companyLogo) return job.companyLogo;
    const clean = (job.company || 'tech').toLowerCase().replace(/[^a-z0-9]/g, '');
    return `https://logo.clearbit.com/${clean}.com`;
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#081512] via-[#0b1d19] to-[#050e0c] border border-[#00f5a0]/25 p-8 md:p-10 overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#00f5a0]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f5a0]/10 border border-[#00f5a0]/30 text-xs font-mono text-[#00f5a0]">
              <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-ping" />
              LIVE OPPORTUNITIES & FREELANCE CONTRACTS
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Verified Open Jobs & Freelancing Hub
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Explore open roles across top tech companies and high-paying freelance gigs. Click any card to inspect skill relevance and discover missing keywords before you apply.
            </p>
          </div>

          {/* Quick Metrics from DB */}
          <div className="flex flex-wrap lg:flex-col gap-3">
            <div className="px-5 py-3 rounded-2xl bg-[#040908]/90 border border-[#00f5a0]/20 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#00f5a0]/15 text-[#00f5a0]">
                <FiBriefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-mono">ACTIVE POSTINGS</p>
                <p className="text-xl font-black text-white font-mono">{globalStats?.totalJobs || total || '120+'}</p>
              </div>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-[#040908]/90 border border-[#00f5a0]/20 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#38bdf8]/15 text-[#38bdf8]">
                <FiUsers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-mono">APPLICATIONS LOGGED</p>
                <p className="text-xl font-black text-white font-mono">{globalStats?.totalApplications || '540+'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Matrix */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Keyword Search Bar */}
          <div className="md:col-span-6 relative">
            <FiSearch className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              placeholder="Search by role, company, or tech stack (e.g. React, Python, Remote)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#08100e] border border-white/10 text-white placeholder-gray-500 text-sm focus:border-[#00f5a0] focus:outline-none transition-all shadow-inner"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '', page: 1 })}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-white"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Job Type Filter */}
          <div className="md:col-span-3">
            <select
              value={filters.jobType}
              onChange={(e) => setFilters({ ...filters, jobType: e.target.value, page: 1 })}
              className="w-full px-4 py-3 rounded-2xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none transition-all"
            >
              <option value="all">All Employment Types</option>
              <option value="full_time">Full Time</option>
              <option value="freelance">Freelance Gigs</option>
              <option value="contract">Contract</option>
              <option value="internship">Internships</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div className="md:col-span-3">
            <select
              value={filters.experienceLevel}
              onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value, page: 1 })}
              className="w-full px-4 py-3 rounded-2xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none transition-all"
            >
              <option value="all">All Experience Levels</option>
              <option value="fresher">Fresher / Graduate</option>
              <option value="junior">Junior (1-3 yrs)</option>
              <option value="mid">Mid Level (3-5 yrs)</option>
              <option value="senior">Senior (5+ yrs)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-gray-500 font-mono flex items-center gap-1 mr-1">
            <FiFilter className="w-3 h-3" /> Quick Filter:
          </span>
          {['all', 'Remote', 'Engineering', 'Frontend', 'Backend', 'AI & Data', 'Mobile'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters({
                ...filters,
                location: cat === 'Remote' ? (filters.location === 'Remote' ? 'all' : 'Remote') : filters.location,
                category: cat !== 'Remote' ? (cat === 'all' ? 'all' : cat) : filters.category,
                page: 1
              })}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                (cat === 'Remote' && filters.location === 'Remote') || (cat !== 'Remote' && filters.category === cat)
                  ? 'bg-[#00f5a0] text-black font-bold shadow-[0_0_12px_rgba(0,245,160,0.3)]'
                  : 'bg-[#08100e] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat === 'all' ? 'All Domains' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-[#08100e]/60 border border-white/5 animate-pulse p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-white/10 rounded w-full" />
              <div className="h-3 bg-white/10 rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl bg-[#08100e] border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#00f5a0]/10 border border-[#00f5a0]/20 flex items-center justify-center mx-auto text-[#00f5a0]">
            <FiSearch className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No jobs matched your current filters</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Try adjusting your search terms or clearing some filters to explore more verified postings.
          </p>
          <button
            onClick={() => setFilters({
              search: '',
              category: 'all',
              jobType: 'all',
              experienceLevel: 'all',
              location: 'all',
              sort: 'newest',
              page: 1,
              limit: 24
            })}
            className="px-5 py-2.5 rounded-xl bg-[#00f5a0]/20 text-[#00f5a0] border border-[#00f5a0]/30 hover:bg-[#00f5a0]/30 text-xs font-mono"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        /* Job Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => {
            const hasMissingSkills = job.missingSkills && job.missingSkills.length > 0;
            const matchScore = job.matchScore !== null ? job.matchScore : null;

            return (
              <motion.div
                key={job._id}
                whileHover={{ y: -4, borderColor: 'rgba(0, 245, 160, 0.4)' }}
                onClick={() => setSelectedJob(job)}
                className="group relative rounded-2xl bg-[#08100e] border border-white/10 hover:border-[#00f5a0]/40 p-5 flex flex-col justify-between cursor-pointer transition-all shadow-lg hover:shadow-[0_10px_30px_rgba(0,245,160,0.1)]"
              >
                {/* Top Card: Company Logo & Basic Meta */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#040807] border border-white/10 p-1.5 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        <img
                          src={getCompanyLogo(job)}
                          alt={job.company}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=00f5a0&color=000&bold=true`;
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-gray-400 group-hover:text-gray-300 transition-colors">
                          {job.company}
                        </span>
                        <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-[#00f5a0] transition-colors">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {/* Match Score Badge (if user logged in) */}
                    {matchScore !== null ? (
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border ${
                          matchScore >= 80
                            ? 'bg-[#00f5a0]/15 text-[#00f5a0] border-[#00f5a0]/40'
                            : matchScore >= 50
                            ? 'bg-amber-400/15 text-amber-400 border-amber-400/40'
                            : 'bg-red-400/15 text-red-400 border-red-400/40'
                        }`}
                      >
                        {matchScore}% Match
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                        {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                      </span>
                    )}
                  </div>

                  {/* Location & Compensation */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono mb-4">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="w-3.5 h-3.5 text-[#00f5a0]" /> {job.location || 'Remote'}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1 text-gray-300">
                        <FiDollarSign className="w-3.5 h-3.5 text-cyan-400" /> {job.salary}
                      </span>
                    )}
                  </div>

                  {/* Required Tech Skills Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(job.requiredSkills || []).slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-[#040807] border border-white/10 text-gray-300 text-[11px] font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                    {(job.requiredSkills || []).length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md text-gray-500 text-[10px] font-mono">
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Card Footer: Missing Skills Alert or Status */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  {isAuthenticated && hasMissingSkills ? (
                    <span className="text-amber-400/90 text-[11px] font-mono flex items-center gap-1 truncate">
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      Missing: {job.missingSkills.slice(0, 2).join(', ')}
                      {job.missingSkills.length > 2 && ` +${job.missingSkills.length - 2}`}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-[11px] font-mono flex items-center gap-1">
                      <FiUsers className="w-3.5 h-3.5 text-gray-400" /> {job.applicantCount || 0} Applicants
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(job);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#00f5a0]/15 hover:bg-[#00f5a0] text-[#00f5a0] hover:text-black font-bold text-xs font-mono transition-all flex items-center gap-1.5 group-hover:bg-[#00f5a0] group-hover:text-black"
                  >
                    Apply Now <FiExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ================= DETAILED JOB OPPORTUNITY MODAL ================= */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob ? `${selectedJob.title} @ ${selectedJob.company}` : ''}
        size="lg"
      >
        {selectedJob && (
          <div className="space-y-6">
            {/* Top Modal Header with Logo & Match Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#040807] p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#08100e] border border-white/10 p-2 flex items-center justify-center shrink-0">
                  <img
                    src={getCompanyLogo(selectedJob)}
                    alt={selectedJob.company}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedJob.company)}&background=00f5a0&color=000&bold=true`;
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedJob.title}</h3>
                  <p className="text-xs text-gray-400 font-mono flex items-center gap-2">
                    <span>{selectedJob.company}</span>
                    <span>•</span>
                    <span className="text-[#00f5a0]">{selectedJob.location || 'Remote'}</span>
                  </p>
                </div>
              </div>

              {/* Match Gauge */}
              {selectedJob.matchScore !== null && (
                <div className="flex items-center gap-3 bg-[#08100e] px-4 py-2.5 rounded-xl border border-[#00f5a0]/30">
                  <FiZap className="w-5 h-5 text-[#00f5a0]" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-mono">YOUR RELEVANCE</p>
                    <p className="text-lg font-black text-[#00f5a0] font-mono leading-none">
                      {selectedJob.matchScore}% Match
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* KEY METRICS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#08100e] border border-white/5">
                <p className="text-gray-500 text-[10px]">COMPENSATION</p>
                <p className="text-white font-semibold mt-0.5">{selectedJob.salary || 'Competitive'}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#08100e] border border-white/5">
                <p className="text-gray-500 text-[10px]">JOB TYPE</p>
                <p className="text-cyan-400 font-semibold mt-0.5 capitalize">{selectedJob.jobType?.replace('_', ' ')}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#08100e] border border-white/5">
                <p className="text-gray-500 text-[10px]">EXPERIENCE</p>
                <p className="text-purple-400 font-semibold mt-0.5 capitalize">{selectedJob.experienceLevel || 'Any'}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#08100e] border border-white/5">
                <p className="text-gray-500 text-[10px]">APPLICANTS</p>
                <p className="text-[#00f5a0] font-semibold mt-0.5">{selectedJob.applicantCount || 0} Registered</p>
              </div>
            </div>

            {/* SKILL ANALYSIS BREAKDOWN */}
            <div className="p-4 rounded-2xl bg-[#08100e] border border-[#00f5a0]/20 space-y-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FiShield className="w-4 h-4 text-[#00f5a0]" /> Skill Match & Gap Breakdown
              </h4>

              {/* Matched Skills */}
              {selectedJob.matchedSkills && selectedJob.matchedSkills.length > 0 && (
                <div>
                  <p className="text-[11px] text-gray-400 font-mono mb-1.5 flex items-center gap-1 text-[#00f5a0]">
                    <FiCheckCircle className="w-3.5 h-3.5" /> Skills You Possess ({selectedJob.matchedSkills.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md bg-[#00f5a0]/15 border border-[#00f5a0]/40 text-[#00f5a0] text-xs font-mono"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {selectedJob.missingSkills && selectedJob.missingSkills.length > 0 && (
                <div>
                  <p className="text-[11px] text-gray-400 font-mono mb-1.5 flex items-center gap-1 text-amber-400">
                    <FiAlertCircle className="w-3.5 h-3.5" /> Missing Skills To Prepare For ({selectedJob.missingSkills.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.missingSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md bg-amber-400/15 border border-amber-400/40 text-amber-400 text-xs font-mono"
                      >
                        ! {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!isAuthenticated && (
                <p className="text-xs text-gray-400 font-mono italic">
                  💡 Sign in and fill your Profile Skills to automatically see which keywords you have or are missing!
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">Role Description</h4>
              <div className="p-4 rounded-2xl bg-[#08100e] border border-white/5 text-gray-300 text-sm leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                {selectedJob.description || 'No detailed description provided by the recruiter.'}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-mono transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleApply(selectedJob)}
                disabled={isApplying}
                className="px-6 py-2.5 rounded-xl bg-[#00f5a0] hover:bg-[#00d88d] text-black font-bold text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all active:scale-95 disabled:opacity-50"
              >
                <span>Apply On Original Job Page</span>
                <FiExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
