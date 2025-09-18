import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Archive, 
  Pin, 
  X, 
  FileText,
  User,
  Briefcase,
  BookOpen,
  Home,
  Lightbulb,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { notesService } from '../utils/notesService';
import { Note } from '../types/Note';

const Notes: React.FC = () => {
  const { isDark } = useTheme();
  
  // États
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showArchived, setShowArchived] = useState(false);
  
  // États pour la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personnel' as Note['category'],
    tags: '',
    priority: 'medium' as Note['priority']
  });

  // Catégories
  const categories = [
    { id: 'all', name: 'Toutes', icon: Home },
    { id: 'personnel', name: 'Personnel', icon: User },
    { id: 'travail', name: 'Travail', icon: Briefcase },
    { id: 'cours', name: 'Cours', icon: BookOpen },
    { id: 'idees', name: 'Idées', icon: Lightbulb },
    { id: 'projets', name: 'Projets', icon: FileText }
  ];

  // Charger les notes au démarrage
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      // Essayer d'abord le serveur, sinon localStorage
      try {
        const loadedNotes = await notesService.getNotesFromServer();
        setNotes(loadedNotes);
      } catch (serverError) {
        console.warn('Échec serveur, utilisation du localStorage:', serverError);
        const loadedNotes = notesService.getNotesFromLocalStorage();
        setNotes(loadedNotes);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
    }
  };

  // Fonctions utilitaires
  const getCategoryIcon = (category: Note['category']) => {
    const categoryMap = {
      personnel: User,
      travail: Briefcase,
      cours: BookOpen,
      idees: Lightbulb,
      projets: FileText
    };
    return categoryMap[category] || FileText;
  };

  const getCategoryColor = (category: Note['category']) => {
    const colorMap = {
      personnel: 'text-blue-500',
      travail: 'text-green-500',
      cours: 'text-purple-500',
      idees: 'text-yellow-500',
      projets: 'text-red-500'
    };
    return colorMap[category] || 'text-gray-500';
  };

  const getPriorityColor = (priority: Note['priority']) => {
    const colorMap = {
      low: isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
      medium: isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
      high: isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
    };
    return colorMap[priority];
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  // Fonctions CRUD
  const createNote = async () => {
    if (!formData.title.trim()) return;
    
    try {
      let newNote: Note;
      
      // Essayer d'abord le serveur
      try {
        newNote = await notesService.saveNoteToServer({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          priority: formData.priority,
          isPinned: false,
          isArchived: false
        });
      } catch (serverError) {
        console.warn('Échec serveur, utilisation du localStorage:', serverError);
        newNote = notesService.saveNoteToLocalStorage({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          priority: formData.priority,
          isPinned: false,
          isArchived: false
        });
      }
      
      setNotes([newNote, ...notes]);
      setFormData({
        title: '',
        content: '',
        category: 'personnel',
        tags: '',
        priority: 'medium'
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      let updatedNote: Note;
      
      // Essayer d'abord le serveur
      try {
        updatedNote = await notesService.updateNoteOnServer(id, updates);
      } catch (serverError) {
        console.warn('Échec serveur, utilisation du localStorage:', serverError);
        updatedNote = notesService.updateNoteInLocalStorage(id, updates);
      }
      
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
      
      if (selectedNote?.id === id) {
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;
    
    try {
      // Essayer d'abord le serveur
      try {
        await notesService.deleteNoteFromServer(id);
      } catch (serverError) {
        console.warn('Échec serveur, utilisation du localStorage:', serverError);
        notesService.deleteNoteFromLocalStorage(id);
      }
      
      setNotes(notes.filter(note => note.id !== id));
      
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const togglePin = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    await updateNote(id, { isPinned: !note.isPinned });
  };

  const toggleArchive = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    await updateNote(id, { isArchived: !note.isArchived });
  };

  // Filtrage et tri des notes
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
      const matchesArchived = note.isArchived === showArchived;
      
      return matchesSearch && matchesCategory && matchesArchived;
    })
    .sort((a, b) => {
      // Épinglées en premier
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        default: // date
          comparison = b.updatedAt.getTime() - a.updatedAt.getTime();
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 border-b backdrop-blur-sm ${
        isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <FileText className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Notes
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {notes.length} notes • {filteredNotes.length} affichées
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setSelectedNote(null);
                setIsEditing(true);
                setIsModalOpen(true);
                setFormData({
                  title: '',
                  content: '',
                  category: 'personnel',
                  tags: '',
                  priority: 'medium'
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
            >
              <Plus className="w-5 h-5" />
              Nouvelle note
            </button>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans les notes..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="date">Date</option>
                <option value="title">Titre</option>
                <option value="priority">Priorité</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className={`p-2 border rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white' 
                    : 'bg-white border-gray-300 text-gray-600 hover:text-gray-900'
                }`}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`px-3 py-2 border rounded-lg transition-colors ${
                  showArchived 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : isDark 
                      ? 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white' 
                      : 'bg-white border-gray-300 text-gray-600 hover:text-gray-900'
                }`}
              >
                <Archive className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grille de cartes */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <FileText className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              {searchTerm ? 'Aucune note trouvée' : 'Aucune note'}
            </h3>
            <p className={`mb-6 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez par créer votre première note'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => {
                  setSelectedNote(null);
                  setIsEditing(true);
                  setIsModalOpen(true);
                  setFormData({
                    title: '',
                    content: '',
                    category: 'personnel',
                    tags: '',
                    priority: 'medium'
                  });
                }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium mx-auto"
              >
                <Plus className="w-5 h-5" />
                Créer ma première note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  setSelectedNote(note);
                  setIsEditing(false);
                  setIsModalOpen(true);
                }}
                className={`group cursor-pointer rounded-xl border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                } ${note.isPinned ? 'ring-2 ring-yellow-400/50' : ''}`}
              >
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {React.createElement(getCategoryIcon(note.category), {
                      className: `w-5 h-5 ${getCategoryColor(note.category)}`
                    })}
                    {note.isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      note.priority === 'high' ? 'bg-red-500' : 
                      note.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                </div>

                {/* Titre */}
                <h3 className={`font-semibold text-lg mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {note.title}
                </h3>

                {/* Contenu */}
                <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {note.content || 'Aucun contenu'}
                </p>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className={`px-2 py-1 text-xs rounded-full ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        +{note.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs">
                  <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                    {formatDate(note.updatedAt)}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(note.id);
                      }}
                      className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                        note.isPinned ? 'text-yellow-400' : isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArchive(note.id);
                      }}
                      className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                        isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Archive className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modale d'édition/visualisation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-6xl h-[95vh] rounded-xl shadow-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Header de la modale */}
            <div className={`flex items-center justify-between p-6 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {isEditing ? (selectedNote ? 'Modifier la note' : 'Nouvelle note') : selectedNote?.title}
              </h2>
              <div className="flex items-center gap-2">
                {!isEditing && selectedNote && (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setFormData({
                          title: selectedNote.title,
                          content: selectedNote.content,
                          category: selectedNote.category,
                          tags: selectedNote.tags.join(', '),
                          priority: selectedNote.priority
                        });
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(selectedNote.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                    setSelectedNote(null);
                    // Réinitialiser le formulaire
                    setFormData({
                      title: '',
                      content: '',
                      category: 'personnel',
                      tags: '',
                      priority: 'medium'
                    });
                  }}
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

            {/* Contenu de la modale */}
            <div className="flex-1 overflow-hidden h-[calc(95vh-80px)]">
              {isEditing ? (
                /* Mode édition */
                <div className="p-6 space-y-4 h-full overflow-y-auto">
                  {/* Titre */}
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre de la note..."
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  
                  {/* Métadonnées */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Note['category'] })}
                      className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    >
                      {categories.filter(c => c.id !== 'all').map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as Note['priority'] })}
                      className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="low">🟢 Faible</option>
                      <option value="medium">🟡 Normale</option>
                      <option value="high">🔴 Élevée</option>
                    </select>
                    
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="Tags séparés par des virgules..."
                      className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  {/* Zone de contenu */}
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Écrivez votre note ici..."
                    rows={20}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />

                  {/* Boutons d'action */}
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        if (!selectedNote) {
                          setIsModalOpen(false);
                          // Réinitialiser le formulaire pour nouvelle note
                          setFormData({
                            title: '',
                            content: '',
                            category: 'personnel',
                            tags: '',
                            priority: 'medium'
                          });
                        } else {
                          // Restaurer les données originales de la note
                          setFormData({
                            title: selectedNote.title,
                            content: selectedNote.content,
                            category: selectedNote.category,
                            tags: selectedNote.tags.join(', '),
                            priority: selectedNote.priority
                          });
                        }
                      }}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={async () => {
                        if (selectedNote) {
                          await updateNote(selectedNote.id, {
                            title: formData.title,
                            content: formData.content,
                            category: formData.category,
                            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                            priority: formData.priority
                          });
                          setIsEditing(false);
                        } else {
                          await createNote();
                          setIsModalOpen(false);
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
                    >
                      {selectedNote ? 'Sauvegarder' : 'Créer'}
                    </button>
                  </div>
                </div>
              ) : selectedNote && (
                /* Mode lecture */
                <div className="p-6 h-full overflow-y-auto">
                  {/* Métadonnées */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                      {React.createElement(getCategoryIcon(selectedNote.category), {
                        className: `w-5 h-5 ${getCategoryColor(selectedNote.category)}`
                      })}
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {categories.find(c => c.id === selectedNote.category)?.name}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded ${getPriorityColor(selectedNote.priority)}`}>
                      Priorité {selectedNote.priority}
                    </span>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      Créé le {selectedNote.createdAt.toLocaleDateString('fr-FR')}
                    </span>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      Modifié {formatDate(selectedNote.updatedAt)}
                    </span>
                  </div>

                  {/* Tags */}
                  {selectedNote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedNote.tags.map((tag, index) => (
                        <span key={index} className={`px-3 py-1 rounded-full text-sm ${
                          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contenu */}
                  <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                    <pre className={`whitespace-pre-wrap leading-relaxed font-sans ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {selectedNote.content || 'Aucun contenu'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;