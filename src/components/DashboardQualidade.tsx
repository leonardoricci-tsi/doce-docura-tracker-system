
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQualityAnalytics } from '@/hooks/useAnalytics';
import { useLotesProducao } from '@/hooks/useLotesProducao';

const historicoQualidade = [
  { mes: 'Jan', aprovados: 95.2, rejeitados: 4.8 },
  { mes: 'Fev', aprovados: 96.1, rejeitados: 3.9 },
  { mes: 'Mar', aprovados: 94.8, rejeitados: 5.2 },
  { mes: 'Abr', aprovados: 97.3, rejeitados: 2.7 },
  { mes: 'Mai', aprovados: 98.1, rejeitados: 1.9 },
  { mes: 'Jun', aprovados: 98.5, rejeitados: 1.5 }
];

const testesPorProduto = [
  { produto: 'Brigadeiro', testes: 45, aprovados: 44, taxa: 97.8 },
  { produto: 'Beijinho', testes: 38, aprovados: 37, taxa: 97.4 },
  { produto: 'Quindim', testes: 32, aprovados: 31, taxa: 96.9 },
  { produto: 'Bem-casado', testes: 28, aprovados: 28, taxa: 100 },
  { produto: 'Trufa', testes: 25, aprovados: 24, taxa: 96.0 }
];

const inspecoesRecentes = [
  {
    id: 'INS001',
    lote: 'LOT001',
    produto: 'Brigadeiro',
    data: '2024-06-10',
    resultado: 'aprovado',
    observacoes: 'Dentro dos padrões estabelecidos'
  },
  {
    id: 'INS002',
    lote: 'LOT002',
    produto: 'Beijinho',
    data: '2024-06-10',
    resultado: 'aprovado',
    observacoes: 'Excelente qualidade'
  },
  {
    id: 'INS003',
    lote: 'LOT003',
    produto: 'Quindim',
    data: '2024-06-09',
    resultado: 'rejeitado',
    observacoes: 'Textura fora do padrão'
  }
];

export const DashboardQualidade = () => {
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const { data: analytics, isLoading: analyticsLoading } = useQualityAnalytics();
  const { data: lotes = [], isLoading: lotesLoading } = useLotesProducao();

  if (analyticsLoading || lotesLoading) {
    return <div className="flex items-center justify-center h-64">Carregando dados de qualidade...</div>;
  }

  const getResultadoColor = (resultado: string) => {
    switch (resultado) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultadoText = (resultado: string) => {
    switch (resultado) {
      case 'aprovado':
        return 'Aprovado';
      case 'rejeitado':
        return 'Rejeitado';
      case 'pendente':
        return 'Pendente';
      default:
        return resultado;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-sweet-gold-800 mb-2">✅ Dashboard de Qualidade</h2>
        <p className="text-sweet-gold-600">Monitoramento de qualidade, testes e conformidade dos produtos</p>
      </div>

      {/* Quality KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{analytics?.taxaAprovacao || 0}%</p>
                <p className="text-sm text-sweet-gold-600">Taxa de Aprovação</p>
                <p className="text-xs text-green-600">Baseado em lotes ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sweet-pink-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔬</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-sweet-pink-600">{analytics?.totalLotes || 0}</p>
                <p className="text-sm text-sweet-gold-600">Lotes Analisados</p>
                <p className="text-xs text-blue-600">Total no sistema</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{analytics?.lotesRejeitados || 0}</p>
                <p className="text-sm text-sweet-gold-600">Lotes Rejeitados</p>
                <p className="text-xs text-red-600">Status inativo</p>
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
                <p className="text-2xl font-bold text-blue-600">{analytics?.lotesAprovados || 0}</p>
                <p className="text-sm text-sweet-gold-600">Lotes Aprovados</p>
                <p className="text-xs text-green-600">Status ativo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quality Trend */}
        <Card className="sweet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
              📈 Evolução da Qualidade
            </CardTitle>
            <CardDescription>
              Taxa de aprovação nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicoQualidade}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis domain={[90, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Line type="monotone" dataKey="aprovados" stroke="#10b981" strokeWidth={3} name="Taxa de Aprovação" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tests by Product */}
        <Card className="sweet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
              🧪 Testes por Produto
            </CardTitle>
            <CardDescription>
              Número de testes realizados por tipo de produto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.produtoStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="produto" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="testes" fill="#ec4899" name="Testes Realizados" />
                <Bar dataKey="aprovados" fill="#10b981" name="Aprovados" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product Quality Summary */}
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            📊 Resumo de Qualidade por Produto
          </CardTitle>
          <CardDescription>
            Taxa de aprovação detalhada por linha de produto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Testes Realizados</TableHead>
                  <TableHead>Aprovados</TableHead>
                  <TableHead>Taxa de Aprovação</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics?.produtoStats?.map((item) => (
                  <TableRow key={item.produto}>
                    <TableCell className="font-medium">{item.produto}</TableCell>
                    <TableCell>{item.testes}</TableCell>
                    <TableCell>{item.aprovados}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.taxa >= 98 ? 'bg-green-500' : item.taxa >= 95 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{width: `${item.taxa}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{item.taxa.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={item.taxa >= 98 ? 'bg-green-100 text-green-800' : item.taxa >= 95 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                        {item.taxa >= 98 ? 'Excelente' : item.taxa >= 95 ? 'Bom' : 'Atenção'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )) || []}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Inspections */}
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            🔍 Inspeções Recentes
          </CardTitle>
          <CardDescription>
            Lista das últimas inspeções de qualidade realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Inspeção</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotes.slice(0, 10).map((lote) => (
                  <TableRow key={lote.id}>
                    <TableCell className="font-medium">{lote.codigo_lote}</TableCell>
                    <TableCell>{lote.codigo_lote}</TableCell>
                    <TableCell>{lote.produtos?.nome || 'N/A'}</TableCell>
                    <TableCell>{new Date(lote.data_producao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge className={getResultadoColor(lote.status === 'ativo' ? 'aprovado' : 'rejeitado')}>
                        {getResultadoText(lote.status === 'ativo' ? 'aprovado' : 'rejeitado')}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{lote.observacoes || 'Sem observações'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-sweet-gold-300 hover:bg-sweet-gold-100">
                          👁️
                        </Button>
                        <Button size="sm" variant="outline" className="border-sweet-pink-300 hover:bg-sweet-pink-100">
                          📄
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quality Actions */}
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            ⚡ Ações de Qualidade
          </CardTitle>
          <CardDescription>
            Ferramentas e comandos para gestão da qualidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 border-green-300 hover:bg-green-100">
              <span className="text-2xl">🧪</span>
              <span>Novo Teste</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-blue-300 hover:bg-blue-100">
              <span className="text-2xl">📊</span>
              <span>Relatório Qualidade</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-sweet-pink-300 hover:bg-sweet-pink-100">
              <span className="text-2xl">⚙️</span>
              <span>Configurar Padrões</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-sweet-gold-300 hover:bg-sweet-gold-100">
              <span className="text-2xl">📋</span>
              <span>Auditoria</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
