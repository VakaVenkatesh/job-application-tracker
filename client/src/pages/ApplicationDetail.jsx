import React, { useState } from 'react';
import { useApplication, useUpdateApplication, useDeleteApplication, useAddContact, useAddNote } from '../hooks/useApplications';
import { StageBadge, ColdEmailBadge } from '../components/common/Badge';
import { ContactFormModal } from '../components/forms/ContactFormModal';
import { NoteFormModal } from '../components/forms/NoteFormModal';
import { ApplicationFormModal } from '../components/forms/ApplicationFormModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { STAGES, COLD_EMAIL_STATUSES } from '../utils/constants';
import { formatDate, formatSalary, formatRelativeTime } from '../utils/formatters';
import {
  FiArrowLeft,
  FiEdit3,
  FiTrash2,
  FiExternalLink,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiUserPlus,
  FiFileText,
  FiMail,
  FiLinkedin,
  FiPlus,
  FiCopy
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export const ApplicationDetail = ({ applicationId, onBack }) => {
  const { data: app, isLoading, error } = useApplication(applicationId);
  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();
  const addContactMutation = useAddContact();
  const addNoteMutation = useAddNote();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <div className="h-8 w-32 bg-slate-800 rounded animate-pulse" />
        <div className="h-48 bg-slate-900 rounded-2xl animate-pulse" />
        <div className="h-64 bg-slate-900 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto">
        <p className="text-red-400 font-semibold mb-4">Application not found</p>
        <button onClick={onBack} className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-sm">
          Return to applications list
        </button>
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
      onSuccess: () => onBack()
    });
  };

  const handleAddContact = (contactData) => {
    addContactMutation.mutate({ id: app._id, contact: contactData }, {
      onSuccess: () => setIsContactModalOpen(false)
    });
  };

  const handleAddNote = (noteData) => {
    addNoteMutation.mutate({ id: app._id, note: noteData }, {
      onSuccess: () => setIsNoteModalOpen(false)
    });
  };

  const generateColdEmailText = (contactName = 'Hiring Team') => {
    return `Hi ${contactName},

I recently saw the ${app.title} opening at ${app.company} and wanted to reach out directly. 

With my experience in full-stack web development and software engineering, I’m particularly drawn to ${app.company}'s work. I've attached my resume and would welcome the opportunity to discuss how my skills align with your engineering goals.

Best regards,
[Your Name]
[Your Portfolio / LinkedIn]`;
  };

  const copyEmailTemplate = () => {
    const text = generateColdEmailText();
    navigator.clipboard.writeText(text);
    toast.success('Cold email template copied to clipboard!');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Pipeline
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200 transition-all"
          >
            <FiEdit3 className="w-3.5 h-3.5 text-indigo-400" />
            Edit Entry
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-red-400 transition-all"
            title="Delete Application"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel border border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            {app.companyLogo ? (
              <img
                src={app.companyLogo}
                alt={app.company}
                className="w-16 h-16 rounded-2xl object-contain bg-slate-900 p-2 border border-slate-800 shadow-md"
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-extrabold text-2xl flex items-center justify-center shadow-md">
                {app.company ? app.company.charAt(0).toUpperCase() : '?'}
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{app.title}</h1>
                <StageBadge stageId={app.stage} className="text-xs" />
              </div>
              <p className="text-lg font-semibold text-indigo-400">{app.company}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <FiMapPin className="text-slate-500" /> {app.location || 'Remote'}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <FiDollarSign /> {formatSalary(app.salaryMin, app.salaryMax, app.currency)}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock className="text-slate-500" /> Applied: {formatDate(app.appliedDate || app.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Job URL Button */}
          {app.jobUrl && (
            <a
              href={app.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-xs rounded-xl transition-all self-start"
            >
              <span>View Job Posting</span>
              <FiExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Stage Change Controls */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Move Pipeline Stage</p>
          <div className="flex flex-wrap gap-2">
            {STAGES.map(s => (
              <button
                key={s.id}
                onClick={() => handleUpdate({ stage: s.id })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  app.stage === s.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Details, Right Column Contacts & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Details + Cold Email Generator) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Cold Email Outreach Status Widget */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FiMail className="text-purple-400" /> Cold Email Outreach
              </h3>
              <ColdEmailBadge statusId={app.coldEmailStatus} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Update Outreach Status</label>
              <select
                value={app.coldEmailStatus}
                onChange={(e) => handleUpdate({ coldEmailStatus: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {COLD_EMAIL_STATUSES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowEmailTemplate(!showEmailTemplate)}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FiCopy className="w-3.5 h-3.5" />
              {showEmailTemplate ? 'Hide Cold Email Template' : 'Generate Cold Email Template'}
            </button>

            {showEmailTemplate && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
                <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed text-[11px]">
                  {generateColdEmailText()}
                </pre>
                <button
                  onClick={copyEmailTemplate}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-all"
                >
                  Copy Template Text
                </button>
              </div>
            )}
          </div>

          {/* Job Details Card */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-3">
            <h3 className="font-bold text-sm text-white">Application Meta</h3>

            <div className="text-xs space-y-2 text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">Source</span>
                <span className="font-medium text-slate-200">{app.source || 'Manual Entry'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">Job Type</span>
                <span className="font-medium text-slate-200">{app.jobType || 'Full-time'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">Last Modified</span>
                <span className="font-medium text-slate-200">{formatRelativeTime(app.updatedAt)}</span>
              </div>
            </div>

            {app.tags && app.tags.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400 block mb-1.5">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {app.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs bg-slate-900 text-indigo-300 rounded-lg border border-slate-800 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Recruiter Contacts & Notes) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recruiter Contacts Section */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <FiUserPlus className="text-indigo-400" /> Recruiter Contacts ({app.contacts?.length || 0})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Key recruiters, hiring managers, and interviewers</p>
              </div>

              <button
                onClick={() => setIsContactModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20"
              >
                <FiPlus className="w-3.5 h-3.5" />
                Add Contact
              </button>
            </div>

            {app.contacts && app.contacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {app.contacts.map((contact, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-200">{contact.name}</h4>
                        <span className="text-xs text-indigo-400 font-medium">{contact.role || 'Recruiter'}</span>
                      </div>
                      {contact.linkedin && (
                        <a
                          href={contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-blue-400"
                        >
                          <FiLinkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {contact.email && (
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <FiMail className="text-slate-500" />
                        <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                      </div>
                    )}

                    {contact.notes && (
                      <p className="text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        {contact.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                No recruiter contacts logged yet. Click "Add Contact" to save recruiter details.
              </div>
            )}
          </div>

          {/* Notes & Activity Log Section */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <FiFileText className="text-purple-400" /> Notes & Application Timeline ({app.notes?.length || 0})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Interview logs, salary notes, and updates</p>
              </div>

              <button
                onClick={() => setIsNoteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/60 transition-all"
              >
                <FiPlus className="w-3.5 h-3.5 text-purple-400" />
                Add Note
              </button>
            </div>

            {app.notes && app.notes.length > 0 ? (
              <div className="space-y-3">
                {app.notes.slice().reverse().map((note, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-400">Note Entry</span>
                      <span>{formatDate(note.createdAt, true)}</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                No notes added yet. Keep track of interview feedback and thoughts here.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ApplicationFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={app}
        isLoading={updateMutation.isPending}
      />

      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSubmit={handleAddContact}
        isLoading={addContactMutation.isPending}
      />

      <NoteFormModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSubmit={handleAddNote}
        isLoading={addNoteMutation.isPending}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Application Entry"
        message="Are you sure you want to delete this job application? This action cannot be undone."
        confirmText="Permanently Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
