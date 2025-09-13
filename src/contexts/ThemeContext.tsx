import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  isSystemTheme: boolean;
  setSystemTheme: (useSystem: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'system' || !saved) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return saved === 'dark';
    }
    return false;
  });

  const [isSystemTheme, setIsSystemTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'system' || !saved;
    }
    return true;
  });

  // Écoute les changements de préférence système
  useEffect(() => {
    if (!isSystemTheme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemTheme]);

  useEffect(() => {
    // Sauvegarde la préférence
    if (isSystemTheme) {
      localStorage.setItem('theme', 'system');
    } else {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Applique le thème avec transition fluide
    document.documentElement.style.setProperty('--theme-transition', 'all 0.3s ease-in-out');
    document.documentElement.classList.toggle('dark', isDark);
    
    // Animation de transition jour/nuit
    if (isDark) {
      document.documentElement.style.setProperty('--bg-transition', 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)');
    } else {
      document.documentElement.style.setProperty('--bg-transition', 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)');
    }
  }, [isDark, isSystemTheme]);

  const toggleTheme = () => {
    if (isSystemTheme) {
      // Si on est en mode système, passer en mode manuel avec le thème opposé
      setIsSystemTheme(false);
      setIsDark(!isDark);
    } else {
      // En mode manuel, juste inverser
      setIsDark(!isDark);
    }
  };

  const setSystemTheme = (useSystem: boolean) => {
    setIsSystemTheme(useSystem);
    if (useSystem) {
      // Revenir aux préférences système
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, isSystemTheme, setSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
