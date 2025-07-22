import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTask } from '@/contexts/TaskContext';
import { TaskFormData } from '@/types/task';
import { Plus } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  sharepointId: z.string().min(1, 'ID do SharePoint é obrigatório'),
  responsible: z.string().min(1, 'Responsável é obrigatório'),
  deadline: z.string().min(1, 'Prazo é obrigatório'),
  description: z.string().optional()
});

interface TaskFormProps {
  onClose?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onClose }) => {
  const { addTask } = useTask();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema)
  });

  const onSubmit = (data: TaskFormData) => {
    addTask(data);
    reset();
    onClose?.();
  };

  return (
    <Card className="bg-gradient-card border-none shadow-medium">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Nova Atividade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-foreground">
                Título da Tarefa
              </Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Ex: Implementar nova funcionalidade"
                className="bg-background border-border focus:border-primary"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sharepointId" className="text-sm font-medium text-foreground">
                ID do SharePoint
              </Label>
              <Input
                id="sharepointId"
                {...register('sharepointId')}
                placeholder="Ex: SP001"
                className="bg-background border-border focus:border-primary"
              />
              {errors.sharepointId && (
                <p className="text-sm text-destructive">{errors.sharepointId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsible" className="text-sm font-medium text-foreground">
                Responsável
              </Label>
              <Input
                id="responsible"
                {...register('responsible')}
                placeholder="Ex: João Silva"
                className="bg-background border-border focus:border-primary"
              />
              {errors.responsible && (
                <p className="text-sm text-destructive">{errors.responsible.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-medium text-foreground">
                Prazo
              </Label>
              <Input
                id="deadline"
                type="date"
                {...register('deadline')}
                className="bg-background border-border focus:border-primary"
              />
              {errors.deadline && (
                <p className="text-sm text-destructive">{errors.deadline.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Descrição (opcional)
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descreva os detalhes da tarefa..."
              rows={3}
              className="bg-background border-border focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium px-6"
            >
              Criar Atividade
            </Button>
            {onClose && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-border hover:bg-muted"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};