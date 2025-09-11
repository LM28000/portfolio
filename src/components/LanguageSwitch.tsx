import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-blue-300"
      aria-label={`Switch to ${language === 'fr' ? 'English' : 'French'}`}
    >
      <Globe size={18} />
      <span className="font-medium text-sm">
        {language === 'fr' ? 'EN' : 'FR'}
      </span>
    </button>
  );
};

export default LanguageSwitch;
