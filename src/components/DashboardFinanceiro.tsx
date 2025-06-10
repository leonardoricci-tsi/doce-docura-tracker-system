
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const receitaMensal = [
  { mes: 'Jan', receita: 45000, custo: 28000, lucro: 17000 },
  { mes: 'Fev', receita: 52000, custo: 32000, lucro: 20000 },
  { mes: 'Mar', receita: 48000, custo: 30000, lucro: 18000 },
  { mes: 'Abr', receita: 55000, custo: 33000, lucro: 22000 },
  { mes: 'Mai', receita: 62000, custo: 36000, lucro: 26000 },
  { mes: 'Jun', receita: 58000, custo: 35000, lucro: 23000 }
];

const custosProducao = [
  { categoria: 'Matéria Prima', valor: 42000 },
  { categoria: 'Mão de Obra', valor: 28000 },
  { categoria: 'Energia', valor: 8000 },
  { categoria: 'Embalagem', valor: 12000 },
  { categoria: 'Outros', valor: 5000 }
];

const COLORS = ['#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#f97316'];

export const DashboardFinanceiro = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-sweet-gold-800 mb-2">💰 Dashboard Financeiro</h2>
        <p className="text-sweet-gold-600">Análise financeira e indicadores de performance econômica</p>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">R$ 58k</p>
                <p className="text-sm text-sweet-gold-600">Receita Mensal</p>
                <p className="text-xs text-green-600">+12% vs mês anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📉</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">R$ 35k</p>
                <p className="text-sm text-sweet-gold-600">Custos Totais</p>
                <p className="text-xs text-red-600">+5% vs mês anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sweet-gold-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-sweet-gold-800">R$ 23k</p>
                <p className="text-sm text-sweet-gold-600">Lucro Líquido</p>
                <p className="text-xs text-green-600">+18% vs mês anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💹</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">39.7%</p>
                <p className="text-sm text-sweet-gold-600">Margem de Lucro</p>
                <p className="text-xs text-green-600">+2.3% vs mês anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue & Profit Trend */}
        <Card className="sweet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
              📊 Evolução Financeira
            </CardTitle>
            <CardDescription>
              Receita, custos e lucro dos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={receitaMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, '']} />
                <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={3} name="Receita" />
                <Line type="monotone" dataKey="custo" stroke="#ef4444" strokeWidth={3} name="Custos" />
                <Line type="monotone" dataKey="lucro" stroke="#ec4899" strokeWidth={3} name="Lucro" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="sweet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
              🥧 Distribuição de Custos
            </CardTitle>
            <CardDescription>
              Breakdown dos custos de produção por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={custosProducao}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {custosProducao.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${value}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cash Flow */}
        <Card className="sweet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
              💸 Fluxo de Caixa
            </CardTitle>
            <CardDescription>
              Resumo do movimento financeiro atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">Vendas à Vista</span>
                <span className="text-green-600 font-bold">R$ 34.800</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">Vendas a Prazo</span>
                <span className="text-blue-600 font-bold">R$ 23.200</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">Contas a Pagar</span>
                <span className="text-red-600 font-bold">R$ 18.500</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">Contas a Receber</span>
                <span className="text-green-600 font-bold">R$ 41.200</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t-2 border-sweet-gold-300 font-bold">
                <span>Saldo Disponível</span>
                <span className="text-sweet-gold-800">R$ 56.700</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Targets */}
        <Card className="sweet-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
              🎯 Metas Financeiras
            </CardTitle>
            <CardDescription>
              Progresso em relação às metas estabelecidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Meta de Receita Mensal</span>
                  <span className="text-sm text-sweet-gold-600">97% (R$ 58k / R$ 60k)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '97%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Meta de Lucro</span>
                  <span className="text-sm text-sweet-gold-600">115% (R$ 23k / R$ 20k)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-sweet-pink-500 h-2 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Controle de Custos</span>
                  <span className="text-sm text-sweet-gold-600">88% (R$ 35k / R$ 40k)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '88%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">ROI Anual</span>
                  <span className="text-sm text-sweet-gold-600">42% (Meta: 35%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-sweet-gold-500 h-2 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
