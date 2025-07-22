import React, { useMemo } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskStatus } from '@/types/task';

interface GanttChartProps {
  statusFilter?: TaskStatus | null;
  responsibleFilter?: string;
}

export const GanttChart: React.FC<GanttChartProps> = ({ 
  statusFilter = null, 
  responsibleFilter = '' 
}) => {
  const { tasks } = useTask();

  const ganttData = useMemo(() => {
    // Aplicar filtros
    let filteredTasks = tasks;
    
    if (statusFilter) {
      filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }
    
    if (responsibleFilter.trim()) {
      filteredTasks = filteredTasks.filter(task => 
        task.responsible.toLowerCase().includes(responsibleFilter.toLowerCase())
      );
    }

    if (filteredTasks.length === 0) return { tasks: [], dates: [], startDate: new Date(), endDate: new Date() };

    const sortedTasks = [...filteredTasks].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    
    const allDates = sortedTasks.map(task => new Date(task.deadline));
    const startDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const endDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    // Adicionar buffer de alguns dias
    startDate.setDate(startDate.getDate() - 7);
    endDate.setDate(endDate.getDate() + 7);
    
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const totalDays = dates.length;
    
    const tasksWithPositions = sortedTasks.map(task => {
      const taskDate = new Date(task.deadline);
      const dayIndex = Math.floor((taskDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const position = (dayIndex / totalDays) * 100;
      
      return {
        ...task,
        position: Math.max(0, Math.min(100, position)),
        isOverdue: taskDate < new Date() && task.status !== 'done'
      };
    });
    
    return { tasks: tasksWithPositions, dates, startDate, endDate };
  }, [tasks, statusFilter, responsibleFilter]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-completed';
      case 'doing': return 'bg-progress';
      case 'overdue': return 'bg-destructive';
      default: return 'bg-pending';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done': return 'Feito';
      case 'doing': return 'Fazendo';
      case 'overdue': return 'Atrasado';
      default: return 'À Fazer';
    }
  };

  if (ganttData.tasks.length === 0) {
    const message = statusFilter || responsibleFilter.trim() 
      ? 'Nenhuma atividade encontrada com os filtros aplicados' 
      : 'Nenhuma atividade encontrada';
    
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Card className="bg-gradient-card border-none shadow-medium">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{message}</h3>
            <p className="text-muted-foreground">
              {statusFilter || responsibleFilter.trim() 
                ? 'Tente ajustar os filtros para ver mais resultados.' 
                : 'Adicione algumas atividades para visualizar o cronograma Gantt.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full p-6 bg-background">
      <Card className="bg-gradient-card border-none shadow-medium h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Cronograma Gantt
            {(statusFilter || responsibleFilter.trim()) && (
              <span className="text-sm font-normal text-muted-foreground">
                ({ganttData.tasks.length} atividade{ganttData.tasks.length !== 1 ? 's' : ''})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full overflow-auto">
          {/* Timeline Header */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{formatDate(ganttData.startDate)}</span>
              <span className="font-medium text-foreground">Cronograma do Projeto</span>
              <span>{formatDate(ganttData.endDate)}</span>
            </div>
            <div className="mt-2 h-2 bg-border rounded-full relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20"></div>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            {ganttData.tasks.map((task, index) => (
              <div key={task.id} className="relative">
                <Card className="bg-background border-border shadow-soft hover:shadow-medium transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">{task.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            <span>{task.sharepointId}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{task.responsible}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(new Date(task.deadline))}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            task.status === 'done' && "border-completed text-completed",
                            task.status === 'doing' && "border-progress text-progress",
                            task.status === 'overdue' && "border-destructive text-destructive",
                            task.status === 'todo' && "border-pending text-pending"
                          )}
                        >
                          {getStatusText(task.status)}
                        </Badge>
                        {task.isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            Atrasado
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Timeline Bar */}
                    <div className="relative h-6 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "absolute top-0 h-full rounded-full transition-all duration-300",
                          getStatusColor(task.status),
                          task.isOverdue && "bg-destructive"
                        )}
                        style={{
                          left: `${Math.max(0, task.position - 2)}%`,
                          width: '4%',
                          minWidth: '8px'
                        }}
                      />
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-foreground rounded-full border-2 border-background shadow-sm"
                        style={{
                          left: `${task.position}%`,
                          transform: 'translateX(-50%) translateY(-50%)'
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <h5 className="font-medium text-foreground mb-3">Legenda</h5>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pending rounded-full"></div>
                <span className="text-sm text-muted-foreground">À Fazer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-progress rounded-full"></div>
                <span className="text-sm text-muted-foreground">Fazendo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-completed rounded-full"></div>
                <span className="text-sm text-muted-foreground">Feito</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <span className="text-sm text-muted-foreground">Atrasado</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};