
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Rota {
  id: string;
  nome: string;
  regiao: string;
  pdvs: string[];
  status: 'planejada' | 'em_andamento' | 'concluida';
  dataEntrega: string;
  produtos: string[];
}

const rotasIniciais: Rota[] = [
  {
    id: '1',
    nome: 'Rota Grande SP - Norte',
    regiao: 'Grande SP',
    pdvs: ['Padaria Central', 'Supermercado Norte', 'Confeitaria Delícia'],
    status: 'em_andamento',
    dataEntrega: '2024-06-10',
    produtos: ['Brigadeiro', 'Beijinho']
  },
  {
    id: '2',
    nome: 'Rota Interior - Campinas',
    regiao: 'Interior de SP',
    pdvs: ['Doces & Cia', 'Mercado Central'],
    status: 'planejada',
    dataEntrega: '2024-06-11',
    produtos: ['Quindim', 'Bem-casado']
  },
  {
    id: '3',
    nome: 'Rota Sul - Santos',
    regiao: 'Sul de SP',
    pdvs: ['Confeitaria Mar', 'Padaria da Praia', 'Doces do Porto'],
    status: 'concluida',
    dataEntrega: '2024-06-09',
    produtos: ['Trufa', 'Brownie']
  }
];

interface RotasEntregaProps {
  distribuidorName: string;
}

export const RotasEntrega = ({ distribuidorName }: RotasEntregaProps) => {
  const [rotas, setRotas] = useState<Rota[]>(rotasIniciais);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planejada':
        return 'bg-blue-100 text-blue-800';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'concluida':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planejada':
        return 'Planejada';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluida':
        return 'Concluída';
      default:
        return status;
    }
  };

  const rotasPlanejadas = rotas.filter(r => r.status === 'planejada').length;
  const rotasEmAndamento = rotas.filter(r => r.status === 'em_andamento').length;
  const rotasConcluidas = rotas.filter(r => r.status === 'concluida').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-sweet-gold-800 mb-2">🗺️ Rotas de Entrega</h2>
        <p className="text-sweet-gold-600">Planejamento e acompanhamento das rotas de entrega - {distribuidorName}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{rotasPlanejadas}</p>
                <p className="text-sm text-sweet-gold-600">Rotas Planejadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚛</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{rotasEmAndamento}</p>
                <p className="text-sm text-sweet-gold-600">Em Andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sweet-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{rotasConcluidas}</p>
                <p className="text-sm text-sweet-gold-600">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            ⚙️ Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="sweet-button">
              ➕ Nova Rota
            </Button>
            <Button variant="outline" className="border-sweet-gold-300 hover:bg-sweet-gold-100">
              📊 Otimizar Rotas
            </Button>
            <Button variant="outline" className="border-sweet-pink-300 hover:bg-sweet-pink-100">
              📍 Visualizar Mapa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Routes Table */}
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            🗂️ Rotas Cadastradas
          </CardTitle>
          <CardDescription>
            Lista de todas as rotas de entrega programadas e realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Rota</TableHead>
                  <TableHead>Região</TableHead>
                  <TableHead>PDVs</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Data de Entrega</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rotas.map((rota) => (
                  <TableRow key={rota.id}>
                    <TableCell className="font-medium">{rota.nome}</TableCell>
                    <TableCell>{rota.regiao}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rota.pdvs.map((pdv, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {pdv}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rota.produtos.map((produto, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {produto}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(rota.dataEntrega).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(rota.status)}>
                        {getStatusText(rota.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-sweet-gold-300 hover:bg-sweet-gold-100">
                          ✏️
                        </Button>
                        <Button size="sm" variant="outline" className="border-sweet-pink-300 hover:bg-sweet-pink-100">
                          👁️
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
    </div>
  );
};
