import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useApplications, useMoveStage } from '../hooks/useApplications';
import { KanbanColumn } from '../components/board/KanbanColumn';
import { STAGES } from '../utils/constants';
import { EmptyState } from '../components/common/EmptyState';
import { FiColumns, FiPlus } from 'react-icons/fi';

export const PipelineBoard = ({ onOpenCreateModal, onSelectApplication, searchTerm }) => {
  const { data: applications = [], isLoading, error } = useApplications({ search: searchTerm });
  const moveStageMutation = useMoveStage();

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    moveStageMutation.mutate({
      id: draggableId,
      stage: destination.droppableId
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex gap-6 overflow-x-auto max-w-7xl mx-auto">
        {STAGES.map(s => (
          <div key={s.id} className="w-80 h-[600px] bg-[#081210] rounded-3xl animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-rose-400 bg-[#081210] border border-rose-900/50 rounded-3xl max-w-7xl mx-auto my-8">
        Failed to load applications: {error.message}
      </div>
    );
  }

  const appsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = applications.filter(app => app.stage === stage.id);
    return acc;
  }, {});

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 space-y-4 max-w-7xl mx-auto">
      {/* Board Header */}
      <div className="flex items-center justify-between flex-shrink-0 p-5 rounded-3xl bg-[#081210]/90 border border-[#00f5a0]/20 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f5a0] animate-ping" />
            <span className="text-[10px] font-extrabold text-[#00f5a0] uppercase tracking-wider">
              INTERACTIVE PIPELINE BOARD
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Kanban Pipeline Tracker
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Drag & drop cards between stage columns to update status in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 font-bold hidden sm:inline">
            Total Tracked: <strong className="text-[#00f5a0]">{applications.length}</strong>
          </span>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-[#00f5a0] hover:bg-[#00d294] text-black text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,245,160,0.3)] transition-all flex items-center gap-1.5"
          >
            <FiPlus className="w-4 h-4 text-black" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      {applications.length === 0 ? (
        <EmptyState
          title="No applications in pipeline"
          description="Start building your job search pipeline by adding your first application or seeding live jobs."
          actionLabel="Add New Application"
          onAction={onOpenCreateModal}
        />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 flex gap-4 overflow-x-auto pb-6 custom-scrollbar items-start">
            {STAGES.map(stage => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                apps={appsByStage[stage.id] || []}
                onCardClick={onSelectApplication}
                onAddInStage={onOpenCreateModal}
              />
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};
