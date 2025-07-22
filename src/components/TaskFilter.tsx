import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, User } from 'lucide-react';
import { TaskStatus } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskFilterProps {
  responsibleFilter: string;
  onResponsibleFilterChange: (value: string) => void;
  selectedStatus: TaskStatus | null;
  onStatusFilterClear: () => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  responsibleFilter,
  onResponsibleFilterChange,
  selectedStatus,
  onStatusFilterClear
}) => {
  const getStatusLabel = (status: TaskStatus | null) => {
    switch (status) {
      case 'todo': return 'À Fazer';
      case 'doing': return 'Fazendo';
      case 'done': return 'Feito';
      case 'overdue': return 'Atrasado';
      default: return null;
    }
  };

  const getStatusColor = (status: TaskStatus | null) => {
    switch (status) {
      case 'todo': return 'text-pending border-pending bg-pending/10';
      case 'doing': return 'text-progress border-progress bg-progress/10';
      case 'done': return 'text-completed border-completed bg-completed/10';
      case 'overdue': return 'text-destructive border-destructive bg-destructive/10';
      default: return '';
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-soft mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Filtro por Responsável */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="responsible-filter" className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Filtrar por Responsável ou Envolvido
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="responsible-filter"
                type="text"
                placeholder="Digite o nome da pessoa (responsável ou envolvido)..."
                value={responsibleFilter}
                onChange={(e) => onResponsibleFilterChange(e.target.value)}
                className="pl-10 bg-background border-border focus:border-primary"
              />
              {responsibleFilter && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onResponsibleFilterChange('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted/50"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Status Filter Display */}
          {selectedStatus && (
            <div className="flex items-center gap-2">
              <div className={cn(
                "px-3 py-2 rounded-lg border-2 font-medium text-sm flex items-center gap-2",
                getStatusColor(selectedStatus)
              )}>
                <span>Filtrando: {getStatusLabel(selectedStatus)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onStatusFilterClear}
                  className="h-4 w-4 p-0 hover:bg-current hover:bg-opacity-20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Clear All Filters */}
          {(responsibleFilter || selectedStatus) && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onResponsibleFilterChange('');
                onStatusFilterClear();
              }}
              className="border-border hover:bg-muted"
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};