import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiBriefcase,
  FiGlobe,
  FiMapPin,
  FiDollarSign,
  FiArrowRight,
  FiColumns,
  FiPieChart,
  FiMail,
  FiZap,
  FiExternalLink,
  FiTerminal,
  FiCpu,
  FiActivity,
  FiShield,
  FiCheck,
  FiPlus
} from 'react-icons/fi';
import { useFetchLiveJobs } from '../hooks/useSync';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuth } from '../context/AuthContext';

export const LandingPage = ({ onOpenAuthModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const { isAuthenticated } = useAuth();
  const { data: jobs = [], isLoading, isError } = useFetchLiveJobs();

  // Clock for OS status dock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter public jobs
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

  const handleAuthTrigger = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal();
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-mono antialiased selection:bg-zinc-800 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Background Grid Accent */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] z-0" />

      {/* Floating OS Utility Dock / Navigation */}
      <header className="sticky top-4 z-50 px-4 max-w-6xl mx-auto w-full">
        <div className="bg-zinc-950/90 backdrop-blur-md border border-zinc-800/90 rounded-2xl p-2.5 px-5 flex items-center justify-between shadow-2xl shadow-black/80">
          {/* Brand Mark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              <FiTerminal className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wider text-white">JOBTRACK</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700">
                  v2.0_OS
                </span>
              </div>
              <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest hidden sm:block">
                Tactile Application & Job Search Engine
              </p>
            </div>
          </div>

          {/* OS Diagnostics & System Status */}
          <div className="hidden lg:flex items-center gap-4 text-[11px] text-zinc-400 border-x border-zinc-800/80 px-6">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-zinc-200 font-bold">[SYS: ONLINE]</span>
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">{currentTime || 'SYS.CLOCK'}</span>
          </div>

          {/* Dock Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAuthTrigger}
              className="px-3.5 py-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all"
            >
              [SIGN IN]
            </button>
            <button
              onClick={handleAuthTrigger}
              className="px-4 py-1.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md shadow-white/10"
            >
              INITIALIZE WORKSPACE
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-16 max-w-5xl mx-auto text-center">
        {/* System Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs mb-8 shadow-inner">
          <FiActivity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-zinc-400 uppercase tracking-wider text-[11px]">
            TACTILE OPERATING SYSTEM // JOB PIPELINE MANAGEMENT
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-6 uppercase">
          ENGINEER YOUR CAREER PIPELINE WITH <span className="text-zinc-400 underline decoration-zinc-700 underline-offset-8">PRECISION</span>.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-mono">
          A tactile operating system designed for modern job seekers. Search verified job openings, manage application stages, log recruiter contacts, and analyze interview velocity.
        </p>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a
            href="#public-jobs"
            className="w-full sm:w-auto px-7 py-3.5 bg-white text-black font-extrabold text-xs tracking-wider uppercase rounded-xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2"
          >
            <FiSearch className="w-4 h-4" />
            <span>[SEARCH PUBLIC JOB LISTINGS]</span>
          </a>
          <button
            onClick={handleAuthTrigger}
            className="w-full sm:w-auto px-7 py-3.5 bg-zinc-900 text-zinc-200 font-extrabold text-xs tracking-wider uppercase rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all flex items-center justify-center gap-2"
          >
            <span>[AUTHENTICATE WORKSPACE]</span>
            <FiArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Modular System Grid / Project Cells (Sublevel Studio Cell Architecture) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
          {/* Cell 01 */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-600 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">CELL 01 //</span>
              <FiColumns className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-sm uppercase mb-1">KANBAN PIPELINE</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Drag-and-drop state transitions across Wishlist, Applied, Interviewing, and Offer columns.
            </p>
          </div>

          {/* Cell 02 */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-600 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">CELL 02 //</span>
              <FiPieChart className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-sm uppercase mb-1">REALTIME ANALYTICS</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Live response rates, response velocity metrics, and stage breakdown visualizations.
            </p>
          </div>

          {/* Cell 03 */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-600 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">CELL 03 //</span>
              <FiMail className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-sm uppercase mb-1">RECRUITER LOGS</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Log recruiter contacts, interview notes, and cold email follow-up schedules per application.
            </p>
          </div>

          {/* Cell 04 */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-600 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">CELL 04 //</span>
              <FiZap className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-sm uppercase mb-1">LIVE API DISCOVERY</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Automated ingestion from Remotive and Arbeitnow APIs with 1-click pipeline import.
            </p>
          </div>
        </div>
      </section>

      {/* Public Job Listings Section (Tactile OS Job Board - Naukri / Indeed Style) */}
      <section id="public-jobs" className="relative z-10 px-6 py-12 max-w-6xl mx-auto w-full flex-1">
        {/* Terminal Header */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                  05 // LIVE PUBLIC JOB BOARD
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                Browse verified openings. Sign in to save and track jobs directly in your MongoDB workspace.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setJobTypeFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  jobTypeFilter === 'all'
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                [ALL JOBS]
              </button>
              <button
                onClick={() => setJobTypeFilter('remote')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  jobTypeFilter === 'remote'
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                [REMOTE ONLY]
              </button>
            </div>
          </div>

          {/* Terminal Search Prompt */}
          <div className="mt-6 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-zinc-500 text-xs">
              <FiTerminal className="w-4 h-4 text-emerald-400" />
              <span className="text-zinc-600">[SEARCH] &gt;</span>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type role, company, or tech stack (e.g. React, Node, Frontend, Remote)..."
              className="w-full pl-32 pr-4 py-3 bg-black border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        {/* Job Cards Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-zinc-500 bg-zinc-950/60 rounded-2xl border border-zinc-800">
            <FiCpu className="w-6 h-6 animate-spin mx-auto mb-3 text-emerald-400" />
            <p className="text-xs uppercase tracking-widest">[INGESTING LIVE JOBS FROM APIS...]</p>
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-rose-400 bg-zinc-950 rounded-2xl border border-rose-900/50">
            <p className="text-xs">[ERROR] Failed to fetch live job listings. Please refresh.</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 bg-zinc-950 rounded-2xl border border-zinc-800">
            <p className="text-xs">[NO RESULTS] No listings found matching "{searchTerm}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.slice(0, 20).map((job, idx) => (
              <div
                key={job.externalId || idx}
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                        [{job.source || 'VERIFIED_API'}]
                      </span>
                      <h3 className="font-bold text-white text-sm mt-2 group-hover:text-emerald-400 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-semibold">{job.company}</p>
                    </div>

                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-9 h-9 rounded-lg object-contain bg-black p-1 border border-zinc-800 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300 shrink-0">
                        {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                      </div>
                    )}
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {job.location || 'Remote'}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <FiDollarSign className="w-3.5 h-3.5" />
                        {job.salary}
                      </span>
                    )}
                  </div>

                  {/* Tag Chips */}
                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.tags.slice(0, 4).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 text-[10px] bg-zinc-900 text-zinc-300 rounded border border-zinc-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
                  {job.jobUrl ? (
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                      <span>VIEW LINK</span>
                      <FiExternalLink className="w-3 h-3" />
                    </a>
                  ) : <div />}

                  <button
                    onClick={handleAuthTrigger}
                    className="px-3.5 py-1.5 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-white/5"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    <span>[TRACK THIS JOB]</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Terminal Contact / System CTA Close (Sublevel Studio Style) */}
      <section className="relative z-10 px-6 py-16 max-w-4xl mx-auto w-full text-center">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 text-left shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 border-b border-zinc-900 pb-3">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-[10px] text-zinc-500 ml-2 font-mono">06 // SYSTEM TERMINAL</span>
          </div>

          <div className="space-y-2 text-xs font-mono text-zinc-400 mb-6">
            <p className="text-emerald-400">$ jobtrack init --mode=production</p>
            <p className="text-zinc-500">&gt; Authenticating user workspace...</p>
            <p className="text-zinc-300">&gt; Status: Ready to track applications, manage recruiters, and accelerate response rates.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleAuthTrigger}
              className="w-full sm:w-auto px-6 py-3 bg-white text-black font-extrabold text-xs uppercase rounded-xl hover:bg-zinc-200 transition-all shadow-lg"
            >
              [INITIALIZE YOUR ACCOUNT NOW]
            </button>
            <button
              onClick={handleAuthTrigger}
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-extrabold text-xs uppercase rounded-xl hover:border-zinc-700 transition-all"
            >
              [SIGN IN]
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 px-6 py-8 bg-black text-center text-[11px] text-zinc-600 font-mono">
        <p>JOBTRACK // OS v2.0 — TACTILE APPLICATION PIPELINE & REALTIME JOB DISCOVERY</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};
