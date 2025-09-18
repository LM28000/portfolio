export interface Todo {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  category: 'personal' | 'work' | 'shopping' | 'health' | 'learning' | 'projects';
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isImportant: boolean;
}

export interface TodoFormData {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  category: 'personal' | 'work' | 'shopping' | 'health' | 'learning' | 'projects';
  dueDate: string;
  tags: string;
  isImportant: boolean;
}