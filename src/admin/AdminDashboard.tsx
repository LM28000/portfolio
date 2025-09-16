import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Lock, 
  Activity, 
  User, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Search,
  Plus,
  LogOut,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  HardDrive,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { AdminAuthUtils, SecurityLog } from '../utils/adminAuth';

interface AdminFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  lastModified: Date;
  isEncrypted: boolean;
  category: string;
  tags: string[];
}

const AdminDashboard: React.FC = () => {
  const { user, logout, updateActivity } = useAdmin();
  const [files, setFiles] = useState<AdminFile[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [selectedFile, setSelectedFile] = useState<AdminFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [storageInfo, setStorageInfo] = useState({ used: 0, total: 0 });
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [previewFile, setPreviewFile] = useState<AdminFile | null>(null);
  const [previewData, setPreviewData] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const categories = [
    { id: 'all', name: 'Tous les documents', icon: FileText },
    { id: 'identity', name: 'Pièces d\'identité', icon: User },
    { id: 'finance', name: 'Documents financiers', icon: Shield },
    { id: 'medical', name: 'Documents médicaux', icon: Activity },
    { id: 'legal', name: 'Documents légaux', icon: Lock },
    { id: 'other', name: 'Autres', icon: FileText }
  ];

  // Charger les données au montage
  useEffect(() => {
    loadFiles();
    loadSecurityLogs();
    calculateStorageUsage();
    
    // Marquer l'activité régulièrement
    const activityInterval = setInterval(() => {
      updateActivity();
    }, 5 * 60 * 1000); // Toutes les 5 minutes

    return () => clearInterval(activityInterval);
  }, [updateActivity]);

  // Gestion des raccourcis clavier pour la navigation PDF
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Vérifier si on est en mode aperçu PDF
      const iframe = document.getElementById('pdf-viewer-iframe');
      if (!iframe || !previewFile || previewFile.type !== 'application/pdf') return;

      const pageSlider = document.getElementById('page-slider') as HTMLInputElement;
      if (!pageSlider) return;

      const currentPage = parseInt(pageSlider.value);
      const totalPages = parseInt(pageSlider.max);

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (currentPage > 1) {
            const newPage = currentPage - 1;
            pageSlider.value = newPage.toString();
            const newSrc = (iframe as HTMLIFrameElement).src.replace(/page=\d+/, `page=${newPage}`);
            (iframe as HTMLIFrameElement).src = newSrc;
            document.getElementById('page-indicator')!.textContent = `Page ${newPage}`;
            document.getElementById('page-display')!.textContent = newPage.toString();
            
            const percent = ((newPage - 1) / (totalPages - 1)) * 100;
            pageSlider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percent}%, #374151 ${percent}%, #374151 100%)`;
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            pageSlider.value = newPage.toString();
            const newSrc = (iframe as HTMLIFrameElement).src.replace(/page=\d+/, `page=${newPage}`);
            (iframe as HTMLIFrameElement).src = newSrc;
            document.getElementById('page-indicator')!.textContent = `Page ${newPage}`;
            document.getElementById('page-display')!.textContent = newPage.toString();
            
            const percent = ((newPage - 1) / (totalPages - 1)) * 100;
            pageSlider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percent}%, #374151 ${percent}%, #374151 100%)`;
          }
          break;
        case 'Home':
          e.preventDefault();
          pageSlider.value = '1';
          const homeSrc = (iframe as HTMLIFrameElement).src.replace(/page=\d+/, 'page=1');
          (iframe as HTMLIFrameElement).src = homeSrc;
          document.getElementById('page-indicator')!.textContent = 'Page 1';
          document.getElementById('page-display')!.textContent = '1';
          pageSlider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 0%, #374151 0%, #374151 100%)`;
          break;
        case 'End':
          e.preventDefault();
          pageSlider.value = totalPages.toString();
          const endSrc = (iframe as HTMLIFrameElement).src.replace(/page=\d+/, `page=${totalPages}`);
          (iframe as HTMLIFrameElement).src = endSrc;
          document.getElementById('page-indicator')!.textContent = `Page ${totalPages}`;
          document.getElementById('page-display')!.textContent = totalPages.toString();
          pageSlider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 100%, #374151 100%, #374151 100%)`;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewFile]);

  const calculateStorageUsage = () => {
    try {
      let used = 0;
      let total = 5 * 1024 * 1024; // 5MB approximatif pour localStorage

      // Calculer l'espace utilisé par les fichiers admin
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('admin-file-data-')) {
          const value = localStorage.getItem(key);
          if (value) {
            used += value.length;
          }
        }
      }

      setStorageInfo({ used, total });
    } catch (error) {
      console.error('Erreur calcul stockage:', error);
    }
  };

  const loadFiles = () => {
    try {
      const storedFiles = localStorage.getItem('admin-files-lm');
      if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles).map((file: any) => ({
          ...file,
          uploadDate: new Date(file.uploadDate),
          lastModified: new Date(file.lastModified)
        }));
        setFiles(parsedFiles);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers:', error);
    }
  };

  const loadSecurityLogs = () => {
    try {
      const logs = AdminAuthUtils.getSecurityLogs();
      setSecurityLogs(logs.slice(0, 50)); // Derniers 50 logs
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Vérifier la taille du fichier (limite 10MB pour localStorage)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('Fichier trop volumineux. Taille maximale : 10MB');
        return;
      }

      // Créer l'objet fichier
      const newFile: AdminFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        lastModified: new Date(),
        isEncrypted: true,
        category: selectedCategory === 'all' ? 'other' : selectedCategory,
        tags: []
      };

      // Convertir le fichier en base64 de manière sécurisée
      const fileData = await file.arrayBuffer();
      
      // Méthode plus robuste pour la conversion base64
      let base64Data: string;
      try {
        const uint8Array = new Uint8Array(fileData);
        const chunkSize = 8192; // Traiter par chunks pour éviter les erreurs de pile
        const chunks: string[] = [];
        
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.subarray(i, i + chunkSize);
          chunks.push(String.fromCharCode.apply(null, Array.from(chunk)));
        }
        
        base64Data = btoa(chunks.join(''));
      } catch (conversionError) {
        console.error('Erreur de conversion base64:', conversionError);
        throw new Error('Erreur lors de la conversion du fichier');
      }

      // Vérifier que le localStorage peut stocker les données
      try {
        localStorage.setItem(`admin-file-data-${newFile.id}`, base64Data);
      } catch (storageError) {
        console.error('Erreur de stockage:', storageError);
        throw new Error('Espace de stockage insuffisant');
      }
      
      // Stocker les métadonnées
      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);
      localStorage.setItem('admin-files-lm', JSON.stringify(updatedFiles));

      // Log de sécurité
      AdminAuthUtils.logSecurityEvent('file_upload', `Fichier ${file.name} uploadé (${formatFileSize(file.size)})`);
      loadSecurityLogs();
      calculateStorageUsage(); // Recalculer l'usage du stockage

      alert(`Fichier "${file.name}" uploadé avec succès !`);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Erreur lors de l\'upload du fichier';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      
      // Log de l'erreur
      AdminAuthUtils.logSecurityEvent('file_upload', `Échec upload: ${file?.name} - ${errorMessage}`);
    } finally {
      setIsUploading(false);
      // Réinitialiser l'input
      event.target.value = '';
    }
  };

  const handleFileDownload = async (file: AdminFile) => {
    try {
      const base64Data = localStorage.getItem(`admin-file-data-${file.id}`);
      if (!base64Data) {
        alert('Fichier non trouvé dans le stockage');
        return;
      }

      // Décoder le base64 de manière sécurisée
      let binaryString: string;
      try {
        binaryString = atob(base64Data);
      } catch (decodeError) {
        console.error('Erreur de décodage base64:', decodeError);
        alert('Erreur lors du décodage du fichier');
        return;
      }

      // Convertir en Uint8Array
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Créer un blob et le télécharger
      const blob = new Blob([bytes], { type: file.type || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Log de sécurité
      AdminAuthUtils.logSecurityEvent('file_download', `Fichier ${file.name} téléchargé`);
      loadSecurityLogs();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du fichier');
    }
  };

  const handleFileDelete = (file: AdminFile) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${file.name}" ?`)) {
      try {
        // Supprimer les métadonnées
        const updatedFiles = files.filter(f => f.id !== file.id);
        setFiles(updatedFiles);
        localStorage.setItem('admin-files-lm', JSON.stringify(updatedFiles));

        // Supprimer les données du fichier
        localStorage.removeItem(`admin-file-data-${file.id}`);

        // Log de sécurité
        AdminAuthUtils.logSecurityEvent('file_delete', `Fichier ${file.name} supprimé`);
        loadSecurityLogs();
        calculateStorageUsage(); // Recalculer l'usage du stockage

        setSelectedFile(null);
        alert('Fichier supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleFilePreview = async (file: AdminFile) => {
    setPreviewLoading(true);
    setPreviewFile(file);
    setZoom(100);
    setRotation(0);

    try {
      const base64Data = localStorage.getItem(`admin-file-data-${file.id}`);
      if (!base64Data) {
        alert('Fichier non trouvé dans le stockage');
        setPreviewFile(null);
        return;
      }

      // Vérifier si le fichier est prévisualisable
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const isText = file.type.startsWith('text/') || file.name.toLowerCase().endsWith('.txt');

      if (isImage) {
        // Pour les images, créer un blob URL
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: file.type });
        const url = URL.createObjectURL(blob);
        setPreviewData(url);
      } else if (isPdf) {
        // Pour les PDFs, utiliser data URL
        setPreviewData(`data:${file.type};base64,${base64Data}`);
      } else if (isText) {
        // Pour les fichiers texte, décoder le contenu
        const binaryString = atob(base64Data);
        setPreviewData(binaryString);
      } else {
        // Type non supporté
        alert('Aperçu non disponible pour ce type de fichier');
        setPreviewFile(null);
        return;
      }

      // Log de sécurité
      AdminAuthUtils.logSecurityEvent('file_preview', `Aperçu du fichier ${file.name}`);
    } catch (error) {
      console.error('Erreur lors de la prévisualisation:', error);
      alert('Erreur lors de la prévisualisation du fichier');
      setPreviewFile(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    if (previewData && previewFile?.type.startsWith('image/')) {
      URL.revokeObjectURL(previewData);
    }
    setPreviewFile(null);
    setPreviewData(null);
    setZoom(100);
    setRotation(0);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(25, Math.min(300, prev + delta)));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      AdminAuthUtils.logSecurityEvent('logout', 'Déconnexion admin');
      logout();
    }
  };

  const filteredAndSortedFiles = React.useMemo(() => {
    let filtered = files.filter(file => {
      // Filtre de recherche
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtre de catégorie
      const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
      
      // Filtre de date
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const now = new Date();
        const fileDate = file.uploadDate;
        
        switch (dateFilter) {
          case 'today':
            matchesDate = fileDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = fileDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = fileDate >= monthAgo;
            break;
        }
      }
      
      // Filtre de taille
      let matchesSize = true;
      if (sizeFilter !== 'all') {
        const sizeInMB = file.size / (1024 * 1024);
        switch (sizeFilter) {
          case 'small':
            matchesSize = sizeInMB < 1;
            break;
          case 'medium':
            matchesSize = sizeInMB >= 1 && sizeInMB < 5;
            break;
          case 'large':
            matchesSize = sizeInMB >= 5;
            break;
        }
      }
      
      return matchesSearch && matchesCategory && matchesDate && matchesSize;
    });

    // Tri des fichiers
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = (a.type || '').localeCompare(b.type || '');
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [files, searchTerm, selectedCategory, dateFilter, sizeFilter, sortBy, sortOrder]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLogIcon = (action: SecurityLog['action']) => {
    switch (action) {
      case 'login_success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'logout': return <LogOut className="w-4 h-4 text-blue-500" />;
      case 'login_failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-bold">Administration Sécurisée</h1>
            </div>
            <div className="text-sm text-gray-400">
              Connecté en tant que <span className="text-blue-400 font-medium">{user?.username}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Activity className="w-4 h-4" />
              Logs
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800/30 border-r border-gray-700 p-6">
          <div className="space-y-6">
            {/* Upload */}
            <div>
              <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg cursor-pointer transition-all duration-200 font-medium shadow-lg">
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Upload...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Ajouter un document
                  </>
                )}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                />
              </label>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Filtres</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1 rounded ${showFilters ? 'text-blue-400 bg-blue-900/30' : 'text-gray-400 hover:text-white'}`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="space-y-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                {/* Sort Options */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Tri par :</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size' | 'type')}
                      className="px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="date">Date</option>
                      <option value="name">Nom</option>
                      <option value="size">Taille</option>
                      <option value="type">Type</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="flex items-center justify-center px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-300 hover:text-white"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Période :
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
                    className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="all">Toutes les dates</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                  </select>
                </div>

                {/* Size Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    <HardDrive className="w-3 h-3 inline mr-1" />
                    Taille :
                  </label>
                  <select
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value as 'all' | 'small' | 'medium' | 'large')}
                    className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="all">Toutes les tailles</option>
                    <option value="small">Petit (&lt; 1MB)</option>
                    <option value="medium">Moyen (1-5MB)</option>
                    <option value="large">Grand (&gt; 5MB)</option>
                  </select>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setDateFilter('all');
                    setSizeFilter('all');
                    setSortBy('date');
                    setSortOrder('desc');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                  Réinitialiser
                </button>
              </div>
            )}

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Catégories</h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Storage Info */}
            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Stockage</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Utilisé</span>
                  <span>{formatFileSize(storageInfo.used)} / {formatFileSize(storageInfo.total)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((storageInfo.used / storageInfo.total) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {files.length} document{files.length !== 1 ? 's' : ''} stocké{files.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {showLogs ? (
            /* Security Logs */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Logs de Sécurité</h2>
                <button
                  onClick={() => setShowLogs(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Retour aux fichiers
                </button>
              </div>

              <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {securityLogs.length > 0 ? (
                    <div className="divide-y divide-gray-700">
                      {securityLogs.map((log, index) => (
                        <div key={index} className="flex items-center gap-4 p-4">
                          {getLogIcon(log.action)}
                          <div className="flex-1">
                            <div className="text-sm font-medium">{log.details}</div>
                            <div className="text-xs text-gray-400">{formatDate(log.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      Aucun log de sécurité disponible
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Files List */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Documents Sécurisés</h2>
                  {/* Active Filters Indicator */}
                  {(searchTerm || selectedCategory !== 'all' || dateFilter !== 'all' || sizeFilter !== 'all') && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">Filtres actifs:</span>
                      {searchTerm && (
                        <span className="px-2 py-1 text-xs bg-blue-900/30 text-blue-300 rounded">
                          "{searchTerm}"
                        </span>
                      )}
                      {selectedCategory !== 'all' && (
                        <span className="px-2 py-1 text-xs bg-purple-900/30 text-purple-300 rounded">
                          {categories.find(c => c.id === selectedCategory)?.name}
                        </span>
                      )}
                      {dateFilter !== 'all' && (
                        <span className="px-2 py-1 text-xs bg-green-900/30 text-green-300 rounded">
                          {dateFilter === 'today' ? 'Aujourd\'hui' : 
                           dateFilter === 'week' ? 'Cette semaine' : 'Ce mois'}
                        </span>
                      )}
                      {sizeFilter !== 'all' && (
                        <span className="px-2 py-1 text-xs bg-orange-900/30 text-orange-300 rounded">
                          {sizeFilter === 'small' ? '< 1MB' : 
                           sizeFilter === 'medium' ? '1-5MB' : '> 5MB'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  {filteredAndSortedFiles.length} document{filteredAndSortedFiles.length !== 1 ? 's' : ''}
                  {files.length !== filteredAndSortedFiles.length && (
                    <span className="text-gray-500"> sur {files.length}</span>
                  )}
                </div>
              </div>

              {filteredAndSortedFiles.length > 0 ? (
                <div className="grid gap-4">
                  {filteredAndSortedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-600/20 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-sm text-gray-400">
                              {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
                              {file.isEncrypted && (
                                <span className="ml-2 inline-flex items-center gap-1 text-green-400">
                                  <Lock className="w-3 h-3" />
                                  Chiffré
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFilePreview(file)}
                            className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-600/20 rounded-lg transition-colors"
                            title="Aperçu"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleFileDownload(file)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors"
                            title="Télécharger"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedFile(selectedFile?.id === file.id ? null : file)}
                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-600/20 rounded-lg transition-colors"
                            title="Détails"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleFileDelete(file)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {selectedFile?.id === file.id && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Type:</span>
                              <span className="ml-2">{file.type || 'Inconnu'}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Catégorie:</span>
                              <span className="ml-2 capitalize">{file.category}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Modifié:</span>
                              <span className="ml-2">{formatDate(file.lastModified)}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Sécurité:</span>
                              <span className="ml-2 text-green-400">
                                {file.isEncrypted ? 'Chiffré AES-256' : 'Non chiffré'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    {files.length === 0 ? 'Aucun document' : 'Aucun résultat'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {files.length === 0 
                      ? 'Commencez par ajouter vos premiers documents sécurisés'
                      : 'Aucun document ne correspond à vos critères de filtrage'
                    }
                  </p>
                  {(searchTerm || selectedCategory !== 'all' || dateFilter !== 'all' || sizeFilter !== 'all') ? (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setDateFilter('all');
                        setSizeFilter('all');
                        setSortBy('date');
                        setSortOrder('desc');
                      }}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Réinitialiser tous les filtres
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-6xl max-h-[90vh] w-full flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-600/20 rounded-lg">
                  <Eye className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{previewFile.name}</h3>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(previewFile.size)} • {previewFile.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Controls for Images only */}
                {previewFile.type.startsWith('image/') && (
                  <>
                    <button
                      onClick={() => handleZoom(-25)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="Zoom arrière"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-400 min-w-[3rem] text-center">{zoom}%</span>
                    <button
                      onClick={() => handleZoom(25)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="Zoom avant"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleRotate}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="Rotation"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Download from Preview (for non-PDF files only, PDF has its own download button) */}
                {previewFile.type !== 'application/pdf' && (
                  <button
                    onClick={() => handleFileDownload(previewFile)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}

                {/* Close */}
                <button
                  onClick={closePreview}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            {previewFile?.type === 'application/pdf' ? (
              // Layout spécial pour PDF - sans scroll interne, utilise toute la hauteur
              <div className="flex-1 flex flex-col">
                {previewLoading ? (
                  <div className="flex items-center justify-center h-64 p-4">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-400">Chargement de l'aperçu...</p>
                    </div>
                  </div>
                ) : previewData ? (
                  // Layout PDF en deux colonnes qui utilise toute la hauteur disponible sans scroll interne
                  <div className="flex gap-4 h-full p-4">
                    {/* Informations PDF à gauche */}
                    <div className="w-1/3 bg-gray-800 rounded-lg p-6 border border-gray-600">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">PDF</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{previewFile.name}</h3>
                          <p className="text-sm text-gray-400">Document PDF</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-900/50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-3">Détails du fichier</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Taille :</span>
                              <span className="text-white">{formatFileSize(previewFile.size)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Type :</span>
                              <span className="text-white">PDF</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Pages :</span>
                              <span id="pdf-pages-info" className="text-white">
                                <span className="inline-flex items-center gap-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                  Analyse en cours...
                                </span>
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Ajouté le :</span>
                              <span className="text-white">{previewFile.uploadDate.toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Catégorie :</span>
                              <span className="text-white capitalize">{previewFile.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <button
                            onClick={() => handleFileDownload(previewFile)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Télécharger le document
                          </button>
                        </div>

                        <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                          <p className="text-xs text-blue-300">
                            💡 L'aperçu s'adapte automatiquement à votre écran. Utilisez la barre de navigation pour parcourir les pages.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Aperçu PDF à droite - prend toute la hauteur restante */}
                    <div className="flex-1 bg-gray-800 rounded-lg border border-gray-600 flex flex-col">
                      {/* Zone d'aperçu PDF sans contrainte de hauteur */}
                      <div className="flex-1 relative bg-gray-900">
                        <iframe
                          id="pdf-viewer-iframe"
                          src={`${previewData}#toolbar=0&navpanes=0&scrollbar=0&page=1&view=Fit&zoom=page-fit`}
                          className="w-full h-full border-0"
                          title={`Aperçu de ${previewFile.name}`}
                          style={{
                            background: '#1f2937',
                            borderRadius: '0.5rem 0.5rem 0 0'
                          }}
                          loading="lazy"
                          onLoad={() => {
                            // Fonction pour détecter le nombre exact de pages PDF
                            const detectExactPageCount = async () => {
                              try {
                                // Méthode 1: Analyser le fichier PDF directement
                                const response = await fetch(previewData);
                                const arrayBuffer = await response.arrayBuffer();
                                const uint8Array = new Uint8Array(arrayBuffer);
                                
                                // Convertir en string pour analyser le contenu
                                let pdfText = '';
                                for (let i = 0; i < Math.min(uint8Array.length, 50000); i++) {
                                  pdfText += String.fromCharCode(uint8Array[i]);
                                }
                                
                                // Chercher les indicateurs de pages dans le PDF
                                let pageCount = 0;
                                
                                // Méthode A: Compter les objets de type Page
                                const pageMatches = pdfText.match(/\/Type\s*\/Page[^s]/g);
                                if (pageMatches) {
                                  pageCount = pageMatches.length;
                                }
                                
                                // Méthode B: Chercher le Count dans le catalogue des pages
                                if (pageCount === 0) {
                                  const countMatch = pdfText.match(/\/Count\s+(\d+)/);
                                  if (countMatch) {
                                    pageCount = parseInt(countMatch[1]);
                                  }
                                }
                                
                                // Méthode C: Compter les directives "endobj" qui suivent des pages
                                if (pageCount === 0) {
                                  const pageObjMatches = pdfText.match(/\/Type\s*\/Page[\s\S]*?endobj/g);
                                  if (pageObjMatches) {
                                    pageCount = pageObjMatches.length;
                                  }
                                }
                                
                                // Méthode D: Analyser la structure /Kids
                                if (pageCount === 0) {
                                  const kidsMatches = pdfText.match(/\/Kids\s*\[\s*([^\]]+)\]/g);
                                  if (kidsMatches) {
                                    let totalRefs = 0;
                                    kidsMatches.forEach(match => {
                                      const refs = match.match(/\d+\s+\d+\s+R/g);
                                      if (refs) totalRefs += refs.length;
                                    });
                                    if (totalRefs > 0) pageCount = totalRefs;
                                  }
                                }
                                
                                // Validation et application
                                if (pageCount > 0 && pageCount <= 1000) {
                                  updatePageInfo(pageCount, 'exact');
                                  console.log(`✅ PDF analysé: ${pageCount} pages détectées pour ${previewFile.name}`);
                                } else {
                                  throw new Error('Nombre de pages détecté invalide: ' + pageCount);
                                }
                                
                              } catch (error) {
                                console.warn('⚠️ Détection exacte échouée:', error);
                                // Fallback vers estimation intelligente
                                fallbackEstimation();
                              }
                            };
                            
                            // Fonction de fallback avec estimation améliorée
                            const fallbackEstimation = () => {
                              try {
                                const fileSizeKB = previewFile.size / 1024;
                                let estimatedPages: number;
                                
                                // Estimation plus précise basée sur des moyennes réelles
                                if (fileSizeKB < 100) {
                                  estimatedPages = 1;
                                } else if (fileSizeKB < 200) {
                                  estimatedPages = Math.ceil(fileSizeKB / 120); // ~120KB par page pour docs simples
                                } else if (fileSizeKB < 500) {
                                  estimatedPages = Math.ceil(fileSizeKB / 90);  // ~90KB par page pour docs moyens
                                } else if (fileSizeKB < 2000) {
                                  estimatedPages = Math.ceil(fileSizeKB / 75);  // ~75KB par page pour docs complexes
                                } else {
                                  estimatedPages = Math.ceil(fileSizeKB / 60);  // ~60KB par page pour docs lourds
                                }
                                
                                estimatedPages = Math.max(1, Math.min(500, estimatedPages));
                                updatePageInfo(estimatedPages, 'estimated');
                                console.log(`📊 Estimation: ${estimatedPages} pages pour ${previewFile.name} (${Math.round(fileSizeKB)}KB)`);
                                
                              } catch (error) {
                                console.error('❌ Erreur fallback:', error);
                                updatePageInfo(10, 'default');
                              }
                            };
                            
                            // Fonction pour mettre à jour l'interface
                            const updatePageInfo = (pageCount: number, method: 'exact' | 'estimated' | 'default') => {
                              const totalPagesInput = document.getElementById('total-pages') as HTMLInputElement;
                              const pageSlider = document.getElementById('page-slider') as HTMLInputElement;
                              const pagesInfo = document.getElementById('pdf-pages-info');
                              
                              if (totalPagesInput && pageSlider) {
                                totalPagesInput.value = pageCount.toString();
                                pageSlider.max = pageCount.toString();
                                pageSlider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 0%, #374151 0%, #374151 100%)`;
                              }
                              
                              if (pagesInfo) {
                                let statusText = '';
                                let statusIcon = '';
                                let statusColor = '';
                                
                                switch (method) {
                                  case 'exact':
                                    statusText = `${pageCount} page${pageCount > 1 ? 's' : ''}`;
                                    statusIcon = '✓';
                                    statusColor = 'text-green-400';
                                    break;
                                  case 'estimated':
                                    statusText = `~${pageCount} page${pageCount > 1 ? 's' : ''} (estimation)`;
                                    statusIcon = '📊';
                                    statusColor = 'text-yellow-400';
                                    break;
                                  case 'default':
                                    statusText = `${pageCount} pages (par défaut)`;
                                    statusIcon = '⚠️';
                                    statusColor = 'text-gray-400';
                                    break;
                                }
                                
                                pagesInfo.innerHTML = `
                                  <span class="inline-flex items-center gap-1 ${statusColor}">
                                    <span class="text-xs">${statusIcon}</span>
                                    ${statusText}
                                  </span>
                                `;
                              }
                            };
                            
                            // Démarrer la détection après un délai pour laisser l'iframe se charger
                            setTimeout(() => {
                              detectExactPageCount();
                            }, 1000);
                          }}
                        />
                        
                        <div id="page-indicator" className="absolute top-4 left-4 px-3 py-1 bg-gray-800/90 text-white text-xs rounded-full border border-gray-600">
                          Page 1
                        </div>
                      </div>

                      {/* Barre de navigation des pages */}
                      <div className="bg-gray-900 p-3 border-t border-gray-600 rounded-b-lg">
                        <div className="flex items-center gap-3">
                          <button
                            id="prev-page-btn"
                            onClick={() => {
                              const iframe = document.getElementById('pdf-viewer-iframe') as HTMLIFrameElement;
                              const pageSlider = document.getElementById('page-slider') as HTMLInputElement;
                              const currentPage = parseInt(pageSlider.value);
                              if (currentPage > 1) {
                                const newPage = currentPage - 1;
                                pageSlider.value = newPage.toString();
                                const newSrc = iframe.src.replace(/page=\d+/, `page=${newPage}`);
                                iframe.src = newSrc;
                                document.getElementById('page-indicator')!.textContent = `Page ${newPage}`;
                                document.getElementById('page-display')!.textContent = newPage.toString();
                              }
                            }}
                            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            title="Page précédente"
                          >
                            ◀
                          </button>

                          <span className="text-sm text-gray-300 min-w-[2rem] text-center">
                            <span id="page-display">1</span>
                          </span>

                          <div className="flex-1 px-2">
                            <input
                              id="page-slider"
                              type="range"
                              min="1"
                              max="10"
                              defaultValue="1"
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                              style={{
                                background: 'linear-gradient(to right, #3b82f6 0%, #3b82f6 2%, #374151 2%, #374151 100%)'
                              }}
                              onChange={(e) => {
                                const iframe = document.getElementById('pdf-viewer-iframe') as HTMLIFrameElement;
                                const page = parseInt(e.target.value);
                                const newSrc = iframe.src.replace(/page=\d+/, `page=${page}`);
                                iframe.src = newSrc;
                                document.getElementById('page-indicator')!.textContent = `Page ${page}`;
                                document.getElementById('page-display')!.textContent = page.toString();
                                
                                const percent = ((page - 1) / (parseInt(e.target.max) - 1)) * 100;
                                e.target.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percent}%, #374151 ${percent}%, #374151 100%)`;
                              }}
                              title="Naviguer dans les pages"
                            />
                          </div>

                          <span className="text-sm text-gray-400">/ 
                            <input
                              id="total-pages"
                              type="number"
                              min="1"
                              max="999"
                              defaultValue="10"
                              className="w-12 bg-gray-700 text-gray-200 text-center border border-gray-600 rounded px-1 ml-1 focus:outline-none focus:border-blue-500"
                              onChange={(e) => {
                                const slider = document.getElementById('page-slider') as HTMLInputElement;
                                const totalPages = parseInt(e.target.value) || 1;
                                slider.max = totalPages.toString();
                                
                                const currentPage = parseInt(slider.value);
                                if (currentPage > totalPages) {
                                  slider.value = totalPages.toString();
                                  const iframe = document.getElementById('pdf-viewer-iframe') as HTMLIFrameElement;
                                  const newSrc = iframe.src.replace(/page=\d+/, `page=${totalPages}`);
                                  iframe.src = newSrc;
                                  document.getElementById('page-indicator')!.textContent = `Page ${totalPages}`;
                                  document.getElementById('page-display')!.textContent = totalPages.toString();
                                }
                              }}
                              title="Ajustez manuellement si nécessaire"
                            />
                          </span>

                          <button
                            id="next-page-btn"
                            onClick={() => {
                              const iframe = document.getElementById('pdf-viewer-iframe') as HTMLIFrameElement;
                              const pageSlider = document.getElementById('page-slider') as HTMLInputElement;
                              const totalPages = parseInt(pageSlider.max);
                              const currentPage = parseInt(pageSlider.value);
                              if (currentPage < totalPages) {
                                const newPage = currentPage + 1;
                                pageSlider.value = newPage.toString();
                                const newSrc = iframe.src.replace(/page=\d+/, `page=${newPage}`);
                                iframe.src = newSrc;
                                document.getElementById('page-indicator')!.textContent = `Page ${newPage}`;
                                document.getElementById('page-display')!.textContent = newPage.toString();
                                
                                const percent = ((newPage - 1) / (totalPages - 1)) * 100;
                                pageSlider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percent}%, #374151 ${percent}%, #374151 100%)`;
                              }
                            }}
                            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            title="Page suivante"
                          >
                            ▶
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p>Erreur lors du chargement de l'aperçu</p>
                  </div>
                )}
              </div>
            ) : (
              // Layout standard pour les autres types de fichiers avec scroll autorisé
              <div className="flex-1 overflow-auto p-4">
                {previewLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-400">Chargement de l'aperçu...</p>
                    </div>
                  </div>
                ) : previewData ? (
                  <div className="flex items-center justify-center min-h-[300px]">
                    {previewFile.type.startsWith('image/') ? (
                      <img
                        src={previewData}
                        alt={previewFile.name}
                        className="max-w-full max-h-full object-contain transition-transform duration-200"
                        style={{
                          transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                          transformOrigin: 'center'
                        }}
                      />
                    ) : previewFile.type.startsWith('text/') ? (
                      <div className="w-full">
                        <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 overflow-auto max-h-[500px] whitespace-pre-wrap font-mono">
                          {previewData}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p>Aperçu non disponible pour ce type de fichier</p>
                        <p className="text-sm mt-2">Type: {previewFile.type}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p>Erreur lors du chargement de l'aperçu</p>
                  </div>
                )}
              </div>
            )}

            {/* Preview Footer */}
            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  <span>Uploadé le {formatDate(previewFile.uploadDate)}</span>
                  {previewFile.isEncrypted && (
                    <span className="flex items-center gap-1 text-green-400">
                      <Lock className="w-3 h-3" />
                      Chiffré
                    </span>
                  )}
                </div>
                <div className="text-xs">
                  Catégorie: <span className="capitalize">{previewFile.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;