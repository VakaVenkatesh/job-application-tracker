export const STAGES_LIST = [
  { id: 'wishlist', label: 'Wishlist', color: '#8b5cf6', bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  { id: 'applied', label: 'Applied', color: '#00f5a0', bg: 'bg-[#00f5a0]/15', text: 'text-[#00f5a0]', border: 'border-[#00f5a0]/30' },
  { id: 'screening', label: 'Screening', color: '#06b6d4', bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  { id: 'interviewing', label: 'Interviewing', color: '#f59e0b', bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  { id: 'offer', label: 'Offer Received', color: '#10b981', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'accepted', label: 'Offer Accepted', color: '#22c55e', bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30' },
  { id: 'rejected', label: 'Rejected', color: '#ef4444', bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
  { id: 'ghosted', label: 'Ghosted', color: '#6b7280', bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' }
];

export const STAGES = STAGES_LIST.reduce((acc, stage) => {
  acc[stage.id] = stage;
  return acc;
}, {});

// Make array indexing also work for components that map over STAGES
STAGES.map = (...args) => STAGES_LIST.map(...args);
STAGES.reduce = (...args) => STAGES_LIST.reduce(...args);
STAGES.forEach = (...args) => STAGES_LIST.forEach(...args);
STAGES.filter = (...args) => STAGES_LIST.filter(...args);

export const STAGE_MAP = STAGES;

export const COLD_EMAIL_STATUSES = [
  { id: 'not_sent', label: 'Not Sent' },
  { id: 'sent', label: 'Sent' },
  { id: 'replied', label: 'Replied' }
];

export const JOB_TYPES = ['full_time', 'part_time', 'contract', 'freelance', 'internship', 'other'];

export const JOB_TYPE_LABELS = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
  other: 'Other'
};

export const NEXT_ROUNDS = [
  { id: 'none', label: 'None Scheduled' },
  { id: 'online_assessment', label: 'Online Assessment / Exam' },
  { id: 'technical_interview', label: 'Technical Interview (Live Coding)' },
  { id: 'system_design', label: 'System Design / Architecture' },
  { id: 'hr_screening', label: 'HR Screening & Culture Fit' },
  { id: 'managerial', label: 'Managerial Round' },
  { id: 'final_round', label: 'Final Executive Call' },
  { id: 'assignment', label: 'Take-home Assignment' },
  { id: 'offer_discussion', label: 'Offer Discussion' }
];
