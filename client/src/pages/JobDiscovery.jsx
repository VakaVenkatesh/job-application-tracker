import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobs, useGlobalJobStats } from '../hooks/useJobs';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
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
  FiShield,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
  FiCheck
} from 'react-icons/fi';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { JOB_TYPE_LABELS } from '../utils/constants';

const DOMAIN_CATEGORIES = [
  'all',
  'Engineering',
  'Frontend',
  'Backend',
  'AI & Data',
  'Mobile',
  'DevOps & Cloud',
  'Security & Web3'
];

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

  const handleApply = (job) => {
    // Record application in DB and track in pipeline
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

  const handleCategorySelect = (cat) => {
    setFilters(prev => ({
      ...prev,
      category: cat,
      page: 1
    }));
  };

  const handleLocationSelect = (loc) => {
    setFilters(prev => ({
      ...prev,
      location: loc,
      page: 1
    }));
  };

  const startIndex = (currentPage - 1) * filters.limit + 1;
  const endIndex = Math.min(currentPage * filters.limit, total);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#081512] via-[#0b1d19] to-[#050e0c] border border-[#00f5a0]/25 p-8 md:p-10 overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#00f5a0]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f5a0]/10 border border-[#00f5a0]/30 text-xs font-mono text-[#00f5a0]">
              <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-ping" />
              70+ CURATED TECH OPPORTUNITIES & FREELANCE GIGS
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Verified Open Jobs & Roles Hub
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Explore 70+ curated roles across top tech giants, global unicorns, and premier Indian product leaders. Applying to any role automatically syncs with your pipeline tracker, analytics dashboard, and skill gap radar.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                🔒 Predefined Verified Postings Active
              </span>
              <span>•</span>
              <span className="text-zinc-500">Admin posting portal coming in next update</span>
            </div>
          </div>

          {/* Quick Metrics from DB */}
          <div className="flex flex-wrap lg:flex-col gap-3">
            <div className="px-5 py-3 rounded-2xl bg-[#040908]/90 border border-[#00f5a0]/20 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#00f5a0]/15 text-[#00f5a0]">
                <FiBriefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-mono">CURATED OPENINGS</p>
                <p className="text-xl font-black text-white font-mono">{globalStats?.totalJobs || total || '70+'}</p>
              </div>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-[#040908]/90 border border-[#00f5a0]/20 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#38bdf8]/15 text-[#38bdf8]">
                <FiUsers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-mono">APPLICATIONS LOGGED</p>
                <p className="text-xl font-black text-white font-mono">{globalStats?.totalApplications || '0'}</p>
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
              placeholder="Search by role, company, or tech stack (e.g. Google, React, Python, Remote)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#08100e] border border-white/10 text-white placeholder-gray-500 text-sm focus:border-[#00f5a0] focus:outline-none transition-all shadow-inner"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '', page: 1 })}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-white cursor-pointer"
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
              className="w-full px-4 py-3 rounded-2xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none transition-all cursor-pointer"
            >
              <option value="all">All Employment Types</option>
              <option value="full_time">Full Time</option>
              <option value="freelance">Freelance Gigs</option>
              <option value="contract">Contract Roles</option>
              <option value="internship">Internships</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div className="md:col-span-3">
            <select
              value={filters.experienceLevel}
              onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value, page: 1 })}
              className="w-full px-4 py-3 rounded-2xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none transition-all cursor-pointer"
            >
              <option value="all">All Experience Levels</option>
              <option value="fresher">Fresher / Graduate / Intern</option>
              <option value="junior">Junior (1-3 yrs)</option>
              <option value="mid">Mid Level (3-5 yrs)</option>
              <option value="senior">Senior (5+ yrs)</option>
              <option value="lead">Lead / Staff / Principal</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Domain Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-gray-500 font-mono flex items-center gap-1 mr-1">
            <FiFilter className="w-3 h-3" /> Domains:
          </span>
          {DOMAIN_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                filters.category === cat
                  ? 'bg-[#00f5a0] text-black font-bold shadow-[0_0_12px_rgba(0,245,160,0.3)]'
                  : 'bg-[#08100e] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat === 'all' ? 'All Roles' : cat}
            </button>
          ))}

          <span className="text-xs text-gray-600 font-mono mx-1">|</span>

          {/* Location Quick Filters */}
          <button
            onClick={() => handleLocationSelect(filters.location === 'Remote' ? 'all' : 'Remote')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              filters.location === 'Remote'
                ? 'bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-[#08100e] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            🌍 Remote Only
          </button>
          <button
            onClick={() => handleLocationSelect(filters.location === 'India' ? 'all' : 'India')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              filters.location === 'India'
                ? 'bg-amber-400 text-black font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-[#08100e] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            🇮🇳 India Tech Hubs
          </button>
        </div>

        {/* Results Count & Page Limit Header */}
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 pt-2 border-t border-white/5">
          <div>
            Showing <span className="text-white font-bold">{total > 0 ? startIndex : 0} - {endIndex}</span> of <span className="text-[#00f5a0] font-bold">{total}</span> opportunities
          </div>
          <div className="flex items-center gap-2">
            <span>Per page:</span>
            {[24, 48, 100].map(size => (
              <button
                key={size}
                onClick={() => setFilters(prev => ({ ...prev, limit: size, page: 1 }))}
                className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                  filters.limit === size
                    ? 'bg-[#00f5a0]/20 text-[#00f5a0] border border-[#00f5a0]/40 font-bold'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {size === 100 ? 'All' : size}
              </button>
            ))}
          </div>
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
            Try adjusting your search terms or clearing filters to explore all 70+ verified opportunities.
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
            className="px-5 py-2.5 rounded-xl bg-[#00f5a0]/20 text-[#00f5a0] border border-[#00f5a0]/30 hover:bg-[#00f5a0]/30 text-xs font-mono cursor-pointer"
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
            const hasApplied = job.hasApplied;

            return (
              <motion.div
                key={job._id}
                whileHover={{ y: -4, borderColor: 'rgba(0, 245, 160, 0.4)' }}
                onClick={() => setSelectedJob(job)}
                className={`group relative rounded-2xl bg-[#08100e] border ${
                  hasApplied ? 'border-[#00f5a0]/40 shadow-[0_0_20px_rgba(0,245,160,0.08)]' : 'border-white/10'
                } hover:border-[#00f5a0]/40 p-5 flex flex-col justify-between cursor-pointer transition-all shadow-lg hover:shadow-[0_10px_30px_rgba(0,245,160,0.1)]`}
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

                    {/* Applied Badge or Match Score Badge */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {hasApplied && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#00f5a0] text-black shadow-[0_0_10px_rgba(0,245,160,0.4)] flex items-center gap-1">
                          <FiCheck className="w-3 h-3" /> APPLIED
                        </span>
                      )}
                      {matchScore !== null ? (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border ${
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
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                          {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                        </span>
                      )}
                    </div>
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
                    <span className="text-amber-400/90 text-[11px] font-mono flex items-center gap-1 truncate max-w-[170px]">
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      Missing: {job.missingSkills.slice(0, 2).join(', ')}
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
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                      hasApplied
                        ? 'bg-[#00f5a0]/20 text-[#00f5a0] border border-[#00f5a0]/40 hover:bg-[#00f5a0] hover:text-black'
                        : 'bg-[#00f5a0]/15 hover:bg-[#00f5a0] text-[#00f5a0] hover:text-black group-hover:bg-[#00f5a0] group-hover:text-black'
                    }`}
                  >
                    {hasApplied ? 'Tracked' : 'Apply Now'} <FiExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <button
            onClick={() => setFilters(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08100e] border border-white/10 text-xs font-mono text-gray-300 hover:text-white hover:border-[#00f5a0]/40 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <FiChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pages }).map((_, idx) => {
              const p = idx + 1;
              return (
                <button
                  key={p}
                  onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    currentPage === p
                      ? 'bg-[#00f5a0] text-black shadow-[0_0_12px_rgba(0,245,160,0.3)]'
                      : 'bg-[#08100e] text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setFilters(prev => ({ ...prev, page: Math.min(prev.page + 1, pages) }))}
            disabled={currentPage === pages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08100e] border border-white/10 text-xs font-mono text-gray-300 hover:text-white hover:border-[#00f5a0]/40 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            Next <FiChevronRight className="w-4 h-4" />
          </button>
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

              {/* Match Gauge or Applied Status */}
              <div className="flex items-center gap-3">
                {selectedJob.hasApplied && (
                  <div className="bg-[#00f5a0]/15 px-3 py-2 rounded-xl border border-[#00f5a0]/40 flex items-center gap-2 text-[#00f5a0] text-xs font-mono font-bold">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Tracked in Pipeline</span>
                  </div>
                )}
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
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div>
                {selectedJob.hasApplied ? (
                  <span className="text-xs font-mono text-[#00f5a0] flex items-center gap-1.5">
                    <FiCheckCircle className="w-4 h-4" /> Application tracked in your pipeline!
                  </span>
                ) : (
                  <span className="text-xs font-mono text-gray-400">
                    Applying records this in your personal tracker.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleApply(selectedJob)}
                  disabled={isApplying}
                  className="px-6 py-2.5 rounded-xl bg-[#00f5a0] hover:bg-[#00d88d] text-black font-bold text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <span>{selectedJob.hasApplied ? 'Open Job Portal Again' : 'Apply On Original Job Page'}</span>
                  <FiExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
