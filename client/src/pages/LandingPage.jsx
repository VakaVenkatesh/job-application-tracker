import React, { useState } from 'react';
import {
  FiSearch,
  FiBriefcase,
  FiGlobe,
  FiMapPin,
  FiDollarSign,
  FiArrowRight,
  FiCheckCircle,
  FiColumns,
  FiPieChart,
  FiMail,
  FiLock,
  FiZap,
  FiExternalLink
} from 'react-icons/fi';
import { useFetchLiveJobs } from '../hooks/useSync';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuth } from '../context/AuthContext';

export const LandingPage = ({ onOpenAuthModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const { data: jobs = [], isLoading, isError } = useFetchLiveJobs();

  // Filter jobs based on search term & job type
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.tags && job.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesType =
      jobTypeFilter === 'all' ||
      (job.jobType && job.jobType.toLowerCase().includes(jobTypeFilter.toLowerCase())) ||
      (jobTypeFilter === 'remote' && job.location?.toLowerCase().includes('remote'));

    return matchesSearch && matchesType;
  });

  const handleTrackClick = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal();
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
            <FiBriefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300">
              JobTrack AI
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Smart Job Search & Application Pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTrackClick}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={handleTrackClick}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
          >
            Create Free Account
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 text-center max-w-5xl mx-auto overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
          <FiZap className="w-4 h-4 text-amber-400" />
          <span>The All-in-One Job Search & Pipeline Suite</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-100 tracking-tight leading-tight mb-6">
          Find your dream job &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
            track every application
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Browse verified remote & tech job listings, organize your application stages on a visual Kanban board, log recruiter contacts, and boost your interview response rate.
        </p>

        {/* Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#public-jobs"
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
          >
            <FiSearch className="w-4 h-4" />
            <span>Browse Job Listings</span>
          </a>
          <button
            onClick={handleTrackClick}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to Track Applications</span>
            <FiArrowRight className="w-4 h-4 text-indigo-400" />
          </button>
        </div>

        {/* Feature Grid Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 w-fit mb-4">
              <FiColumns className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-200 mb-2">Visual Kanban Board</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag & drop applications between Wishlist, Applied, Screening, Interviewing, and Offer stages.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="p-3 bg-violet-500/10 rounded-xl text-violet-400 w-fit mb-4">
              <FiPieChart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-200 mb-2">Real-time Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitor your application response rate, weekly submission velocity, and interview metrics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 w-fit mb-4">
              <FiMail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-200 mb-2">Recruiter Contact Logs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log recruiter details, notes, and cold email follow-up dates directly on each application.
            </p>
          </div>
        </div>
      </section>

      {/* Public Job Board Section (Naukri / Indeed style) */}
      <section id="public-jobs" className="px-6 py-12 max-w-6xl mx-auto w-full flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <FiBriefcase className="w-6 h-6 text-indigo-400" />
              <span>Explore Verified Job Openings</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Browse live postings from Remotive & Arbeitnow APIs. Sign in to save any job directly to your personal tracking board.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setJobTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                jobTypeFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => setJobTypeFilter('remote')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                jobTypeFilter === 'remote'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Remote Only
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search job title, company, technology stack, or location (e.g., React, Python, Remote)..."
            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Job Listings Cards */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm">Fetching real-time job listings...</p>
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-sm text-rose-400">Failed to load public job listings. Please check back shortly.</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-sm">No job listings found matching "{searchTerm}". Try a different keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.slice(0, 20).map((job, idx) => (
              <div
                key={job.externalId || idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-indigo-500/5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                        {job.source || 'Verified Job'}
                      </span>
                      <h3 className="font-bold text-slate-100 text-base mt-1.5 group-hover:text-indigo-300 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400">{job.company}</p>
                    </div>

                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-10 h-10 rounded-xl object-contain bg-slate-950 p-1 border border-slate-800 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-300 shrink-0">
                        {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                      </div>
                    )}
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="w-3.5 h-3.5 text-slate-500" />
                      {job.location || 'Remote'}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <FiDollarSign className="w-3.5 h-3.5" />
                        {job.salary}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.tags.slice(0, 4).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 text-[11px] font-medium bg-slate-800 text-slate-300 rounded-md border border-slate-700/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {job.jobUrl ? (
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <span>View Listing</span>
                      <FiExternalLink className="w-3 h-3" />
                    </a>
                  ) : <div />}

                  <button
                    onClick={handleTrackClick}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    <span>Track This Job</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-8 bg-slate-950 text-center text-xs text-slate-500">
        <p>© 2026 JobTrack AI. Real-time Job Search & Application Tracker.</p>
      </footer>

      {/* Auth Modal Fallback */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};
