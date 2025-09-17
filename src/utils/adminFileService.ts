/**
 * Service pour la gestion des fichiers administratifs via l'API serveur
 * Alternative sécurisée à localStorage avec stockage sur le serveur
 */

// Interface partagée pour les fichiers administratifs
export interface AdminFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  lastModified: Date;
  isEncrypted: boolean;
  category: string;
  tags: string[];
  filePath?: string; // Chemin sur le serveur
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class AdminFileService {
  private baseUrl: string;
  private token: string;

  constructor() {
    // Token d'authentification depuis les variables d'environnement ou fallback dev
    this.token = import.meta.env.VITE_ADMIN_TOKEN || 'default-dev-token';
    
    // Détection automatique de l'environnement
    if (import.meta.env.DEV) {
      // Mode développement : serveur API local sur port 8080
      this.baseUrl = 'http://localhost:8080/api';
    } else {
      // Mode production : API servie par le même domaine via proxy Nginx
      this.baseUrl = `${window.location.origin}/api`;
    }
    
    console.log(`[AdminFileService] Mode: ${import.meta.env.DEV ? 'développement' : 'production'}`);
    console.log(`[AdminFileService] API URL: ${this.baseUrl}`);
    console.log(`[AdminFileService] Token: ${this.token.substring(0, 8)}...`);
    console.log(`[AdminFileService] Window origin: ${window.location.origin}`);
  }

  /**
   * Headers par défaut pour les requêtes API
   */
  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Headers pour l'upload de fichiers (sans Content-Type pour FormData)
   */
  private getUploadHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.token}`
    };
  }

  /**
   * Récupérer la liste des fichiers depuis le serveur
   */
  async getFiles(): Promise<AdminFile[]> {
    try {
      const response = await fetch(`${this.baseUrl}/files`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse<AdminFile[]> = await response.json();
      
      if (result.success && result.data) {
        // Convertir les dates en objets Date
        return result.data.map(file => ({
          ...file,
          uploadDate: new Date(file.uploadDate),
          lastModified: new Date(file.lastModified)
        }));
      } else {
        throw new Error(result.error || 'Erreur lors de la récupération des fichiers');
      }
    } catch (error) {
      console.error('Erreur getFiles:', error);
      throw error;
    }
  }

  /**
   * Uploader un fichier vers le serveur
   */
  async uploadFile(file: File, category: string = 'other'): Promise<AdminFile> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const response = await fetch(`${this.baseUrl}/files`, {
        method: 'POST',
        headers: this.getUploadHeaders(),
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse<AdminFile> = await response.json();
      
      if (result.success && result.data) {
        // Convertir les dates
        const adminFile = {
          ...result.data,
          uploadDate: new Date(result.data.uploadDate),
          lastModified: new Date(result.data.lastModified)
        };
        return adminFile;
      } else {
        throw new Error(result.error || 'Erreur lors de l\'upload du fichier');
      }
    } catch (error) {
      console.error('Erreur uploadFile:', error);
      throw error;
    }
  }

  /**
   * Uploader un fichier vers le serveur avec préservation du chemin
   */
  async uploadFileWithPath(file: File, category: string = 'other', relativePath: string = ''): Promise<AdminFile> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('relativePath', relativePath);

      const response = await fetch(`${this.baseUrl}/files/upload-with-path`, {
        method: 'POST',
        headers: this.getUploadHeaders(),
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse<AdminFile> = await response.json();
      
      if (result.success && result.data) {
        // Convertir les dates
        const adminFile = {
          ...result.data,
          uploadDate: new Date(result.data.uploadDate),
          lastModified: new Date(result.data.lastModified)
        };
        return adminFile;
      } else {
        throw new Error(result.error || 'Erreur lors de l\'upload du fichier avec chemin');
      }
    } catch (error) {
      console.error('Erreur uploadFileWithPath:', error);
      throw error;
    }
  }

  /**
   * Supprimer un fichier du serveur
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/files?id=${encodeURIComponent(fileId)}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la suppression du fichier');
      }
    } catch (error) {
      console.error('Erreur deleteFile:', error);
      throw error;
    }
  }

  /**
   * Télécharger un fichier depuis le serveur
   */
  async downloadFile(fileId: string, fileName: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/download?id=${encodeURIComponent(fileId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Créer un blob depuis la réponse
      const blob = await response.blob();
      
      // Créer un lien de téléchargement
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Nettoyer l'URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur downloadFile:', error);
      throw error;
    }
  }

  /**
   * Tester la connectivité avec l'API serveur
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/test`, {
        method: 'GET'
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur testConnection:', error);
      return false;
    }
  }

  /**
   * Calculer l'usage du stockage serveur
   */
  async getStorageInfo(): Promise<{ used: number; total: number; fileCount: number }> {
    try {
      const files = await this.getFiles();
      const used = files.reduce((total, file) => total + file.size, 0);
      const total = 100 * 1024 * 1024; // 100MB par défaut
      const fileCount = files.length;
      
      return { used, total, fileCount };
    } catch (error) {
      console.error('Erreur getStorageInfo:', error);
      return { used: 0, total: 100 * 1024 * 1024, fileCount: 0 };
    }
  }

  /**
   * Migrer les données depuis localStorage vers le serveur
   */
  async migrateFromLocalStorage(): Promise<{ success: number; errors: string[] }> {
    const results = { success: 0, errors: [] as string[] };
    
    try {
      // Récupérer les fichiers depuis localStorage
      const storedFiles = localStorage.getItem('admin-files-lm');
      if (!storedFiles) {
        return results;
      }

      const localFiles = JSON.parse(storedFiles);
      
      for (const localFile of localFiles) {
        try {
          // Récupérer les données du fichier
          const base64Data = localStorage.getItem(`admin-file-data-${localFile.id}`);
          if (!base64Data) {
            results.errors.push(`Données manquantes pour ${localFile.name}`);
            continue;
          }

          // Convertir base64 en Blob
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: localFile.type });
          
          // Créer un File depuis le Blob
          const file = new File([blob], localFile.name, { type: localFile.type });
          
          // Uploader vers le serveur
          await this.uploadFile(file, localFile.category);
          results.success++;
          
          // Supprimer de localStorage après upload réussi
          localStorage.removeItem(`admin-file-data-${localFile.id}`);
          
        } catch (error) {
          console.error(`Erreur migration ${localFile.name}:`, error);
          results.errors.push(`${localFile.name}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
      }
      
      // Supprimer la liste localStorage si migration complètement réussie
      if (results.errors.length === 0) {
        localStorage.removeItem('admin-files-lm');
      }
      
    } catch (error) {
      console.error('Erreur migration globale:', error);
      results.errors.push(`Erreur globale: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
    
    return results;
  }

  /**
   * Sauvegarder en fallback localStorage si le serveur n'est pas disponible
   */
  async saveToLocalStorage(file: File, category: string = 'other'): Promise<AdminFile> {
    try {
      // Créer l'objet fichier
      const newFile: AdminFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        lastModified: new Date(),
        isEncrypted: true,
        category: category,
        tags: []
      };

      // Convertir en base64
      const fileData = await file.arrayBuffer();
      const uint8Array = new Uint8Array(fileData);
      const chunkSize = 8192;
      const chunks: string[] = [];
      
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize);
        chunks.push(String.fromCharCode.apply(null, Array.from(chunk)));
      }
      
      const base64Data = btoa(chunks.join(''));
      
      // Sauvegarder
      localStorage.setItem(`admin-file-data-${newFile.id}`, base64Data);
      
      // Mettre à jour la liste
      const storedFiles = localStorage.getItem('admin-files-lm');
      const files = storedFiles ? JSON.parse(storedFiles) : [];
      files.push(newFile);
      localStorage.setItem('admin-files-lm', JSON.stringify(files));

      return newFile;
    } catch (error) {
      console.error('Erreur saveToLocalStorage:', error);
      throw error;
    }
  }

  /**
   * Sauvegarder en localStorage avec préservation du chemin
   */
  async saveToLocalStorageWithPath(file: File, category: string = 'other', relativePath: string = ''): Promise<AdminFile> {
    try {
      // Créer l'objet fichier avec le chemin relatif
      const newFile: AdminFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: relativePath || file.name, // Utiliser le chemin relatif comme nom si fourni
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        lastModified: new Date(),
        isEncrypted: true,
        category: category,
        tags: [],
        filePath: relativePath || undefined
      };

      // Convertir en base64
      const fileData = await file.arrayBuffer();
      const uint8Array = new Uint8Array(fileData);
      const chunkSize = 8192;
      const chunks: string[] = [];
      
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize);
        chunks.push(String.fromCharCode.apply(null, Array.from(chunk)));
      }
      
      const base64Data = btoa(chunks.join(''));
      
      // Sauvegarder
      localStorage.setItem(`admin-file-data-${newFile.id}`, base64Data);
      
      // Mettre à jour la liste
      const storedFiles = localStorage.getItem('admin-files-lm');
      const files = storedFiles ? JSON.parse(storedFiles) : [];
      files.push(newFile);
      localStorage.setItem('admin-files-lm', JSON.stringify(files));

      return newFile;
    } catch (error) {
      console.error('Erreur saveToLocalStorageWithPath:', error);
      throw error;
    }
  }

  /**
   * Charger depuis localStorage (mode fallback)
   */
  getLocalStorageFiles(): AdminFile[] {
    try {
      const storedFiles = localStorage.getItem('admin-files-lm');
      if (storedFiles) {
        return JSON.parse(storedFiles).map((file: any) => ({
          ...file,
          uploadDate: new Date(file.uploadDate),
          lastModified: new Date(file.lastModified)
        }));
      }
      return [];
    } catch (error) {
      console.error('Erreur getLocalStorageFiles:', error);
      return [];
    }
  }

  /**
   * Supprimer un fichier de localStorage
   */
  deleteFromLocalStorage(fileId: string): void {
    try {
      // Supprimer les données
      localStorage.removeItem(`admin-file-data-${fileId}`);
      
      // Mettre à jour la liste
      const storedFiles = localStorage.getItem('admin-files-lm');
      if (storedFiles) {
        const files = JSON.parse(storedFiles).filter((f: any) => f.id !== fileId);
        localStorage.setItem('admin-files-lm', JSON.stringify(files));
      }
    } catch (error) {
      console.error('Erreur deleteFromLocalStorage:', error);
      throw error;
    }
  }

  /**
   * Télécharger depuis localStorage
   */
  downloadFromLocalStorage(fileId: string, fileName: string): void {
    try {
      const base64Data = localStorage.getItem(`admin-file-data-${fileId}`);
      if (!base64Data) {
        throw new Error('Fichier non trouvé dans le stockage local');
      }

      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur downloadFromLocalStorage:', error);
      throw error;
    }
  }

  /**
   * Obtenir l'URL de prévisualisation depuis localStorage
   */
  getLocalStoragePreviewUrl(fileId: string, fileType: string): string | null {
    try {
      const base64Data = localStorage.getItem(`admin-file-data-${fileId}`);
      if (!base64Data) return null;

      if (fileType.startsWith('image/')) {
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: fileType });
        return URL.createObjectURL(blob);
      } else if (fileType === 'application/pdf') {
        return `data:${fileType};base64,${base64Data}`;
      } else if (fileType.startsWith('text/')) {
        const binaryString = atob(base64Data);
        return binaryString;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur getLocalStoragePreviewUrl:', error);
      return null;
    }
  }

  /**
   * Récupérer l'URL de prévisualisation d'un fichier depuis le serveur
   */
  getPreviewUrl(fileId: string): string {
    return `${this.baseUrl}/preview?id=${encodeURIComponent(fileId)}&token=${encodeURIComponent(this.token)}`;
  }

  /**
   * Tester la connectivité avec le serveur
   */
  async testServerConnection(): Promise<boolean> {
    try {
      console.log('🔍 Test connexion serveur...');
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const isConnected = response.ok;
      console.log('📡 Test serveur résultat:', { status: response.status, connected: isConnected });
      return isConnected;
    } catch (error) {
      console.warn('❌ Test serveur échoué:', error);
      return false;
    }
  }

  /**
   * Mettre à jour la catégorie d'un fichier sur le serveur
   */
  async updateFileCategory(fileId: string, category: string): Promise<AdminFile> {
    try {
      // Test de connectivité d'abord
      const isServerReachable = await this.testServerConnection();
      if (!isServerReachable) {
        throw new Error('Serveur non accessible, utilisez le mode localStorage');
      }

      const url = `${this.baseUrl}/files/${encodeURIComponent(fileId)}/category`;
      console.log('🔍 Debug updateFileCategory:');
      console.log('   - URL:', url);
      console.log('   - fileId:', fileId);
      console.log('   - category:', category);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ category })
      });

      console.log('   - Response status:', response.status);
      console.log('   - Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('   - Error response:', errorText);
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }

      const result: ApiResponse<AdminFile> = await response.json();
      
      if (result.success && result.data) {
        // Convertir les dates
        const adminFile = {
          ...result.data,
          uploadDate: new Date(result.data.uploadDate),
          lastModified: new Date(result.data.lastModified)
        };
        return adminFile;
      } else {
        throw new Error(result.error || 'Erreur lors de la mise à jour de la catégorie');
      }
    } catch (error) {
      console.error('Erreur updateFileCategory:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour la catégorie d'un fichier dans localStorage
   */
  async updateLocalStorageFileCategory(fileId: string, category: string): Promise<AdminFile> {
    try {
      // Récupérer la liste des fichiers
      const storedFiles = localStorage.getItem('admin-files-lm');
      const files = storedFiles ? JSON.parse(storedFiles) : [];
      
      // Trouver le fichier
      const fileIndex = files.findIndex((f: AdminFile) => f.id === fileId);
      if (fileIndex === -1) {
        throw new Error('Fichier non trouvé');
      }

      // Mettre à jour la catégorie
      files[fileIndex].category = category;
      files[fileIndex].lastModified = new Date();

      // Sauvegarder
      localStorage.setItem('admin-files-lm', JSON.stringify(files));

      // Retourner le fichier mis à jour
      return files[fileIndex];
    } catch (error) {
      console.error('Erreur updateLocalStorageFileCategory:', error);
      throw error;
    }
  }

  /**
   * Renommer un fichier sur le serveur
   */
  async renameFile(fileId: string, newName: string): Promise<AdminFile> {
    try {
      // Test de connectivité d'abord
      const isServerReachable = await this.testServerConnection();
      if (!isServerReachable) {
        throw new Error('Serveur non accessible, utilisez le mode localStorage');
      }

      const url = `${this.baseUrl}/files/${encodeURIComponent(fileId)}/rename`;
      console.log('🔍 Debug renameFile:');
      console.log('   - URL:', url);
      console.log('   - fileId:', fileId);
      console.log('   - newName:', newName);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ newName })
      });

      console.log('   - Response status:', response.status);
      console.log('   - Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('   - Error response:', errorText);
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }

      const result: ApiResponse<AdminFile> = await response.json();
      
      if (result.success && result.data) {
        // Convertir les dates
        const adminFile = {
          ...result.data,
          uploadDate: new Date(result.data.uploadDate),
          lastModified: new Date(result.data.lastModified)
        };
        return adminFile;
      } else {
        throw new Error(result.error || 'Erreur lors du renommage du fichier');
      }
    } catch (error) {
      console.error('Erreur renameFile:', error);
      throw error;
    }
  }

  /**
   * Renommer un fichier dans localStorage
   */
  async renameLocalStorageFile(fileId: string, newName: string): Promise<AdminFile> {
    try {
      // Récupérer la liste des fichiers
      const storedFiles = localStorage.getItem('admin-files-lm');
      const files = storedFiles ? JSON.parse(storedFiles) : [];
      
      // Trouver le fichier
      const fileIndex = files.findIndex((f: AdminFile) => f.id === fileId);
      if (fileIndex === -1) {
        throw new Error('Fichier non trouvé');
      }

      // Nettoyer le nom (enlever caractères dangereux)
      const cleanName = newName.trim().replace(/[<>:"/\\|?*]/g, '_');

      // Mettre à jour le nom
      files[fileIndex].name = cleanName;
      files[fileIndex].lastModified = new Date();

      // Sauvegarder
      localStorage.setItem('admin-files-lm', JSON.stringify(files));

      // Retourner le fichier mis à jour
      return files[fileIndex];
    } catch (error) {
      console.error('Erreur renameLocalStorageFile:', error);
      throw error;
    }
  }
}

// Instance singleton
export const adminFileService = new AdminFileService();