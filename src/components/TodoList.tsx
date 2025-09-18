import React, { useState, useEffect } from 'react';
import { 
  Plus, X, Trash2, Star, Calendar, Tag, Filter, Search,
  CheckCircle2, Circle, Clock, AlertCircle, User, Briefcase,
  ShoppingCart, Heart, GraduationCap, Code, Home
} from 'lucide-react';
import { Todo, TodoFormData } from '../types/Todo';
import { todoService } from '../services/todoService';
import { useTheme } from '../contexts/ThemeContext';

const TodoList: React.FC = () => {
  const { isDark } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Todo['status']>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | Todo['category']>('all');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    category: 'personal',
    dueDate: '',
    tags: '',
    isImportant: false
  });

  const categories = [
    { id: 'all', name: 'Toutes', icon: Home, color: 'text-gray-500' },
    { id: 'personal', name: 'Personnel', icon: User, color: 'text-blue-500' },
    { id: 'work', name: 'Travail', icon: Briefcase, color: 'text-green-500' },
    { id: 'shopping', name: 'Courses', icon: ShoppingCart, color: 'text-yellow-500' },
    { id: 'health', name: 'Santé', icon: Heart, color: 'text-red-500' },
    { id: 'learning', name: 'Apprentissage', icon: GraduationCap, color: 'text-purple-500' },
    { id: 'projects', name: 'Projets', icon: Code, color: 'text-indigo-500' }
  ];

  const getCategoryIcon = (category: Todo['category']) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.icon || User;
  };

  const getCategoryColor = (category: Todo['category']) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.color || 'text-gray-500';
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Todo['status']) => {
    switch (status) {
      case 'done': return CheckCircle2;
      case 'in-progress': return Clock;
      case 'todo': return Circle;
      default: return Circle;
    }
  };

  const getStatusColor = (status: Todo['status']) => {
    switch (status) {
      case 'done': return 'text-green-500';
      case 'in-progress': return 'text-blue-500';
      case 'todo': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${Math.floor(diffInHours)}h`;
    if (diffInHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  const loadTodos = async () => {
    try {
      setLoading(true);
      const allTodos = await todoService.getAllTodos();
      setTodos(allTodos);
    } catch (error) {
      console.error('Erreur lors du chargement des todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async () => {
    try {
      const newTodo = await todoService.createTodo({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        isImportant: formData.isImportant
      });
      
      setTodos(prev => [...prev, newTodo]);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la création du todo:', error);
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, updates);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
      if (selectedTodo?.id === id) {
        setSelectedTodo(updatedTodo);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      if (selectedTodo?.id === id) {
        setSelectedTodo(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du todo:', error);
    }
  };

  const toggleTodoStatus = async (id: string) => {
    try {
      const updatedTodo = await todoService.toggleTodoStatus(id);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const toggleImportant = async (id: string) => {
    try {
      const updatedTodo = await todoService.toggleImportant(id);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('Erreur lors du changement d\'importance:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      category: 'personal',
      dueDate: '',
      tags: '',
      isImportant: false
    });
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedTodo(null);
  };

  const resetFormForNewTodo = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      category: 'personal',
      dueDate: '',
      tags: '',
      isImportant: false
    });
    setSelectedTodo(null);
  };

  const closeModal = () => {
    resetForm();
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    let filtered = todos;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrer par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(todo => todo.status === filterStatus);
    }

    // Filtrer par catégorie
    if (filterCategory !== 'all') {
      filtered = filtered.filter(todo => todo.category === filterCategory);
    }

    // Trier par importance puis par date de mise à jour
    filtered.sort((a, b) => {
      if (a.isImportant && !b.isImportant) return -1;
      if (!a.isImportant && b.isImportant) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    setFilteredTodos(filtered);
  }, [todos, searchTerm, filterStatus, filterCategory]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Chargement des tâches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Mes Tâches
            </h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {filteredTodos.length} tâche{filteredTodos.length !== 1 ? 's' : ''} au total
            </p>
          </div>
          <button
            onClick={() => {
              setIsEditing(true);
              setIsModalOpen(true);
              resetFormForNewTodo();
            }}
            className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
          >
            <Plus className="w-5 h-5" />
            Nouvelle tâche
          </button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des tâches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className={`px-4 py-3 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option value="all">Tous les statuts</option>
              <option value="todo">À faire</option>
              <option value="in-progress">En cours</option>
              <option value="done">Terminé</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className={`px-4 py-3 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grille des tâches */}
        {filteredTodos.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Aucune tâche trouvée
            </h3>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {todos.length === 0 ? 'Commencez par créer votre première tâche !' : 'Essayez de modifier vos filtres.'}
            </p>
            {todos.length === 0 && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsModalOpen(true);
                  resetFormForNewTodo();
                }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium mx-auto"
              >
                <Plus className="w-5 h-5" />
                Créer ma première tâche
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => {
                  setSelectedTodo(todo);
                  setIsEditing(true);
                  setFormData({
                    title: todo.title,
                    description: todo.description,
                    status: todo.status,
                    priority: todo.priority,
                    category: todo.category,
                    dueDate: todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '',
                    tags: todo.tags.join(', '),
                    isImportant: todo.isImportant
                  });
                  setIsModalOpen(true);
                }}
                className={`group cursor-pointer rounded-xl border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                } ${todo.isImportant ? 'ring-2 ring-yellow-400/50' : ''}`}
              >
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {React.createElement(getCategoryIcon(todo.category), {
                      className: `w-5 h-5 ${getCategoryColor(todo.category)}`
                    })}
                    {todo.isImportant && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority)}`}></div>
                    {React.createElement(getStatusIcon(todo.status), {
                      className: `w-5 h-5 ${getStatusColor(todo.status)}`
                    })}
                  </div>
                </div>

                {/* Titre */}
                <h3 className={`font-semibold text-lg mb-2 line-clamp-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                } ${todo.status === 'done' ? 'line-through opacity-75' : ''}`}>
                  {todo.title}
                </h3>

                {/* Description */}
                <p className={`text-sm mb-4 line-clamp-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                } ${todo.status === 'done' ? 'line-through opacity-75' : ''}`}>
                  {todo.description}
                </p>

                {/* Tags */}
                {todo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {todo.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className={`px-2 py-1 rounded-full text-xs ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        #{tag}
                      </span>
                    ))}
                    {todo.tags.length > 2 && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        +{todo.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(todo.updatedAt)}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTodoStatus(todo.id);
                      }}
                      className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                        isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Changer le statut"
                    >
                      {React.createElement(getStatusIcon(todo.status), { className: "w-3 h-3" })}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleImportant(todo.id);
                      }}
                      className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                        isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Marquer comme important"
                    >
                      <Star className={`w-3 h-3 ${todo.isImportant ? 'text-yellow-400 fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'édition */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl flex flex-col ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Header de la modal */}
            <div className={`flex items-center justify-between p-6 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {selectedTodo ? 'Modifier la tâche' : 'Nouvelle tâche'}
              </h2>
              <div className="flex items-center gap-2">
                {selectedTodo && (
                  <button
                    onClick={() => deleteTodo(selectedTodo.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contenu de la modal */}
            <div className="flex flex-col flex-1">
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Titre */}
                <div className="mb-6">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre de la tâche..."
                    className={`text-xl font-semibold w-full bg-transparent border-none outline-none resize-none ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                {/* Métadonnées */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Catégorie */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Catégorie
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Todo['category'] })}
                      className={`w-full p-2 rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    >
                      {categories.filter(c => c.id !== 'all').map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priorité */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Priorité
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as Todo['priority'] })}
                      className={`w-full p-2 rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Élevée</option>
                    </select>
                  </div>

                  {/* Statut */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Statut
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Todo['status'] })}
                      className={`w-full p-2 rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    >
                      <option value="todo">À faire</option>
                      <option value="in-progress">En cours</option>
                      <option value="done">Terminé</option>
                    </select>
                  </div>

                  {/* Date d'échéance */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Échéance
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className={`w-full p-2 rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  </div>
                </div>

                {/* Important */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isImportant}
                      onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Marquer comme important
                    </span>
                    <Star className="w-4 h-4 text-yellow-400" />
                  </label>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="travail, urgent, meeting..."
                    className={`w-full p-3 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez votre tâche..."
                    className={`w-full p-3 rounded-lg border resize-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    rows={4}
                  />
                </div>
              </div>

              {/* Boutons d'action fixes en bas */}
              <div className={`flex-shrink-0 flex items-center justify-end gap-3 p-6 border-t ${
                isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}>
                <button
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Annuler
                </button>
                <button
                  onClick={async () => {
                    if (selectedTodo) {
                      await updateTodo(selectedTodo.id, {
                        title: formData.title,
                        description: formData.description,
                        status: formData.status,
                        priority: formData.priority,
                        category: formData.category,
                        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
                        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                        isImportant: formData.isImportant
                      });
                    } else {
                      await createTodo();
                    }
                    closeModal();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
                  disabled={!formData.title.trim()}
                >
                  {selectedTodo ? 'Sauvegarder' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;