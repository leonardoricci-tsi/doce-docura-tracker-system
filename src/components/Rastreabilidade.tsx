import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface Produto {
  id: string;
  nome: string;
  lote: string;
  dataProducao: string;
  dataValidade: string;
  status: 'Em Produção' | 'Em Trânsito' | 'Entregue';
  distribuidor: string;
  localizacaoAtual: string;
}

interface EventoRastreabilidade {
  data: string;
  hora: string;
  evento: string;
  responsavel: string;
  localizacao: string;
}

// Dados de exemplo
const produtosExemplo: Produto[] = [
  {
    id: '1',
    nome: 'Bolo de Chocolate',
    lote: 'BC-2023-001',
    dataProducao: '10/01/2023',
    dataValidade: '10/04/2023',
    status: 'Entregue',
    distribuidor: 'Distribuidora Sul',
    localizacaoAtual: 'Loja Centro'
  },
  {
    id: '2',
    nome: 'Torta de Morango',
    lote: 'TM-2023-042',
    dataProducao: '15/02/2023',
    dataValidade: '15/05/2023',
    status: 'Em Trânsito',
    distribuidor: 'Distribuidora Norte',
    localizacaoAtual: 'Centro de Distribuição'
  },
  {
    id: '3',
    nome: 'Pudim de Leite',
    lote: 'PL-2023-103',
    dataProducao: '22/03/2023',
    dataValidade: '22/06/2023',
    status: 'Em Produção',
    distribuidor: 'Distribuidora Leste',
    localizacaoAtual: 'Fábrica'
  },
];

const eventosRastreabilidadeExemplo: Record<string, EventoRastreabilidade[]> = {
  'BC-2023-001': [
    {
      data: '10/01/2023',
      hora: '08:30',
      evento: 'Produção Iniciada',
      responsavel: 'Maria Silva',
      localizacao: 'Fábrica'
    },
    {
      data: '10/01/2023',
      hora: '14:45',
      evento: 'Produção Finalizada',
      responsavel: 'Maria Silva',
      localizacao: 'Fábrica'
    },
    {
      data: '11/01/2023',
      hora: '09:15',
      evento: 'Saída para Distribuição',
      responsavel: 'João Pereira',
      localizacao: 'Centro de Distribuição'
    },
    {
      data: '12/01/2023',
      hora: '11:30',
      evento: 'Entrega Realizada',
      responsavel: 'Carlos Santos',
      localizacao: 'Loja Centro'
    }
  ],
  'TM-2023-042': [
    {
      data: '15/02/2023',
      hora: '09:00',
      evento: 'Produção Iniciada',
      responsavel: 'Ana Oliveira',
      localizacao: 'Fábrica'
    },
    {
      data: '15/02/2023',
      hora: '16:20',
      evento: 'Produção Finalizada',
      responsavel: 'Ana Oliveira',
      localizacao: 'Fábrica'
    },
    {
      data: '16/02/2023',
      hora: '10:45',
      evento: 'Saída para Distribuição',
      responsavel: 'Roberto Alves',
      localizacao: 'Centro de Distribuição'
    }
  ],
  'PL-2023-103': [
    {
      data: '22/03/2023',
      hora: '10:15',
      evento: 'Produção Iniciada',
      responsavel: 'Fernanda Lima',
      localizacao: 'Fábrica'
    }
  ]
};

export const Rastreabilidade = () => {
  const [termoBusca, setTermoBusca] = useState('');
  const [loteSelecionado, setLoteSelecionado] = useState<string | null>(null);

  const produtosFiltrados = produtosExemplo.filter(produto => 
    produto.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    produto.lote.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementação futura: busca no backend
  };

  return (
    <div className="space-y-6">
      {/* Busca */}
      <Card className="brand-card">
        <CardHeader>
          <CardTitle className="text-brand-brown-800">Rastreabilidade de Produtos</CardTitle>
          <CardDescription>
            Busque por nome do produto ou número do lote para rastrear
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBusca} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por produto ou lote..."
                className="pl-8"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-brand-brown-800 hover:bg-brand-brown-900">
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card className="brand-card">
        <CardHeader>
          <CardTitle className="text-brand-brown-800">Histórico de Rastreabilidade</CardTitle>
          <CardDescription>
            Visualize todo o histórico de movimentação dos produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-brand-neutral-300">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Data Produção</TableHead>
                  <TableHead>Data Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Localização Atual</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosFiltrados.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>{produto.lote}</TableCell>
                    <TableCell>{produto.dataProducao}</TableCell>
                    <TableCell>{produto.dataValidade}</TableCell>
                    <TableCell>
                      <Badge variant={
                        produto.status === 'Em Trânsito' ? 'default' :
                        produto.status === 'Entregue' ? 'secondary' : 'outline'
                      }>
                        {produto.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{produto.localizacaoAtual}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLoteSelecionado(produto.lote)}
                        className="border-brand-yellow-400 text-brand-brown-800 hover:bg-brand-yellow-400"
                      >
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento de rastreabilidade */}
      {loteSelecionado && (
        <Card className="brand-card">
          <CardHeader>
            <CardTitle className="text-brand-brown-800">Detalhes de Rastreabilidade</CardTitle>
            <CardDescription>
              Lote: {loteSelecionado}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-brand-neutral-300">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Localização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventosRastreabilidadeExemplo[loteSelecionado]?.map((evento, index) => (
                    <TableRow key={index}>
                      <TableCell>{evento.data}</TableCell>
                      <TableCell>{evento.hora}</TableCell>
                      <TableCell className="font-medium">{evento.evento}</TableCell>
                      <TableCell>{evento.responsavel}</TableCell>
                      <TableCell>{evento.localizacao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setLoteSelecionado(null)}
                className="border-brand-neutral-300 text-brand-brown-800"
              >
                Fechar Detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
