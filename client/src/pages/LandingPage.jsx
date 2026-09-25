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
  FiZap,
  FiExternalLink,
  FiShare2,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiPlus,
  FiLayers,
  FiShield,
  FiCpu
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
    <div className="min-h-screen bg-[#040908] text-zinc-100 font-sans antialiased selection:bg-[#00f5a0] selection:text-black flex flex-col relative overflow-x-hidden">
      {/* Background Mint Radial Glowing Orbs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#00f5a0]/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#00d294]/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Floating Vertical Social / Action Sidebar (Exact Match to Template Image) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-4 p-3 bg-[#081210]/80 backdrop-blur-md border border-[#00f5a0]/20 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          className="p-2.5 text-zinc-400 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10 rounded-xl transition-all"
          title="LinkedIn"
        >
          <FiLinkedin className="w-4 h-4" />
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="p-2.5 text-zinc-400 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10 rounded-xl transition-all"
          title="GitHub"
        >
          <FiGithub className="w-4 h-4" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noreferrer"
          className="p-2.5 text-zinc-400 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10 rounded-xl transition-all"
          title="Twitter"
        >
          <FiTwitter className="w-4 h-4" />
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Page URL copied to clipboard!');
          }}
          className="p-2.5 text-zinc-400 hover:text-[#00f5a0] hover:bg-[#00f5a0]/10 rounded-xl transition-all"
          title="Share Page"
        >
          <FiShare2 className="w-4 h-4" />
        </button>
      </div>

      {/* Top Header Navigation Bar (Exact Match to Template Image) */}
      <header className="relative z-30 px-6 lg:px-12 py-5 flex items-center justify-between border-b border-white/5 max-w-7xl mx-auto w-full">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f5a0] to-[#00d294] flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(0,245,160,0.4)]">
            <FiBriefcase className="w-5 h-5 text-black" />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">
            JOBTRACK<span className="text-[#00f5a0]">.AI</span>
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#overview" className="hover:text-[#00f5a0] transition-colors">Overview</a>
          <a href="#features" className="hover:text-[#00f5a0] transition-colors">Features</a>
          <a href="#public-jobs" className="hover:text-[#00f5a0] transition-colors">Live Jobs</a>
          <a href="#about" className="hover:text-[#00f5a0] transition-colors">About</a>
        </nav>

        {/* Launch App / Sign In Button */}
        <button
          onClick={handleAuthTrigger}
          className="px-6 py-2.5 bg-[#00f5a0] hover:bg-[#00d294] text-black font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_0_25px_rgba(0,245,160,0.4)] hover:scale-105 active:scale-95"
        >
          Launch App
        </button>
      </header>

      {/* Hero Section (Matching Reference Template Layout) */}
      <section id="overview" className="relative z-20 px-6 lg:px-12 py-12 lg:py-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Rotating 3D Cyberpunk Job Asset (Replacing Monkey Face) */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient Backlight Aura */}
            <div className="absolute w-[320px] h-[320px] rounded-full bg-[#00f5a0]/20 blur-[80px] pointer-events-none animate-pulse" />
            
            {/* 3D Rotating & Floating Wrapper */}
            <div className="relative w-full max-w-[420px] aspect-square perspective-1000">
              <div className="w-full h-full preserve-3d animate-3d-rotate animate-3d-float cursor-pointer hover:pause">
                <img
                  src="/cyberpunk_job_3d.jpg"
                  alt="3D Holographic Cyberpunk Job Core"
                  className="w-full h-full object-contain rounded-3xl shadow-[0_0_50px_rgba(0,245,160,0.35)] border border-[#00f5a0]/30"
                />
              </div>

              {/* Status HUD Floating Tag */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#081210]/90 backdrop-blur-md border border-[#00f5a0]/30 rounded-2xl flex items-center gap-2 shadow-2xl text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-ping" />
                <span className="text-zinc-200 font-bold">3D CORE // ACTIVE ROTATION</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Content (Matching Template Typography) */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Explore <br />
              <span className="text-gradient-mint">Next-Gen Job Tracking</span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Next-Gen Job Tracking simplifies managing, organizing, and accelerating your career application pipeline using automated AI sync, recruiter logs, and real-time response analytics.
            </p>

            {/* Sub-Card Widget (Matching Template Picture Pill) */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#081210]/80 border border-[#00f5a0]/20 backdrop-blur-md flex items-center gap-4 max-w-xl shadow-xl hover:border-[#00f5a0]/40 transition-all">
              <div className="w-20 h-20 rounded-2xl bg-black/60 border border-[#00f5a0]/30 overflow-hidden shrink-0 flex items-center justify-center p-1">
                <img
                  src="/cyberpunk_job_3d.jpg"
                  alt="Mini 3D Core"
                  className="w-full h-full object-contain animate-spin-3d"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#00f5a0] uppercase tracking-wider">AI Protocol Powered</span>
                <h4 className="font-bold text-white text-base mt-0.5">
                  AI Protocol-Premier Career Tracking
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                  Automated Kanban pipeline, recruiter cold-email logging, and live job aggregation.
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={handleAuthTrigger}
                className="px-8 py-3.5 bg-[#00f5a0] hover:bg-[#00d294] text-black font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_0_30px_rgba(0,245,160,0.4)] hover:scale-105"
              >
                Get Started Free
              </button>
              <a
                href="#public-jobs"
                className="px-6 py-3.5 bg-[#081210] hover:bg-[#0c1a17] text-zinc-300 hover:text-white font-bold text-xs tracking-wider uppercase rounded-xl border border-[#00f5a0]/20 transition-all flex items-center gap-2"
              >
                <span>Browse Jobs</span>
                <FiArrowRight className="text-[#00f5a0]" />
              </a>
            </div>
          </div>
        </div>

        {/* Feature Highlights Row (Matching Bottom 3 Feature Pills in Reference Image) */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {/* Feature Card 1 */}
          <div className="p-6 rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/15 hover:border-[#00f5a0]/40 transition-all glass-panel-mint-hover">
            <div className="w-12 h-12 rounded-2xl bg-[#00f5a0]/10 border border-[#00f5a0]/30 flex items-center justify-center text-[#00f5a0] mb-4 glow-mint">
              <FiColumns className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white text-lg mb-2">Multi-Stage Pipeline</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Organize job applications across Wishlist, Applied, Screening, Interviewing, and Offer stages with visual drag-and-drop.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="p-6 rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/15 hover:border-[#00f5a0]/40 transition-all glass-panel-mint-hover">
            <div className="w-12 h-12 rounded-2xl bg-[#00f5a0]/10 border border-[#00f5a0]/30 flex items-center justify-center text-[#00f5a0] mb-4 glow-mint">
              <FiPieChart className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white text-lg mb-2">Realtime Analytics</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Track response rates, interview velocity, and weekly application timelines powered by MongoDB serverless data streams.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="p-6 rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/15 hover:border-[#00f5a0]/40 transition-all glass-panel-mint-hover">
            <div className="w-12 h-12 rounded-2xl bg-[#00f5a0]/10 border border-[#00f5a0]/30 flex items-center justify-center text-[#00f5a0] mb-4 glow-mint">
              <FiZap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white text-lg mb-2">Live API Job Sync</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Fetch verified remote and tech job listings from Remotive & Arbeitnow APIs with 1-click import into your personal tracker.
            </p>
          </div>
        </div>
      </section>

      {/* Public Job Listings Section (Naukri / Indeed style - Formatted in Dark Mint Glow Aesthetic) */}
      <section id="public-jobs" className="relative z-20 px-6 lg:px-12 py-12 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/20 mb-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#00f5a0]/10 text-[#00f5a0] text-xs font-bold border border-[#00f5a0]/20">
                LIVE JOB BOARD // NAUKRI & REMOTIVE AGGREGATOR
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Discover Verified Openings
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Browse public listings in real-time. Sign in to save any opening into your personal MongoDB tracking workspace.
              </p>
            </div>

            {/* Filter Toggle Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setJobTypeFilter('all')}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
                  jobTypeFilter === 'all'
                    ? 'bg-[#00f5a0] text-black shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                    : 'bg-[#040908] text-zinc-400 border border-white/10 hover:text-white'
                }`}
              >
                All Jobs
              </button>
              <button
                onClick={() => setJobTypeFilter('remote')}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
                  jobTypeFilter === 'remote'
                    ? 'bg-[#00f5a0] text-black shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                    : 'bg-[#040908] text-zinc-400 border border-white/10 hover:text-white'
                }`}
              >
                Remote Only
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="mt-6 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00f5a0] w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search job title, company name, location, or tech stack (e.g. React, Python, Full Stack)..."
              className="w-full pl-12 pr-4 py-3.5 bg-[#040908] border border-[#00f5a0]/30 rounded-2xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#00f5a0] focus:ring-1 focus:ring-[#00f5a0] transition-all"
            />
          </div>
        </div>

        {/* Job Listings Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-zinc-400 bg-[#081210]/60 rounded-3xl border border-[#00f5a0]/20">
            <div className="w-8 h-8 border-2 border-[#00f5a0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold">Fetching live job postings...</p>
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-rose-400 bg-[#081210] rounded-3xl border border-rose-900/50">
            <p className="text-sm">Failed to retrieve job listings. Please try refreshing.</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 bg-[#081210] rounded-3xl border border-white/10">
            <p className="text-sm">No listings found matching "{searchTerm}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.slice(0, 20).map((job, idx) => (
              <div
                key={job.externalId || idx}
                className="p-6 rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/15 hover:border-[#00f5a0]/40 transition-all flex flex-col justify-between group shadow-xl hover:shadow-[0_0_30px_rgba(0,245,160,0.15)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00f5a0] px-2.5 py-0.5 rounded-full bg-[#00f5a0]/10 border border-[#00f5a0]/20">
                        {job.source || 'Verified API'}
                      </span>
                      <h3 className="font-extrabold text-white text-base mt-2 group-hover:text-[#00f5a0] transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-zinc-400">{job.company}</p>
                    </div>

                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-10 h-10 rounded-xl object-contain bg-[#040908] p-1 border border-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[#040908] border border-white/10 flex items-center justify-center font-extrabold text-sm text-[#00f5a0] shrink-0">
                        {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                      </div>
                    )}
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mb-4">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-zinc-500" />
                      {job.location || 'Remote'}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1 text-[#00f5a0] font-bold">
                        <FiDollarSign />
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
                          className="px-2.5 py-0.5 text-[11px] font-semibold bg-[#040908] text-zinc-300 rounded-lg border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  {job.jobUrl ? (
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-[#00f5a0] transition-colors"
                    >
                      <span>External Link</span>
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : <div />}

                  <button
                    onClick={handleAuthTrigger}
                    className="px-4 py-2 bg-[#00f5a0] hover:bg-[#00d294] text-black font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,245,160,0.3)] hover:scale-105"
                  >
                    <FiPlus className="w-4 h-4 text-black" />
                    <span>Track Job</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Section */}
      <footer id="about" className="relative z-20 border-t border-white/10 px-6 lg:px-12 py-10 bg-[#040908] text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#00f5a0] flex items-center justify-center text-black font-bold text-xs">
              <FiBriefcase className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-extrabold text-white text-sm">JOBTRACK.AI</span>
          </div>

          <p>© 2026 JobTrack AI Inc. Next-Gen Career Tracking Operating System.</p>

          <div className="flex items-center gap-6 text-zinc-400">
            <a href="#overview" className="hover:text-[#00f5a0] transition-colors">Home</a>
            <a href="#features" className="hover:text-[#00f5a0] transition-colors">Features</a>
            <a href="#public-jobs" className="hover:text-[#00f5a0] transition-colors">Jobs</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};
