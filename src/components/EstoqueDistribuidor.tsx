
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EstoqueItem {
  id: string;
  produto: string;
  numeroLote: string;
  quantidade: number;
  dataValidade: string;
  status: 'disponivel' | 'baixo' | 'vencido';
}

const estoqueInicial: EstoqueItem[] = [
  {
    id: '1',
    produto: 'Brigadeiro',
    numeroLote: 'LOT001',
    quantidade: 150,
    dataValidade: '2024-07-15',
    status: 'disponivel'
  },
  {
    id: '2',
    produto: 'Beijinho',
    numeroLote: 'LOT002',
    quantidade: 25,
    dataValidade: '2024-06-30',
    status: 'baixo'
  },
  {
    id: '3',
    produto: 'Quindim',
    numeroLote: 'LOT003',
    quantidade: 80,
    dataValidade: '2024-08-20',
    status: 'disponivel'
  }
];

interface EstoqueDistribuidorProps {
  distribuidorName: string;
}

export const EstoqueDistribuidor = ({ distribuidorName }: EstoqueDistribuidorProps) => {
  const [estoque, setEstoque] = useState<EstoqueItem[]>(estoqueInicial);
  const [filtro, setFiltro] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'bg-green-100 text-green-800';
      case 'baixo':
        return 'bg-yellow-100 text-yellow-800';
      case 'vencido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'baixo':
        return 'Estoque Baixo';
      case 'vencido':
        return 'Vencido';
      default:
        return status;
    }
  };

  const estoqueFiltrado = estoque.filter(item => 
    item.produto.toLowerCase().includes(filtro.toLowerCase()) ||
    item.numeroLote.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalProdutos = estoque.reduce((acc, item) => acc + item.quantidade, 0);
  const produtosBaixoEstoque = estoque.filter(item => item.status === 'baixo').length;
  const produtosVencidos = estoque.filter(item => item.status === 'vencido').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-sweet-gold-800 mb-2">📦 Gestão de Estoque</h2>
        <p className="text-sweet-gold-600">Controle do estoque de produtos do distribuidor {distribuidorName}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sweet-gold-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-sweet-gold-800">{totalProdutos}</p>
                <p className="text-sm text-sweet-gold-600">Total de Produtos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{produtosBaixoEstoque}</p>
                <p className="text-sm text-sweet-gold-600">Estoque Baixo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚨</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{produtosVencidos}</p>
                <p className="text-sm text-sweet-gold-600">Produtos Vencidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            🔍 Filtrar Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="filtro">Buscar por produto ou lote</Label>
              <Input
                id="filtro"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Digite o nome do produto ou número do lote..."
                className="focus:ring-2 focus:ring-sweet-pink-300"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => setFiltro('')} variant="outline" className="border-sweet-cream-400">
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            📋 Inventário Atual
          </CardTitle>
          <CardDescription>
            Lista detalhada de todos os produtos em estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Data de Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estoqueFiltrado.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.produto}</TableCell>
                    <TableCell>{item.numeroLote}</TableCell>
                    <TableCell>{item.quantidade} unidades</TableCell>
                    <TableCell>{new Date(item.dataValidade).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-sweet-gold-300 hover:bg-sweet-gold-100">
                          ✏️ Editar
                        </Button>
                        <Button size="sm" variant="outline" className="border-sweet-pink-300 hover:bg-sweet-pink-100">
                          📊 Detalhes
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {estoqueFiltrado.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sweet-gold-600">Nenhum produto encontrado com os filtros aplicados.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
