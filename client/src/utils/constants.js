export const STAGES = [
  { id: 'wishlist', label: 'Wishlist', color: '#8b5cf6', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  { id: 'applied', label: 'Applied', color: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  { id: 'screening', label: 'Screening', color: '#06b6d4', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  { id: 'interviewing', label: 'Interviewing', color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  { id: 'offer', label: 'Offer Received', color: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'accepted', label: 'Offer Accepted', color: '#22c55e', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  { id: 'rejected', label: 'Rejected', color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  { id: 'ghosted', label: 'Ghosted', color: '#6b7280', bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' }
];

export const STAGE_MAP = STAGES.reduce((acc, stage) => {
  acc[stage.id] = stage;
  return acc;
}, {});

export const COLD_EMAIL_STATUSES = [
  { id: 'not_sent', label: 'Not Sent', color: 'text-slate-400', bg: 'bg-slate-800' },
  { id: 'drafted', label: 'Drafted', color: 'text-purple-400', bg: 'bg-purple-950' },
  { id: 'sent', label: 'Sent', color: 'text-blue-400', bg: 'bg-blue-950' },
  { id: 'opened', label: 'Opened', color: 'text-amber-400', bg: 'bg-amber-950' },
  { id: 'replied', label: 'Replied', color: 'text-emerald-400', bg: 'bg-emerald-950' },
  { id: 'bounced', label: 'Bounced', color: 'text-red-400', bg: 'bg-red-950' }
];

export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Hybrid', 'On-site'];

export const DEFAULT_FILTERS = {
  search: '',
  stage: '',
  source: '',
  coldEmailStatus: '',
  sort: '-updatedAt'
};
