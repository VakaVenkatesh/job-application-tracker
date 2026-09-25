import React, { useState } from 'react';
import { FiSearch, FiPlus, FiZap, FiLogOut, FiLogIn, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { Link, useNavigate } from 'react-router-dom';

export const Header = ({ onOpenCreateModal, searchTerm, setSearchTerm }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const hunterRank = user?.hunterStats?.rank || 'E-Rank';

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-[#040908]/90 backdrop-blur-md border-b border-[#00f5a0]/15 px-6 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f5a0]" />
          <input
            type="text"
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            placeholder="Search roles, companies, tech tags..."
            className="w-full pl-10 pr-4 py-2 bg-[#08100e] border border-white/10 rounded-xl text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00f5a0] transition-all"
          />
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Track Application Button */}
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f5a0] hover:bg-[#00d88d] text-black text-xs font-mono font-bold rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Track Application</span>
          </button>

          {/* User Profile / Auth Gate */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 bg-[#08100e] border border-[#00f5a0]/30 hover:border-[#00f5a0] rounded-xl transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#00f5a0] flex items-center justify-center text-xs font-black text-black">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-white max-w-[100px] truncate leading-tight">
                    {user?.name}
                  </span>
                  <span className="text-[9px] text-[#00f5a0] font-mono leading-none">
                    {hunterRank}
                  </span>
                </div>
              </Link>
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#08100e] border border-white/10 hover:border-red-500/30 rounded-xl transition-all cursor-pointer"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f5a0] hover:bg-[#00d88d] text-black text-xs font-mono font-bold rounded-xl shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all cursor-pointer"
            >
              <FiLogIn className="w-3.5 h-3.5" />
              <span>Sign In / Join</span>
            </button>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
