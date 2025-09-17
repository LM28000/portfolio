/**
 * Service API pour la gestion des fichiers administratifs côté serveur
 * Remplace le stockage localStorage par des appels vers l'API PHP
 */

export interface AdminFile {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  extension: string;
  category: string;
  description: string;
  uploadDate: string;
  lastModified: string;
  isEncrypted: boolean;
  filePath: string;
}

export interface StorageInfo {
  used: number;
  total: number;
  count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class AdminFilesService {
  private baseUrl: string;
  private authToken: string;

  constructor() {
    // Configuration de base - ajustez selon votre serveur
    this.baseUrl = window.location.origin + '/api';
    this.authToken = 'admin123'; // Temporaire - sera remplacé par l'auth réelle
  }

  /**
   * Définir le token d'authentification
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Headers par défaut pour les requêtes
   */
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {};

    if (includeAuth && this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Récupérer la liste des fichiers et informations de stockage
   */
  async getFiles(): Promise<{ files: AdminFile[]; storage: StorageInfo }> {
    try {
      const response = await fetch(`${this.baseUrl}/files.php`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la récupération des fichiers');
      }

      // Convertir les dates string en objets Date si nécessaire
      const files = data.files.map((file: any) => ({
        ...file,
        uploadDate: typeof file.uploadDate === 'string' ? new Date(file.uploadDate) : file.uploadDate,
        lastModified: typeof file.lastModified === 'string' ? new Date(file.lastModified) : file.lastModified
      }));

      return {
        files,
        storage: data.storage
      };
    } catch (error) {
      console.error('Erreur getFiles:', error);
      throw error;
    }
  }

  /**
   * Upload un nouveau fichier
   */
  async uploadFile(
    file: File, 
    category: string = 'documents', 
    description: string = '',
    isEncrypted: boolean = false
  ): Promise<AdminFile> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('isEncrypted', isEncrypted.toString());

      const response = await fetch(`${this.baseUrl}/files.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        },
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      // Convertir les dates
      const uploadedFile = {
        ...data.file,
        uploadDate: new Date(data.file.uploadDate),
        lastModified: new Date(data.file.lastModified)
      };

      return uploadedFile;
    } catch (error) {
      console.error('Erreur uploadFile:', error);
      throw error;
    }
  }

  /**
   * Supprimer un fichier
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/files.php`, {
        method: 'DELETE',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: fileId }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur deleteFile:', error);
      throw error;
    }
  }

  /**
   * Télécharger un fichier
   */
  async downloadFile(fileId: string, fileName: string): Promise<void> {
    try {
      const url = `${this.baseUrl}/download.php?id=${encodeURIComponent(fileId)}&token=${encodeURIComponent(this.authToken)}`;
      
      // Créer un lien de téléchargement temporaire
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur downloadFile:', error);
      throw error;
    }
  }

  /**
   * Obtenir l'URL d'aperçu d'un fichier
   */
  getPreviewUrl(fileId: string): string {
    return `${this.baseUrl}/preview.php?id=${encodeURIComponent(fileId)}&token=${encodeURIComponent(this.authToken)}`;
  }

  /**
   * Vérifier si le serveur est accessible
   */
  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/files.php`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return response.status !== 0; // 0 = pas de connexion
    } catch (error) {
      console.error('Serveur non accessible:', error);
      return false;
    }
  }

  /**
   * Migration depuis localStorage vers serveur
   */
  async migrateFromLocalStorage(): Promise<{ migrated: number; errors: string[] }> {
    const errors: string[] = [];
    let migrated = 0;

    try {
      // Récupérer les données localStorage
      const storedFiles = localStorage.getItem('admin-files-lm');
      if (!storedFiles) {
        return { migrated: 0, errors: ['Aucune donnée à migrer'] };
      }

      const localFiles = JSON.parse(storedFiles);
      
      for (const localFile of localFiles) {
        try {
          // Récupérer le contenu du fichier
          const base64Data = localStorage.getItem(`admin-file-data-${localFile.id}`);
          if (!base64Data) {
            errors.push(`Données manquantes pour ${localFile.name}`);
            continue;
          }

          // Convertir base64 en File
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const file = new File([byteArray], localFile.name, { type: localFile.type });

          // Upload vers le serveur
          await this.uploadFile(file, localFile.category, '', localFile.isEncrypted);
          migrated++;

        } catch (error) {
          errors.push(`Erreur pour ${localFile.name}: ${error}`);
        }
      }

      return { migrated, errors };
    } catch (error) {
      errors.push(`Erreur générale de migration: ${error}`);
      return { migrated, errors };
    }
  }
}

// Instance singleton
export const adminFilesService = new AdminFilesService();
export default adminFilesService;