import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { trackPortfolioEvent } from '../utils/analytics';
import { useState } from 'react';

const ThemeToggle = () => {
  const { isDark, toggleTheme, isSystemTheme, setSystemTheme } = useTheme();
  const { t } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSystemTheme = () => {
    setSystemTheme(true);
    setShowDropdown(false);
    trackPortfolioEvent.themeToggle('system');
  };

  const handleManualTheme = (theme: 'light' | 'dark') => {
    setSystemTheme(false);
    if ((theme === 'dark') !== isDark) {
      toggleTheme();
    }
    setShowDropdown(false);
    trackPortfolioEvent.themeToggle(theme);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
        aria-label="Changer le thème"
      >
        {isSystemTheme ? (
          <Monitor className="w-5 h-5 text-blue-500" />
        ) : isDark ? (
          <Moon className="w-5 h-5 text-purple-500" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
          <div className="py-2">
            <button
              onClick={handleSystemTheme}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                isSystemTheme ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Monitor size={16} />
              {t('theme.system')}
            </button>
            <button
              onClick={() => handleManualTheme('light')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                !isSystemTheme && !isDark ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Sun size={16} />
              {t('theme.light')}
            </button>
            <button
              onClick={() => handleManualTheme('dark')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                !isSystemTheme && isDark ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Moon size={16} />
              {t('theme.dark')}
            </button>
          </div>
        </div>
      )}

      {/* Overlay pour fermer le dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ThemeToggle;
