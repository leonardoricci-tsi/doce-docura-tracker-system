import { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRData {
  codigoLote: string;
  dataProducao: string;
  dataValidade: string;
  responsavel: string;
  numeroNotaFiscal: string;
  produtos: Array<{
    nome: string;
    quantidade: number;
  }>;
  status: string;
  observacoes: string;
}

interface QRCodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: QRData) => void;
}

export const QRCodeScanner = ({ isOpen, onClose, onScanSuccess }: QRCodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Espera o vídeo montar antes de iniciar
      const timer = setTimeout(() => {
        if (videoRef.current) startScanner();
      }, 200);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const requestCameraPermission = async () => {
    try {
      console.log('QRCodeScanner: Solicitando permissão de câmera...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: "environment" } } 
      });
      stream.getTracks().forEach(track => track.stop());
      console.log('QRCodeScanner: Permissão concedida');
      return true;
    } catch (err) {
      console.error('QRCodeScanner: Erro ao solicitar permissão:', err);
      let msg = 'Erro ao acessar a câmera.';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') msg = 'Permissão de câmera negada.';
        else if (err.name === 'NotFoundError') msg = 'Nenhuma câmera encontrada.';
        else if (err.name === 'NotSupportedError') msg = 'Câmera não suportada pelo navegador.';
      }
      setError(msg);
      return false;
    }
  };

  const startScanner = async () => {
    if (!videoRef.current) {
      console.log('QRCodeScanner: videoRef ainda não está pronto.');
      return;
    }

    try {
      setError(null);
      setIsScanning(false);

      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      if (!(await QrScanner.hasCamera())) {
        throw new Error('Nenhuma câmera disponível');
      }

      let cameraType: string = 'environment';
      const cameras = await QrScanner.listCameras(true);
      if (!cameras.some(c => c.id && c.label.toLowerCase().includes('back'))) {
        cameraType = 'user'; // fallback para frontal
      }

      const scanner = new QrScanner(
        videoRef.current!,
        (result: string) => {
          try {
            const parsedData = JSON.parse(result) as QRData;
            if (parsedData.codigoLote && parsedData.produtos) {
              onScanSuccess(parsedData);
              scanner.stop();
              onClose();
              toast({
                title: "QR Code lido com sucesso!",
                description: `Dados do lote ${parsedData.codigoLote} carregados.`
              });
            } else {
              throw new Error('QR Code inválido');
            }
          } catch {
            toast({
              title: "QR Code inválido",
              description: "Este QR Code não contém dados válidos.",
              variant: "destructive"
            });
          }
        }
      );
      
      // Se quiser tentar setar a câmera (se suportar)
      if (typeof scanner.setCamera === 'function') {
        scanner.setCamera(cameraType);
      }
      
      await scanner.start();
      setQrScanner(scanner);
      setIsScanning(true);
      
    } catch (err) {
      console.error('QRCodeScanner: Erro ao iniciar scanner:', err);
      let msg = 'Erro ao acessar a câmera.';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') msg = 'Permissão de câmera negada.';
        else if (err.name === 'NotFoundError') msg = 'Nenhuma câmera encontrada.';
        else if (err.name === 'NotSupportedError') msg = 'Câmera não suportada pelo navegador.';
        else if (err.name === 'OverconstrainedError') msg = 'Configuração de câmera não suportada.';
      }
      setError(msg);
      setIsScanning(false);
      toast({
        title: "Erro de câmera",
        description: msg,
        variant: "destructive"
      });
    }
  };

  const stopScanner = () => {
    if (qrScanner) {
      qrScanner.stop();
      qrScanner.destroy();
      setQrScanner(null);
    }
    setIsScanning(false);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) =>
      {
        if (!open){
          stopScanner();

        }
      }
    }>
      <DialogContent className="max-w-md w-full bg-brand-brown-100 border-brand-marrom">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-brand-brown-800">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Scanner QR Code
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-brand-brown-800 hover:bg-brand-chocolate"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
            
            {!isScanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Iniciando câmera...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-900/80">
                <div className="text-center text-white p-4">
                  <p className="text-sm">{error}</p>
                  <Button
                    onClick={startScanner}
                    className="mt-2 bg-white text-black hover:bg-gray-200"
                    size="sm"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-brand-brown-800">
              Posicione o QR Code na área de escaneamento
            </p>
            
            {isScanning && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Escaneando...
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-brand-marrom text-brand-brown-800"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
