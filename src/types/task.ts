export type TaskStatus = 'pending' | 'progress' | 'review' | 'completed';

export interface Task {
  id: string;
  title: string;
  sharepointId: string;
  responsible: string;
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
  deadline: string;
  description?: string;
}