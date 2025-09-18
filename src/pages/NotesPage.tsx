import React from 'react';
import Notes from '../components/Notes';
import { ArrowLeft } from 'lucide-react';

const NotesPage: React.FC = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <h1 className="text-xl font-bold">Système de prise de notes</h1>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="h-[calc(100vh-80px)]">
        <Notes className="h-full" />
      </div>
    </div>
  );
};

export default NotesPage;