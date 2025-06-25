
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const saboresData = [
  { sabor: 'Trufado', quantidade: 150 },
  { sabor: 'Alfajor', quantidade: 120 },
  { sabor: 'Doce de Leite', quantidade: 100 },
  { sabor: 'Nozes', quantidade: 80 },
];

const regioesData = [
  { regiao: 'Grande SP', volume: 300 },
  { regiao: 'Interior SP', volume: 200 },
  { regiao: 'Rio de Janeiro', volume: 180 },
  { regiao: 'Minas Gerais', volume: 150 },
  { regiao: 'Sul do País', volume: 120 }
];

const produtosProximosVencimento = [
  {
    numeroLote: 'LOT003',
    produto: 'Trufado',
    dataValidade: '2025-06-29',
    distribuidor: 'Distribuidora Minas Gerais',
    diasRestantes: 2
  },
  {
    numeroLote: 'LOT001',
    produto: 'Alfajor',
    dataValidade: '2025-06-28',
    distribuidor: 'Distribuidora São Paulo',
    diasRestantes: 10
  }
];

const COLORS = ['#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#f97316'];

const getValidityClass = (dias: number) => {
  if (dias <= 15) return 'date-danger';
  if (dias <= 29) return 'date-warning';
  return 'date-safe';
};

export const DashboardAnalytics = () => {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-brand-brown-200 border-brand-brown-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-yellow-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏭</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-brown-800">3</p>
                <p className="text-sm text-brand-brown-600">Lotes Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-brown-200 border-brand-brown-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-yellow-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-brown-800">230</p>
                <p className="text-sm text-brand-brown-600">Produtos Produzidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-brown-200 border-brand-brown-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚛</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-brown-800">3</p>
                <p className="text-sm text-brand-brown-600">Distribuidores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-brown-200 border-brand-brown-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">2</p>
                <p className="text-sm text-brand-brown-600">Próximos ao Vencimento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart - Sabores */}
        <Card className="bg-brand-brown-200 border-brand-brown-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-brown-800">
              📊 Produção por Sabor
            </CardTitle>
            <CardDescription className="text-brand-brown-700">
              Comparação da quantidade produzida por sabor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={saboresData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sabor" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Regiões */}
        <Card className="bg-brand-brown-200 border-brand-brown-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-brown-800">
              🗺️ Distribuição por Região
            </CardTitle>
            <CardDescription className="text-brand-brown-700">
              Volume de distribuição por região geográfica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regioesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ regiao, percent }) => `${regiao} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="volume"
                >
                  {regioesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Products Near Expiration */}
      <Card className="bg-brand-brown-200 border-brand-brown-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-brown-800">
            ⚠️ Produtos Próximos ao Vencimento
          </CardTitle>
          <CardDescription className="text-brand-brown-700">
            Lista prioritária de produtos que precisam de atenção
          </CardDescription>
        </CardHeader>
        <CardContent>
          {produtosProximosVencimento.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-6xl">✅</span>
              <p className="text-brand-brown-700 mt-4">Nenhum produto próximo ao vencimento!</p>
              <p className="text-sm text-brand-brown-600">Todos os produtos estão dentro do prazo de validade seguro.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {produtosProximosVencimento.map((produto) => (
                <div
                  key={produto.numeroLote}
                  className={`p-4 rounded-lg border-2 ${getValidityClass(produto.diasRestantes)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl">
                          {produto.diasRestantes <= 15 ? '🚨' : produto.diasRestantes <= 29 ? '⚠️' : '✅'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{produto.produto}</h3>
                        <p className="text-sm opacity-80">Lote: {produto.numeroLote}</p>
                        <p className="text-sm opacity-80">Distribuidor: {produto.distribuidor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {produto.diasRestantes} {produto.diasRestantes === 1 ? 'dia' : 'dias'}
                      </p>
                      <p className="text-sm opacity-80">
                        Vence em {new Date(produto.dataValidade).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
