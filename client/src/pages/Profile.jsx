import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../hooks/useProfile';
import {
  FiUser,
  FiZap,
  FiAward,
  FiShield,
  FiTarget,
  FiBriefcase,
  FiLink,
  FiFileText,
  FiPlus,
  FiX,
  FiSave,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiMapPin,
  FiDollarSign,
  FiCheckCircle,
  FiTrendingUp,
  FiLayers
} from 'react-icons/fi';

const POPULAR_SKILLS = [
  'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Next.js',
  'TailwindCSS', 'Express', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker',
  'Kubernetes', 'Go', 'GraphQL', 'FastAPI', 'Java', 'C++', 'Git',
  'Figma', 'Solidity', 'Redis', 'System Design', 'Data Structures'
];

export default function Profile() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();

  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    bio: '',
    targetRole: '',
    experienceLevel: 'junior',
    skills: [],
    resumeUrl: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    preferredJobTypes: ['full_time', 'freelance'],
    preferredLocations: ['Remote'],
    expectedSalary: '$90,000 - $130,000 / yr',
  });

  const [newSkill, setNewSkill] = useState('');
  const [activeTab, setActiveTab] = useState('hunter_card'); // 'hunter_card' | 'preferences' | 'portfolio'

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        headline: profile.headline || 'Software Engineer & Tech Aspirant',
        bio: profile.bio || '',
        targetRole: profile.targetRole || 'Fullstack Engineer',
        experienceLevel: profile.experienceLevel || 'junior',
        skills: profile.skills || ['React', 'Node.js', 'JavaScript'],
        resumeUrl: profile.resumeUrl || '',
        phone: profile.phone || '',
        location: profile.location || 'Remote / Hybrid',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        portfolio: profile.portfolio || '',
        preferredJobTypes: profile.preferredJobTypes || ['full_time'],
        preferredLocations: profile.preferredLocations || ['Remote'],
        expectedSalary: profile.expectedSalary || '$80,000 - $120,000 / yr',
      });
    }
  }, [profile]);

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkill).trim();
    if (!trimmed) return;
    if (formData.skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) return;

    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, trimmed]
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const toggleJobType = (type) => {
    setFormData(prev => {
      const exists = prev.preferredJobTypes.includes(type);
      return {
        ...prev,
        preferredJobTypes: exists
          ? prev.preferredJobTypes.filter(t => t !== type)
          : [...prev.preferredJobTypes, type]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const hunterStats = profile?.hunterStats || {
    level: 5,
    rank: 'C-Rank',
    rankTitle: 'Dungeon Specialist',
    rankColor: '#00f5a0',
    exp: 35,
    nextLevelExp: 50,
    totalSkills: formData.skills.length,
    combatPower: 8500
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-[#00f5a0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#00f5a0]/15 pb-6">
        <div>
          <div className="flex items-center gap-2.5 text-[#00f5a0] text-xs font-mono tracking-wider uppercase mb-1">
            <FiShield className="w-4 h-4" /> Hunter Guild Aspirant Identity
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Aspirant Profile & Skill Vault
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Keep your skills, resume, and preferences updated to unlock 100% accurate match scores & missing skill analysis.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00f5a0] hover:bg-[#00d88d] text-black font-bold rounded-xl shadow-[0_0_25px_rgba(0,245,160,0.3)] transition-all active:scale-95 disabled:opacity-50"
        >
          {isUpdating ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Syncing...</span>
            </>
          ) : (
            <>
              <FiSave className="w-4 h-4" />
              <span>Save & Update Hunter Rank</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Hunter Card Left + Details Editor Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT: SOLO LEVELING HUNTER LICENSE CARD ================= */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className="relative rounded-2xl bg-gradient-to-br from-[#0c1916] via-[#08100e] to-[#040807] border-2 p-6 shadow-2xl overflow-hidden"
            style={{
              borderColor: hunterStats.rankColor,
              boxShadow: `0 0 35px ${hunterStats.rankColor}25, inset 0 0 15px ${hunterStats.rankColor}10`
            }}
          >
            {/* Holographic Watermark Badge */}
            <div className="absolute top-3 right-3 opacity-15 pointer-events-none">
              <FiZap className="w-32 h-32 text-white" />
            </div>

            {/* License Top Banner */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded text-xs font-black tracking-widest uppercase border"
                  style={{
                    backgroundColor: `${hunterStats.rankColor}20`,
                    color: hunterStats.rankColor,
                    borderColor: `${hunterStats.rankColor}50`
                  }}
                >
                  {hunterStats.rank}
                </span>
                <span className="text-xs font-mono text-gray-400">{hunterStats.rankTitle}</span>
              </div>
              <span className="text-[11px] font-mono text-[#00f5a0] bg-[#00f5a0]/10 px-2 py-0.5 rounded border border-[#00f5a0]/30">
                OFFICIAL LICENSE
              </span>
            </div>

            {/* Hunter Avatar & Info */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-black shadow-lg"
                style={{ backgroundColor: hunterStats.rankColor }}
              >
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'H'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white truncate">{formData.name || 'Anonymous Hunter'}</h3>
                <p className="text-xs text-[#00f5a0] font-mono truncate">{formData.headline || formData.targetRole}</p>
                <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <FiMapPin className="w-3 h-3 text-gray-500" /> {formData.location || 'Remote'}
                </p>
              </div>
            </div>

            {/* EXP & Combat Level Progress */}
            <div className="space-y-2 bg-[#050c0a] p-3.5 rounded-xl border border-[#00f5a0]/15 mb-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <FiZap className="w-3.5 h-3.5 text-[#00f5a0]" /> Level {hunterStats.level} Hunter
                </span>
                <span className="text-[#00f5a0]">EXP: {hunterStats.exp} / {hunterStats.nextLevelExp}</span>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-[#00f5a0]/20">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (hunterStats.exp / hunterStats.nextLevelExp) * 100)}%`,
                    backgroundColor: hunterStats.rankColor
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono pt-1">
                <span>Combat Score: {hunterStats.combatPower?.toLocaleString()} CP</span>
                <span>Unlocked Skills: {formData.skills.length}</span>
              </div>
            </div>

            {/* Hunter Career Matrix */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#091512] border border-white/5">
                <p className="text-[10px] text-gray-400 uppercase">Tracked</p>
                <p className="text-base font-black text-white mt-0.5">{profile?.activityStats?.totalApplications || 0}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#091512] border border-white/5">
                <p className="text-[10px] text-gray-400 uppercase">Interviews</p>
                <p className="text-base font-black text-cyan-400 mt-0.5">{profile?.activityStats?.activeInterviews || 0}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#091512] border border-white/5">
                <p className="text-[10px] text-gray-400 uppercase">Offers</p>
                <p className="text-base font-black text-[#00f5a0] mt-0.5">{profile?.activityStats?.offersCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Quick Resume Link Box */}
          <div className="p-5 rounded-2xl bg-[#08100e] border border-[#00f5a0]/20 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FiFileText className="w-4 h-4 text-[#00f5a0]" /> Verified Resume URL
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                placeholder="https://drive.google.com/your-resume or notion.so/cv"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040807] border border-white/10 text-white text-xs font-mono focus:border-[#00f5a0] focus:outline-none"
              />
              {formData.resumeUrl && (
                <a
                  href={formData.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 rounded-xl bg-[#00f5a0]/10 text-[#00f5a0] border border-[#00f5a0]/30 hover:bg-[#00f5a0]/20 text-xs font-mono"
                >
                  View
                </a>
              )}
            </div>
            <p className="text-[11px] text-gray-400">
              Paste your Google Drive, Dropbox, or hosted portfolio link for quick 1-click sharing.
            </p>
          </div>
        </div>

        {/* ================= RIGHT: PROFILE & SKILLS FORM ================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-white/10 pb-3">
            <button
              onClick={() => setActiveTab('hunter_card')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'hunter_card'
                  ? 'bg-[#00f5a0]/20 text-[#00f5a0] border border-[#00f5a0]/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiUser className="w-3.5 h-3.5" /> Aspirant Profile
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'preferences'
                  ? 'bg-[#00f5a0]/20 text-[#00f5a0] border border-[#00f5a0]/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiTarget className="w-3.5 h-3.5" /> Target Preferences
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'portfolio'
                  ? 'bg-[#00f5a0]/20 text-[#00f5a0] border border-[#00f5a0]/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiLink className="w-3.5 h-3.5" /> Web Presence & Links
            </button>
          </div>

          {/* TAB 1: ASPIRANT IDENTITY & SKILLS */}
          {activeTab === 'hunter_card' && (
            <div className="space-y-6">
              {/* Core Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none"
                    placeholder="e.g. Alex Hunter"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">Target Job Title</label>
                  <input
                    type="text"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none"
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">Professional Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none"
                  placeholder="e.g. Fullstack React & Node.js Developer | Open Source Contributor"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">Experience Tier</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none"
                  >
                    <option value="fresher">Fresher / Graduate (0-1 yrs)</option>
                    <option value="junior">Junior Developer (1-3 yrs)</option>
                    <option value="mid">Mid-Level Engineer (3-5 yrs)</option>
                    <option value="senior">Senior Engineer (5-8 yrs)</option>
                    <option value="lead">Staff / Lead / Architect (8+ yrs)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">Current Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none"
                    placeholder="e.g. Bengaluru, India or Remote"
                  />
                </div>
              </div>

              {/* SKILLS VAULT SECTION */}
              <div className="p-5 rounded-2xl bg-[#08100e] border border-[#00f5a0]/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FiZap className="w-4 h-4 text-[#00f5a0]" /> Aspirant Skill Vault ({formData.skills.length} Equipped)
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      These skills are checked in real-time against every job requirement to calculate missing skills.
                    </p>
                  </div>
                </div>

                {/* Add Custom Skill Bar */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type skill (e.g. Docker, Redux, Three.js) & press Enter..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#040807] border border-white/10 text-white text-xs font-mono focus:border-[#00f5a0] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className="px-4 py-2.5 bg-[#00f5a0] hover:bg-[#00d88d] text-black font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
                  >
                    <FiPlus className="w-4 h-4" /> Add
                  </button>
                </div>

                {/* Equipped Skills Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <AnimatePresence>
                    {formData.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00f5a0]/15 border border-[#00f5a0]/40 text-[#00f5a0] text-xs font-mono font-medium shadow-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  {formData.skills.length === 0 && (
                    <p className="text-xs text-gray-500 italic">No skills equipped yet. Add some below!</p>
                  )}
                </div>

                {/* Suggested Popular Skills */}
                <div className="pt-2 border-t border-white/5">
                  <p className="text-[11px] text-gray-400 font-mono mb-2">⚡ Quick Add Recommended Tech:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SKILLS.filter(s => !formData.skills.includes(s)).slice(0, 12).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleAddSkill(s)}
                        className="px-2.5 py-1 rounded-md bg-[#040807] hover:bg-[#00f5a0]/10 border border-white/10 hover:border-[#00f5a0]/40 text-gray-300 hover:text-[#00f5a0] text-[11px] font-mono transition-all flex items-center gap-1"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">Professional Summary & Bio</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none"
                  placeholder="Share your background, recent projects, key technical strengths, and what kind of roles excite you..."
                />
              </div>
            </div>
          )}

          {/* TAB 2: TARGET PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#08100e] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FiBriefcase className="w-4 h-4 text-[#00f5a0]" /> Preferred Job & Opportunity Types
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'full_time', label: 'Full Time' },
                    { id: 'freelance', label: 'Freelance' },
                    { id: 'contract', label: 'Contract' },
                    { id: 'internship', label: 'Internship' }
                  ].map((item) => {
                    const isSelected = formData.preferredJobTypes.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleJobType(item.id)}
                        className={`p-3.5 rounded-xl border text-center font-medium text-xs transition-all ${
                          isSelected
                            ? 'bg-[#00f5a0]/20 border-[#00f5a0] text-[#00f5a0] shadow-[0_0_15px_rgba(0,245,160,0.15)]'
                            : 'bg-[#040807] border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">Expected Compensation / Rate</label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={formData.expectedSalary}
                      onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none"
                      placeholder="e.g. ₹20 LPA or $110,000 / yr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">Contact Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08100e] border border-white/10 text-white text-sm focus:border-[#00f5a0] focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PORTFOLIO & SOCIAL LINKS */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <FiGithub className="w-3.5 h-3.5 text-gray-400" /> GitHub Profile
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08100e] border border-white/10 text-white text-sm font-mono focus:border-[#00f5a0] focus:outline-none"
                  placeholder="https://github.com/your-username"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <FiLinkedin className="w-3.5 h-3.5 text-blue-400" /> LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08100e] border border-white/10 text-white text-sm font-mono focus:border-[#00f5a0] focus:outline-none"
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <FiGlobe className="w-3.5 h-3.5 text-[#00f5a0]" /> Portfolio Website / Blog
                </label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08100e] border border-white/10 text-white text-sm font-mono focus:border-[#00f5a0] focus:outline-none"
                  placeholder="https://yourportfolio.dev"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
