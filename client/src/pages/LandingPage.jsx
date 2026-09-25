import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiPlus,
  FiShield,
  FiActivity,
  FiLayers,
  FiUsers,
  FiChevronDown,
  FiCheck,
  FiPlay
} from 'react-icons/fi';
import { useFetchLiveJobs } from '../hooks/useSync';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuth } from '../context/AuthContext';

export const LandingPage = ({ onOpenAuthModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState('pipeline');
  const [activeFaq, setActiveFaq] = useState(null);

  const { isAuthenticated } = useAuth();
  const { data: jobs = [], isLoading, isError } = useFetchLiveJobs();
  const parallaxRef = useRef(null);

  // Parallax mouse move effect for 3D Hero image
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!parallaxRef.current || window.innerWidth < 768) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const moveX = (clientX - innerWidth / 2) / 45;
      const moveY = (clientY - innerHeight / 2) / 45;
      parallaxRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px) rotateY(${moveX * 0.8}deg) rotateX(${-moveY * 0.8}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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

  // Feature Showcase Configuration
  const featureTabs = [
    {
      id: 'pipeline',
      icon: <FiColumns className="w-5 h-5" />,
      title: 'Kanban Pipeline Board',
      subtitle: 'Visual Drag & Drop Career Tracking',
      description: 'Categorize applications effortlessly between Wishlist, Applied, Screening, Interviewing, and Offer stages.',
      benefits: [
        'Custom drag-and-drop state transitions',
        'Automatic application date tracking',
        'Salary and job type tagging',
        'Priority scoring from 1 to 5 stars'
      ],
      image: '/cyberpunk_job_3d.jpg'
    },
    {
      id: 'analytics',
      icon: <FiPieChart className="w-5 h-5" />,
      title: 'Real-time Analytics',
      subtitle: 'MongoDB Aggregated Metrics Stream',
      description: 'Monitor your interview response rate, reply velocity, and application distribution across top companies.',
      benefits: [
        'Live interview response rate calculation',
        'Average days to recruiter response tracking',
        'Weekly application submission timeline',
        'Source breakdown (Remotive, Arbeitnow, LinkedIn)'
      ],
      image: '/cyberpunk_job_3d.jpg'
    },
    {
      id: 'recruiter',
      icon: <FiMail className="w-5 h-5" />,
      title: 'Recruiter Contact Logs',
      subtitle: 'Cold Email & Follow-Up Tracker',
      description: 'Store interviewer email addresses, phone numbers, interview notes, and set automated follow-up reminders.',
      benefits: [
        'Embedded recruiter contact logs',
        'Company notes and interview activity timeline',
        'Cold email follow-up counter',
        'Custom template storage'
      ],
      image: '/cyberpunk_job_3d.jpg'
    },
    {
      id: 'discovery',
      icon: <FiZap className="w-5 h-5" />,
      title: 'Live Job Discovery API',
      subtitle: 'Instant Remotive & Arbeitnow Ingestion',
      description: 'Browse thousands of active remote and tech job listings with 1-click import into your personal tracker.',
      benefits: [
        'Live remote job feeds from top APIs',
        'Automatic company logo and tag extraction',
        'One-click import into Wishlist stage',
        'Instant deduplication checking'
      ],
      image: '/cyberpunk_job_3d.jpg'
    }
  ];

  // How It Works Steps
  const steps = [
    {
      num: '01',
      title: 'Search & Discover',
      desc: 'Browse verified remote tech openings from integrated job APIs with instant keyword filtering.'
    },
    {
      num: '02',
      title: 'Organize Pipeline',
      desc: 'Import or log job applications into your custom MongoDB Kanban board across 5 distinct stages.'
    },
    {
      num: '03',
      title: 'Accelerate Offers',
      desc: 'Track recruiter follow-up dates, log cold emails, and optimize your response rate in real-time.'
    }
  ];

  // FAQs
  const faqs = [
    {
      q: 'Is JobTrack AI completely free to use?',
      a: 'Yes! JobTrack AI offers a free account with full access to the Kanban pipeline board, live job discovery, analytics, and recruiter contact logging.'
    },
    {
      q: 'Can I browse job listings without creating an account?',
      a: 'Absolutely! Anyone can search and filter live job listings on our public portal like Naukri or Indeed. Creating an account allows you to save and track jobs in your personal pipeline.'
    },
    {
      q: 'Where is my application data stored?',
      a: 'Your application data, notes, and recruiter contacts are securely stored in your personal MongoDB Atlas database cluster with JWT token protection.'
    },
    {
      q: 'Does it update in real-time across multiple devices?',
      a: 'Yes, JobTrack AI features serverless data synchronization and automated background polling so your dashboard stays updated everywhere.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans antialiased selection:bg-[#00f5a0] selection:text-black flex flex-col relative overflow-x-hidden">
      {/* Background Mint Radial Glowing Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#00f5a0]/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00d294]/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Top Header Navigation */}
      <header className="relative z-30 px-6 lg:px-12 py-5 flex items-center justify-between border-b border-white/10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f5a0] to-[#00d294] flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(0,245,160,0.4)]">
            <FiBriefcase className="w-5 h-5 text-black" />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">
            JOBTRACK<span className="text-[#00f5a0]">.AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#overview" className="hover:text-[#00f5a0] transition-colors">Overview</a>
          <a href="#how-it-works" className="hover:text-[#00f5a0] transition-colors">How It Works</a>
          <a href="#features" className="hover:text-[#00f5a0] transition-colors">Features</a>
          <a href="#public-jobs" className="hover:text-[#00f5a0] transition-colors">Live Jobs</a>
          <a href="#faq" className="hover:text-[#00f5a0] transition-colors">FAQ</a>
        </nav>

        <button
          onClick={handleAuthTrigger}
          className="px-6 py-2.5 bg-[#00f5a0] hover:bg-[#00d294] text-black font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_0_25px_rgba(0,245,160,0.4)] hover:scale-105 active:scale-95"
        >
          Launch App
        </button>
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative z-20 px-6 lg:px-12 pt-12 lg:pt-20 pb-16 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column: Content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            {/* Animated Hero Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#081210] border border-[#00f5a0]/30 text-xs text-[#00f5a0] shadow-[0_0_15px_rgba(0,245,160,0.2)]"
            >
              <FiZap className="w-3.5 h-3.5 text-[#00f5a0] animate-pulse" />
              <span className="font-semibold text-[11px] uppercase tracking-wider">
                INTRODUCING JOBTRACK AI PIPELINE ENGINE v2.0
              </span>
            </motion.div>

            {/* Hero Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]"
            >
              Elevate Your <br />
              <span className="bg-gradient-to-r from-[#00f5a0] via-[#00d294] to-emerald-400 bg-clip-text text-transparent">
                Career Search Engine
              </span>
            </motion.h1>

            {/* Hero Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Transform how you search and track job opportunities with our AI-powered platform. Automate application pipelines, log recruiter contacts, and gain real-time response insights.
            </motion.p>

            {/* Hero CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={handleAuthTrigger}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#00f5a0] hover:bg-[#00d294] text-black font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_0_30px_rgba(0,245,160,0.4)] hover:scale-105"
              >
                Start Free Tracking
              </button>
              <a
                href="#public-jobs"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#081210] hover:bg-[#0c1a17] text-zinc-300 hover:text-white font-bold text-xs tracking-wider uppercase rounded-xl border border-[#00f5a0]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Browse Live Jobs</span>
                <FiArrowRight className="text-[#00f5a0]" />
              </a>
            </motion.div>

            {/* Social Proof Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-6 flex items-center justify-center lg:justify-start gap-3 text-xs text-zinc-400 border-t border-white/10"
            >
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-[#00f5a0] flex items-center justify-center font-bold text-black text-[10px]">A</div>
                <div className="w-7 h-7 rounded-full bg-[#00d294] flex items-center justify-center font-bold text-black text-[10px]">K</div>
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black text-[10px]">M</div>
              </div>
              <span>
                <strong className="text-white font-bold">15,000+</strong> applications tracked across top tech companies
              </span>
            </motion.div>
          </div>

          {/* Right Column: Parallax 3D Rotating Cyberpunk Asset */}
          <div className="flex-1 relative max-w-lg w-full mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="relative">
                {/* Glow Backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#00f5a0] to-[#00d294] rounded-3xl blur-2xl opacity-40 animate-pulse"></div>

                {/* 3D Rotating Canvas Viewport */}
                <div
                  ref={parallaxRef}
                  className="relative bg-black/90 backdrop-blur-md border border-[#00f5a0]/30 rounded-3xl overflow-hidden p-3 shadow-2xl transition-transform duration-200 ease-out preserve-3d"
                >
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden group">
                    <img
                      src="/cyberpunk_job_3d.jpg"
                      alt="3D Holographic Cyberpunk Job Core"
                      className="w-full h-full object-contain animate-3d-rotate animate-3d-float cursor-pointer hover:pause"
                    />

                    {/* Floating HUD Badges (Matching Template) */}
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-[#00f5a0]/40 rounded-xl px-3 py-1.5 text-xs font-mono flex items-center gap-2 shadow-xl">
                      <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-ping" />
                      <span className="text-white font-bold">SYSTEM ONLINE</span>
                    </div>

                    <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md border border-[#00f5a0]/40 rounded-xl px-3 py-1.5 text-xs font-mono flex items-center gap-2 shadow-xl">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-zinc-300">Live API Syncing...</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-20 px-6 lg:px-12 py-16 bg-[#081210]/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-[#00f5a0] uppercase tracking-wider">WORKFLOW PROCESS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">How JobTrack AI Works</h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">Simplify your application journey in 3 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#081210] border border-[#00f5a0]/20 hover:border-[#00f5a0]/40 transition-all relative overflow-hidden group"
              >
                <span className="text-4xl font-black text-[#00f5a0]/20 absolute top-4 right-6 group-hover:text-[#00f5a0]/40 transition-colors">
                  {s.num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#00f5a0]/10 border border-[#00f5a0]/30 flex items-center justify-center text-[#00f5a0] mb-4">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabbed Feature Showcase */}
      <section id="features" className="relative z-20 px-6 lg:px-12 py-20 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-[#00f5a0] uppercase tracking-wider">FEATURE PLATFORM</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Everything You Need to Land Offers</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">Explore our suite of pipeline management tools.</p>
        </div>

        {/* Feature Tabs Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 p-1.5 bg-[#081210] border border-[#00f5a0]/20 rounded-2xl max-w-3xl mx-auto">
          {featureTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFeatureTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeFeatureTab === tab.id
                  ? 'bg-[#00f5a0] text-black shadow-[0_0_20px_rgba(0,245,160,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Active Feature Showcase Body */}
        {featureTabs
          .filter((tab) => tab.id === activeFeatureTab)
          .map((tab) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-8 sm:p-10 rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/20 backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-extrabold text-[#00f5a0] uppercase tracking-wider">{tab.subtitle}</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{tab.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{tab.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {tab.benefits.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs text-zinc-300">
                      <FiCheck className="text-[#00f5a0] shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleAuthTrigger}
                    className="px-6 py-3 bg-[#00f5a0] hover:bg-[#00d294] text-black font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(0,245,160,0.3)]"
                  >
                    Try {tab.title} Now
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="w-full aspect-square rounded-2xl bg-black border border-[#00f5a0]/30 p-4 flex items-center justify-center overflow-hidden group">
                  <img
                    src={tab.image}
                    alt={tab.title}
                    className="w-full h-full object-contain animate-3d-float"
                  />
                </div>
              </div>
            </motion.div>
          ))}
      </section>

      {/* Public Job Listings Board (Naukri / Indeed style) */}
      <section id="public-jobs" className="relative z-20 px-6 lg:px-12 py-12 max-w-7xl mx-auto w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/20 mb-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#00f5a0]/10 text-[#00f5a0] text-xs font-bold border border-[#00f5a0]/20">
                LIVE PUBLIC JOB BOARD // NAUKRI & REMOTIVE AGGREGATOR
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Discover Verified Openings
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Browse public listings in real-time. Sign in to save any opening into your personal MongoDB tracking workspace.
              </p>
            </div>

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

      {/* FAQ Accordion Section */}
      <section id="faq" className="relative z-20 px-6 lg:px-12 py-20 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold text-[#00f5a0] uppercase tracking-wider">GOT QUESTIONS?</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#081210] border border-[#00f5a0]/20 cursor-pointer transition-all"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between text-sm font-bold text-white">
                <span>{faq.q}</span>
                <FiChevronDown className={`w-4 h-4 text-[#00f5a0] transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </div>
              {activeFaq === idx && (
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed pt-3 border-t border-white/5">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="relative z-20 px-6 lg:px-12 py-16 max-w-5xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#081210] via-black to-[#081210] border border-[#00f5a0]/30 text-center shadow-[0_0_50px_rgba(0,245,160,0.15)] relative overflow-hidden">
          <span className="text-xs font-extrabold text-[#00f5a0] uppercase tracking-wider">TAKE CONTROL OF YOUR CAREER</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-4">Ready to Land Your Next Role?</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mb-8">
            Create your free account now to manage your applications on an interactive Kanban pipeline.
          </p>
          <button
            onClick={handleAuthTrigger}
            className="px-8 py-4 bg-[#00f5a0] hover:bg-[#00d294] text-black font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_0_30px_rgba(0,245,160,0.4)] hover:scale-105"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/10 px-6 lg:px-12 py-10 bg-black text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#00f5a0] flex items-center justify-center text-black font-bold text-xs">
              <FiBriefcase className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-extrabold text-white text-sm">JOBTRACK.AI</span>
          </div>

          <p>© 2026 JobTrack AI Inc. All rights reserved.</p>

          <div className="flex items-center gap-6 text-zinc-400">
            <a href="#overview" className="hover:text-[#00f5a0] transition-colors">Overview</a>
            <a href="#features" className="hover:text-[#00f5a0] transition-colors">Features</a>
            <a href="#public-jobs" className="hover:text-[#00f5a0] transition-colors">Jobs</a>
            <a href="#faq" className="hover:text-[#00f5a0] transition-colors">FAQ</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};
