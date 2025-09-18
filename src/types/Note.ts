export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'personnel' | 'travail' | 'cours' | 'idees' | 'projets' | 'reunion';
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}