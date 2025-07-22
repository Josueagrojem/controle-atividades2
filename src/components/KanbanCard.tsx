import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Hash, MoreVertical } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTask } from '@/contexts/TaskContext';

interface KanbanCardProps {
  task: Task;
  isDragging?: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, isDragging = false }) => {
  const { deleteTask } = useTask();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'done';

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all duration-200",
        isDragging || isSortableDragging && "opacity-50 rotate-2 shadow-strong",
        isOverdue && "border-destructive/50"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-foreground text-sm leading-tight flex-1 mr-2">
            {task.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 hover:bg-muted/50"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem 
                className="text-destructive hover:text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Hash className="h-3 w-3" />
            <span>{task.sharepointId}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{task.responsible}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className={cn(
              "flex items-center gap-1.5 text-xs",
              isOverdue ? "text-destructive" : "text-muted-foreground"
            )}>
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.deadline)}</span>
            </div>
            
            {isOverdue && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                Atrasado
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};