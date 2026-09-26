import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Laptop3D from '../components/common/Laptop3D';
import {
  FiZap,
  FiShield,
  FiTarget,
  FiCheckCircle,
  FiCalendar,
  FiTrendingUp,
  FiAward,
  FiArrowRight,
  FiLayers,
  FiCompass,
  FiSearch,
  FiLock,
  FiCpu,
  FiUsers
} from 'react-icons/fi';

const FEATURES = [
  {
    icon: FiZap,
    title: 'Instant Missing Skill Radar',
    description: 'Never get rejected due to hidden keywords. Our system evaluates job requirements against your equipped skill vault in real-time and alerts you to every missing competency.',
    color: '#00f5a0',
  },
  {
    icon: FiAward,
    title: 'Leveling Profile',
    description: 'Transform your career into an RPG progression. Gain EXP points, level up your Rank and build a verified technical identity.',
    color: '#a855f7',
  },
  {
    icon: FiCalendar,
    title: 'Exam & Interview Timeline Radar',
    description: 'Track upcoming online assessments, technical coding rounds, system design interviews, and managerial discussions with automated countdowns.',
    color: '#38bdf8',
  },
  {
    icon: FiTarget,
    title: 'Precision Pipeline Management',
    description: 'A smooth drag-and-drop Kanban workflow built purely for job seekers. Monitor response rates, track recruiter notes, and accelerate offers.',
    color: '#f59e0b',
  },
  {
    icon: FiLock,
    title: 'Multi-User Cloud Security',
    description: 'Your applications, notes, contacts, and personal portfolio data are securely siloed in isolated MongoDB Atlas databases with JWT encryption.',
    color: '#10b981',
  },
  {
    icon: FiCompass,
    title: 'Direct 1-Click Application Flow',
    description: 'No bloated intermediary forms or fake apply buttons. One click directs you straight to the authentic company career page while logging the opportunity in your pipeline.',
    color: '#ec4899',
  }
];

const FAQS = [
  {
    q: 'How does the Missing Skill analysis work?',
    a: 'When you equip skills in your Aspirant Profile, the platform dynamically parses the required technical stack for each job posting and highlights the exact technologies you have vs. what you need to prepare.'
  },
  {
    q: 'Can I track both full-time roles and freelance contracts?',
    a: 'Yes! The platform supports full-time engineering roles, freelance contracts, hourly gigs, and internships with dedicated filters and compensation tracking.'
  },
  {
    q: 'How do I level up my Hunter Rank?',
    a: 'Your Hunter Rank (E-Rank to S-Rank) and Combat Power increase as you equip verified technical skills, track new applications, and progress through interview rounds.'
  },
  {
    q: 'Is my application data private?',
    a: 'Absolutely. Every user has their own private workspace secured by encrypted JWT credentials and dedicated database indexing.'
  }
];

export default function LandingPage({ onOpenAuth }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-28 pb-20 overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-8 pb-12 lg:pt-14">
        {/* Background glow flares */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#00f5a0]/15 via-transparent to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Hero Copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#081512] border border-[#00f5a0]/40 text-xs font-mono text-[#00f5a0] shadow-[0_0_15px_rgba(0,245,160,0.15)]">
                <FiZap className="w-3.5 h-3.5 animate-pulse" />
                <span>REAL-TIME MULTI-USER JOB ASPIRANT PLATFORM</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Master Your Tech Career.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5a0] via-[#38bdf8] to-[#a855f7]">
                  Level Up Your Job Hunt.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                A structured command center built exclusively for tech aspirants and freelance hunters. Pinpoint missing skills for any job, track interview exams, and level up your Hunter Rank in real-time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {isAuthenticated ? (
                  <Link
                    to="/jobs"
                    className="px-8 py-4 rounded-2xl bg-[#00f5a0] hover:bg-[#00d88d] text-black font-black text-sm font-mono flex items-center gap-3 shadow-[0_0_30px_rgba(0,245,160,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>LAUNCH JOB COMMAND CENTER</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={onOpenAuth}
                      className="px-8 py-4 rounded-2xl bg-[#00f5a0] hover:bg-[#00d88d] text-black font-black text-sm font-mono flex items-center gap-3 shadow-[0_0_30px_rgba(0,245,160,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <span>START FREE ASPIRANT ACCOUNT</span>
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                    <Link
                      to="/jobs"
                      className="px-7 py-4 rounded-2xl bg-[#08100e] hover:bg-[#0d1a17] text-white border border-white/10 hover:border-[#00f5a0]/40 font-bold text-sm font-mono transition-all flex items-center gap-2"
                    >
                      <FiSearch className="w-4 h-4 text-[#00f5a0]" />
                      <span>Browse Open Postings</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Micro-Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs font-mono">
                <div>
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">Authentic Apply Links</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#00f5a0]">0.1s</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">Skill Gap Analysis</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-purple-400">S-Rank</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">Hunter Gamification</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interactive 3D Laptop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 flex justify-center items-center"
            >
              <Laptop3D />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= ARCHITECTURE / FEATURE MATRIX ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f5a0]/10 border border-[#00f5a0]/30 text-xs font-mono text-[#00f5a0]">
            <FiCpu className="w-3.5 h-3.5" /> SYSTEM CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Engineered For The Relentless Job Seeker
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Eliminate messy spreadsheets and guesswork. A cohesive ecosystem designed to guide tech aspirants step-by-step from discovery to final offer letters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5, borderColor: `${feat.color}60` }}
              className="p-7 rounded-3xl bg-[#08100e] border border-white/10 transition-all flex flex-col justify-between space-y-6 shadow-xl"
            >
              <div className="space-y-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${feat.color}15`, color: feat.color, border: `1px solid ${feat.color}40` }}
                >
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{feat.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 pt-2 border-t border-white/5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: feat.color }} />
                <span>Feature Active</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= STEP BY STEP STRUCTURED JOURNEY ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-[#081512] via-[#050e0c] to-[#040807] border border-[#00f5a0]/30 p-8 sm:p-14 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              A Structured Roadmap To Your Next Role
            </h2>
            <p className="text-gray-400 text-sm">
              Follow the proven pipeline sequence adopted by top candidate hunters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Equip Skills', desc: 'Add your languages, frameworks & resume link in your Hunter Vault.' },
              { step: '02', title: 'Find Roles', desc: 'Browse verified listings with instant missing skill keyword alerts.' },
              { step: '03', title: 'Apply Directly', desc: '1-click external apply opens authentic portal & updates DB pipeline.' },
              { step: '04', title: 'Ace The Rounds', desc: 'Track upcoming coding exams, technical rounds & interview dates.' }
            ].map((s) => (
              <div key={s.step} className="p-5 rounded-2xl bg-[#030605] border border-white/10 space-y-3 relative">
                <span className="text-2xl font-black font-mono text-[#00f5a0]">{s.step}</span>
                <h3 className="text-base font-bold text-white">{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-sm">
            Everything you need to know about the platform.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#08100e] border border-white/10 space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-[#00f5a0] font-mono">Q.</span> {faq.q}
              </h3>
              <p className="text-gray-400 text-sm pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CTA BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#00f5a0]/20 via-[#0c241e] to-[#040908] border border-[#00f5a0]/40 p-10 sm:p-14 text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready To Level Up Your Tech Career?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Join thousands of job aspirants organizing their technical opportunities with speed and precision.
            </p>
          </div>

          <div className="pt-2">
            {isAuthenticated ? (
              <Link
                to="/jobs"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#00f5a0] hover:bg-[#00d88d] text-black font-black text-sm font-mono shadow-[0_0_35px_rgba(0,245,160,0.4)] transition-all transform hover:scale-105"
              >
                <span>OPEN DISCOVERY HUB</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#00f5a0] hover:bg-[#00d88d] text-black font-black text-sm font-mono shadow-[0_0_35px_rgba(0,245,160,0.4)] transition-all transform hover:scale-105 cursor-pointer"
              >
                <span>CREATE YOUR FREE PROFILE</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
