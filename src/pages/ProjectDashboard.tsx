import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from '@/components/TaskForm';
import { KanbanBoard } from '@/components/KanbanBoard';
import { GanttChart } from '@/components/GanttChart';
import { TaskFilter } from '@/components/TaskFilter';
import { useTask } from '@/contexts/TaskContext';
import { TaskStatus, Task } from '@/types/task';
import { Plus, BarChart3, Kanban, Calendar, CheckCircle, Clock, AlertCircle, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'kanban' | 'gantt';

export default function ProjectDashboard() {
  const { tasks } = useTask();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [responsibleFilter, setResponsibleFilter] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    doing: tasks.filter(t => t.status === 'doing').length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => t.status === 'overdue').length
  };

  const handleStatusClick = (status: TaskStatus) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(status);
      setViewMode('gantt'); // Sempre mostrar Gantt quando filtrar por status
    }
  };

  const handleClearStatusFilter = () => {
    setSelectedStatus(null);
  };

  const handleResponsibleFilterChange = (value: string) => {
    setResponsibleFilter(value);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-card">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Controle de Atividades
              </h1>
              <p className="text-muted-foreground">
                Gerencie suas atividades de projeto com visões Kanban e Gantt
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowTaskForm(true)}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Atividade
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card 
              className={cn(
                "bg-background border-border shadow-soft cursor-pointer transition-all hover:shadow-medium hover:scale-105",
                selectedStatus === 'todo' && "ring-2 ring-pending bg-pending/5"
              )}
              onClick={() => handleStatusClick('todo')}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-pending" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stats.todo}</div>
                <div className="text-xs text-muted-foreground">À Fazer</div>
              </CardContent>
            </Card>

            <Card 
              className={cn(
                "bg-background border-border shadow-soft cursor-pointer transition-all hover:shadow-medium hover:scale-105",
                selectedStatus === 'doing' && "ring-2 ring-progress bg-progress/5"
              )}
              onClick={() => handleStatusClick('doing')}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <PlayCircle className="h-5 w-5 text-progress" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stats.doing}</div>
                <div className="text-xs text-muted-foreground">Fazendo</div>
              </CardContent>
            </Card>

            <Card 
              className={cn(
                "bg-background border-border shadow-soft cursor-pointer transition-all hover:shadow-medium hover:scale-105",
                selectedStatus === 'done' && "ring-2 ring-completed bg-completed/5"
              )}
              onClick={() => handleStatusClick('done')}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-completed" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stats.done}</div>
                <div className="text-xs text-muted-foreground">Feito</div>
              </CardContent>
            </Card>

            <Card 
              className={cn(
                "bg-background border-border shadow-soft cursor-pointer transition-all hover:shadow-medium hover:scale-105",
                selectedStatus === 'overdue' && "ring-2 ring-destructive bg-destructive/5"
              )}
              onClick={() => handleStatusClick('overdue')}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stats.overdue}</div>
                <div className="text-xs text-muted-foreground">Atrasado</div>
              </CardContent>
            </Card>
          </div>

          {/* View Toggle - Only show if no status filter is active */}
          {!selectedStatus && (
            <div className="flex items-center gap-2 mt-6">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                onClick={() => setViewMode('kanban')}
                className={cn(
                  "font-medium",
                  viewMode === 'kanban' 
                    ? "bg-gradient-primary text-primary-foreground" 
                    : "border-border hover:bg-muted"
                )}
              >
                <Kanban className="h-4 w-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'gantt' ? 'default' : 'outline'}
                onClick={() => setViewMode('gantt')}
                className={cn(
                  "font-medium",
                  viewMode === 'gantt' 
                    ? "bg-gradient-primary text-primary-foreground" 
                    : "border-border hover:bg-muted"
                )}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Gantt
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Show filters when status is selected or when in gantt mode */}
        {(selectedStatus || viewMode === 'gantt') && (
          <div className="p-6 pb-0">
            <TaskFilter
              responsibleFilter={responsibleFilter}
              onResponsibleFilterChange={handleResponsibleFilterChange}
              selectedStatus={selectedStatus}
              onStatusFilterClear={handleClearStatusFilter}
            />
          </div>
        )}
        
        {selectedStatus || viewMode === 'gantt' ? (
          <GanttChart 
            statusFilter={selectedStatus} 
            responsibleFilter={responsibleFilter}
          />
        ) : (
          <KanbanBoard onEditTask={handleEditTask} />
        )}
      </div>

      {/* Task Form Dialog */}
      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent className="max-w-2xl bg-background border-border">
          <DialogHeader>
            <DialogTitle className="sr-only">Nova Atividade</DialogTitle>
          </DialogHeader>
          <TaskForm onClose={handleCloseTaskForm} editTask={editingTask} />
        </DialogContent>
      </Dialog>
    </div>
  );
}