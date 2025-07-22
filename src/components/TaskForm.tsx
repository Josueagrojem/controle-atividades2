import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTask } from '@/contexts/TaskContext';
import { TaskFormData, Task } from '@/types/task';
import { Plus, X, Users } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  sharepointId: z.string().min(1, 'ID do SharePoint é obrigatório'),
  responsible: z.string().min(1, 'Responsável é obrigatório'),
  involved: z.array(z.string()).default([]),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  deadline: z.string().min(1, 'Prazo é obrigatório'),
  description: z.string().optional()
});

interface TaskFormProps {
  onClose?: () => void;
  editTask?: Task | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, editTask }) => {
  const { addTask, updateTask } = useTask();
  const [newInvolvedPerson, setNewInvolvedPerson] = useState('');
  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: editTask?.title || '',
      sharepointId: editTask?.sharepointId || '',
      responsible: editTask?.responsible || '',
      involved: editTask?.involved || [],
      startDate: editTask?.startDate || '',
      deadline: editTask?.deadline || '',
      description: editTask?.description || ''
    }
  });

  const watchedInvolved = watch('involved');

  const addInvolvedPerson = () => {
    if (newInvolvedPerson.trim() && !watchedInvolved.includes(newInvolvedPerson.trim())) {
      setValue('involved', [...watchedInvolved, newInvolvedPerson.trim()]);
      setNewInvolvedPerson('');
    }
  };

  const removeInvolvedPerson = (personToRemove: string) => {
    setValue('involved', watchedInvolved.filter(person => person !== personToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInvolvedPerson();
    }
  };

  const onSubmit = (data: TaskFormData) => {
    if (editTask) {
      updateTask(editTask.id, data);
    } else {
      addTask(data);
    }
    reset();
    setNewInvolvedPerson('');
    onClose?.();
  };

  return (
    <Card className="bg-gradient-card border-none shadow-medium">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          {editTask ? 'Editar Atividade' : 'Nova Atividade'}
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
              <Label htmlFor="startDate" className="text-sm font-medium text-foreground">
                Data de Início
              </Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="bg-background border-border focus:border-primary"
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
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
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Envolvidos
            </Label>
            
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Digite o nome da pessoa"
                value={newInvolvedPerson}
                onChange={(e) => setNewInvolvedPerson(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-border focus:border-primary flex-1"
              />
              <Button
                type="button"
                onClick={addInvolvedPerson}
                variant="outline"
                className="px-3 border-border hover:bg-muted"
                disabled={!newInvolvedPerson.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {watchedInvolved.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {watchedInvolved.map((person, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 px-2 py-1"
                  >
                    {person}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInvolvedPerson(person)}
                      className="h-4 w-4 p-0 hover:bg-primary/20 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
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
              {editTask ? 'Salvar Alterações' : 'Criar Atividade'}
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