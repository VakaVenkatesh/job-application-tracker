import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { STAGES, JOB_TYPES } from '../../utils/constants';
import { useCreateApplication, useUpdateApplication } from '../../hooks/useApplications';
import { FiCalendar, FiClock, FiDollarSign, FiBriefcase } from 'react-icons/fi';

const NEXT_ROUNDS = [
  { id: 'none', label: 'None Scheduled' },
  { id: 'online_assessment', label: 'Online Assessment / Coding Exam' },
  { id: 'technical_interview', label: 'Technical Interview (Live Coding)' },
  { id: 'system_design', label: 'System Design / Architecture' },
  { id: 'hr_screening', label: 'HR Screening & Culture Fit' },
  { id: 'managerial', label: 'Managerial / Engineering Director' },
  { id: 'final_round', label: 'Final Executive / Offer Call' },
  { id: 'assignment', label: 'Take-home Assignment' }
];

export default function ApplicationFormModal({ isOpen, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: 'Remote',
    jobUrl: '',
    companyLogo: '',
    salary: '',
    jobType: 'full_time',
    stage: 'applied',
    dateApplied: new Date().toISOString().substring(0, 10),
    nextRoundDate: '',
    nextRoundType: 'none',
    nextRoundNotes: '',
    requiredSkills: '',
    tags: '',
    description: ''
  });

  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        title: initialData.title || '',
        location: initialData.location || 'Remote',
        jobUrl: initialData.jobUrl || '',
        companyLogo: initialData.companyLogo || '',
        salary: initialData.salary || '',
        jobType: initialData.jobType || 'full_time',
        stage: initialData.stage || 'applied',
        dateApplied: initialData.dateApplied ? new Date(initialData.dateApplied).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
        nextRoundDate: initialData.nextRoundDate ? new Date(initialData.nextRoundDate).toISOString().substring(0, 10) : '',
        nextRoundType: initialData.nextRoundType || 'none',
        nextRoundNotes: initialData.nextRoundNotes || '',
        requiredSkills: Array.isArray(initialData.requiredSkills) ? initialData.requiredSkills.join(', ') : '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        company: '',
        title: '',
        location: 'Remote',
        jobUrl: '',
        companyLogo: '',
        salary: '',
        jobType: 'full_time',
        stage: 'applied',
        dateApplied: new Date().toISOString().substring(0, 10),
        nextRoundDate: '',
        nextRoundType: 'none',
        nextRoundNotes: '',
        requiredSkills: '',
        tags: '',
        description: ''
      });
    }
  }, [initialData, isOpen]);

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
      title={initialData ? 'Edit Application Details' : 'Track New Job Application'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
