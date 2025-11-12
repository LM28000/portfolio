import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitch from './LanguageSwitch';
import ThemeToggle from './ThemeToggle';
import QRCodeGenerator from './QRCodeGenerator';
import CalendlyWidget from './CalendlyWidget';
import { trackPortfolioEvent } from '../utils/analytics';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { id: '/', label: t('nav.home') },
    { id: '/experience', label: t('timeline.title') },
    { id: '/skills', label: t('nav.skills') },
    { id: '/projects', label: t('nav.projects') },
    { id: '/interests', label: t('nav.interests') },
    { id: '/contact', label: t('nav.contact') },
  ];

  const navigateToPage = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    // Track navigation event
    trackPortfolioEvent.navigation(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm z-50 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateToPage(item.id)}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center space-x-3 ml-6">
              <CalendlyWidget />
              <QRCodeGenerator />
              <ThemeToggle />
              <LanguageSwitch />
            </div>
          </div>

          {/* Mobile menu button and controls */}
          <div className="md:hidden flex items-center justify-center space-x-2 w-full">
            <CalendlyWidget />
            <QRCodeGenerator />
            <ThemeToggle />
            <LanguageSwitch />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateToPage(item.id)}
                className={`block w-full text-left px-4 py-3 text-base font-medium transition-colors ${
                  location.pathname === item.id ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;