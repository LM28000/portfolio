import { Todo } from '../types/Todo';

const API_BASE_URL = 'http://localhost:3001/api';

class TodoService {
  private isServerAvailable = false;

  constructor() {
    this.checkServerAvailability();
  }

  private async checkServerAvailability(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      this.isServerAvailable = response.ok;
    } catch (error) {
      this.isServerAvailable = false;
      console.warn('Serveur non disponible, utilisation du localStorage');
    }
  }

  // LocalStorage methods
  private getLocalTodos(): Todo[] {
    try {
      const todos = localStorage.getItem('todos');
      if (!todos) return [];
      
      return JSON.parse(todos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      }));
    } catch (error) {
      console.error('Erreur lors de la lecture des todos:', error);
      return [];
    }
  }

  private saveLocalTodos(todos: Todo[]): void {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des todos:', error);
    }
  }

  // API methods
  async getAllTodos(): Promise<Todo[]> {
    if (!this.isServerAvailable) {
      return this.getLocalTodos();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) throw new Error('Erreur réseau');
      
      const todos = await response.json();
      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      }));
    } catch (error) {
      console.warn('Erreur serveur, utilisation du localStorage:', error);
      return this.getLocalTodos();
    }
  }

  async createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    const now = new Date();
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };

    if (!this.isServerAvailable) {
      const todos = this.getLocalTodos();
      todos.push(newTodo);
      this.saveLocalTodos(todos);
      return newTodo;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });

      if (!response.ok) throw new Error('Erreur réseau');
      
      const createdTodo = await response.json();
      return {
        ...createdTodo,
        createdAt: new Date(createdTodo.createdAt),
        updatedAt: new Date(createdTodo.updatedAt),
        dueDate: createdTodo.dueDate ? new Date(createdTodo.dueDate) : undefined
      };
    } catch (error) {
      console.warn('Erreur serveur, sauvegarde locale:', error);
      const todos = this.getLocalTodos();
      todos.push(newTodo);
      this.saveLocalTodos(todos);
      return newTodo;
    }
  }

  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    if (!this.isServerAvailable) {
      const todos = this.getLocalTodos();
      const index = todos.findIndex(todo => todo.id === id);
      if (index === -1) throw new Error('Todo non trouvé');
      
      todos[index] = { ...todos[index], ...updateData };
      this.saveLocalTodos(todos);
      return todos[index];
    }

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Erreur réseau');
      
      const updatedTodo = await response.json();
      return {
        ...updatedTodo,
        createdAt: new Date(updatedTodo.createdAt),
        updatedAt: new Date(updatedTodo.updatedAt),
        dueDate: updatedTodo.dueDate ? new Date(updatedTodo.dueDate) : undefined
      };
    } catch (error) {
      console.warn('Erreur serveur, mise à jour locale:', error);
      const todos = this.getLocalTodos();
      const index = todos.findIndex(todo => todo.id === id);
      if (index === -1) throw new Error('Todo non trouvé');
      
      todos[index] = { ...todos[index], ...updateData };
      this.saveLocalTodos(todos);
      return todos[index];
    }
  }

  async deleteTodo(id: string): Promise<void> {
    if (!this.isServerAvailable) {
      const todos = this.getLocalTodos();
      const filteredTodos = todos.filter(todo => todo.id !== id);
      this.saveLocalTodos(filteredTodos);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur réseau');
    } catch (error) {
      console.warn('Erreur serveur, suppression locale:', error);
      const todos = this.getLocalTodos();
      const filteredTodos = todos.filter(todo => todo.id !== id);
      this.saveLocalTodos(filteredTodos);
    }
  }

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

  async toggleImportant(id: string): Promise<Todo> {
    const todos = await this.getAllTodos();
    const todo = todos.find(t => t.id === id);
    if (!todo) throw new Error('Todo non trouvé');

    return this.updateTodo(id, { isImportant: !todo.isImportant });
  }
}

export const todoService = new TodoService();