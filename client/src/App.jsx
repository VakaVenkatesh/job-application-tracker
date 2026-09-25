import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import { Dashboard } from './pages/Dashboard';
import { PipelineBoard } from './pages/PipelineBoard';
import ApplicationsList from './pages/ApplicationsList';
import ApplicationDetail from './pages/ApplicationDetail';
import JobDiscovery from './pages/JobDiscovery';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import ApplicationFormModal from './components/forms/ApplicationFormModal';
import { AuthModal } from './components/auth/AuthModal';
import { useAuth } from './context/AuthContext';

export function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const handleSelectApplication = (app) => {
    navigate(`/applications/${app._id}`);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#040908] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#00f5a0] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 font-mono">Initializing Aspirant Portal...</p>
        </div>
      </div>
    );
  }

  // Public View for Guests (Unauthenticated Users)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#040908] text-gray-100 antialiased selection:bg-[#00f5a0] selection:text-black">
        {/* Top Public Header */}
        <header className="sticky top-0 z-40 h-16 bg-[#040908]/90 backdrop-blur-md border-b border-[#00f5a0]/15 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00f5a0] text-black font-black flex items-center justify-center text-lg shadow-[0_0_15px_rgba(0,245,160,0.4)]">
              ⚡
            </div>
            <span className="font-black text-base text-white tracking-tight">
              JOBTRACK<span className="text-[#00f5a0]">.PRO</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-2 rounded-xl bg-[#00f5a0] hover:bg-[#00d88d] text-black font-bold text-xs font-mono shadow-[0_0_20px_rgba(0,245,160,0.3)] transition-all cursor-pointer"
            >
              Sign In / Get Started
            </button>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<LandingPage onOpenAuth={() => setIsAuthModalOpen(true)} />} />
            <Route path="/jobs" element={<div className="p-6 max-w-7xl mx-auto"><JobDiscovery /></div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  // Authenticated Workspace for Job Aspirants
  return (
    <div className="flex min-h-screen bg-[#040908] text-gray-100 antialiased selection:bg-[#00f5a0] selection:text-black font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Command Center Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <Routes>
            <Route path="/" element={<Navigate to="/jobs" replace />} />
            <Route path="/jobs" element={<JobDiscovery />} />
            <Route path="/dashboard" element={<Dashboard onOpenCreateModal={() => setIsCreateModalOpen(true)} />} />
            <Route
              path="/board"
              element={
                <PipelineBoard
                  onOpenCreateModal={() => setIsCreateModalOpen(true)}
                  onSelectApplication={handleSelectApplication}
                  searchTerm={searchTerm}
                />
              }
            />
            <Route path="/applications" element={<ApplicationsList />} />
            <Route path="/applications/:id" element={<ApplicationDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Application Create Modal */}
      <ApplicationFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default App;
