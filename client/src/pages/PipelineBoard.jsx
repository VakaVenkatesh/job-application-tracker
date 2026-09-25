import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useApplications, useMoveStage } from '../hooks/useApplications';
import { KanbanColumn } from '../components/board/KanbanColumn';
import { STAGES } from '../utils/constants';
import { EmptyState } from '../components/common/EmptyState';
import { FiSliders } from 'react-icons/fi';

export const PipelineBoard = ({ onOpenCreateModal, onSelectApplication, searchTerm }) => {
  const { data: applications = [], isLoading, error } = useApplications({ search: searchTerm });
  const moveStageMutation = useMoveStage();

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Trigger backend mutation with optimistic update
    moveStageMutation.mutate({
      id: draggableId,
      stage: destination.droppableId
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex gap-6 overflow-x-auto">
        {STAGES.map(s => (
          <div key={s.id} className="w-80 h-[600px] bg-slate-900/60 rounded-2xl animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        Failed to load applications: {error.message}
      </div>
    );
  }

  // Group applications by stage
  const appsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = applications.filter(app => app.stage === stage.id);
    return acc;
  }, {});

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 space-y-4">
      {/* Board Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-white">Interactive Pipeline Board</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Drag and drop cards between stages to update status in real-time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{applications.length}</strong> applications
          </span>
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
