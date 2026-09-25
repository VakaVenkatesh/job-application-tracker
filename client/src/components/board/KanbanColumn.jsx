import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import { FiPlus } from 'react-icons/fi';

export const KanbanColumn = ({ stage, apps = [], onCardClick, onAddInStage }) => {
  return (
    <div className="flex-shrink-0 w-80 bg-[#040908] rounded-2xl border border-white/10 flex flex-col max-h-full">
      {/* Column Header */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
          <h3 className="font-bold text-xs font-mono text-white">{stage.label}</h3>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#08100e] text-[#00f5a0] border border-[#00f5a0]/30">
            {apps.length}
          </span>
        </div>

        <button
          onClick={() => onAddInStage(stage.id)}
          className="p-1 text-gray-400 hover:text-[#00f5a0] rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
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
            className={`flex-1 p-3 overflow-y-auto custom-scrollbar min-h-[350px] transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-[#00f5a0]/5 ring-1 ring-[#00f5a0]/30 rounded-b-2xl' : ''
            }`}
          >
            {apps.map((app, index) => (
              <KanbanCard key={app._id} app={app} index={index} onClick={onCardClick} />
            ))}
            {provided.placeholder}

            {apps.length === 0 && (
              <div className="h-32 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-xs font-mono text-gray-600">
                Drop applications here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
