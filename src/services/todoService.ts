/**
 * Service pour la gestion des todos avec support serveur et localStorage
 * Basé sur l'architecture robuste du notesService
 */

import { Todo } from '../types/Todo';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class TodoService {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.token = import.meta.env.VITE_ADMIN_TOKEN || 'default-dev-token';
    
    if (import.meta.env.DEV) {
      this.baseUrl = 'http://localhost:8080/api';
    } else {
      this.baseUrl = `${window.location.origin}/api`;
    }
    
    console.log(`[TodoService] API URL: ${this.baseUrl}`);
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
      console.warn('Serveur non accessible, utilisation du localStorage pour les todos');
      return false;
    }
  }

  /**
   * Récupérer tous les todos depuis le serveur
   */
  async getTodosFromServer(): Promise<Todo[]> {
    try {
      const isServerReachable = await this.testServerConnection();
      if (!isServerReachable) {
        throw new Error('Serveur non accessible');
      }

      const response = await fetch(`${this.baseUrl}/todos`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse<Todo[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data.map(todo => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
        }));
      } else {
        throw new Error(result.error || 'Erreur lors de la récupération des todos');
      }
    } catch (error) {
      console.error('Erreur getTodosFromServer:', error);
      throw error;
    }
  }

  /**
   * Récupérer les todos depuis localStorage
   */
  getTodosFromLocalStorage(): Todo[] {
    try {
      const savedTodos = localStorage.getItem('admin-todos-lm');
      if (!savedTodos) return [];
      
      const todos = JSON.parse(savedTodos);
      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des todos depuis localStorage:', error);
      return [];
    }
  }

  /**
   * Sauvegarder les todos dans localStorage
   */
  saveTodosToLocalStorage(todos: Todo[]): void {
    try {
      localStorage.setItem('admin-todos-lm', JSON.stringify(todos));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des todos dans localStorage:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les todos (serveur en priorité, localStorage en fallback)
   */
  async getAllTodos(): Promise<Todo[]> {
    try {
      return await this.getTodosFromServer();
    } catch (error) {
      console.warn('Récupération depuis le serveur échouée, utilisation du localStorage');
      return this.getTodosFromLocalStorage();
    }
  }

  /**
   * Créer un nouveau todo
   */
  async createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    const newTodo: Todo = {
      ...todoData,
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      // Essayer d'abord le serveur
      const isServerReachable = await this.testServerConnection();
      if (!isServerReachable) {
        throw new Error('Serveur non accessible');
      }

      const response = await fetch(`${this.baseUrl}/todos`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(newTodo)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse<Todo> = await response.json();
      
      if (result.success && result.data) {
        const serverTodo = {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          updatedAt: new Date(result.data.updatedAt),
          dueDate: result.data.dueDate ? new Date(result.data.dueDate) : undefined
        };
        
        // Sauvegarder aussi en local pour synchronisation
        const localTodos = this.getTodosFromLocalStorage();
        localTodos.unshift(serverTodo);
        this.saveTodosToLocalStorage(localTodos);
        
        return serverTodo;
      } else {
        throw new Error(result.error || 'Erreur lors de la création du todo');
      }
    } catch (error) {
      console.warn('Erreur serveur, sauvegarde locale:', error);
      
      // Fallback vers localStorage
      const localTodos = this.getTodosFromLocalStorage();
      localTodos.unshift(newTodo);
      this.saveTodosToLocalStorage(localTodos);
      
      return newTodo;
    }
  }

  /**
   * Mettre à jour un todo
   */
  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    try {
      // Essayer d'abord le serveur
      const isServerReachable = await this.testServerConnection();
      if (!isServerReachable) {
        throw new Error('Serveur non accessible');
      }

      const response = await fetch(`${this.baseUrl}/todos/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse<Todo> = await response.json();
      
      if (result.success && result.data) {
        const updatedTodo = {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          updatedAt: new Date(result.data.updatedAt),
          dueDate: result.data.dueDate ? new Date(result.data.dueDate) : undefined
        };
        
        // Mettre à jour aussi en local
        const localTodos = this.getTodosFromLocalStorage();
        const index = localTodos.findIndex(todo => todo.id === id);
        if (index !== -1) {
          localTodos[index] = updatedTodo;
          this.saveTodosToLocalStorage(localTodos);
        }
        
        return updatedTodo;
      } else {
        throw new Error(result.error || 'Erreur lors de la mise à jour du todo');
      }
    } catch (error) {
      console.warn('Erreur serveur, mise à jour locale:', error);
      
      // Fallback vers localStorage
      const localTodos = this.getTodosFromLocalStorage();
      const index = localTodos.findIndex(todo => todo.id === id);
      if (index === -1) throw new Error('Todo non trouvé');
      
      localTodos[index] = { ...localTodos[index], ...updateData };
      this.saveTodosToLocalStorage(localTodos);
      
      return localTodos[index];
    }
  }

  /**
   * Supprimer un todo
   */
  async deleteTodo(id: string): Promise<void> {
    try {
      // Essayer d'abord le serveur
      const isServerReachable = await this.testServerConnection();
      if (!isServerReachable) {
        throw new Error('Serveur non accessible');
      }

      const response = await fetch(`${this.baseUrl}/todos/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la suppression du todo');
      }
      
      // Supprimer aussi en local
      const localTodos = this.getTodosFromLocalStorage();
      const filteredTodos = localTodos.filter(todo => todo.id !== id);
      this.saveTodosToLocalStorage(filteredTodos);
      
    } catch (error) {
      console.warn('Erreur serveur, suppression locale:', error);
      
      // Fallback vers localStorage
      const localTodos = this.getTodosFromLocalStorage();
      const filteredTodos = localTodos.filter(todo => todo.id !== id);
      this.saveTodosToLocalStorage(filteredTodos);
    }
  }

  /**
   * Changer le statut d'un todo
   */
  async toggleTodoStatus(id: string): Promise<Todo> {
    const todos = await this.getAllTodos();
    const todo = todos.find(t => t.id === id);
    if (!todo) throw new Error('Todo non trouvé');

    let newStatus: Todo['status'];
    if (todo.status === 'todo') newStatus = 'in-progress';
    else if (todo.status === 'in-progress') newStatus = 'done';
    else newStatus = 'todo';

    return this.updateTodo(id, { status: newStatus });
  }

  /**
   * Basculer l'importance d'un todo
   */
  async toggleImportant(id: string): Promise<Todo> {
    const todos = await this.getAllTodos();
    const todo = todos.find(t => t.id === id);
    if (!todo) throw new Error('Todo non trouvé');

    return this.updateTodo(id, { isImportant: !todo.isImportant });
  }

  /**
   * Obtenir des statistiques sur les todos
   */
  getTodoStats(todos: Todo[]): {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
    important: number;
    overdue: number;
  } {
    const stats = {
      total: todos.length,
      byStatus: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      important: 0,
      overdue: 0
    };

    const now = new Date();

    todos.forEach(todo => {
      // Par statut
      stats.byStatus[todo.status] = (stats.byStatus[todo.status] || 0) + 1;
      
      // Par priorité
      stats.byPriority[todo.priority] = (stats.byPriority[todo.priority] || 0) + 1;
      
      // Par catégorie
      stats.byCategory[todo.category] = (stats.byCategory[todo.category] || 0) + 1;
      
      // Important
      if (todo.isImportant) stats.important++;
      
      // En retard
      if (todo.dueDate && todo.dueDate < now && todo.status !== 'done') {
        stats.overdue++;
      }
    });

    return stats;
  }
}

// Instance singleton
export const todoService = new TodoService();
export default todoService;