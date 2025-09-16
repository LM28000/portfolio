import { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleNameClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // Réinitialiser le compteur après 1 seconde
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);
    
    // Si triple-clic détecté
    if (newClickCount >= 3) {
      setClickCount(0);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      window.location.href = '/admin';
    }
  };
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6">
            <h3 
              className="text-2xl font-bold mb-2 cursor-default select-none"
              onClick={handleNameClick}
              title="Louis-Marie Perret du Cray"
            >
              Louis-Marie Perret du Cray
            </h3>
            <p className="text-gray-400">{t('hero.subtitle')}</p>
          </div>
          
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <span>{t('footer.built')} {t('footer.year')}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              © 2025 Louis-Marie Perret du Cray. {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;