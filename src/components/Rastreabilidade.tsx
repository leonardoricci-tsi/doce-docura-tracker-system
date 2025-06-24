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
      <Card className="bg-brand-doceLeite border-brand-marrom">
        <CardHeader>
          <CardTitle className="text-brand-begeSuave">Rastreabilidade de Produtos</CardTitle>
          <CardDescription className="text-brand-begeSuave">
            Busque por nome do produto ou número do lote para rastrear
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBusca} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-brand-trufa" />
              <Input
                type="search"
                placeholder="Buscar por produto ou lote..."
                className="pl-8 bg-brand-mel text-brand-trufa !placeholder-brand-trufa  font-medium !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-brand-marrom hover:bg-brand-marromEscuro text-brand-begeSuave">
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card className="bg-brand-doceLeite border-brand-marrom">
        <CardHeader>
          <CardTitle className="text-brand-begeSuave">Histórico de Rastreabilidade</CardTitle>
          <CardDescription className="text-brand-begeSuave">
            Visualize todo o histórico de movimentação dos produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-brand-marrom bg-brand-mel">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-brand-trufa">Produto</TableHead>
                  <TableHead className="text-brand-trufa">Lote</TableHead>
                  <TableHead className="text-brand-trufa">Data Produção</TableHead>
                  <TableHead className="text-brand-trufa">Data Validade</TableHead>
                  <TableHead className="text-brand-trufa">Status</TableHead>
                  <TableHead className="text-brand-trufa">Localização Atual</TableHead>
                  <TableHead className="text-brand-trufa">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotesFiltrados.map((lote) => {
                  const status = getStatusLote(lote);
                  return (
                    <TableRow key={lote.id}>
                      <TableCell className="font-medium text-brand-trufa">{lote.produtos?.nome}</TableCell>
                      <TableCell className="text-brand-trufa">{lote.codigo_lote}</TableCell>
                      <TableCell className="text-brand-trufa">{new Date(lote.data_producao).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-brand-trufa">{new Date(lote.data_validade).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(status)}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-brand-trufa">{getLocalizacaoAtual(lote)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLoteSelecionado(lote.id)}
                          className="border-brand-marrom text-brand-trufa hover:bg-brand-cremeEscuro"
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
        <Card className="bg-brand-doceLeite border-brand-marrom">
          <CardHeader>
            <CardTitle className="text-brand-begeSuave">Detalhes de Rastreabilidade</CardTitle>
            <CardDescription className="text-brand-begeSuave">
              Lote: {lotes.find(l => l.id === loteSelecionado)?.codigo_lote}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-brand-marrom bg-brand-mel">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-brand-trufa">Data</TableHead>
                    <TableHead className="text-brand-trufa">Evento</TableHead>
                    <TableHead className="text-brand-trufa">Responsável</TableHead>
                    <TableHead className="text-brand-trufa">Quantidade</TableHead>
                    <TableHead className="text-brand-trufa">Localização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Evento de produção */}
                  {(() => {
                    const lote = lotes.find(l => l.id === loteSelecionado);
                    if (!lote) return null;
                    
                    return (
                      <TableRow>
                        <TableCell className="text-brand-trufa">{new Date(lote.data_producao).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="font-medium text-brand-trufa">Produção Finalizada</TableCell>
                        <TableCell className="text-brand-trufa">{lote.responsavel}</TableCell>
                        <TableCell className="text-brand-trufa">{lote.quantidade_produzida} unidades</TableCell>
                        <TableCell className="text-brand-trufa">Fábrica</TableCell>
                      </TableRow>
                    );
                  })()}
                  
                  {/* Eventos de distribuição */}
                  {distribuicoesDoLote.map((distribuicao) => (
                    <TableRow key={distribuicao.id}>
                      <TableCell className="text-brand-trufa">{new Date(distribuicao.data_distribuicao).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="font-medium text-brand-trufa">Saída para Distribuição</TableCell>
                      <TableCell className="text-brand-trufa">{distribuicao.responsavel_distribuicao}</TableCell>
                      <TableCell className="text-brand-trufa">{distribuicao.quantidade_distribuida} unidades</TableCell>
                      <TableCell className="text-brand-trufa">{distribuicao.distribuidores?.nome}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setLoteSelecionado(null)}
                className="border-brand-marrom text-brand-trufa hover:bg-brand-cremeEscuro"
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
