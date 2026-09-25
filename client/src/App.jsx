import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Dashboard } from './pages/Dashboard';
import { PipelineBoard } from './pages/PipelineBoard';
import { ApplicationsList } from './pages/ApplicationsList';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { JobDiscovery } from './pages/JobDiscovery';
import { ApplicationFormModal } from './components/forms/ApplicationFormModal';
import { useCreateApplication } from './hooks/useApplications';

export function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);

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
