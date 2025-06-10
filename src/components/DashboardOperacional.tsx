
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const eficienciaLinhas = [
  { linha: 'Linha 1', eficiencia: 94, status: 'ativa', produto: 'Brigadeiro' },
  { linha: 'Linha 2', eficiencia: 87, status: 'ativa', produto: 'Beijinho' },
  { linha: 'Linha 3', eficiencia: 0, status: 'manutencao', produto: 'Quindim' },
  { linha: 'Linha 4', eficiencia: 91, status: 'ativa', produto: 'Bem-casado' }
];

const producaoDiaria = [
  { dia: 'Seg', meta: 800, realizado: 750 },
  { dia: 'Ter', meta: 800, realizado: 820 },
  { dia: 'Qua', meta: 800, realizado: 780 },
  { dia: 'Qui', meta: 800, realizado: 850 },
  { dia: 'Sex', meta: 800, realizado: 790 },
  { dia: 'Sáb', meta: 600, realizado: 580 },
  { dia: 'Dom', meta: 400, realizado: 420 }
];

const equipamentos = [
  { id: 'EQ001', nome: 'Misturador Principal', status: 'operando', ultimaManutencao: '2024-05-15' },
  { id: 'EQ002', nome: 'Forno Industrial A', status: 'operando', ultimaManutencao: '2024-05-20' },
  { id: 'EQ003', nome: 'Esteira Embalagem', status: 'manutencao', ultimaManutencao: '2024-06-01' },
  { id: 'EQ004', nome: 'Refrigerador Central', status: 'operando', ultimaManutencao: '2024-05-10' }
];

export const DashboardOperacional = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operando':
      case 'ativa':
        return 'bg-green-100 text-green-800';
      case 'manutencao':
        return 'bg-yellow-100 text-yellow-800';
      case 'parada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operando':
      case 'ativa':
        return 'Operando';
      case 'manutencao':
        return 'Manutenção';
      case 'parada':
        return 'Parada';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-sweet-gold-800 mb-2">⚙️ Dashboard Operacional</h2>
        <p className="text-sweet-gold-600">Monitoramento de operações, equipamentos e eficiência produtiva</p>
      </div>

      {/* Operational KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">91%</p>
                <p className="text-sm text-sweet-gold-600">Eficiência Geral</p>
                <p className="text-xs text-green-600">+3% vs semana anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sweet-pink-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏭</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-sweet-pink-600">3/4</p>
                <p className="text-sm text-sweet-gold-600">Linhas Ativas</p>
                <p className="text-xs text-yellow-600">1 em manutenção</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏱️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">16.2h</p>
                <p className="text-sm text-sweet-gold-600">Tempo Operacional</p>
                <p className="text-xs text-blue-600">De 18h planejadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sweet-gold-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-sweet-gold-800">98.5%</p>
                <p className="text-sm text-sweet-gold-600">Qualidade</p>
                <p className="text-xs text-green-600">Acima da meta (95%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Lines Status */}
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            🏭 Status das Linhas de Produção
          </CardTitle>
          <CardDescription>
            Monitoramento em tempo real da eficiência das linhas produtivas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Linha</TableHead>
                  <TableHead>Produto Atual</TableHead>
                  <TableHead>Eficiência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eficienciaLinhas.map((linha) => (
                  <TableRow key={linha.linha}>
                    <TableCell className="font-medium">{linha.linha}</TableCell>
                    <TableCell>{linha.produto}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${linha.eficiencia >= 90 ? 'bg-green-500' : linha.eficiencia >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{width: `${linha.eficiencia}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{linha.eficiencia}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(linha.status)}>
                        {getStatusText(linha.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">👁️</button>
                        <button className="text-sweet-gold-600 hover:text-sweet-gold-800">⚙️</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Production */}
        <Card className="sweet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
              📈 Produção vs Meta
            </CardTitle>
            <CardDescription>
              Comparação da produção realizada com a meta semanal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={producaoDiaria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="meta" fill="#e5e7eb" name="Meta" />
                <Bar dataKey="realizado" fill="#ec4899" name="Realizado" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Equipment Status */}
        <Card className="sweet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
              🔧 Status dos Equipamentos
            </CardTitle>
            <CardDescription>
              Monitoramento do estado operacional dos equipamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipamentos.map((equipamento) => (
                <div key={equipamento.id} className="flex items-center justify-between p-4 border border-sweet-cream-300 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-sweet-cream-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">⚙️</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sweet-gold-800">{equipamento.nome}</h4>
                      <p className="text-sm text-sweet-gold-600">ID: {equipamento.id}</p>
                      <p className="text-xs text-sweet-gold-500">
                        Última manutenção: {new Date(equipamento.ultimaManutencao).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(equipamento.status)}>
                    {getStatusText(equipamento.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            ⚡ Ações Rápidas
          </CardTitle>
          <CardDescription>
            Controles operacionais e comandos rápidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border border-sweet-pink-300 rounded-lg hover:bg-sweet-pink-100 transition-colors">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-sm font-medium">Reiniciar Linha</div>
            </button>
            <button className="p-4 border border-sweet-gold-300 rounded-lg hover:bg-sweet-gold-100 transition-colors">
              <div className="text-2xl mb-2">⏸️</div>
              <div className="text-sm font-medium">Pausar Produção</div>
            </button>
            <button className="p-4 border border-green-300 rounded-lg hover:bg-green-100 transition-colors">
              <div className="text-2xl mb-2">🔧</div>
              <div className="text-sm font-medium">Agendar Manutenção</div>
            </button>
            <button className="p-4 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">Relatório Detalhado</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
