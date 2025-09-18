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
  RotateCw,
  Server,
  Cloud,
  Folder,
  Edit,
  Save,
  Archive,
  DollarSign
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { AdminAuthUtils, SecurityLog } from '../utils/adminAuth';
import { adminFileService, AdminFile } from '../utils/adminFileService';

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
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<string>('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  
  // États pour la sélection multiple
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');
  
  // Nouveaux états pour la gestion serveur/localStorage
  const [useServerStorage, setUseServerStorage] = useState(true);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [migrationStatus, setMigrationStatus] = useState<'none' | 'in-progress' | 'completed' | 'error'>('none');

  const categories = [
    { id: 'all', name: 'Tous les documents', icon: FileText },
    { id: 'scolaire', name: 'Documents scolaires', icon: FileText },
    { id: 'logement', name: 'Documents logement', icon: User },
    { id: 'transport', name: 'Documents transport', icon: Shield },
    { id: 'sante', name: 'Documents santé', icon: Activity },
    { id: 'finance', name: 'Documents financiers', icon: DollarSign },
    { id: 'legal', name: 'Documents légaux', icon: Lock },
     { id: 'micro-entreprise', name: 'Documents micro-entreprise', icon: Shield },
    // { id: 'identity', name: 'Pièces d\'identité', icon: User },
    { id: 'other', name: 'Documents divers', icon: FileText }
  ];

  // Charger les données au montage
  useEffect(() => {
    initializeSystem();
    loadSecurityLogs();
    
    // Marquer l'activité régulièrement
    const activityInterval = setInterval(() => {
      updateActivity();
    }, 5 * 60 * 1000); // Toutes les 5 minutes

    return () => clearInterval(activityInterval);
  }, [updateActivity]);

  // Fonction d'initialisation du système
  const initializeSystem = async () => {
    try {
      // Vérifier la connectivité du serveur
      setServerStatus('checking');
      const isServerOnline = await adminFileService.testConnection();
      
      if (isServerOnline) {
        setServerStatus('online');
        setUseServerStorage(true);
        await loadFilesFromServer();
        await calculateStorageUsage();
        
        // Proposer la migration si des données localStorage existent
        const localFiles = adminFileService.getLocalStorageFiles();
        if (localFiles.length > 0 && migrationStatus === 'none') {
          const shouldMigrate = confirm(`${localFiles.length} fichier(s) trouvé(s) en local. Migrer vers le serveur ?`);
          if (shouldMigrate) {
            await performMigration();
          }
        }
      } else {
        setServerStatus('offline');
        setUseServerStorage(false);
        loadFilesFromLocalStorage();
        calculateLocalStorageUsage();
        console.warn('🔄 Mode local : Serveur indisponible, utilisation de localStorage');
      }
    } catch (error) {
      console.error('Erreur initialisation système:', error);
      setServerStatus('offline');
      setUseServerStorage(false);
      loadFilesFromLocalStorage();
      calculateLocalStorageUsage();
    }
  };

  // Charger les fichiers depuis le serveur
  const loadFilesFromServer = async () => {
    try {
      console.log('📂 loadFilesFromServer: Début du chargement...');
      const serverFiles = await adminFileService.getFiles();
      console.log('📂 loadFilesFromServer: Fichiers reçus:', serverFiles.length);
      setFiles(serverFiles);
    } catch (error) {
      console.error('📂 Erreur chargement serveur:', error);
      // Fallback vers localStorage
      loadFilesFromLocalStorage();
      setUseServerStorage(false);
      setServerStatus('offline');
    }
  };

  // Charger les fichiers depuis localStorage
  const loadFilesFromLocalStorage = () => {
    try {
      console.log('💾 loadFilesFromLocalStorage: Début du chargement...');
      const localFiles = adminFileService.getLocalStorageFiles();
      console.log('💾 loadFilesFromLocalStorage: Fichiers reçus:', localFiles.length);
      setFiles(localFiles);
    } catch (error) {
      console.error('💾 Erreur chargement localStorage:', error);
      setFiles([]);
    }
  };

  // Effectuer la migration depuis localStorage vers le serveur
  const performMigration = async () => {
    try {
      setMigrationStatus('in-progress');
      const result = await adminFileService.migrateFromLocalStorage();
      
      if (result.errors.length === 0) {
        setMigrationStatus('completed');
        alert(`Migration réussie ! ${result.success} fichier(s) transféré(s) vers le serveur.`);
        await loadFilesFromServer();
      } else {
        setMigrationStatus('error');
        const errorMsg = `Migration partiellement réussie: ${result.success} succès, ${result.errors.length} erreurs.\n\nErreurs:\n${result.errors.join('\n')}`;
        alert(errorMsg);
        await loadFilesFromServer();
      }
      
      AdminAuthUtils.logSecurityEvent('file_upload', `Migration: ${result.success} succès, ${result.errors.length} erreurs`);
    } catch (error) {
      console.error('Erreur migration:', error);
      setMigrationStatus('error');
      alert('Erreur lors de la migration: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

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

  // Calculer l'usage du stockage serveur
  const calculateStorageUsage = async () => {
    try {
      if (useServerStorage && serverStatus === 'online') {
        const serverInfo = await adminFileService.getStorageInfo();
        setStorageInfo({ used: serverInfo.used, total: serverInfo.total });
      } else {
        calculateLocalStorageUsage();
      }
    } catch (error) {
      console.error('Erreur calcul stockage serveur:', error);
      calculateLocalStorageUsage();
    }
  };

  // Calculer l'usage du stockage localStorage
  const calculateLocalStorageUsage = () => {
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
      console.error('Erreur calcul stockage local:', error);
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
      // Vérifier la taille du fichier
      const maxSize = useServerStorage ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB serveur, 10MB localStorage
      if (file.size > maxSize) {
        const maxSizeStr = formatFileSize(maxSize);
        alert(`Fichier trop volumineux. Taille maximale : ${maxSizeStr}`);
        return;
      }

      const category = selectedCategory === 'all' ? 'other' : selectedCategory;

      if (useServerStorage && serverStatus === 'online') {
        // Upload vers le serveur
        try {
          await adminFileService.uploadFile(file, category);
          AdminAuthUtils.logSecurityEvent('file_upload', `Fichier ${file.name} uploadé sur serveur (${formatFileSize(file.size)})`);
        } catch (serverError) {
          console.warn('Échec upload serveur, fallback localStorage:', serverError);
          await adminFileService.saveToLocalStorage(file, category);
          AdminAuthUtils.logSecurityEvent('file_upload', `Fichier ${file.name} sauvé en local (${formatFileSize(file.size)})`);
        }
      } else {
        // Sauvegarde localStorage
        await adminFileService.saveToLocalStorage(file, category);
        AdminAuthUtils.logSecurityEvent('file_upload', `Fichier ${file.name} sauvé en local (${formatFileSize(file.size)})`);
      }

      // Mettre à jour la liste des fichiers
      if (useServerStorage && serverStatus === 'online') {
        await loadFilesFromServer();
      } else {
        loadFilesFromLocalStorage();
      }
      await calculateStorageUsage();
      
      // Reset du formulaire
      event.target.value = '';
      
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload du fichier');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const maxSize = useServerStorage ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB serveur, 10MB localStorage
      const category = selectedCategory === 'all' ? 'other' : selectedCategory;
      
      let uploadedCount = 0;
      let skippedCount = 0;
      let totalSize = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Vérifier la taille du fichier
        if (file.size > maxSize) {
          skippedCount++;
          console.warn(`Fichier ${file.name} trop volumineux (${formatFileSize(file.size)}), ignoré`);
          continue;
        }

        totalSize += file.size;

        try {
          // Extraire seulement le nom du fichier (sans le chemin du dossier)
          const fileName = file.webkitRelativePath ? 
            file.webkitRelativePath.split('/').pop() || file.name : 
            file.name;

          if (useServerStorage && serverStatus === 'online') {
            // Upload vers le serveur avec seulement le nom du fichier
            try {
              await adminFileService.uploadFileWithPath(file, category, fileName);
            } catch (serverError) {
              console.warn('Échec upload serveur pour', fileName, ', fallback localStorage:', serverError);
              await adminFileService.saveToLocalStorageWithPath(file, category, fileName);
            }
          } else {
            // Sauvegarde localStorage avec seulement le nom
            await adminFileService.saveToLocalStorageWithPath(file, category, fileName);
          }

          uploadedCount++;
        } catch (error) {
          console.error(`Erreur pour le fichier ${file.name}:`, error);
          skippedCount++;
        }
      }

      // Log de sécurité
      AdminAuthUtils.logSecurityEvent('file_upload', 
        `Dossier uploadé: ${uploadedCount} fichiers (${formatFileSize(totalSize)}), ${skippedCount} ignorés`
      );

      // Mettre à jour la liste des fichiers
      console.log('🔍 Debug folder upload - Reloading files...');
      console.log('   - useServerStorage:', useServerStorage);
      console.log('   - serverStatus:', serverStatus);
      
      if (useServerStorage && serverStatus === 'online') {
        console.log('   - Chargement depuis le serveur...');
        await loadFilesFromServer();
      } else {
        console.log('   - Chargement depuis localStorage...');
        loadFilesFromLocalStorage();
      }
      await calculateStorageUsage();
      
      console.log('   - Nouveau nombre de fichiers:', files.length);
      
      // Reset du formulaire
      event.target.value = '';

      // Message de confirmation
      if (uploadedCount > 0) {
        alert(`✅ Dossier uploadé avec succès!\n${uploadedCount} fichiers ajoutés${skippedCount > 0 ? `\n${skippedCount} fichiers ignorés (trop volumineux)` : ''}`);
      } else {
        alert('❌ Aucun fichier n\'a pu être uploadé.');
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'upload du dossier:', error);
      alert('Erreur lors de l\'upload du dossier');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDownload = async (file: AdminFile) => {
    try {
      if (useServerStorage && serverStatus === 'online' && file.filePath) {
        // Télécharger depuis le serveur
        await adminFileService.downloadFile(file.id, file.name);
      } else {
        // Télécharger depuis localStorage
        adminFileService.downloadFromLocalStorage(file.id, file.name);
      }

      // Log de sécurité
      AdminAuthUtils.logSecurityEvent('file_download', `Fichier ${file.name} téléchargé`);
      loadSecurityLogs();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du fichier: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleFileDelete = async (file: AdminFile) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${file.name}" ?`)) {
      try {
        if (useServerStorage && serverStatus === 'online' && file.filePath) {
          // Supprimer du serveur
          await adminFileService.deleteFile(file.id);
        } else {
          // Supprimer de localStorage
          adminFileService.deleteFromLocalStorage(file.id);
        }

        // Mettre à jour la liste des fichiers
        setFiles(prev => prev.filter(f => f.id !== file.id));
        await calculateStorageUsage();
        setSelectedFile(null);

        // Log de sécurité
        AdminAuthUtils.logSecurityEvent('file_delete', `Fichier ${file.name} supprimé`);
        loadSecurityLogs();

        alert('Fichier supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
      }
    }
  };

  const handleFilePreview = async (file: AdminFile) => {
    setPreviewLoading(true);
    setPreviewFile(file);
    setZoom(100);
    setRotation(0);

    try {
      let previewUrl: string | null = null;

      if (useServerStorage && serverStatus === 'online' && file.filePath) {
        // Aperçu depuis le serveur
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';
        const isText = file.type.startsWith('text/') || file.name.toLowerCase().endsWith('.txt');

        if (isImage || isPdf) {
          previewUrl = adminFileService.getPreviewUrl(file.id);
        } else if (isText) {
          // Pour les fichiers texte, on doit les télécharger et les lire
          // Pour l'instant, on va utiliser l'URL de prévisualisation
          previewUrl = adminFileService.getPreviewUrl(file.id);
        }
      } else {
        // Aperçu depuis localStorage
        previewUrl = adminFileService.getLocalStoragePreviewUrl(file.id, file.type);
      }

      if (previewUrl) {
        setPreviewData(previewUrl);
      } else {
        alert('Aperçu non disponible pour ce type de fichier');
        setPreviewFile(null);
        return;
      }

      // Log de sécurité
      AdminAuthUtils.logSecurityEvent('file_preview', `Aperçu du fichier ${file.name}`);
    } catch (error) {
      console.error('Erreur lors de la prévisualisation:', error);
      alert('Erreur lors de la prévisualisation du fichier: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
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

  // Fonction pour mettre à jour la catégorie d'un fichier
  const handleUpdateCategory = async (fileId: string, newCategoryValue: string) => {
    if (!newCategoryValue || newCategoryValue === 'all') {
      alert('Veuillez sélectionner une catégorie valide');
      return;
    }

    try {
      console.log('🔄 Mise à jour catégorie:', { 
        fileId, 
        newCategoryValue, 
        useServerStorage, 
        serverStatus,
        fileExists: files.find(f => f.id === fileId) ? 'oui' : 'non'
      });
      
      // Afficher tous les IDs disponibles pour débugger
      console.log('📋 IDs de fichiers disponibles:', files.map(f => ({ id: f.id, name: f.name })));
      
      // Mettre à jour via le service approprié
      if (useServerStorage && serverStatus === 'online') {
        console.log('📡 Tentative de mise à jour via serveur...');
        try {
          await adminFileService.updateFileCategory(fileId, newCategoryValue);
          console.log('✅ Mise à jour serveur réussie');
        } catch (serverError) {
          console.warn('❌ Échec serveur, fallback localStorage:', serverError);
          await adminFileService.updateLocalStorageFileCategory(fileId, newCategoryValue);
          console.log('✅ Mise à jour localStorage réussie');
        }
      } else {
        console.log('💾 Mise à jour via localStorage...');
        await adminFileService.updateLocalStorageFileCategory(fileId, newCategoryValue);
        console.log('✅ Mise à jour localStorage réussie');
      }

      // Recharger la liste des fichiers
      if (useServerStorage && serverStatus === 'online') {
        await loadFilesFromServer();
      } else {
        loadFilesFromLocalStorage();
      }

      // Log de sécurité
      AdminAuthUtils.logSecurityEvent('file_upload', `Catégorie du fichier mise à jour vers: ${newCategoryValue}`);
      
      // Réinitialiser l'état d'édition
      setEditingCategory(null);
      setNewCategory('');

      alert('Catégorie mise à jour avec succès!');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      alert('Erreur lors de la mise à jour de la catégorie: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  // Fonction pour renommer un fichier
  const handleRenameFile = async (fileId: string, newNameValue: string) => {
    if (!newNameValue || newNameValue.trim() === '') {
      alert('Veuillez saisir un nom valide');
      return;
    }

    try {
      console.log('🔄 Renommage fichier:', { 
        fileId, 
        newNameValue, 
        useServerStorage, 
        serverStatus,
        fileExists: files.find(f => f.id === fileId) ? 'oui' : 'non'
      });
      
      // Afficher tous les IDs disponibles pour débugger
      console.log('📋 IDs de fichiers disponibles:', files.map(f => ({ id: f.id, name: f.name })));
      
      // Renommer via le service approprié
      if (useServerStorage && serverStatus === 'online') {
        console.log('📡 Tentative de renommage via serveur...');
        try {
          await adminFileService.renameFile(fileId, newNameValue.trim());
          console.log('✅ Renommage serveur réussi');
        } catch (serverError) {
          console.warn('❌ Échec serveur, fallback localStorage:', serverError);
          await adminFileService.renameLocalStorageFile(fileId, newNameValue.trim());
          console.log('✅ Renommage localStorage réussi');
        }
      } else {
        console.log('💾 Renommage via localStorage...');
        await adminFileService.renameLocalStorageFile(fileId, newNameValue.trim());
        console.log('✅ Renommage localStorage réussi');
      }

      // Recharger la liste des fichiers
      if (useServerStorage && serverStatus === 'online') {
        await loadFilesFromServer();
      } else {
        loadFilesFromLocalStorage();
      }

      // Log de sécurité
      AdminAuthUtils.logSecurityEvent('file_rename', `Fichier renommé vers: ${newNameValue.trim()}`);
      
      // Réinitialiser l'état d'édition
      setEditingName(null);
      setNewName('');

      alert('Fichier renommé avec succès!');
    } catch (error) {
      console.error('Erreur lors du renommage du fichier:', error);
      alert('Erreur lors du renommage du fichier: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  // Fonctions de gestion de la sélection multiple
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedFiles(new Set());
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const selectAllFiles = () => {
    const allFileIds = new Set(files.map(file => file.id));
    setSelectedFiles(allFileIds);
  };

  const deselectAllFiles = () => {
    setSelectedFiles(new Set());
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) {
      alert('Aucun fichier sélectionné');
      return;
    }

    const confirmMessage = `Êtes-vous sûr de vouloir supprimer ${selectedFiles.size} fichier(s) ?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const selectedFilesList = Array.from(selectedFiles);
      
      for (const fileId of selectedFilesList) {
        const file = files.find(f => f.id === fileId);
        if (file) {
          if (useServerStorage) {
            await adminFileService.deleteFile(fileId);
          } else {
            adminFileService.deleteFromLocalStorage(fileId);
          }
        }
      }

      // Recharger la liste des fichiers
      await initializeSystem();
      
      // Réinitialiser la sélection
      setSelectedFiles(new Set());
      
      // Log de sécurité
      AdminAuthUtils.logSecurityEvent('file_delete', `Suppression groupée de ${selectedFiles.size} fichiers`);
      
      alert(`${selectedFilesList.length} fichier(s) supprimé(s) avec succès!`);
    } catch (error) {
      console.error('Erreur lors de la suppression des fichiers:', error);
      alert('Erreur lors de la suppression des fichiers: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleBulkCategoryChange = async () => {
    if (selectedFiles.size === 0) {
      alert('Aucun fichier sélectionné');
      return;
    }

    if (!bulkCategory) {
      alert('Veuillez sélectionner une catégorie');
      return;
    }

    const confirmMessage = `Êtes-vous sûr de vouloir changer la catégorie de ${selectedFiles.size} fichier(s) vers "${bulkCategory}" ?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const selectedFilesList = Array.from(selectedFiles);
      
      if (useServerStorage) {
        // Utiliser le service pour le changement en lot
        await adminFileService.updateMultipleFileCategories(selectedFilesList, bulkCategory);
      } else {
        // Mettre à jour localement
        for (const fileId of selectedFilesList) {
          await adminFileService.updateLocalStorageFileCategory(fileId, bulkCategory);
        }
      }

      // Recharger la liste des fichiers
      await initializeSystem();
      
      // Réinitialiser la sélection et la catégorie
      setSelectedFiles(new Set());
      setBulkCategory('');
      
      // Log de sécurité
      AdminAuthUtils.logSecurityEvent('file_update', `Changement de catégorie groupé de ${selectedFiles.size} fichiers vers ${bulkCategory}`);
      
      alert(`Catégorie de ${selectedFilesList.length} fichier(s) changée vers "${bulkCategory}" avec succès!`);
    } catch (error) {
      console.error('Erreur lors du changement de catégorie:', error);
      alert('Erreur lors du changement de catégorie: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleDownloadCategory = async (category: string) => {
    try {
      const categoryFiles = files.filter(file => file.category === category);
      
      if (categoryFiles.length === 0) {
        alert('Aucun fichier trouvé dans cette catégorie');
        return;
      }

      const confirmMessage = `Télécharger ${categoryFiles.length} fichier(s) de la catégorie "${category}" en archive ZIP ?`;
      if (!confirm(confirmMessage)) {
        return;
      }

      // Utiliser la nouvelle méthode ZIP
      if (useServerStorage) {
        await adminFileService.downloadCategoryAsZip(category);
      } else {
        // Fallback: téléchargement séquentiel pour localStorage
        let downloadedCount = 0;
        for (const file of categoryFiles) {
          try {
            adminFileService.downloadFromLocalStorage(file.id, file.name);
            downloadedCount++;
          } catch (error) {
            console.error(`Erreur lors du téléchargement de ${file.name}:`, error);
          }
        }
        alert(`${downloadedCount}/${categoryFiles.length} fichier(s) téléchargé(s) individuellement!`);
        AdminAuthUtils.logSecurityEvent('file_download', `Téléchargement localStorage catégorie ${category}: ${downloadedCount}/${categoryFiles.length} fichiers`);
        return;
      }

      AdminAuthUtils.logSecurityEvent('file_download', `Téléchargement ZIP catégorie ${category}: ${categoryFiles.length} fichiers`);
      alert(`Archive ZIP téléchargée avec succès! (${categoryFiles.length} fichier(s))`);
    } catch (error) {
      console.error('Erreur lors du téléchargement de la catégorie:', error);
      alert('Erreur lors du téléchargement de la catégorie: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleDownloadAllCategories = async () => {
    try {
      const totalFiles = files.length;
      
      if (totalFiles === 0) {
        alert('Aucun fichier à télécharger');
        return;
      }

      const confirmMessage = `Télécharger tous vos documents (${totalFiles} fichiers) organisés par dossiers dans une archive ZIP ?`;
      if (!confirm(confirmMessage)) {
        return;
      }

      // Utiliser la nouvelle méthode pour télécharger tout organisé par dossiers
      if (useServerStorage) {
        await adminFileService.downloadAllCategoriesAsZip();
        AdminAuthUtils.logSecurityEvent('file_download', `Téléchargement ZIP complet: ${totalFiles} fichiers`);
        alert(`Archive complète téléchargée avec succès: ${totalFiles} fichier(s) organisés par dossiers`);
      } else {
        // Fallback: créer une structure organisée en localStorage
        alert('Téléchargement organisé disponible uniquement en mode serveur. Téléchargement individuel par catégorie recommandé.');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement complet:', error);
      alert('Erreur lors du téléchargement complet: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
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
            
            {/* Indicateur de statut serveur */}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-700/50 rounded-lg">
              {serverStatus === 'checking' ? (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-yellow-400">Vérification...</span>
                </>
              ) : serverStatus === 'online' ? (
                <>
                  <Server className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-400">Serveur en ligne</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-orange-400">Mode local</span>
                </>
              )}
              
              {migrationStatus === 'in-progress' && (
                <div className="flex items-center gap-1 ml-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                  <span className="text-xs text-blue-400">Migration...</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Bouton de migration manuelle */}
            {serverStatus === 'online' && !useServerStorage && (
              <button
                onClick={performMigration}
                disabled={migrationStatus === 'in-progress'}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-lg transition-colors"
              >
                <Server className="w-4 h-4" />
                Migrer vers serveur
              </button>
            )}
            
            {/* Bouton de reconnexion serveur */}
            {serverStatus === 'offline' && (
              <button
                onClick={initializeSystem}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Server className="w-4 h-4" />
                Reconnecter
              </button>
            )}
            
            <button
              onClick={() => window.location.href = '/admin/notes'}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              Notes
            </button>
            <button
              onClick={() => window.location.href = '/admin/todos'}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Tâches
            </button>
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
            {/* Sélection multiple */}
            <div className="space-y-3">
              <button
                onClick={toggleSelectionMode}
                className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg transition-all duration-200 font-medium ${
                  selectionMode 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {selectionMode ? 'Annuler sélection' : 'Sélectionner plusieurs'}
              </button>
              
              {selectionMode && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllFiles}
                      className="flex-1 py-1 px-2 text-xs bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                      Tout sélectionner
                    </button>
                    <button
                      onClick={deselectAllFiles}
                      className="flex-1 py-1 px-2 text-xs bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                    >
                      Tout désélectionner
                    </button>
                  </div>
                  
                  {selectedFiles.size > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-amber-300 text-center">
                        {selectedFiles.size} fichier(s) sélectionné(s)
                      </div>
                      
                      {/* Changement de catégorie en lot */}
                      <div className="space-y-2">
                        <select
                          value={bulkCategory}
                          onChange={(e) => setBulkCategory(e.target.value)}
                          className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Changer catégorie</option>
                          <option value="scolaire">Scolaire</option>
                          <option value="logement">Logement</option>
                          <option value="transport">Transport</option>
                          <option value="sante">Santé</option>
                          <option value="finance">Finance</option>
                          <option value="legal">Légal</option>
                          <option value="micro-entreprise">Micro-entreprise</option>
                          <option value="other">Autre</option>
                        </select>
                        <button
                          onClick={handleBulkCategoryChange}
                          disabled={!bulkCategory}
                          className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Changer catégorie
                        </button>
                      </div>
                      
                      <button
                        onClick={handleDeleteSelected}
                        className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer sélection
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

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

            {/* Upload de dossier */}
            <div>
              <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-lg cursor-pointer transition-all duration-200 font-medium shadow-lg">
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Upload...
                  </>
                ) : (
                  <>
                    <Folder className="w-4 h-4" />
                    Ajouter un dossier
                  </>
                )}
                <input
                  type="file"
                  onChange={handleFolderUpload}
                  disabled={isUploading}
                  className="hidden"
                  ref={(input) => {
                    if (input) {
                      (input as any).webkitdirectory = true;
                      (input as any).directory = true;
                    }
                  }}
                  multiple
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
              
              {/* Bouton téléchargement complet */}
              <div className="mb-4">
                <button
                  onClick={handleDownloadAllCategories}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all duration-200 font-medium shadow-lg text-white"
                  title="Télécharger tous les documents organisés par dossiers"
                >
                  <Archive className="w-4 h-4" />
                  Télécharger tout en ZIP
                </button>
              </div>
              
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  const categoryFilesCount = files.filter(f => f.category === category.id).length;
                  
                  return (
                    <div key={category.id} className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-3 flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="flex-1 text-left">{category.name}</span>
                        {categoryFilesCount > 0 && (
                          <span className="text-xs bg-gray-600 px-1.5 py-0.5 rounded">
                            {categoryFilesCount}
                          </span>
                        )}
                      </button>
                      
                      {/* Bouton ZIP pour télécharger toute la catégorie */}
                      {category.id !== 'all' && categoryFilesCount > 0 && (
                        <button
                          onClick={() => handleDownloadCategory(category.id)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                          title={`Télécharger tous les fichiers de ${category.name} en ZIP`}
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Storage Info */}
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-medium text-gray-300">Stockage</h3>
                {useServerStorage ? (
                  <Server className="w-3 h-3 text-green-500" />
                ) : (
                  <HardDrive className="w-3 h-3 text-orange-500" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Utilisé</span>
                  <span>{formatFileSize(storageInfo.used)} / {formatFileSize(storageInfo.total)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      useServerStorage 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500'
                    }`}
                    style={{ width: `${Math.min((storageInfo.used / storageInfo.total) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {files.length} document{files.length !== 1 ? 's' : ''} stocké{files.length !== 1 ? 's' : ''}
                  <br />
                  <span className={useServerStorage ? 'text-green-400' : 'text-orange-400'}>
                    {useServerStorage ? 'Serveur' : 'Local'}
                  </span>
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
                      className="group bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {selectionMode && (
                            <input
                              type="checkbox"
                              checked={selectedFiles.has(file.id)}
                              onChange={() => toggleFileSelection(file.id)}
                              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                          )}
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-600/20 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            {editingName === file.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={newName}
                                  onChange={(e) => setNewName(e.target.value)}
                                  className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm flex-1"
                                  placeholder="Nouveau nom..."
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleRenameFile(file.id, newName)}
                                  className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white"
                                  disabled={!newName.trim()}
                                  title="Confirmer"
                                >
                                  <Save className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingName(null);
                                    setNewName('');
                                  }}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white"
                                  title="Annuler"
                                >
                                  ✗
                                </button>
                              </div>
                            ) : (
                              <div className="font-medium">{file.name}</div>
                            )}
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
                            onClick={() => {
                              setEditingName(file.id);
                              setNewName(file.name);
                            }}
                            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-600/20 rounded-lg transition-colors"
                            title="Renommer"
                          >
                            <Edit className="w-4 h-4" />
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
                              {editingCategory === file.id ? (
                                <div className="ml-2 flex items-center gap-2">
                                  <select
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                  >
                                    <option value="">Sélectionnez...</option>
                                    {categories.filter(cat => cat.id !== 'all').map(cat => (
                                      <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => handleUpdateCategory(file.id, newCategory)}
                                    className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white"
                                    disabled={!newCategory}
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingCategory(null);
                                      setNewCategory('');
                                    }}
                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white"
                                  >
                                    ✗
                                  </button>
                                </div>
                              ) : (
                                <div className="ml-2 flex items-center gap-2">
                                  <span className="capitalize">{file.category}</span>
                                  <button
                                    onClick={() => {
                                      setEditingCategory(file.id);
                                      setNewCategory(file.category);
                                    }}
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Modifier la catégorie"
                                  >
                                    📝
                                  </button>
                                </div>
                              )}
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
                          {editingName === previewFile.id ? (
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm flex-1"
                                placeholder="Nouveau nom..."
                                autoFocus
                              />
                              <button
                                onClick={() => handleRenameFile(previewFile.id, newName)}
                                className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white"
                                disabled={!newName.trim()}
                                title="Confirmer"
                              >
                                <Save className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingName(null);
                                  setNewName('');
                                }}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white"
                                title="Annuler"
                              >
                                ✗
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-white">{previewFile.name}</h3>
                              <button
                                onClick={() => {
                                  setEditingName(previewFile.id);
                                  setNewName(previewFile.name);
                                }}
                                className="p-1 text-gray-400 hover:text-yellow-400 hover:bg-yellow-600/20 rounded transition-colors"
                                title="Renommer"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                            </div>
                          )}
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
                            💡 L'aperçu s'adapte automatiquement à votre écran. Vous pouvez naviguer dans le PDF directement dans la fenêtre d'aperçu.
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
                        />
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
                <div className="text-xs flex items-center gap-2">
                  <span>Catégorie:</span>
                  {editingCategory === previewFile.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                      >
                        <option value="">Sélectionnez...</option>
                        {categories.filter(cat => cat.id !== 'all').map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleUpdateCategory(previewFile.id, newCategory)}
                        className="px-1 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white"
                        disabled={!newCategory}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategory(null);
                          setNewCategory('');
                        }}
                        className="px-1 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white"
                      >
                        ✗
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{previewFile.category}</span>
                      <button
                        onClick={() => {
                          setEditingCategory(previewFile.id);
                          setNewCategory(previewFile.category);
                        }}
                        className="px-1 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                        title="Modifier la catégorie"
                      >
                        📝
                      </button>
                    </div>
                  )}
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
