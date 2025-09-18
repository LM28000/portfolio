import React, { useState, useEffect } from 'react';
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
  Archive
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
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  
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

  const loadNotes = () => {
    try {
      const savedNotes = localStorage.getItem('admin-notes-lm');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
    }
  };

  const saveNotes = (newNotes: Note[]) => {
    try {
      localStorage.setItem('admin-notes-lm', JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notes:', error);
    }
  };

  const createNote = () => {
    if (!formData.title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }

    const newNote: Note = {
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      isArchived: false,
      priority: formData.priority
    };

    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    
    // Réinitialiser le formulaire
    setFormData({
      title: '',
      content: '',
      category: 'personnel',
      tags: '',
      priority: 'medium'
    });

    // Sélectionner la nouvelle note
    setSelectedNote(newNote);
    setIsEditing(false);
  };

  const updateNote = (noteId: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    );
    saveNotes(updatedNotes);
    
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote({ ...selectedNote, ...updates, updatedAt: new Date() });
    }
  };

  const deleteNote = (noteId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      saveNotes(updatedNotes);
      
      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote(null);
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
    <div className={`h-full flex bg-gray-900 ${className}`}>
      {/* Sidebar - Liste des notes */}
      <div className="w-1/3 border-r border-gray-700 flex flex-col">
        {/* Header avec recherche et filtres */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher dans les notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`p-2 rounded-lg transition-colors ${
                showArchived ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
              title={showArchived ? 'Voir les notes actives' : 'Voir les archives'}
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-1 mb-3">
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
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{category.name}</span>
                  <span className="text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Tri */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-xs"
            >
              <option value="date">Date</option>
              <option value="title">Titre</option>
              <option value="priority">Priorité</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 bg-gray-800 border border-gray-600 rounded text-gray-400 hover:text-white"
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
                className={`p-3 border-b border-gray-700 cursor-pointer transition-colors hover:bg-gray-800 ${
                  selectedNote?.id === note.id ? 'bg-gray-800 border-l-4 border-l-blue-500' : ''
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
                  <span className="text-xs text-gray-500">{formatDate(note.updatedAt)}</span>
                </div>
                
                <h3 className="font-medium text-white mb-1 line-clamp-1">{note.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{note.content}</p>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
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

      {/* Zone principale - Affichage/édition de note */}
      <div className="flex-1 flex flex-col">
        {selectedNote && !isEditing ? (
          /* Affichage de la note sélectionnée */
          <>
            <div className="p-4 border-b border-gray-700 bg-gray-800/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {React.createElement(getCategoryIcon(selectedNote.category), {
                    className: `w-5 h-5 ${getCategoryColor(selectedNote.category)}`
                  })}
                  <h1 className="text-xl font-semibold text-white">{selectedNote.title}</h1>
                  {selectedNote.isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePin(selectedNote.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedNote.isPinned ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                    title={selectedNote.isPinned ? 'Désépingler' : 'Épingler'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-400 hover:text-white"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleArchive(selectedNote.id)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-400 hover:text-white"
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
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className={`px-2 py-1 rounded ${getPriorityColor(selectedNote.priority)}`}>
                  Priorité {selectedNote.priority}
                </span>
                <span>Créé le {selectedNote.createdAt.toLocaleDateString('fr-FR')}</span>
                <span>Modifié {formatDate(selectedNote.updatedAt)}</span>
              </div>
              
              {selectedNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedNote.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                  {selectedNote.content || 'Aucun contenu'}
                </pre>
              </div>
            </div>
          </>
        ) : isEditing ? (
          /* Formulaire d'édition/création */
          <>
            <div className="p-4 border-b border-gray-700 bg-gray-800/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {selectedNote ? 'Modifier la note' : 'Nouvelle note'}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
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
                        createNote();
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
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-white"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4 max-w-4xl">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre de la note..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Métadonnées */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Note['category'] })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.filter(c => c.id !== 'all').map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priorité
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as Note['priority'] })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tags (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="tag1, tag2, tag3..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {/* Contenu */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contenu
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Votre note ici..."
                    rows={20}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* État initial - aucune note sélectionnée */
          <div className="flex-1 flex items-center justify-center bg-gray-800/20">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">Système de prise de notes</h3>
              <p className="text-gray-500 mb-4">Organisez vos idées, cours et notes professionnelles</p>
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
        )}
      </div>
    </div>
  );
};

export default Notes;