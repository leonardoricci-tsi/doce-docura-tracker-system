import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { useLotesProducao } from '@/hooks/useLotesProducao';
import { useDistribuicoes, useCreateDistribuicao } from '@/hooks/useDistribuicoes';
import { useDistribuidores } from '@/hooks/useDistribuidores';

const regioesDisponiveis = [
  'Grande SP',
  'Interior de SP',
  'Sul de MG',
  'Centro RJ',
  'Zona Sul RJ',
  'Norte RJ',
  'BH',
  'Interior MG',
  'Sul do País',
  'Centro-Oeste'
];

interface RegistroDistribuicaoProps {
  distribuidorName: string;
}
function gerarNumeroLote() { //teste
  return "LOTE-TESTE-001";
}
const distribuidoresFixos = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000", // UUID válido
    nome: "Distribuidor Teste",
    responsavel: "João da Silva"
  }
];

const lotesFixos = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479", // UUID válido
    produto_id: "produto-uuid-1234", // Pode ser qualquer string aqui para teste
    codigo_lote: "LOTE-TESTE-001",
    produtos: {
      nome: "Produto Teste"
    }
  }
];

export const RegistroDistribuicao = ({ distribuidorName }: RegistroDistribuicaoProps) => {
  const { data: produtos = [] } = useProducts();
  // const { data: lotes = [] } = useLotesProducao();
  const lotes = lotesFixos;
  const { data: distribuicoes = [] } = useDistribuicoes();
  // const { data: distribuidores = [] } = useDistribuidores();
  const distribuidores = distribuidoresFixos;
  const createDistribuicaoMutation = useCreateDistribuicao();

  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    produto: '',
    numeroLote: '',
    regioes: [] as string[],
    pdvs: '',
    quantidade: ''
  });

  const resetForm = () => {
    setFormData({
      produto: '',
      numeroLote: '',
      regioes: [],
      pdvs: '',
      quantidade: ''
    });
    setEditingId(null);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.produto) errors.push('Produto');
    if (!formData.numeroLote) errors.push('Número do Lote');
    if (!formData.quantidade) errors.push('Quantidade');
    if (formData.regioes.length === 0) errors.push('Regiões de Entrega');
    if (!formData.pdvs.trim()) errors.push('Pontos de Venda');

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Preencha os campos: ${errors.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // const distribuidorAtual = distribuidores.find(d => d.nome === distribuidorName);
    const distribuidorAtual = distribuidores.find(d => d.nome === distribuidorName) || distribuidores[0];


    if (!distribuidorAtual) {
      toast({
        title: "Erro",
        description: "Distribuidor não encontrado",
        variant: "destructive"
      });
      return;
    }

    try {
      const novaDistribuicao = {
        lote_id: formData.numeroLote,
        distribuidor_id: distribuidorAtual.id,
        quantidade_distribuida: parseInt(formData.quantidade),
        data_distribuicao: new Date().toISOString().split('T')[0],
        responsavel_distribuicao: distribuidorAtual.responsavel || 'Sistema',
        observacoes: `Regiões: ${formData.regioes.join(', ')}. PDVs: ${formData.pdvs}`
      };

      await createDistribuicaoMutation.mutateAsync(novaDistribuicao);

      toast({
        title: "Distribuição salva",
        description: "Nova distribuição cadastrada com sucesso."
      });

      resetForm();

    } catch (error: any) {
      console.error('Erro ao salvar distribuição:', error);
      if (error.response) {
        console.error('Detalhes do erro:', error.response.data);
      } else if (error.message) {
        console.error('Mensagem do erro:', error.message);
      }
      toast({
        title: "Erro",
        description: "Erro ao salvar a distribuição. Tente novamente.",
        variant: "destructive"
      });
    }

  };

  const handleRegiaoChange = (regiao: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, regioes: [...prev.regioes, regiao] }));
    } else {
      setFormData(prev => ({ ...prev, regioes: prev.regioes.filter(r => r !== regiao) }));
    }
  };

  const lotesDosProdutos = lotes.filter(lote =>
    !formData.produto || lote.produto_id === formData.produto
  );



  return (
    <div className="space-y-8">
      <Card className="bg-brand-doceLeite border-brand-marrom">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-begeSuave font-bold">
            🚛 {editingId ? 'Editar Distribuição' : 'Nova Distribuição'}
          </CardTitle>
          <CardDescription>
            {editingId ? 'Atualize os dados da distribuição' : 'Registre uma nova distribuição de produtos'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="produto" className="text-brand-begeSuave">Nome do Produto *</Label>
                <Select

                  value={formData.produto}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, produto: value, numeroLote: '' }));
                  }}
                >
                  <SelectTrigger className="text-brand-trufa font-medium" >
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-mel border-0 focus:ring-0 focus:outline-none">
                    {produtos.map(produto => (
                      <SelectItem key={produto.id} value={produto.id}>{produto.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroLote" className="text-brand-begeSuave">Número do Lote *</Label>
                <Select
                  value={formData.numeroLote}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, numeroLote: value }))}
                  disabled={!formData.produto}
                >
                  <SelectTrigger className="text-brand-trufa font-medium ">
                    <SelectValue placeholder={formData.produto ? "Selecione o lote" : "Primeiro selecione o produto"} />
                  </SelectTrigger>
                  {/* <SelectContent className="bg-brand-mel border-0 focus:ring-0 focus:outline-none">
                    {lotesDosProdutos.map(lote => (
                      <SelectItem key={lote.id} value={lote.id}>
                        {lote.codigo_lote} - {lote.produtos?.nome}
                      </SelectItem>
                    ))}
                  </SelectContent> */}
                  <SelectContent className="bg-brand-mel border-0 focus:ring-0 focus:outline-none">
                    <SelectItem value="f47ac10b-58cc-4372-a567-0e02b2c3d479">
                      LOTE-TESTE-001 (simulado)
                    </SelectItem>
                  </SelectContent>

                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-brand-begeSuave">Distribuidor</Label>
                <Input
                  value="Distribuidor Teste"
                  disabled
                  className="bg-brand-cremeEscuro cursor-not-allowed text-brand-begeSuave"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade" className="text-brand-begeSuave">Quantidade a Distribuir *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantidade: e.target.value }))}
                  placeholder="Ex: 100"
                  className=" text-brand-trufa font-medium border-0 focus:ring-0 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdvs" className="text-brand-begeSuave">Pontos de Venda (PDVs) *</Label>
                <Input
                  id="pdvs"
                  value={formData.pdvs}
                  onChange={(e) => setFormData(prev => ({ ...prev, pdvs: e.target.value }))}
                  placeholder="Ex: Padaria da Esquina, Supermercado XYZ"
                  className="text-brand-trufa font-medium border-0 focus:ring-0 focus:outline-none"
                />
                <p className="text-xs text-brand-begeSuave">Separe múltiplos PDVs por vírgula</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-brand-begeSuave">Regiões de Entrega *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 border border-brand-marrom rounded-lg bg-brand-chocolate">
                {regioesDisponiveis.map(regiao => (
                  <div key={regiao} className="flex items-center space-x-2">
                    <Checkbox
                      id={regiao}
                      checked={formData.regioes.includes(regiao)}
                      onCheckedChange={(checked) => handleRegiaoChange(regiao, checked as boolean)}
                    />
                    <Label htmlFor={regiao} className="text-sm font-normal cursor-pointer text-brand-begeSuave">
                      {regiao}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.regioes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.regioes.map(regiao => (
                    <Badge key={regiao} variant="secondary" className="bg-brand-rosaClaro text-brand-begeSuave">
                      {regiao}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="bg-brand-marrom hover:bg-brand-marromEscuro text-white flex-1"
                disabled={createDistribuicaoMutation.isPending}
              >
                {createDistribuicaoMutation.isPending ? '⏳ Salvando...' : '💾 Salvar Distribuição'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm} className="border-brand-marrom text-brand-begeSuave">
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-brand-doceLeite border-brand-marrom">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-begeSuave">
            📋 Distribuições Cadastradas
          </CardTitle>
          <CardDescription className="text-brand-begeSuave">
            Lista de todas as distribuições registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {distribuicoes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-brand-begeSuave">Nenhuma distribuição cadastrada ainda.</p>
              <p className="text-sm text-brand-begeSuave">Cadastre sua primeira distribuição usando o formulário acima.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-brand-begeSuave">Produto</TableHead>
                    <TableHead className="text-brand-begeSuave">Lote</TableHead>
                    <TableHead className="text-brand-begeSuave">Quantidade</TableHead>
                    <TableHead className="text-brand-begeSuave">Data</TableHead>
                    <TableHead className="text-brand-begeSuave">Distribuidor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distribuicoes.map((distribuicao) => (
                    <TableRow key={distribuicao.id}>
                      <TableCell className="font-medium text-brand-begeSuave">
                        {distribuicao.lotes_producao?.produtos?.nome}
                      </TableCell>
                      <TableCell className="text-brand-begeSuave">{distribuicao.lotes_producao?.codigo_lote}</TableCell>
                      <TableCell className="text-brand-begeSuave">{distribuicao.quantidade_distribuida}</TableCell>
                      <TableCell className="text-brand-begeSuave">{new Date(distribuicao.data_distribuicao).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-brand-begeSuave">{distribuicao.distribuidores?.nome}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
