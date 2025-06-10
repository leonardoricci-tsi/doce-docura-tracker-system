
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const vendasMensais = [
  { mes: 'Jan', vendas: 120 },
  { mes: 'Fev', vendas: 150 },
  { mes: 'Mar', vendas: 180 },
  { mes: 'Abr', vendas: 165 },
  { mes: 'Mai', vendas: 200 },
  { mes: 'Jun', vendas: 220 }
];

const produtosMaisVendidos = [
  { produto: 'Brigadeiro', quantidade: 85 },
  { produto: 'Beijinho', quantidade: 70 },
  { produto: 'Quindim', quantidade: 55 },
  { produto: 'Bem-casado', quantidade: 40 },
  { produto: 'Trufa', quantidade: 30 }
];

interface RelatoriosDistribuidorProps {
  distribuidorName: string;
}

export const RelatoriosDistribuidor = ({ distribuidorName }: RelatoriosDistribuidorProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-sweet-gold-800 mb-2">📊 Relatórios e Analytics</h2>
        <p className="text-sweet-gold-600">Dados e métricas de performance - {distribuidorName}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sweet-pink-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-sweet-gold-800">R$ 15.8k</p>
                <p className="text-sm text-sweet-gold-600">Vendas do Mês</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sweet-gold-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-sweet-gold-800">340</p>
                <p className="text-sm text-sweet-gold-600">Produtos Vendidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-sweet-gold-800">25</p>
                <p className="text-sm text-sweet-gold-600">PDVs Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">+15%</p>
                <p className="text-sm text-sweet-gold-600">Crescimento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend */}
        <Card className="sweet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
              📈 Evolução das Vendas
            </CardTitle>
            <CardDescription>
              Vendas mensais dos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vendasMensais}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="vendas" stroke="#ec4899" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="sweet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
              🏆 Produtos Mais Vendidos
            </CardTitle>
            <CardDescription>
              Ranking de produtos por quantidade vendida
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={produtosMaisVendidos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="produto" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Report Actions */}
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            📋 Relatórios Disponíveis
          </CardTitle>
          <CardDescription>
            Gere relatórios detalhados para análise e planejamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 border-sweet-pink-300 hover:bg-sweet-pink-100">
              <span className="text-2xl">📊</span>
              <span>Relatório de Vendas</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-sweet-gold-300 hover:bg-sweet-gold-100">
              <span className="text-2xl">📦</span>
              <span>Relatório de Estoque</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-green-300 hover:bg-green-100">
              <span className="text-2xl">🚛</span>
              <span>Relatório de Entregas</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-blue-300 hover:bg-blue-100">
              <span className="text-2xl">💰</span>
              <span>Relatório Financeiro</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-purple-300 hover:bg-purple-100">
              <span className="text-2xl">🏪</span>
              <span>Performance PDVs</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-orange-300 hover:bg-orange-100">
              <span className="text-2xl">📈</span>
              <span>Análise de Tendências</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
