export type TaskStatus = 'todo' | 'doing' | 'done' | 'overdue';

export interface Task {
  id: string;
  title: string;
  sharepointId: string;
  responsible: string;
  involved: string[];
  startDate: string;
  deadline: string;
  status: TaskStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  sharepointId: string;
  responsible: string;
  involved: string[];
  startDate: string;
  deadline: string;
  description?: string;
}