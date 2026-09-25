import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import { FiPlus } from 'react-icons/fi';

export const KanbanColumn = ({ stage, apps = [], onCardClick, onAddInStage }) => {
  return (
    <div className="flex-shrink-0 w-80 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex flex-col max-h-full">
      {/* Column Header */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
          <h3 className="font-bold text-sm text-slate-200">{stage.label}</h3>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
            {apps.length}
          </span>
        </div>

        <button
          onClick={() => onAddInStage(stage.id)}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title={`Add application to ${stage.label}`}
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 overflow-y-auto custom-scrollbar min-h-[300px] transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-indigo-500/5 ring-1 ring-indigo-500/30 rounded-b-2xl' : ''
            }`}
          >
            {apps.map((app, index) => (
              <KanbanCard key={app._id} app={app} index={index} onClick={onCardClick} />
            ))}
            {provided.placeholder}

            {apps.length === 0 && (
              <div className="h-32 border-2 border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-xs text-slate-600 font-medium">
                Drop applications here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
