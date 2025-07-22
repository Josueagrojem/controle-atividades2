import React, { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  count: number;
  children: ReactNode;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  id, 
  title, 
  color, 
  count, 
  children 
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-gradient-card border border-border shadow-soft">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          color === 'pending' && "bg-pending text-pending-foreground",
          color === 'progress' && "bg-progress text-progress-foreground", 
          color === 'review' && "bg-review text-review-foreground",
          color === 'completed' && "bg-completed text-completed-foreground"
        )}>
          {count}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 min-h-32 p-3 rounded-lg border-2 border-dashed transition-colors",
          isOver 
            ? "border-primary bg-primary/5" 
            : "border-border bg-muted/30"
        )}
      >
        {children}
      </div>
    </div>
  );
};