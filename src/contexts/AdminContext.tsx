import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: string;
  username: string;
  loginTime: Date;
  lastActivity: Date;
}

interface AdminContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AdminUser | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  updateActivity: () => void;
  isSessionExpired: () => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

// Configuration sécurisée
const ADMIN_CONFIG = {
  // Mot de passe récupéré depuis les variables d'environnement
  PASSWORD_HASH: import.meta.env.VITE_ADMIN_PASSWORD || 'default-password-change-me',
  SESSION_DURATION: 4 * 60 * 60 * 1000, // 4 heures en millisecondes
  INACTIVITY_TIMEOUT: 60 * 60 * 1000, // 60 minutes d'inactivité (1 heure)
  STORAGE_KEY: 'admin-session-lm',
  ACTIVITY_KEY: 'admin-activity-lm'
};

// Debug temporaire
console.log('🔍 [AdminContext] Configuration Debug:');
console.log('   - import.meta.env.VITE_ADMIN_PASSWORD:', import.meta.env.VITE_ADMIN_PASSWORD ? '***défini***' : 'NON DÉFINI');
console.log('   - PASSWORD_HASH utilisé:', ADMIN_CONFIG.PASSWORD_HASH);
console.log('   - Mode:', import.meta.env.DEV ? 'développement' : 'production');

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);

  // Vérifier la session au chargement
  useEffect(() => {
    checkExistingSession();
    
    // Nettoyage automatique des sessions expirées
    const interval = setInterval(() => {
      if (isSessionExpired()) {
        logout();
      }
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(interval);
  }, []);

  // Vérifier s'il existe une session valide
  const checkExistingSession = () => {
    setIsLoading(true);
    try {
      const sessionData = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEY);
      if (!sessionData) {
        setIsLoading(false);
        return;
      }

      const session = JSON.parse(sessionData);
      const loginTime = new Date(session.loginTime);
      const now = new Date();

      // Vérifier si la session n'est pas expirée
      if (now.getTime() - loginTime.getTime() < ADMIN_CONFIG.SESSION_DURATION) {
        setUser({
          id: session.id,
          username: session.username,
          loginTime: loginTime,
          lastActivity: new Date(session.lastActivity || session.loginTime)
        });
        setIsAuthenticated(true);
        updateActivity();
      } else {
        // Session expirée, nettoyer
        localStorage.removeItem(ADMIN_CONFIG.STORAGE_KEY);
        localStorage.removeItem(ADMIN_CONFIG.ACTIVITY_KEY);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de session:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de connexion
  const login = async (password: string): Promise<boolean> => {
    try {
      // Simulation d'une vérification sécurisée
      // En production, utilisez bcrypt.compare()
      if (password === ADMIN_CONFIG.PASSWORD_HASH) {
        const now = new Date();
        const newUser: AdminUser = {
          id: 'admin-lm',
          username: 'Louis-Marie',
          loginTime: now,
          lastActivity: now
        };

        // Sauvegarder la session
        const sessionData = {
          id: newUser.id,
          username: newUser.username,
          loginTime: newUser.loginTime.toISOString(),
          lastActivity: newUser.lastActivity.toISOString()
        };

        localStorage.setItem(ADMIN_CONFIG.STORAGE_KEY, JSON.stringify(sessionData));
        localStorage.setItem(ADMIN_CONFIG.ACTIVITY_KEY, now.toISOString());

        setUser(newUser);
        setIsAuthenticated(true);

        // Log de sécurité
        console.log(`[ADMIN] Connexion réussie à ${now.toISOString()}`);
        
        return true;
      } else {
        // Log de tentative de connexion échouée
        console.warn(`[ADMIN] Tentative de connexion échouée à ${new Date().toISOString()}`);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    try {
      // Nettoyer le stockage local
      localStorage.removeItem(ADMIN_CONFIG.STORAGE_KEY);
      localStorage.removeItem(ADMIN_CONFIG.ACTIVITY_KEY);

      // Log de sécurité
      if (user) {
        console.log(`[ADMIN] Déconnexion de ${user.username} à ${new Date().toISOString()}`);
      }

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Mettre à jour l'activité
  const updateActivity = () => {
    if (isAuthenticated && user) {
      const now = new Date();
      localStorage.setItem(ADMIN_CONFIG.ACTIVITY_KEY, now.toISOString());
      
      setUser(prev => prev ? {
        ...prev,
        lastActivity: now
      } : null);
    }
  };

  // Vérifier si la session est expirée
  const isSessionExpired = (): boolean => {
    if (!isAuthenticated || !user) return true;

    try {
      const lastActivityStr = localStorage.getItem(ADMIN_CONFIG.ACTIVITY_KEY);
      if (!lastActivityStr) return true;

      const lastActivity = new Date(lastActivityStr);
      const now = new Date();

      // Vérifier l'inactivité
      const inactivityTime = now.getTime() - lastActivity.getTime();
      if (inactivityTime > ADMIN_CONFIG.INACTIVITY_TIMEOUT) {
        return true;
      }

      // Vérifier la durée totale de session
      const sessionTime = now.getTime() - user.loginTime.getTime();
      if (sessionTime > ADMIN_CONFIG.SESSION_DURATION) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification d\'expiration:', error);
      return true;
    }
  };

  const value: AdminContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    updateActivity,
    isSessionExpired
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;