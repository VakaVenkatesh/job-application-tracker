import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApplication, useUpdateApplication, useDeleteApplication, useAddContact, useAddNote } from '../hooks/useApplications';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import ApplicationFormModal from '../components/forms/ApplicationFormModal';
import { STAGES } from '../utils/constants';
import { formatDate, formatRelativeTime } from '../utils/formatters';
import {
  FiArrowLeft,
  FiEdit3,
  FiTrash2,
  FiExternalLink,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiPlus,
  FiFileText,
  FiShield,
  FiUserPlus,
  FiLinkedin,
  FiMail
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const NEXT_ROUND_LABELS = {
  online_assessment: 'Online Assessment / Coding Exam',
  technical_interview: 'Technical Interview (Live Coding)',
  hr_screening: 'HR Screening & Culture Fit',
  system_design: 'System Design / Architecture',
  managerial: 'Managerial Round',
  final_round: 'Final Executive Round',
  assignment: 'Take-home Assignment',
  offer_discussion: 'Offer Discussion',
  none: 'No Round Scheduled'
};

export default function ApplicationDetail() {
  const { id: applicationId } = useParams();
  const navigate = useNavigate();

  const { data: app, isLoading, error } = useApplication(applicationId);
  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();
  const addNoteMutation = useAddNote();
  const addContactMutation = useAddContact();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactData, setContactData] = useState({ name: '', role: '', email: '', linkedin: '', notes: '' });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-2 border-[#00f5a0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto space-y-4">
        <p className="text-red-400 font-semibold">Application not found</p>
        <Link to="/applications" className="px-5 py-2.5 bg-[#08100e] text-white rounded-xl text-xs font-mono inline-block">
          Return to applications list
        </Link>
      </div>
    );
  }

  const handleUpdate = (updatedFields) => {
    updateMutation.mutate({ id: app._id, data: updatedFields }, {
      onSuccess: () => setIsEditModalOpen(false)
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(app._id, {
      onSuccess: () => navigate('/applications')
    });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    addNoteMutation.mutate({ id: app._id, content: noteContent.trim() }, {
      onSuccess: () => {
        setNoteContent('');
        setIsNoteModalOpen(false);
      }
    });
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!contactData.name.trim()) return;
    addContactMutation.mutate({ id: app._id, contact: contactData }, {
      onSuccess: () => {
        setContactData({ name: '', role: '', email: '', linkedin: '', notes: '' });
        setIsContactModalOpen(false);
      }
    });
  };

  const getCompanyLogo = () => {
    if (app.companyLogo) return app.companyLogo;
    const clean = (app.company || 'tech').toLowerCase().replace(/[^a-z0-9]/g, '');
    return `https://logo.clearbit.com/${clean}.com`;
  };

  const stageInfo = STAGES[app.stage] || { label: app.stage, color: '#00f5a0' };
  const hasNextRound = app.nextRoundDate && new Date(app.nextRoundDate) > new Date();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-xs font-mono transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Tracked Applications
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#08100e] hover:bg-[#0c1815] border border-white/10 rounded-xl text-xs font-mono text-white transition-all cursor-pointer"
          >
            <FiEdit3 className="w-3.5 h-3.5 text-[#00f5a0]" /> Edit Details
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 bg-[#08100e] hover:bg-red-500/20 border border-white/10 rounded-xl text-xs text-gray-400 hover:text-red-400 transition-all cursor-pointer"
            title="Delete Entry"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Header Hero Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#08100e] border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#040807] border border-white/10 p-2 flex items-center justify-center shrink-0">
              <img
                src={getCompanyLogo()}
                alt={app.company}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.company)}&background=00f5a0&color=000&bold=true`;
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{app.title}</h1>
                <Badge label={stageInfo.label} color={stageInfo.color} />
              </div>
              <p className="text-base font-bold text-[#00f5a0] font-mono">{app.company}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1">
                  <FiMapPin className="text-[#00f5a0]" /> {app.location || 'Remote'}
                </span>
                {app.salary && (
                  <span className="flex items-center gap-1 text-white">
                    <FiDollarSign className="text-cyan-400" /> {app.salary}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FiClock className="text-gray-500" /> Applied: {formatDate(app.dateApplied || app.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Apply / Job Link */}
          {app.jobUrl && (
            <a
              href={app.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00f5a0] hover:bg-[#00d88d] text-black font-bold text-xs font-mono rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all self-start"
            >
              <span>Original Job Portal</span>
              <FiExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Stage Advancement Switcher */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Fast Advance Pipeline Stage</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(STAGES).map(([key, info]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleUpdate({ stage: key })}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  app.stage === key
                    ? 'bg-[#00f5a0] text-black font-bold shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                    : 'bg-[#040807] hover:bg-white/5 text-gray-400 border border-white/5'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                {info.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Exam/Interview Schedule + Skills + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Exam Radar & Skills) */}
        <div className="lg:col-span-5 space-y-6">
          {/* UPCOMING EXAM & ROUND CARD */}
          <div className="p-6 rounded-2xl bg-[#08100e] border border-[#00f5a0]/30 space-y-4 shadow-lg">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-[#00f5a0]" /> Next Round / Exam Radar
            </h3>

            {app.nextRoundDate ? (
              <div className="p-4 rounded-xl bg-[#040807] border border-[#00f5a0]/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">ROUND TYPE</span>
                  <span className="text-[#00f5a0] font-bold">
                    {NEXT_ROUND_LABELS[app.nextRoundType] || app.nextRoundType}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">SCHEDULED DATE</span>
                  <span className="text-white font-bold">{formatDate(app.nextRoundDate)}</span>
                </div>
                {app.nextRoundNotes && (
                  <p className="text-xs text-gray-400 pt-2 border-t border-white/5">
                    {app.nextRoundNotes}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500 font-mono italic">
                No upcoming exam or interview round scheduled yet. Click "Edit Details" to set your next interview date.
              </p>
            )}
          </div>

          {/* MISSING & MATCHED SKILLS CARD */}
          <div className="p-6 rounded-2xl bg-[#08100e] border border-white/10 space-y-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FiShield className="w-4 h-4 text-[#00f5a0]" /> Skill Relevancy
            </h3>

            {app.missingSkills && app.missingSkills.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                  <FiAlertCircle className="w-3.5 h-3.5" /> Missing Technical Keywords:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {app.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/40 text-amber-400 text-xs font-mono"
                    >
                      ! {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#00f5a0]/10 border border-[#00f5a0]/30 text-xs font-mono text-[#00f5a0] flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 shrink-0" />
                <span>All key technical requirements are fulfilled in your profile!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Interview Notes & Contacts) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Notes Log */}
          <div className="p-6 rounded-2xl bg-[#08100e] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FiFileText className="w-4 h-4 text-[#00f5a0]" /> Interview Notes & Logs ({app.notes?.length || 0})
              </h3>
              <button
                onClick={() => setIsNoteModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#00f5a0]/20 text-[#00f5a0] border border-[#00f5a0]/30 hover:bg-[#00f5a0]/30 text-xs font-mono flex items-center gap-1 cursor-pointer"
              >
                <FiPlus className="w-3.5 h-3.5" /> Add Note
              </button>
            </div>

            {app.notes && app.notes.length > 0 ? (
              <div className="space-y-3">
                {app.notes.slice().reverse().map((note, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#040807] border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                      <span>Log #{app.notes.length - i}</span>
                      <span>{formatDate(note.createdAt, true)}</span>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-white/10 rounded-xl text-xs text-gray-500 font-mono">
                No notes logged yet. Keep track of recruiter feedback, salary negotiations, and interview questions here.
              </div>
            )}
          </div>

          {/* Recruiter Contacts */}
          <div className="p-6 rounded-2xl bg-[#08100e] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FiUserPlus className="w-4 h-4 text-cyan-400" /> Recruiter & Panel Contacts ({app.contacts?.length || 0})
              </h3>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/30 text-xs font-mono flex items-center gap-1 cursor-pointer"
              >
                <FiPlus className="w-3.5 h-3.5" /> Add Contact
              </button>
            </div>

            {app.contacts && app.contacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {app.contacts.map((contact, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#040807] border border-white/10 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white">{contact.name}</h4>
                        <span className="text-xs text-[#00f5a0] font-mono">{contact.role || 'Recruiter'}</span>
                      </div>
                      {contact.linkedin && (
                        <a href={contact.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#00f5a0]">
                          <FiLinkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    {contact.email && (
                      <div className="text-xs text-gray-400 font-mono flex items-center gap-1">
                        <FiMail className="w-3 h-3 text-gray-500" />
                        <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-white/10 rounded-xl text-xs text-gray-500 font-mono">
                No recruiter or interviewer contacts added.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <ApplicationFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={app}
      />

      {/* Add Note Modal */}
      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="Add Application Note">
        <form onSubmit={handleAddNote} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Note Details</label>
            <textarea
              rows={4}
              required
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="e.g. Completed round 2 live coding. Recruiter mentioned offer decision by next Friday..."
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f5a0]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsNoteModalOpen(false)} className="px-4 py-2 bg-white/5 text-xs font-mono text-gray-300 rounded-xl">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#00f5a0] text-black font-bold text-xs font-mono rounded-xl">Save Note</button>
          </div>
        </form>
      </Modal>

      {/* Add Contact Modal */}
      <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} title="Add Recruiter Contact">
        <form onSubmit={handleAddContact} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Contact Name *</label>
            <input
              type="text"
              required
              value={contactData.name}
              onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
              placeholder="e.g. Sarah Jenkins"
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f5a0]"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Role / Title</label>
            <input
              type="text"
              value={contactData.role}
              onChange={(e) => setContactData({ ...contactData, role: e.target.value })}
              placeholder="e.g. Senior Tech Recruiter"
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f5a0]"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={contactData.email}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              placeholder="sarah@company.com"
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f5a0]"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">LinkedIn Profile URL</label>
            <input
              type="url"
              value={contactData.linkedin}
              onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3.5 py-2.5 bg-[#08100e] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00f5a0]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsContactModalOpen(false)} className="px-4 py-2 bg-white/5 text-xs font-mono text-gray-300 rounded-xl">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#00f5a0] text-black font-bold text-xs font-mono rounded-xl">Save Contact</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Tracked Application"
        message="Are you sure you want to delete this tracked application? All logs and upcoming interview events will be deleted."
      />
    </div>
  );
}
