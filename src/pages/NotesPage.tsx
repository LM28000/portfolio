import React from 'react';
import Notes from '../components/Notes';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const NotesPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-sm border-b px-6 py-4 ${
        isDark 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <h1 className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Système de prise de notes
            </h1>
          </div>
          
          {/* Bouton de basculement thème */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            }`}
            title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="h-[calc(100vh-80px)]">
        <Notes />
      </div>
    </div>
  );
};

export default NotesPage;