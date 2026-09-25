import React from 'react';
import Modal from './Modal';
import { FiAlertTriangle } from 'react-icons/fi';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', isDanger = true, isLoading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center p-2">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isDanger ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
          <FiAlertTriangle className="w-7 h-7" />
        </div>
        <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed">{message}</p>
        
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 px-4 font-mono font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg ${
              isDanger
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                : 'bg-[#00f5a0] hover:bg-[#00d88d] text-black shadow-[0_0_20px_rgba(0,245,160,0.3)]'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
