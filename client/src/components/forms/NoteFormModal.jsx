import React, { useState } from 'react';
import { Modal } from '../common/Modal';

export const NoteFormModal = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({ content });
    setContent('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Application Note" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Note Content *</label>
          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Log interview feedback, salary discussions, preparation notes, or follow-up tasks..."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/20"
          >
            {isLoading ? 'Saving...' : 'Add Note'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
