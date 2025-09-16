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
  LogOut
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
    
    // Marquer l'activité régulièrement
    const activityInterval = setInterval(() => {
      updateActivity();
    }, 5 * 60 * 1000); // Toutes les 5 minutes

    return () => clearInterval(activityInterval);
  }, [updateActivity]);

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
      // Créer l'objet fichier
      const newFile: AdminFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        lastModified: new Date(),
        isEncrypted: true,
        category: selectedCategory === 'all' ? 'other' : selectedCategory,
        tags: []
      };

      // Chiffrer et stocker le fichier (simulation simple pour le prototype)
      const fileData = await file.arrayBuffer();
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(fileData)));
      
      // Stocker les métadonnées
      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);
      localStorage.setItem('admin-files-lm', JSON.stringify(updatedFiles));

      // Stocker le fichier en base64
      localStorage.setItem(`admin-file-data-${newFile.id}`, base64Data);

      // Log de sécurité
      AdminAuthUtils.logSecurityEvent('file_upload', `Fichier ${file.name} uploadé et chiffré`);
      loadSecurityLogs();

      alert('Fichier uploadé avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload du fichier');
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
        alert('Fichier non trouvé');
        return;
      }

      // Décoder le base64
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Créer un blob et le télécharger
      const blob = new Blob([bytes], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Log de sécurité
      AdminAuthUtils.logSecurityEvent('file_download', `Fichier ${file.name} téléchargé`);
      loadSecurityLogs();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement');
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

        setSelectedFile(null);
        alert('Fichier supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      AdminAuthUtils.logSecurityEvent('logout', 'Déconnexion admin');
      logout();
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                <h2 className="text-2xl font-bold">Documents Sécurisés</h2>
                <div className="text-sm text-gray-400">
                  {filteredFiles.length} document{filteredFiles.length !== 1 ? 's' : ''}
                </div>
              </div>

              {filteredFiles.length > 0 ? (
                <div className="grid gap-4">
                  {filteredFiles.map((file) => (
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
                            <Eye className="w-4 h-4" />
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
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Aucun document</h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'Aucun document ne correspond à vos critères'
                      : 'Commencez par ajouter vos premiers documents sécurisés'
                    }
                  </p>
                  {searchTerm || selectedCategory !== 'all' ? (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Réinitialiser les filtres
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;