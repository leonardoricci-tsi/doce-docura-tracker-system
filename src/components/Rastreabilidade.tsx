
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useLotesProducao } from '@/hooks/useLotesProducao';
import { useDistribuicoes } from '@/hooks/useDistribuicoes';

export const Rastreabilidade = () => {
  const [termoBusca, setTermoBusca] = useState('');
  const [loteSelecionado, setLoteSelecionado] = useState<string | null>(null);
  
  const { data: lotes = [] } = useLotesProducao();
  const { data: distribuicoes = [] } = useDistribuicoes();

  const lotesFiltrados = lotes.filter(lote => 
    lote.produtos?.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    lote.codigo_lote.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const distribuicoesDoLote = distribuicoes.filter(dist => 
    loteSelecionado && dist.lote_id === loteSelecionado
  );

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca é feita em tempo real através do filtro
  };

  const getStatusLote = (lote: any) => {
    const distribuicaoExiste = distribuicoes.some(dist => dist.lote_id === lote.id);
    
    if (distribuicaoExiste) {
      return 'Em Distribuição';
    }
    
    const dataValidade = new Date(lote.data_validade);
    const hoje = new Date();
    
    if (dataValidade < hoje) {
      return 'Vencido';
    }
    
    return 'Em Produção';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Distribuição':
        return 'default';
      case 'Vencido':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getLocalizacaoAtual = (lote: any) => {
    const distribuicao = distribuicoes.find(dist => dist.lote_id === lote.id);
    if (distribuicao) {
      return distribuicao.distribuidores?.nome || 'Em Distribuição';
    }
    return 'Fábrica';
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
                {lotesFiltrados.map((lote) => {
                  const status = getStatusLote(lote);
                  return (
                    <TableRow key={lote.id}>
                      <TableCell className="font-medium">{lote.produtos?.nome}</TableCell>
                      <TableCell>{lote.codigo_lote}</TableCell>
                      <TableCell>{new Date(lote.data_producao).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{new Date(lote.data_validade).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(status)}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>{getLocalizacaoAtual(lote)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLoteSelecionado(lote.id)}
                          className="border-brand-yellow-400 text-brand-brown-800 hover:bg-brand-yellow-400"
                        >
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
              Lote: {lotes.find(l => l.id === loteSelecionado)?.codigo_lote}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-brand-neutral-300">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Localização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Evento de produção */}
                  {(() => {
                    const lote = lotes.find(l => l.id === loteSelecionado);
                    if (!lote) return null;
                    
                    return (
                      <TableRow>
                        <TableCell>{new Date(lote.data_producao).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="font-medium">Produção Finalizada</TableCell>
                        <TableCell>{lote.responsavel}</TableCell>
                        <TableCell>{lote.quantidade_produzida} unidades</TableCell>
                        <TableCell>Fábrica</TableCell>
                      </TableRow>
                    );
                  })()}
                  
                  {/* Eventos de distribuição */}
                  {distribuicoesDoLote.map((distribuicao) => (
                    <TableRow key={distribuicao.id}>
                      <TableCell>{new Date(distribuicao.data_distribuicao).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="font-medium">Saída para Distribuição</TableCell>
                      <TableCell>{distribuicao.responsavel_distribuicao}</TableCell>
                      <TableCell>{distribuicao.quantidade_distribuida} unidades</TableCell>
                      <TableCell>{distribuicao.distribuidores?.nome}</TableCell>
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
