import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskFormData, TaskStatus } from '@/types/task';

interface TaskContextType {
  tasks: Task[];
  addTask: (taskData: TaskFormData) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Configurar ambiente de desenvolvimento',
    sharepointId: 'SP001',
    responsible: 'João Silva',
    involved: ['Maria Santos', 'Pedro Costa'],
    startDate: '2024-07-15',
    deadline: '2024-08-15',
    status: 'done',
    description: 'Configurar todos os ambientes necessários para o projeto',
    createdAt: '2024-07-20T10:00:00Z',
    updatedAt: '2024-07-22T14:30:00Z'
  },
  {
    id: '2',
    title: 'Implementar sistema de autenticação',
    sharepointId: 'SP002',
    responsible: 'Maria Santos',
    involved: ['João Silva', 'Ana Oliveira'],
    startDate: '2024-07-18',
    deadline: '2024-08-20',
    status: 'doing',
    description: 'Desenvolver login e controle de acesso',
    createdAt: '2024-07-21T09:00:00Z',
    updatedAt: '2024-07-22T16:00:00Z'
  },
  {
    id: '3',
    title: 'Criar interface do usuário',
    sharepointId: 'SP003',
    responsible: 'Pedro Costa',
    involved: ['Maria Santos', 'João Silva', 'Ana Oliveira'],
    startDate: '2024-07-10',
    deadline: '2024-07-18',
    status: 'overdue',
    description: 'Desenvolver todas as telas principais',
    createdAt: '2024-07-22T08:00:00Z',
    updatedAt: '2024-07-22T18:00:00Z'
  },
  {
    id: '4',
    title: 'Testes de integração',
    sharepointId: 'SP004',
    responsible: 'Ana Oliveira',
    involved: ['Pedro Costa'],
    startDate: '2024-08-25',
    deadline: '2024-08-30',
    status: 'todo',
    description: 'Executar testes completos do sistema',
    createdAt: '2024-07-22T11:00:00Z',
    updatedAt: '2024-07-22T11:00:00Z'
  }
];

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : defaultTasks;
  });

  // Salvar tarefas no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      updateTaskStatus
    }}>
      {children}
    </TaskContext.Provider>
  );
};