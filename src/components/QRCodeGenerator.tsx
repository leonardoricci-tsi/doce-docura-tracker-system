import { useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface LoteData {
  id: string;
  codigo_lote: string;
  data_producao: string;
  data_validade: string;
  responsavel: string;
  nota_fiscal?: string;
  observacoes?: string;
  status: string;
  lote_itens?: Array<{
    quantidade_produzida: number;
    produtos?: {
      nome: string;
      tipo: string;
      sabor: string;
    };
  }>;
}

interface QRCodeGeneratorProps {
  lote: LoteData;
}

export const QRCodeGenerator = ({ lote }: QRCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const getTotalQuantidade = () => {
    return lote.lote_itens?.reduce((total, item) => total + item.quantidade_produzida, 0) || 0;
  };

  const getProdutosString = () => {
    if (!lote.lote_itens || lote.lote_itens.length === 0) return 'N/A';
    return lote.lote_itens.map(item => 
      `${item.produtos?.tipo || ''} ${item.produtos?.sabor || ''} (${item.quantidade_produzida})`
    ).join(', ');
  };

  const generateQRCodeData = () => {
    const qrData = {
      lote: lote.codigo_lote,
      dataProducao: new Date(lote.data_producao).toLocaleDateString('pt-BR'),
      dataValidade: new Date(lote.data_validade).toLocaleDateString('pt-BR'),
      responsavel: lote.responsavel,
      notaFiscal: lote.nota_fiscal || 'N/A',
      produtos: getProdutosString(),
      quantidadeTotal: getTotalQuantidade(),
      status: lote.status,
      observacoes: lote.observacoes || 'N/A'
    };

    return JSON.stringify(qrData, null, 2);
  };

  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const qrData = generateQRCodeData();
      
      await QRCode.toCanvas(canvas, qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#8B4513', // Cor marrom do tema
          light: '#FFF8DC'  // Cor de fundo clara do tema
        }
      });

      toast({
        title: "QR Code gerado",
        description: "QR Code gerado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar QR Code",
        variant: "destructive"
      });
    }
  };

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `qrcode-lote-${lote.codigo_lote}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "Download realizado",
      description: "QR Code baixado com sucesso!"
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-brand-brown-200 border-brand-brown-300">
      <CardHeader>
        <CardTitle className="text-center text-brand-brown-800">
          QR Code - Lote {lote.codigo_lote}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <canvas 
            ref={canvasRef}
            className="border border-brand-brown-300 rounded bg-brand-yellow-50"
          />
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={generateQRCode}
            className="w-full bg-brand-brown-600 hover:bg-brand-brown-700 text-white"
          >
            🔄 Gerar QR Code
          </Button>
          
          <Button 
            onClick={downloadQRCode}
            variant="outline"
            className="w-full border-brand-brown-400 text-brand-brown-700 hover:bg-brand-brown-100"
          >
            📥 Baixar QR Code
          </Button>
        </div>

        {/* Preview dos dados que serão incluídos no QR Code */}
        <div className="mt-4 p-3 bg-brand-yellow-50 rounded border border-brand-brown-300">
          <h4 className="font-semibold text-brand-brown-800 mb-2">Dados incluídos no QR Code:</h4>
          <div className="text-xs text-brand-brown-700 space-y-1">
            <div><strong>Lote:</strong> {lote.codigo_lote}</div>
            <div><strong>Data Produção:</strong> {new Date(lote.data_producao).toLocaleDateString('pt-BR')}</div>
            <div><strong>Data Validade:</strong> {new Date(lote.data_validade).toLocaleDateString('pt-BR')}</div>
            <div><strong>Responsável:</strong> {lote.responsavel}</div>
            <div><strong>Nota Fiscal:</strong> {lote.nota_fiscal || 'N/A'}</div>
            <div><strong>Produtos:</strong> {getProdutosString()}</div>
            <div><strong>Quantidade Total:</strong> {getTotalQuantidade()}</div>
            <div><strong>Status:</strong> {lote.status}</div>
            {lote.observacoes && <div><strong>Observações:</strong> {lote.observacoes}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};