/**
 * Service pour la gestion des notes avec support serveur et localStorage
 */

import { Note } from '../types/Note';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class NotesService {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.token = import.meta.env.VITE_ADMIN_TOKEN || 'default-dev-token';
    
    if (import.meta.env.DEV) {
      this.baseUrl = 'http://localhost:8080/api';
    } else {
      this.baseUrl = `${window.location.origin}/api`;
    }
    
    console.log(`[NotesService] API URL: ${this.baseUrl}`);
  }

  /**
   * Headers par défaut pour les requêtes API
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  /**
   * Tester la connectivité avec le serveur
   */
  async testServerConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      return response.ok;
    } catch (error) {
      console.warn('Serveur non accessible, utilisation du localStorage');
      return false;
    }
  }

  /**
   * Récupérer toutes les notes depuis le serveur
   */
  async getNotesFromServer(): Promise<Note[]> {
    try {
      const isServerReachable = await this.testServerConnection();
      if (!isServerReachable) {
        throw new Error('Serveur non accessible');
      }

      const response = await fetch(`${this.baseUrl}/notes`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse<Note[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data.map(note => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
      } else {
        throw new Error(result.error || 'Erreur lors de la récupération des notes');
      }
    } catch (error) {
      console.error('Erreur getNotesFromServer:', error);
      throw error;
    }
  }

  /**
   * Sauvegarder une note sur le serveur
   */
  async saveNoteToServer(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    try {
      const isServerReachable = await this.testServerConnection();
      if (!isServerReachable) {
        throw new Error('Serveur non accessible');
      }

      const response = await fetch(`${this.baseUrl}/notes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(note)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse<Note> = await response.json();
      
      if (result.success && result.data) {
        return {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          updatedAt: new Date(result.data.updatedAt)
        };
      } else {
        throw new Error(result.error || 'Erreur lors de la sauvegarde de la note');
      }
    } catch (error) {
      console.error('Erreur saveNoteToServer:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une note sur le serveur
   */
  async updateNoteOnServer(noteId: string, updates: Partial<Note>): Promise<Note> {
    try {
      const isServerReachable = await this.testServerConnection();
      if (!isServerReachable) {
        throw new Error('Serveur non accessible');
      }

      const response = await fetch(`${this.baseUrl}/notes/${noteId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse<Note> = await response.json();
      
      if (result.success && result.data) {
        return {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          updatedAt: new Date(result.data.updatedAt)
        };
      } else {
        throw new Error(result.error || 'Erreur lors de la mise à jour de la note');
      }
    } catch (error) {
      console.error('Erreur updateNoteOnServer:', error);
      throw error;
    }
  }

  /**
   * Supprimer une note sur le serveur
   */
  async deleteNoteFromServer(noteId: string): Promise<void> {
    try {
      const isServerReachable = await this.testServerConnection();
      if (!isServerReachable) {
        throw new Error('Serveur non accessible');
      }

      const response = await fetch(`${this.baseUrl}/notes/${noteId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la suppression de la note');
      }
    } catch (error) {
      console.error('Erreur deleteNoteFromServer:', error);
      throw error;
    }
  }

  /**
   * Récupérer les notes depuis localStorage
   */
  getNotesFromLocalStorage(): Note[] {
    try {
      const savedNotes = localStorage.getItem('admin-notes-lm');
      if (!savedNotes) return [];
      
      const notes = JSON.parse(savedNotes);
      return notes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des notes depuis localStorage:', error);
      return [];
    }
  }

  /**
   * Sauvegarder les notes dans localStorage
   */
  saveNotesToLocalStorage(notes: Note[]): void {
    try {
      localStorage.setItem('admin-notes-lm', JSON.stringify(notes));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notes dans localStorage:', error);
      throw error;
    }
  }

  /**
   * Ajouter une note dans localStorage
   */
  saveNoteToLocalStorage(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    try {
      const newNote: Note = {
        ...note,
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const existingNotes = this.getNotesFromLocalStorage();
      const updatedNotes = [newNote, ...existingNotes];
      this.saveNotesToLocalStorage(updatedNotes);
      
      return newNote;
    } catch (error) {
      console.error('Erreur saveNoteToLocalStorage:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une note dans localStorage
   */
  updateNoteInLocalStorage(noteId: string, updates: Partial<Note>): Note {
    try {
      const notes = this.getNotesFromLocalStorage();
      const noteIndex = notes.findIndex(note => note.id === noteId);
      
      if (noteIndex === -1) {
        throw new Error('Note non trouvée');
      }

      const updatedNote = {
        ...notes[noteIndex],
        ...updates,
        updatedAt: new Date()
      };

      notes[noteIndex] = updatedNote;
      this.saveNotesToLocalStorage(notes);
      
      return updatedNote;
    } catch (error) {
      console.error('Erreur updateNoteInLocalStorage:', error);
      throw error;
    }
  }

  /**
   * Supprimer une note de localStorage
   */
  deleteNoteFromLocalStorage(noteId: string): void {
    try {
      const notes = this.getNotesFromLocalStorage();
      const filteredNotes = notes.filter(note => note.id !== noteId);
      this.saveNotesToLocalStorage(filteredNotes);
    } catch (error) {
      console.error('Erreur deleteNoteFromLocalStorage:', error);
      throw error;
    }
  }

  /**
   * Rechercher dans les notes
   */
  searchNotes(notes: Note[], searchTerm: string): Note[] {
    if (!searchTerm.trim()) return notes;
    
    const term = searchTerm.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term) ||
      note.tags.some((tag: string) => tag.toLowerCase().includes(term)) ||
      note.category.toLowerCase().includes(term)
    );
  }

  /**
   * Filtrer les notes par catégorie
   */
  filterNotesByCategory(notes: Note[], category: string): Note[] {
    if (category === 'all') return notes;
    return notes.filter(note => note.category === category);
  }

  /**
   * Trier les notes
   */
  sortNotes(notes: Note[], sortBy: 'date' | 'title' | 'priority', order: 'asc' | 'desc'): Note[] {
    return [...notes].sort((a, b) => {
      // Les notes épinglées restent en haut
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder: Record<Note['priority'], number> = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'date':
        default:
          comparison = b.updatedAt.getTime() - a.updatedAt.getTime();
          break;
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Exporter les notes en JSON
   */
  exportNotes(notes: Note[]): void {
    try {
      const dataStr = JSON.stringify(notes, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `notes_export_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Erreur lors de l\'export des notes:', error);
      throw error;
    }
  }

  /**
   * Importer des notes depuis un fichier JSON
   */
  async importNotes(file: File): Promise<Note[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result as string;
          const importedNotes = JSON.parse(result);
          
          // Valider la structure des notes
          const validNotes = importedNotes.filter((note: any) => 
            note.id && note.title && note.content !== undefined
          ).map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt || Date.now()),
            updatedAt: new Date(note.updatedAt || Date.now())
          }));
          
          resolve(validNotes);
        } catch (error) {
          reject(new Error('Fichier JSON invalide'));
        }
      };
      
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsText(file);
    });
  }

  /**
   * Obtenir des statistiques sur les notes
   */
  getNoteStats(notes: Note[]): {
    total: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
    archived: number;
    pinned: number;
  } {
    const stats = {
      total: notes.length,
      byCategory: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      archived: 0,
      pinned: 0
    };

    notes.forEach(note => {
      // Par catégorie
      stats.byCategory[note.category] = (stats.byCategory[note.category] || 0) + 1;
      
      // Par priorité
      stats.byPriority[note.priority] = (stats.byPriority[note.priority] || 0) + 1;
      
      // Archivées
      if (note.isArchived) stats.archived++;
      
      // Épinglées
      if (note.isPinned) stats.pinned++;
    });

    return stats;
  }
}

// Instance singleton
export const notesService = new NotesService();
export default notesService;