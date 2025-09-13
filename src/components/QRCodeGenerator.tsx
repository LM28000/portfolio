import { useEffect, useRef, useState } from 'react';
import { QrCode, Download, Share2 } from 'lucide-react';
import QRCode from 'qrcode';
import { useLanguage } from '../contexts/LanguageContext';

interface QRCodeGeneratorProps {
  url?: string;
  size?: number;
  className?: string;
}

const QRCodeGenerator = ({ 
  url = "https://louis-marie.du-cray.eu/", 
  size = 200, 
  className = '' 
}: QRCodeGeneratorProps) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>('');

  useEffect(() => {
    generateQRCode();
  }, [url, size]);

  // Régénérer le QR code quand la modale devient visible
  useEffect(() => {
    if (isVisible && canvasRef.current) {
      setTimeout(() => generateQRCode(), 100);
    }
  }, [isVisible]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      // S'assurer que le canvas a les bonnes dimensions carrées
      const qrSize = 180;
      canvas.width = qrSize;
      canvas.height = qrSize;
      
      await QRCode.toCanvas(canvas, url, {
        width: qrSize,
        margin: 1,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });

      // Sauvegarder l'image
      setQrCodeData(canvas.toDataURL());
      console.log('QR Code généré pour:', url);
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 150); // Durée de l'animation de sortie
  };

  const downloadQRCode = () => {
    if (!qrCodeData) return;

    const link = document.createElement('a');
    link.download = 'portfolio-qr-code.png';
    link.href = qrCodeData;
    link.click();
  };

  const shareQRCode = async () => {
    if (navigator.share && qrCodeData) {
      try {
        const response = await fetch(qrCodeData);
        const blob = await response.blob();
        const file = new File([blob], 'portfolio-qr-code.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Portfolio Louis-Marie Perret du Cray',
          text: 'Découvrez mon portfolio',
          files: [file]
        });
      } catch (error) {
        console.error('Erreur lors du partage:', error);
        // Fallback: copier l'URL
        navigator.clipboard.writeText(url);
      }
    } else {
      // Fallback: copier l'URL
      navigator.clipboard.writeText(url);
      alert('URL copiée dans le presse-papiers !');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-105"
        title="Générer un QR code"
      >
        <QrCode size={20} />
      </button>

      {isVisible && (
        <>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black bg-opacity-50 modal-overlay z-40 ${isClosing ? 'animate-overlay-out' : 'animate-overlay-in'}`}
            onClick={handleClose}
          />
          
          {/* Modal QR Code */}
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
                maxWidth: '300px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                margin: 'auto'
              }}
            >
              <div className="text-center space-y-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {t('qrcode.title')}
                </h3>
                
                <div className="bg-white p-3 rounded-lg border flex justify-center">
                  <canvas
                    ref={canvasRef}
                    className="block"
                    style={{ 
                      width: '180px', 
                      height: '180px',
                      imageRendering: 'pixelated'
                    }}
                  />
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t('qrcode.description')}
                </p>
                
                <div className="flex gap-2 justify-center flex-wrap">
                  <button
                    onClick={downloadQRCode}
                    className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <Download size={14} />
                    {t('qrcode.download')}
                  </button>
                  
                  <button
                    onClick={shareQRCode}
                    className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <Share2 size={14} />
                    {t('qrcode.share')}
                  </button>
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

export default QRCodeGenerator;
