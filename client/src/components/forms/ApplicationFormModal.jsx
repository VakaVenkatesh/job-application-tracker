import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { STAGES, JOB_TYPES, NEXT_ROUNDS } from '../../utils/constants';
import { useCreateApplication, useUpdateApplication } from '../../hooks/useApplications';
import { useJobs } from '../../hooks/useJobs';
import { FiCalendar, FiClock, FiDollarSign, FiBriefcase, FiCheck, FiSearch, FiLayers } from 'react-icons/fi';

export default function ApplicationFormModal({ isOpen, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    jobPosting: '',
    company: '',
    title: '',
    location: 'Remote',
    jobUrl: '',
    companyLogo: '',
    salary: '',
    jobType: 'full_time',
    category: 'Engineering',
    stage: 'applied',
    dateApplied: new Date().toISOString().substring(0, 10),
    nextRoundDate: '',
    nextRoundType: 'none',
    nextRoundNotes: '',
    requiredSkills: '',
    tags: '',
    description: ''
  });

  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobSearchTerm, setJobSearchTerm] = useState('');

  // Fetch all available predefined postings for selection
  const { jobs: predefinedJobs } = useJobs({ limit: 100 });

  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();

  useEffect(() => {
    if (initialData) {
      setFormData({
        jobPosting: initialData.jobPosting?._id || initialData.jobPosting || '',
        company: initialData.company || '',
        title: initialData.title || '',
        location: initialData.location || 'Remote',
        jobUrl: initialData.jobUrl || '',
        companyLogo: initialData.companyLogo || '',
        salary: initialData.salary || '',
        jobType: initialData.jobType || 'full_time',
        category: initialData.category || 'Engineering',
        stage: initialData.stage || 'applied',
        dateApplied: initialData.dateApplied ? new Date(initialData.dateApplied).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
        nextRoundDate: initialData.nextRoundDate ? new Date(initialData.nextRoundDate).toISOString().substring(0, 10) : '',
        nextRoundType: initialData.nextRoundType || 'none',
        nextRoundNotes: initialData.nextRoundNotes || '',
        requiredSkills: Array.isArray(initialData.requiredSkills) ? initialData.requiredSkills.join(', ') : (initialData.requiredSkills || ''),
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
        description: initialData.description || ''
      });
      setSelectedJobId(initialData.jobPosting?._id || initialData.jobPosting || '');
    } else {
      setFormData({
        jobPosting: '',
        company: '',
        title: '',
        location: 'Remote',
        jobUrl: '',
        companyLogo: '',
        salary: '',
        jobType: 'full_time',
        category: 'Engineering',
        stage: 'applied',
        dateApplied: new Date().toISOString().substring(0, 10),
        nextRoundDate: '',
        nextRoundType: 'none',
        nextRoundNotes: '',
        requiredSkills: '',
        tags: '',
        description: ''
      });
      setSelectedJobId('');
      setJobSearchTerm('');
    }
  }, [initialData, isOpen]);

  const handlePredefinedSelect = (e) => {
    const jId = e.target.value;
    setSelectedJobId(jId);

    if (!jId) return;

    const matched = (predefinedJobs || []).find(j => j._id === jId);
    if (matched) {
      setFormData(prev => ({
        ...prev,
        jobPosting: matched._id,
        company: matched.company,
        title: matched.title,
        location: matched.location || 'Remote',
        jobUrl: matched.jobUrl || '',
        companyLogo: matched.companyLogo || '',
        salary: matched.salary || '',
        jobType: matched.jobType || 'full_time',
        category: matched.category || 'Engineering',
        requiredSkills: Array.isArray(matched.requiredSkills) ? matched.requiredSkills.join(', ') : '',
        tags: Array.isArray(matched.tags) ? matched.tags.join(', ') : '',
        description: matched.description || ''
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      requiredSkills: formData.requiredSkills ? formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : [],
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      dateApplied: formData.dateApplied ? new Date(formData.dateApplied) : new Date(),
      nextRoundDate: formData.nextRoundDate ? new Date(formData.nextRoundDate) : undefined
    };

    if (initialData && initialData._id) {
      updateMutation.mutate({ id: initialData._id, data: payload }, {
        onSuccess: () => onClose()
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onClose()
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Application Details' : 'Track Verified Job Application'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Predefined Job Selector (when creating new application) */}
        {!initialData && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00f5a0]/10 via-[#041510] to-[#08100e] border border-[#00f5a0]/30 space-y-2">
            <label className="block text-xs font-mono font-bold text-[#00f5a0] flex items-center gap-1.5">
              <FiLayers className="w-4 h-4" /> SELECT FROM PREDEFINED POSTINGS (70+ VERIFIED ROLES)
            </label>
            <p className="text-[11px] text-gray-400 font-mono">
              Pick a verified role to auto-populate company details, skills, location, and keep your analytics 100% consistent.
            </p>
            <select
              value={selectedJobId}
              onChange={handlePredefinedSelect}
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-[#00f5a0]/40 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f5a0] font-sans"
            >
              <option value="">-- Choose a Predefined Job Posting --</option>
              {(predefinedJobs || []).map(j => (
                <option key={j._id} value={j._id}>
                  {j.company} - {j.title} ({j.location}) [{j.salary}]
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Row 1: Company & Job Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Company Name *</label>
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google, Stripe, Uber"
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5a0]"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Job Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5a0]"
            />
          </div>
        </div>

        {/* Row 2: Location & URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Remote or Bengaluru"
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5a0]"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Original Job URL</label>
            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              placeholder="https://careers.company.com/..."
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5a0]"
            />
          </div>
        </div>

        {/* Row 3: Stage, Type, Salary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Pipeline Stage</label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f5a0]"
            >
              {Object.entries(STAGES).map(([key, info]) => (
                <option key={key} value={key}>{info.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Employment Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f5a0]"
            >
              <option value="full_time">Full Time</option>
              <option value="freelance">Freelance Contract</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Salary / Rate</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. ₹25 LPA or $120k"
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5a0]"
            />
          </div>
        </div>

        {/* Row 4: Key Dates & Exam/Interview Radar */}
        <div className="p-4 rounded-2xl bg-[#040807] border border-[#00f5a0]/25 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00f5a0]">
            <FiCalendar className="w-4 h-4" /> EXAM & INTERVIEW SCHEDULE
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5">Date Applied</label>
              <input
                type="date"
                name="dateApplied"
                value={formData.dateApplied}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f5a0]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5">Next Round Type</label>
              <select
                name="nextRoundType"
                value={formData.nextRoundType}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f5a0]"
              >
                {NEXT_ROUNDS.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5">Next Round / Exam Date</label>
              <input
                type="date"
                name="nextRoundDate"
                value={formData.nextRoundDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f5a0]"
              />
            </div>
          </div>
        </div>

        {/* Row 5: Required Skills */}
        <div>
          <label className="block text-xs font-mono text-gray-300 mb-1.5">Required Skills (comma-separated)</label>
          <input
            type="text"
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleChange}
            placeholder="React, TypeScript, Node.js, GraphQL, AWS"
            className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5a0]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-mono rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#00f5a0] hover:bg-[#00d88d] text-black font-bold text-xs font-mono rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Track Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
