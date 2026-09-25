import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Dashboard } from './pages/Dashboard';
import { PipelineBoard } from './pages/PipelineBoard';
import { ApplicationsList } from './pages/ApplicationsList';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { JobDiscovery } from './pages/JobDiscovery';
import { LandingPage } from './pages/LandingPage';
import { ApplicationFormModal } from './components/forms/ApplicationFormModal';
import { AuthModal } from './components/auth/AuthModal';
import { useCreateApplication } from './hooks/useApplications';
import { useAuth } from './context/AuthContext';

export function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const createApplicationMutation = useCreateApplication();
  const navigate = useNavigate();

  const handleSelectApplication = (app) => {
    setSelectedAppId(app._id);
    navigate(`/applications/${app._id}`);
  };

  const handleCreateSubmit = (appData) => {
    createApplicationMutation.mutate(appData, {
      onSuccess: () => setIsCreateModalOpen(false)
    });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // Public View for Guests (Unauthenticated Users)
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }

  // Private Workspace View for Logged-In Users
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  onOpenCreateModal={() => setIsCreateModalOpen(true)}
                  onNavigate={(path) => navigate(path)}
                />
              }
            />
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
            <Route
              path="/applications"
              element={
                <ApplicationsList
                  onOpenCreateModal={() => setIsCreateModalOpen(true)}
                  onSelectApplication={handleSelectApplication}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              }
            />
            <Route
              path="/applications/:id"
              element={
                <ApplicationDetailRoute
                  selectedAppId={selectedAppId}
                  onBack={() => navigate('/board')}
                />
              }
            />
            <Route
              path="/discover"
              element={
                <JobDiscovery
                  onSelectApplication={handleSelectApplication}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Application Create Modal */}
      <ApplicationFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={createApplicationMutation.isPending}
      />
    </div>
  );
}

// Wrapper to extract route param for application detail page
import { useParams } from 'react-router-dom';
function ApplicationDetailRoute({ selectedAppId, onBack }) {
  const params = useParams();
  const id = params.id || selectedAppId;
  return <ApplicationDetail applicationId={id} onBack={onBack} />;
}

export default App;
