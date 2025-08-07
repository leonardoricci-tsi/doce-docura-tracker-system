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
    if (isOpen && videoRef.current) {
      startScanner();
    }

    return () => {
      if (qrScanner) {
        qrScanner.destroy();
      }
    };
  }, [isOpen]);

  const startScanner = async () => {
    if (!videoRef.current) {
      console.log('QRCodeScanner: videoRef.current is null');
      return;
    }

    try {
      console.log('QRCodeScanner: Iniciando scanner...');
      setError(null);
      setIsScanning(true);

      // Verificar se QrScanner está disponível
      if (!QrScanner.hasCamera()) {
        throw new Error('Nenhuma câmera disponível');
      }

      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          try {
            const parsedData = JSON.parse(result.data) as QRData;
            
            // Validar se o QR code tem a estrutura esperada
            if (parsedData.codigoLote && parsedData.produtos) {
              onScanSuccess(parsedData);
              scanner.stop();
              onClose();
              toast({
                title: "QR Code lido com sucesso!",
                description: `Dados do lote ${parsedData.codigoLote} carregados.`
              });
            } else {
              throw new Error('QR Code não contém dados válidos de lote');
            }
          } catch (error) {
            console.error('Erro ao processar QR Code:', error);
            toast({
              title: "QR Code inválido",
              description: "Este QR Code não contém dados válidos de lote de produção.",
              variant: "destructive"
            });
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment', // Câmera traseira em dispositivos móveis
        }
      );

      console.log('QRCodeScanner: Iniciando câmera...');
      await scanner.start();
      console.log('QRCodeScanner: Câmera iniciada com sucesso');
      setQrScanner(scanner);
      setIsScanning(true);
    } catch (error) {
      console.error('QRCodeScanner: Erro ao iniciar scanner:', error);
      
      let errorMessage = 'Erro ao acessar a câmera. Verifique as permissões.';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Permissão de câmera negada. Por favor, permita o acesso à câmera.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'Nenhuma câmera encontrada no dispositivo.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'Câmera não suportada pelo navegador.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'Configuração de câmera não suportada.';
        }
      }
      
      setError(errorMessage);
      setIsScanning(false);
      toast({
        title: "Erro de câmera",
        description: "Não foi possível acessar a câmera. Verifique as permissões.",
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={stopScanner}>
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
              onClick={stopScanner}
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
              onClick={stopScanner}
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