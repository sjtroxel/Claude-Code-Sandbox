export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // Optional due date in ISO format (YYYY-MM-DD)
}

export type FilterType = 'all' | 'active' | 'completed';
