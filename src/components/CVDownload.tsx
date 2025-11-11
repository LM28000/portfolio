import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, FileText, Calendar, Globe, Star, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../utils/analytics';

interface CVOption {
  id: string;
  label: string;
  filename: string;
  language: 'fr' | 'en';
  size: string;
  lastUpdated: string;
  featured?: boolean;
}

interface CVDownloadProps {
  variant?: 'primary' | 'secondary' | 'minimal';
  className?: string;
}

const CVDownload = ({ variant = 'primary', className = '' }: CVDownloadProps) => {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedCV, setSelectedCV] = useState<CVOption | null>(null);

  const cvOptions: CVOption[] = [
    {
      id: 'fr',
      label: t('cv.options.fr'),
      filename: 'cv-louis-marie-perret-du-cray-fr.pdf',
      language: 'fr',
      size: '2.1 MB',
      lastUpdated: '2025-09-16',
      featured: language === 'fr'
    },
    {
      id: 'en',
      label: t('cv.options.en'),
      filename: 'cv-louis-marie-perret-du-cray-en.pdf',
      language: 'en',
      size: '2.0 MB',
      lastUpdated: '2025-09-16',
      featured: language === 'en'
    }
  ];

  // Sélectionner automatiquement le CV recommandé selon la langue
  useEffect(() => {
    const recommended = cvOptions.find(cv => cv.featured);
    setSelectedCV(recommended || cvOptions[0]);
  }, [language]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 150);
  };

  const handleDownload = (cv: CVOption) => {
    // Créer le lien de téléchargement
    const link = document.createElement('a');
    link.href = `/cv/${cv.filename}`;
    link.download = cv.filename;
    link.click();

    // Analytics
    trackEvent('download', 'cv', cv.filename);
    
    // Fermer la modal après téléchargement
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'primary':
        return 'group relative inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-500 hover-lift shadow-lg hover:shadow-xl overflow-hidden';
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600';
      case 'minimal':
        return 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bouton principal */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${getButtonVariant()}`}
        >
          {variant === 'primary' && (
            <>
              {/* Effet de vague au survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"></div>
              
              {/* Particules qui s'échappent au survol */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute -top-1 left-1/4 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute -top-1 right-1/4 w-0.5 h-0.5 bg-white rounded-full"></div>
                <div className="absolute -bottom-1 left-1/3 w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </>
          )}
          
          <Download size={variant === 'minimal' ? 16 : 20} className={variant === 'primary' ? 'relative z-10' : ''} />
          <span className={variant === 'primary' ? 'relative z-10' : ''}>{t('cv.download')}</span>
        </button>
      </div>

      {/* Modal rendue via Portal pour éviter les problèmes de z-index */}
      {isModalOpen && createPortal(
        <div className={`cv-modal-container ${isModalOpen ? 'active' : ''}`}>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black bg-opacity-50 modal-overlay cv-modal-overlay ${isClosing ? 'animate-overlay-out' : 'animate-overlay-in'}`}
            onClick={handleClose}
            style={{ zIndex: 999999 }}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center p-4 cv-modal-content" style={{ zIndex: 1000000 }}>
            <div 
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl modal-content max-w-4xl w-full overflow-hidden ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
              style={{maxHeight: '90vh'}}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('cv.modal.title')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t('cv.modal.subtitle')}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row" style={{maxHeight: 'calc(90vh - 80px)'}}>
                {/* Options de CV */}
                <div className="lg:w-1/2 p-6 border-r border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {t('cv.options.choose')}
                  </h4>
                  
                  <div className="space-y-3">
                    {cvOptions.map((cv) => (
                      <div
                        key={cv.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedCV?.id === cv.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setSelectedCV(cv)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {cv.label}
                              </h5>
                              {cv.featured && (
                                <Star size={14} className="text-yellow-500 fill-current" />
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Globe size={12} />
                                <span>{cv.language.toUpperCase()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText size={12} />
                                <span>{cv.size}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>{new Date(cv.lastUpdated).toLocaleDateString(language)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => selectedCV && handleDownload(selectedCV)}
                      disabled={!selectedCV}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                    >
                      <Download size={16} />
                      {t('cv.download.selected')}
                    </button>
                  </div>
                </div>

                {/* Aperçu */}
                <div className="lg:w-1/2 p-6">
                  {selectedCV ? (
                    <div className="h-full">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        {t('cv.preview.title')}
                      </h4>
                      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center" style={{height: '400px'}}>
                        <iframe
                          src={`/cv/${selectedCV.filename}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="w-full h-full rounded-lg"
                          title={`Aperçu ${selectedCV.label}`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                      <FileText size={48} className="mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">{t('cv.preview.empty.title')}</p>
                      <p className="text-sm">{t('cv.preview.empty.description')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CVDownload;