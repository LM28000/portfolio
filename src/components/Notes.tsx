import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { notesService } from '../utils/notesService';
import {
  Plus,
  Search,
  FileText,
  Calendar,
  Star,
  Edit,
  Trash2,
  Save,
  X,
  SortAsc,
  SortDesc,
  Briefcase,
  GraduationCap,
  User,
  Pin,
  Archive,
  Menu,
  PanelLeftClose,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'entreprise' | 'cours' | 'personnel' | 'idées' | 'meeting' | 'projet';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotesProps {
  className?: string;
}

const Notes: React.FC<NotesProps> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [categoriesCollapsed, setCategoriesCollapsed] = useState(true); // Masquées par défaut
  
  // États pour le formulaire de création/édition
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personnel' as Note['category'],
    tags: '',
    priority: 'medium' as Note['priority']
  });

  const categories = [
    { id: 'all', name: 'Toutes les notes', icon: FileText, color: 'text-gray-400' },
    { id: 'entreprise', name: 'Entreprise', icon: Briefcase, color: 'text-blue-400' },
    { id: 'cours', name: 'Cours', icon: GraduationCap, color: 'text-green-400' },
    { id: 'meeting', name: 'Réunions', icon: Calendar, color: 'text-purple-400' },
    { id: 'projet', name: 'Projets', icon: FileText, color: 'text-orange-400' },
    { id: 'idées', name: 'Idées', icon: Star, color: 'text-yellow-400' },
    { id: 'personnel', name: 'Personnel', icon: User, color: 'text-pink-400' }
  ];

  // Charger les notes au montage
  useEffect(() => {
    loadNotes();
  }, []);

  // Fermer le mode édition quand on change de note sélectionnée
  useEffect(() => {
    setIsEditing(false);
  }, [selectedNote]);

  const loadNotes = async () => {
    try {
      // Essayer de charger depuis le serveur d'abord
      const serverNotes = await notesService.getNotesFromServer();
      setNotes(serverNotes);
      console.log('📖 Notes chargées depuis le serveur:', serverNotes.length);
    } catch (error) {
      console.warn('Serveur non accessible, chargement depuis localStorage:', error);
      // Fallback vers localStorage
      const localNotes = notesService.getNotesFromLocalStorage();
      setNotes(localNotes);
      console.log('📖 Notes chargées depuis localStorage:', localNotes.length);
    }
  };

  const createNote = async () => {
    if (!formData.title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }

    try {
      const noteData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isPinned: false,
        isArchived: false,
        priority: formData.priority
      };

      // Essayer de sauvegarder sur le serveur d'abord
      try {
        const newNote = await notesService.saveNoteToServer(noteData);
        const updatedNotes = [newNote, ...notes];
        setNotes(updatedNotes);
        console.log('✅ Note créée sur le serveur:', newNote.id);
      } catch (serverError) {
        console.warn('Serveur non accessible, sauvegarde locale:', serverError);
        // Fallback vers localStorage
        const newNote = notesService.saveNoteToLocalStorage(noteData);
        const updatedNotes = [newNote, ...notes];
        setNotes(updatedNotes);
        console.log('✅ Note créée localement:', newNote.id);
      }

      // Réinitialiser le formulaire
      setFormData({
        title: '',
        content: '',
        category: 'personnel',
        tags: '',
        priority: 'medium'
      });

      // Sélectionner la nouvelle note et sortir du mode édition
      setSelectedNote(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la création de la note:', error);
      alert('Erreur lors de la création de la note');
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      // Essayer de mettre à jour sur le serveur d'abord
      try {
        const updatedNote = await notesService.updateNoteOnServer(noteId, updates);
        const updatedNotes = notes.map(note =>
          note.id === noteId ? updatedNote : note
        );
        setNotes(updatedNotes);
        
        if (selectedNote && selectedNote.id === noteId) {
          setSelectedNote(updatedNote);
        }
        console.log('✅ Note mise à jour sur le serveur:', noteId);
      } catch (serverError) {
        console.warn('Serveur non accessible, mise à jour locale:', serverError);
        // Fallback vers localStorage
        const updatedNote = notesService.updateNoteInLocalStorage(noteId, updates);
        const updatedNotes = notes.map(note =>
          note.id === noteId ? updatedNote : note
        );
        setNotes(updatedNotes);
        
        if (selectedNote && selectedNote.id === noteId) {
          setSelectedNote(updatedNote);
        }
        console.log('✅ Note mise à jour localement:', noteId);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note:', error);
      alert('Erreur lors de la mise à jour de la note');
    }
  };

  const deleteNote = async (noteId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        // Essayer de supprimer sur le serveur d'abord
        try {
          await notesService.deleteNoteFromServer(noteId);
          const updatedNotes = notes.filter(note => note.id !== noteId);
          setNotes(updatedNotes);
          console.log('✅ Note supprimée du serveur:', noteId);
        } catch (serverError) {
          console.warn('Serveur non accessible, suppression locale:', serverError);
          // Fallback vers localStorage
          notesService.deleteNoteFromLocalStorage(noteId);
          const updatedNotes = notes.filter(note => note.id !== noteId);
          setNotes(updatedNotes);
          console.log('✅ Note supprimée localement:', noteId);
        }
        
        if (selectedNote && selectedNote.id === noteId) {
          setSelectedNote(null);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de la note:', error);
        alert('Erreur lors de la suppression de la note');
      }
    }
  };

  const togglePin = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      updateNote(noteId, { isPinned: !note.isPinned });
    }
  };

  const toggleArchive = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      updateNote(noteId, { isArchived: !note.isArchived });
    }
  };

  // Filtrer et trier les notes
  const filteredNotes = notes.filter(note => {
    if (!showArchived && note.isArchived) return false;
    if (showArchived && !note.isArchived) return false;
    
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    
    let comparison = 0;
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
        break;
      case 'date':
      default:
        comparison = b.updatedAt.getTime() - a.updatedAt.getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Aujourd'hui ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const getPriorityColor = (priority: Note['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
    }
  };

  const getCategoryIcon = (category: Note['category']) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : FileText;
  };

  const getCategoryColor = (category: Note['category']) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'text-gray-400';
  };

  return (
    <div className={`h-full flex ${isDark ? 'bg-gray-900' : 'bg-gray-50'} ${className}`}>
      {/* Sidebar - Liste des notes (conditionnelle) */}
      {sidebarVisible && (
        <div className={`w-1/4 border-r flex flex-col ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>{/* Réduit de w-1/3 à w-1/4 */}
        {/* Header avec recherche et filtres */}
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Rechercher dans les notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400 hover:text-yellow-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700'
              }`}
              title={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`p-2 rounded-lg transition-colors ${
                showArchived 
                  ? 'bg-blue-600 text-white' 
                  : isDark 
                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={showArchived ? 'Voir les notes actives' : 'Voir les archives'}
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>

          {/* Catégories */}
          <div className="mb-3">
            <button
              onClick={() => setCategoriesCollapsed(!categoriesCollapsed)}
              className={`flex items-center gap-2 w-full p-1 text-xs transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {categoriesCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              <span className="font-medium">Catégories</span>
            </button>
            {!categoriesCollapsed && (
              <div className="flex flex-wrap gap-1 mt-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  const count = notes.filter(n => 
                    (category.id === 'all' || n.category === category.id) && 
                    n.isArchived === showArchived
                  ).length;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : isDark 
                            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{category.name}</span>
                      <span className="text-xs opacity-60">({count})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tri */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`flex-1 px-2 py-1 border rounded text-xs ${
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
              className={`p-1 border rounded transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white' 
                  : 'bg-white border-gray-300 text-gray-600 hover:text-gray-900'
              }`}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Liste des notes */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => {
            const Icon = getCategoryIcon(note.category);
            return (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-3 cursor-pointer transition-colors ${
                  isDark 
                    ? `border-b border-gray-700 hover:bg-gray-800 ${
                        selectedNote?.id === note.id ? 'bg-gray-800 border-l-4 border-l-blue-500' : ''
                      }`
                    : `border-b border-gray-200 hover:bg-gray-50 ${
                        selectedNote?.id === note.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {note.isPinned && <Pin className="w-3 h-3 text-yellow-400" />}
                    <Icon className={`w-4 h-4 ${getCategoryColor(note.category)}`} />
                    <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(note.priority)}`}>
                      {note.priority}
                    </span>
                  </div>
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(note.updatedAt)}</span>
                </div>
                
                <h3 className={`font-medium mb-1 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{note.title}</h3>
                <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{note.content}</p>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className={`px-2 py-0.5 text-xs rounded ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{note.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredNotes.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucune note trouvée</p>
              <p className="text-sm mt-1">
                {searchTerm ? 'Essayez une autre recherche' : 'Créez votre première note'}
              </p>
            </div>
          )}
        </div>

        {/* Bouton nouvelle note */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              setSelectedNote(null);
              setIsEditing(true);
              setFormData({
                title: '',
                content: '',
                category: 'personnel',
                tags: '',
                priority: 'medium'
              });
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
          >
            <Plus className="w-4 h-4" />
            Nouvelle note
          </button>
        </div>
      </div>
      )}

      {/* Zone principale - Affichage/édition de note */}
      <div className="flex-1 flex flex-col">        
        {selectedNote && !isEditing ? (
          /* Affichage de la note sélectionnée */
          <>
            <div className={`p-4 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSidebarVisible(!sidebarVisible)}
                    className={`p-1 rounded transition-colors ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900'
                    }`}
                    title={sidebarVisible ? 'Masquer la liste' : 'Afficher la liste'}
                  >
                    {sidebarVisible ? <PanelLeftClose className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
                  </button>
                  {React.createElement(getCategoryIcon(selectedNote.category), {
                    className: `w-5 h-5 ${getCategoryColor(selectedNote.category)}`
                  })}
                  <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedNote.title}</h1>
                  {selectedNote.isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePin(selectedNote.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedNote.isPinned 
                        ? 'bg-yellow-600 text-white' 
                        : isDark 
                          ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    title={selectedNote.isPinned ? 'Désépingler' : 'Épingler'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      // Charger les données de la note dans le formulaire
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
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900'
                    }`}
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleArchive(selectedNote.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900'
                    }`}
                    title={selectedNote.isArchived ? 'Désarchiver' : 'Archiver'}
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className={`px-2 py-1 rounded ${getPriorityColor(selectedNote.priority)}`}>
                  Priorité {selectedNote.priority}
                </span>
                <span>Créé le {selectedNote.createdAt.toLocaleDateString('fr-FR')}</span>
                <span>Modifié {formatDate(selectedNote.updatedAt)}</span>
              </div>
              
              {selectedNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedNote.tags.map((tag, index) => (
                    <span key={index} className={`px-2 py-1 text-sm rounded ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="prose prose-invert max-w-none">
                <pre className={`whitespace-pre-wrap leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {selectedNote.content || 'Aucun contenu'}
                </pre>
              </div>
            </div>
          </>
        ) : isEditing ? (
          /* Formulaire d'édition/création */
          <>
            <div className={`p-2 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSidebarVisible(!sidebarVisible)}
                    className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-gray-400 hover:text-white"
                    title={sidebarVisible ? 'Masquer la liste' : 'Afficher la liste'}
                  >
                    {sidebarVisible ? <PanelLeftClose className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
                  </button>
                  <h2 className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedNote ? 'Modifier la note' : 'Nouvelle note'}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      if (selectedNote) {
                        updateNote(selectedNote.id, {
                          title: formData.title,
                          content: formData.content,
                          category: formData.category,
                          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                          priority: formData.priority
                        });
                        setIsEditing(false);
                      } else {
                        await createNote();
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white"
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      if (!selectedNote) {
                        setFormData({
                          title: '',
                          content: '',
                          category: 'personnel',
                          tags: '',
                          priority: 'medium'
                        });
                      } else {
                        setFormData({
                          title: selectedNote.title,
                          content: selectedNote.content,
                          category: selectedNote.category,
                          tags: selectedNote.tags.join(', '),
                          priority: selectedNote.priority
                        });
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-white ${
                      isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-2 overflow-y-auto">
              <div className="space-y-2 max-w-6xl">
                {/* Titre et métadonnées compacts */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre de la note..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium ${
                      isDark 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  
                  <div className="grid grid-cols-4 gap-2">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Note['category'] })}
                      className={`px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
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
                      className={`px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
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
                      placeholder="Tags..."
                      className={`col-span-2 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>
                
                {/* Zone de contenu */}
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Écrivez votre note ici..."
                  rows={25}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono min-h-[500px] ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
          </>
        ) : (
          /* État initial - aucune note sélectionnée */
          <div className="flex-1 flex flex-col">
            <div className={`p-2 ${isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className={`p-1 rounded transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900'
                }`}
                title={sidebarVisible ? 'Masquer la liste' : 'Afficher la liste'}
              >
                {sidebarVisible ? <PanelLeftClose className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
              </button>
            </div>
            <div className={`flex-1 flex items-center justify-center ${isDark ? 'bg-gray-800/20' : 'bg-gray-100/50'}`}>
              <div className="text-center">
              <FileText className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Système de prise de notes</h3>
              <p className={`mb-4 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Organisez vos idées, cours et notes professionnelles</p>
              <button
                onClick={() => {
                  setSelectedNote(null);
                  setIsEditing(true);
                  setFormData({
                    title: '',
                    content: '',
                    category: 'personnel',
                    tags: '',
                    priority: 'medium'
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white mx-auto"
              >
                <Plus className="w-4 h-4" />
                Créer ma première note
              </button>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;