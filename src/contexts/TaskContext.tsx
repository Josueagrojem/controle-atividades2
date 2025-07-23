import React, { createContext, useContext, ReactNode } from 'react';
import { Task, TaskFormData, TaskStatus } from '@/types/task';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: TaskFormData) => void;
  updateTask: (id: string, updates: Partial<TaskFormData>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByResponsible: (responsible: string) => Task[];
  getAllResponsible: () => string[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask deve ser usado dentro de um TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { tasks, loading, addTask, updateTask, deleteTask, updateTaskStatus } = useSupabaseTasks();

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByResponsible = (responsible: string): Task[] => {
    return tasks.filter(task => 
      task.responsible.toLowerCase().includes(responsible.toLowerCase())
    );
  };

  const getAllResponsible = (): string[] => {
    const responsibleSet = new Set<string>();
    tasks.forEach(task => {
      responsibleSet.add(task.responsible);
      task.involved.forEach(person => responsibleSet.add(person));
    });
    return Array.from(responsibleSet).sort();
  };

  const value: TaskContextType = {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksByStatus,
    getTasksByResponsible,
    getAllResponsible
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskProvider, useTask };