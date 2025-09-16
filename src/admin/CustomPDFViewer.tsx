import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import './pdf-viewer.css';

// Configuration du worker PDF.js avec fallback
if (typeof window !== 'undefined') {
  try {
    // Essayer d'abord le CDN
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  } catch (error) {
    // Fallback vers le bundle local
    console.warn('PDF.js worker CDN failed, using local fallback');
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  }
}

interface CustomPDFViewerProps {
  file: string;
  fileName: string;
  onDownload: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  rotation: number;
  onRotate: () => void;
}

const CustomPDFViewer: React.FC<CustomPDFViewerProps> = ({
  file,
  fileName,
  onDownload,
  zoom,
  onZoomChange,
  rotation,
  onRotate,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  // Timeout pour éviter les chargements infinis
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('PDF loading timeout, switching to fallback');
        setError('Timeout de chargement');
        setLoading(false);
      }
    }, 10000); // 10 secondes max

    return () => clearTimeout(timeout);
  }, [loading]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF Load Error:', error);
    setError('Erreur lors du chargement du PDF');
    setLoading(false);
    
    // Proposer le fallback après 3 secondes
    setTimeout(() => {
      setUseFallback(true);
    }, 3000);
  };

  const handleFallback = () => {
    setUseFallback(true);
    setError(null);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages || 1, prev + 1));
  };

  const handleZoom = (delta: number) => {
    onZoomChange(Math.max(50, Math.min(200, zoom + delta)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-400">Chargement du PDF...</p>
        </div>
      </div>
    );
  }

  if (error && !useFallback) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-400">
          <p className="mb-2">{error}</p>
          <div className="space-y-2">
            <button
              onClick={handleFallback}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Utiliser la vue alternative
            </button>
            <p className="text-sm text-gray-500">ou téléchargez le fichier</p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback vers iframe si le visualiseur custom ne fonctionne pas
  if (useFallback) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-3 bg-gray-900/50 border-b border-gray-700 rounded-t">
          <div className="text-sm text-yellow-400">
            Mode de compatibilité (iframe)
          </div>
          <button
            onClick={onDownload}
            className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-600/20 rounded transition-colors"
            title="Télécharger"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1">
          <iframe
            src={file}
            className="w-full h-full border-0"
            title={`Aperçu de ${fileName}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-3 bg-gray-900/50 border-b border-gray-700 rounded-t">
        <div className="flex items-center gap-2">
          {/* Page Navigation */}
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-300 min-w-[4rem] text-center">
            {pageNumber} / {numPages}
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <button
            onClick={() => handleZoom(-25)}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Zoom arrière"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-400 min-w-[3rem] text-center">{zoom}%</span>
          
          <button
            onClick={() => handleZoom(25)}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Zoom avant"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Rotation */}
          <button
            onClick={onRotate}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Rotation"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Download */}
          <button
            onClick={onDownload}
            className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-600/20 rounded transition-colors"
            title="Télécharger"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-gray-850 flex items-center justify-center p-4">
        <div 
          className="shadow-2xl transition-transform duration-200"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'center'
          }}
        >
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-96 bg-white rounded">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-96 bg-gray-100 rounded text-gray-600">
                <p>Erreur de chargement</p>
              </div>
            }
            noData={
              <div className="flex items-center justify-center h-96 bg-gray-100 rounded text-gray-600">
                <p>Aucune donnée PDF</p>
              </div>
            }
            className="rounded-lg overflow-hidden border border-gray-600"
          >
            <Page
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="!bg-white"
              width={600}
            />
          </Document>
        </div>
      </div>

      {/* PDF Info */}
      <div className="p-2 bg-gray-900/30 border-t border-gray-700 rounded-b">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{fileName}</span>
          <span>{numPages} page{numPages && numPages > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomPDFViewer;