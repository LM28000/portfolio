import { Calendar, ExternalLink, Clock } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CalendlyWidgetProps {
  calendlyUrl?: string;
  className?: string;
}

const CalendlyWidget = ({ 
  calendlyUrl = "https://calendly.com/louismarieperret", 
  className = '' 
}: CalendlyWidgetProps) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 200); // Match CSS animation duration
  };

  const openCalendly = () => {
    window.open(calendlyUrl, '_blank', 'width=700,height=700');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-300 transform hover:scale-105"
        title={t('calendly.title')}
      >
        <Calendar size={20} />
      </button>

            {isVisible && (
        <>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black bg-opacity-50 modal-overlay z-40 ${isClosing ? 'animate-overlay-out' : 'animate-overlay-in'}`}
            onClick={handleClose}
          />
          
          {/* Modal de contact */}
          <div 
            className="fixed z-50"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem'
            }}
          >
            <div 
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-2xl modal-content ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
              style={{
                maxWidth: '400px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                margin: 'auto'
              }}
            >
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('calendly.title')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('calendly.description')}
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                    <Clock size={14} />
                    <span>{t('calendly.duration')}</span>
                  </div>
                  <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    {t('calendly.types')}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={openCalendly}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
                  >
                    <ExternalLink size={14} />
                    {t('calendly.open')}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="mailto:louis-marie@du-cray.com"
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-xs text-center"
                    >
                      {t('calendly.email')}
                    </a>
                    <a
                      href="tel:+33619862297"
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-xs text-center"
                    >
                      {t('calendly.call')}
                    </a>
                  </div>
                </div>
                
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-sm"
                >
                  {t('qrcode.close')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalendlyWidget;
