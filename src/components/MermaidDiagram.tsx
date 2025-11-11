import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

const MermaidDiagram = ({ chart, className = '' }: MermaidDiagramProps) => {
  const { t } = useLanguage();
  const chartRef = useRef<HTMLDivElement>(null);
  const modalChartRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour rendre un diagramme dans un conteneur donné
  const renderChart = async (container: HTMLDivElement | null, isModal = false) => {
    if (container) {
      try {
        container.innerHTML = '';
        
        // Générer un ID unique à chaque rendu
        const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substring(7)}${isModal ? '-modal' : ''}`;
        
        // Configuration adaptée à la taille
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true
          }
        });
        
        const result = await mermaid.render(uniqueId, chart);
        container.innerHTML = result.svg;
        
        // Adapter la taille du SVG pour le modal
        if (isModal) {
          const svg = container.querySelector('svg');
          if (svg) {
            svg.style.width = '100%';
            svg.style.height = 'auto';
            svg.style.maxHeight = '90vh';
          }
        }
      } catch (error) {
        console.error('❌ Erreur lors du rendu Mermaid:', error);
        container.innerHTML = `
          <div class="text-red-500 p-4 border border-red-200 rounded bg-red-50">
            <p><strong>Erreur lors du chargement du diagramme</strong></p>
            <p class="text-sm mt-2">${error}</p>
          </div>
        `;
      }
    }
  };

  useEffect(() => {
    // Forcer une réinitialisation complète de Mermaid
    mermaid.mermaidAPI.reset();
    renderChart(chartRef.current);
  }, [chart]);

  // Effet pour rendre le diagramme modal quand il s'ouvre
  useEffect(() => {
    if (isModalOpen) {
      renderChart(modalChartRef.current, true);
    }
  }, [isModalOpen, chart]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={`mermaid-container overflow-x-auto ${className} relative group`}>
        <div ref={chartRef} className="flex justify-center min-w-full" />
        
        {/* Bouton pour ouvrir en plein écran */}
        <button
          onClick={openModal}
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title={t('projects.architecture.fullscreen')}
        >
          <Maximize2 size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Modal plein écran */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-auto relative">
            {/* Header du modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('projects.architecture.modal')}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Contenu du diagramme */}
            <div className="p-6">
              <div ref={modalChartRef} className="flex justify-center w-full" />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default MermaidDiagram;