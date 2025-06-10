
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data combining production and distribution
const rastreabilidadeData = [
  {
    numeroLote: 'LOT001',
    produto: 'Brigadeiro',
    quantidadeProduzida: 100,
    dataFabricacao: '2024-06-05',
    dataValidade: '2024-06-20',
    distribuidor: 'Distribuidora São Paulo',
    regioes: ['Grande SP', 'Interior SP'],
    pdvs: ['Padaria da Esquina', 'Supermercado XYZ']
  },
  {
    numeroLote: 'LOT002',
    produto: 'Beijinho',
    quantidadeProduzida: 80,
    dataFabricacao: '2024-06-08',
    dataValidade: '2024-07-15',
    distribuidor: 'Distribuidora Rio de Janeiro',
    regioes: ['Zona Sul RJ', 'Centro RJ'],
    pdvs: ['Confeitaria Doce Mel', 'Mercado Bom Preço']
  },
  {
    numeroLote: 'LOT003',
    produto: 'Quindim',
    quantidadeProduzida: 50,
    dataFabricacao: '2024-06-01',
    dataValidade: '2024-06-12',
    distribuidor: 'Distribuidora Minas Gerais',
    regioes: ['BH', 'Interior MG'],
    pdvs: ['Doceria Mineira']
  }
];

const getValidityStatus = (dataValidade: string) => {
  const today = new Date();
  const validityDate = new Date(dataValidade);
  const daysDiff = Math.ceil((validityDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

  if (daysDiff <= 15) {
    return { status: 'danger', label: 'Crítico', className: 'date-danger' };
  } else if (daysDiff <= 29) {
    return { status: 'warning', label: 'Atenção', className: 'date-warning' };
  } else {
    return { status: 'safe', label: 'OK', className: 'date-safe' };
  }
};

export const Rastreabilidade = () => {
  return (
    <div className="space-y-8">
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            🔍 Rastreabilidade Completa
          </CardTitle>
          <CardDescription>
            Acompanhe toda a cadeia de produção e distribuição dos produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rastreabilidadeData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sweet-gold-600">Nenhum dado de rastreabilidade disponível.</p>
              <p className="text-sm text-sweet-gold-500">Cadastre produções e distribuições para visualizar o rastreamento.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lote</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Qtd. Produzida</TableHead>
                    <TableHead>Data Fabricação</TableHead>
                    <TableHead>Data Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Distribuidor</TableHead>
                    <TableHead>Regiões</TableHead>
                    <TableHead>PDVs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rastreabilidadeData.map((item) => {
                    const validityStatus = getValidityStatus(item.dataValidade);
                    
                    return (
                      <TableRow key={item.numeroLote}>
                        <TableCell className="font-medium">{item.numeroLote}</TableCell>
                        <TableCell>{item.produto}</TableCell>
                        <TableCell>{item.quantidadeProduzida}</TableCell>
                        <TableCell>{new Date(item.dataFabricacao).toLocaleDateString()}</TableCell>
                        <TableCell className={`rounded-md px-2 py-1 ${validityStatus.className}`}>
                          {new Date(item.dataValidade).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={validityStatus.status === 'danger' ? 'destructive' : 'secondary'}
                            className={validityStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                          >
                            {validityStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.distribuidor}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.regioes.map((regiao, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {regiao}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.pdvs.map((pdv, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {pdv}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="text-lg text-sweet-gold-800">📝 Legenda de Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded date-danger"></div>
              <div>
                <p className="font-medium text-red-800">Crítico</p>
                <p className="text-sm text-red-600">≤ 15 dias para vencer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded date-warning"></div>
              <div>
                <p className="font-medium text-yellow-800">Atenção</p>
                <p className="text-sm text-yellow-600">16-29 dias para vencer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded date-safe"></div>
              <div>
                <p className="font-medium text-green-800">OK</p>
                <p className="text-sm text-green-600">≥ 30 dias para vencer</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
