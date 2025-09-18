// Utilitaires pour l'authentification admin et la gestion sécurisée

export interface SecurityLog {
  timestamp: Date;
  action: 'login_success' | 'login_failed' | 'logout' | 'file_upload' | 'file_download' | 'file_delete' | 'file_preview' | 'file_rename' | 'file_update';
  details: string;
  ip?: string;
  userAgent?: string;
}

export interface FileMetadata {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  category: DocumentCategory;
  uploadDate: Date;
  lastModified: Date;
  version: number;
  previousVersions: string[];
  description?: string;
  tags: string[];
  isEncrypted: boolean;
}

export type DocumentCategory = 
  | 'administratif'
  | 'financier' 
  | 'finance'
  | 'certificat'
  | 'contrat'
  | 'personnel'
  | 'medical'
  | 'assurance'
  | 'immobilier'
  | 'autre';

export class AdminAuthUtils {
  private static readonly STORAGE_PREFIX = 'admin-lm-';
  private static readonly LOGS_KEY = 'security-logs';
  private static readonly FILES_KEY = 'files-metadata';

  // Génération d'ID unique sécurisé
  static generateSecureId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `${timestamp}-${random}`;
  }

  // Hashage simple (à remplacer par bcrypt en production)
  static async simpleHash(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Validation de mot de passe fort
  static validatePassword(password: string): { isValid: boolean; message: string } {
    if (password.length < 8) {
      return { isValid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre' };
    }

    return { isValid: true, message: 'Mot de passe valide' };
  }

  // Logging sécurisé
  static logSecurityEvent(action: SecurityLog['action'], details: string): void {
    try {
      const logs = this.getSecurityLogs();
      const newLog: SecurityLog = {
        timestamp: new Date(),
        action,
        details,
        ip: this.getClientIP(),
        userAgent: navigator.userAgent
      };

      logs.push(newLog);

      // Garder seulement les 100 derniers logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      localStorage.setItem(
        `${this.STORAGE_PREFIX}${this.LOGS_KEY}`,
        JSON.stringify(logs)
      );
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du log:', error);
    }
  }

  // Récupération des logs de sécurité
  static getSecurityLogs(): SecurityLog[] {
    try {
      const logsStr = localStorage.getItem(`${this.STORAGE_PREFIX}${this.LOGS_KEY}`);
      if (!logsStr) return [];
      
      const logs = JSON.parse(logsStr);
      return logs.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des logs:', error);
      return [];
    }
  }

  // Obtenir l'IP du client (approximatif côté client)
  private static getClientIP(): string {
    // En production, cela devrait être fait côté serveur
    return 'client-side';
  }

  // Chiffrement simple (à améliorer en production)
  static async encryptText(text: string, key: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const keyData = encoder.encode(key);
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData.slice(0, 32), // Utiliser les 32 premiers bytes
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        data
      );

      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Erreur de chiffrement:', error);
      return text; // Fallback non chiffré
    }
  }

  // Déchiffrement simple
  static async decryptText(encryptedText: string, key: string): Promise<string> {
    try {
      const combined = new Uint8Array(
        atob(encryptedText).split('').map(char => char.charCodeAt(0))
      );

      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const encoder = new TextEncoder();
      const keyData = encoder.encode(key);
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData.slice(0, 32),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Erreur de déchiffrement:', error);
      return encryptedText; // Fallback
    }
  }

  // Gestion des métadonnées de fichiers
  static saveFileMetadata(metadata: FileMetadata): void {
    try {
      const allMetadata = this.getAllFilesMetadata();
      const existingIndex = allMetadata.findIndex(m => m.id === metadata.id);
      
      if (existingIndex >= 0) {
        allMetadata[existingIndex] = metadata;
      } else {
        allMetadata.push(metadata);
      }

      localStorage.setItem(
        `${this.STORAGE_PREFIX}${this.FILES_KEY}`,
        JSON.stringify(allMetadata)
      );

      this.logSecurityEvent('file_upload', `Fichier ${metadata.name} sauvegardé`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des métadonnées:', error);
    }
  }

  static getAllFilesMetadata(): FileMetadata[] {
    try {
      const metadataStr = localStorage.getItem(`${this.STORAGE_PREFIX}${this.FILES_KEY}`);
      if (!metadataStr) return [];
      
      const metadata = JSON.parse(metadataStr);
      return metadata.map((m: any) => ({
        ...m,
        uploadDate: new Date(m.uploadDate),
        lastModified: new Date(m.lastModified)
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées:', error);
      return [];
    }
  }

  static deleteFileMetadata(fileId: string): void {
    try {
      const allMetadata = this.getAllFilesMetadata();
      const filteredMetadata = allMetadata.filter(m => m.id !== fileId);
      
      localStorage.setItem(
        `${this.STORAGE_PREFIX}${this.FILES_KEY}`,
        JSON.stringify(filteredMetadata)
      );

      this.logSecurityEvent('file_delete', `Fichier ${fileId} supprimé`);
    } catch (error) {
      console.error('Erreur lors de la suppression des métadonnées:', error);
    }
  }

  // Nettoyage sécurisé
  static clearAllAdminData(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      
      console.log('[ADMIN] Toutes les données admin ont été supprimées');
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  }

  // Validation de fichier
  static validateFile(file: File): { isValid: boolean; message: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/webp',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return { isValid: false, message: 'Le fichier est trop volumineux (max 50MB)' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, message: 'Type de fichier non autorisé' };
    }

    return { isValid: true, message: 'Fichier valide' };
  }
}

export default AdminAuthUtils;