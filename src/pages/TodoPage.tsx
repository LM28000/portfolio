import React from 'react';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import TodoList from '../components/TodoList';

const TodoPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title="Retour à l'accueil"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Gestionnaire de Tâches
                </h1>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Organisez et suivez vos tâches quotidiennes
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main>
        <TodoList />
      </main>
    </div>
  );
};

export default TodoPage;