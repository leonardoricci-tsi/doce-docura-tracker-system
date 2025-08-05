import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useProducts, useCreateProduct } from '@/hooks/useProducts';
import { useLotesProducao, useCreateLoteProducao, useDeleteLoteProducao } from '@/hooks/useLotesProducao';
import { useCreateLoteItens } from '@/hooks/useLoteItens';
import { useDistribuidores } from '@/hooks/useDistribuidores';

const tiposDisponiveis = ['Pão de mel', 'Alfajor'];

const saboresPorTipo = {
  'Pão de mel': ['Doce de Leite', 'Brigadeiro', 'Creme de Nozes', 'Trufado'],
  'Alfajor': ['Doce de Leite']
};

interface ProdutoItem {
  id: string;
  tipoProduto: string;
  sabor: string;
  quantidade: number;
}

export const GerenciamentoProducao = () => {
  const { data: produtos = [] } = useProducts();
  const { data: lotes = [] } = useLotesProducao();
  const { data: distribuidores = [] } = useDistribuidores();
  const createProductMutation = useCreateProduct();
  const createLoteMutation = useCreateLoteProducao();
  const createLoteItensMutation = useCreateLoteItens();
  const deleteLoteMutation = useDeleteLoteProducao();
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    numeroLote: '',
    dataFabricacao: '',
    dataValidade: '',
    notaFiscal: '',
    responsavel: ''
  });

  const [produtoAtual, setProdutoAtual] = useState({
    tipoProduto: '',
    sabor: '',
    quantidade: ''
  });

  const [produtosDoLote, setProdutosDoLote] = useState<ProdutoItem[]>([]);

  const resetForm = () => {
    setFormData({
      numeroLote: '',
      dataFabricacao: '',
      dataValidade: '',
      notaFiscal: '',
      responsavel: ''
    });
    setProdutoAtual({
      tipoProduto: '',
      sabor: '',
      quantidade: ''
    });
    setProdutosDoLote([]);
    setEditingId(null);
  };

  const adicionarProduto = async () => {
    if (!produtoAtual.tipoProduto || !produtoAtual.sabor || !produtoAtual.quantidade) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos do produto",
        variant: "destructive"
      });
      return;
    }

    try {
      // Criar o produto no banco
      const novoProduto = {
        nome: `${produtoAtual.tipoProduto} ${produtoAtual.sabor}`,
        tipo: produtoAtual.tipoProduto,
        sabor: produtoAtual.sabor
      };
      
      const produtoSalvo = await createProductMutation.mutateAsync(novoProduto);

      // Adicionar à lista de produtos do lote
      const novoItem: ProdutoItem = {
        id: produtoSalvo.id,
        tipoProduto: produtoAtual.tipoProduto,
        sabor: produtoAtual.sabor,
        quantidade: parseInt(produtoAtual.quantidade)
      };

      setProdutosDoLote(prev => [...prev, novoItem]);
      setProdutoAtual({
        tipoProduto: '',
        sabor: '',
        quantidade: ''
      });

      toast({
        title: "Produto adicionado",
        description: "Produto adicionado ao lote com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar produto",
        variant: "destructive"
      });
    }
  };

  const removerProduto = (index: number) => {
    setProdutosDoLote(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.numeroLote) errors.push('Número do Lote');
    if (!formData.dataFabricacao) errors.push('Data de Fabricação');
    if (!formData.dataValidade) errors.push('Data de Validade');
    if (!formData.responsavel) errors.push('Responsável');
    if (produtosDoLote.length === 0) errors.push('Pelo menos um produto');
    
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

    try {
      // Criar o lote de produção
      const novoLote = {
        codigo_lote: formData.numeroLote,
        data_producao: formData.dataFabricacao,
        data_validade: formData.dataValidade,
        nota_fiscal: formData.notaFiscal || null,
        responsavel: formData.responsavel,
        observacoes: `Produtos: ${produtosDoLote.map(p => `${p.tipoProduto} ${p.sabor} (${p.quantidade})`).join(', ')}`,
        status: 'ativo'
      };

      const loteSalvo = await createLoteMutation.mutateAsync(novoLote);

      // Criar os itens do lote
      const itensDoLote = produtosDoLote.map(produto => ({
        lote_id: loteSalvo.id,
        produto_id: produto.id,
        quantidade_produzida: produto.quantidade
      }));

      await createLoteItensMutation.mutateAsync(itensDoLote);

      toast({
        title: "Produção salva",
        description: "Nova produção cadastrada com sucesso."
      });

      resetForm();
    } catch (error: any) {
      console.error('Erro ao salvar produção:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar a produção. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lote de produção?')) {
      try {
        await deleteLoteMutation.mutateAsync(id);
        toast({
          title: "Lote excluído",
          description: "Lote de produção excluído com sucesso."
        });
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message || "Erro ao excluir o lote. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  const getTotalQuantidade = (lote: any) => {
    return lote.lote_itens?.reduce((total: number, item: any) => total + item.quantidade_produzida, 0) || 0;
  };

  const getProdutosString = (lote: any) => {
    if (!lote.lote_itens || lote.lote_itens.length === 0) return 'N/A';
    return lote.lote_itens.map((item: any) => 
      `${item.produtos?.tipo || ''} ${item.produtos?.sabor || ''} (${item.quantidade_produzida})`
    ).join(', ');
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <Card className="sweet-card bg-brand-brown-200 border-brand-brown-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-brown-800">
            🏭 {editingId ? 'Editar Produção' : 'Nova Produção'}
          </CardTitle>
          <CardDescription className="text-brand-brown-700">
            {editingId ? 'Atualize os dados da produção' : 'Registre uma nova produção de doces com múltiplos produtos'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados do Lote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="numeroLote" className="text-brand-brown-800">Número do Lote *</Label>
                <Input
                  id="numeroLote"
                  value={formData.numeroLote}
                  onChange={(e) => setFormData(prev => ({ ...prev, numeroLote: e.target.value }))}
                  placeholder="Ex: LOT001"
                  className="bg-brand-yellow-100 text-brand-brown-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel" className="text-brand-brown-800">Responsável *</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsavel: e.target.value }))}
                  placeholder="Nome do responsável pela produção"
                  className="bg-brand-yellow-100 text-brand-brown-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFabricacao" className="text-brand-brown-800">Data de Fabricação *</Label>
                <Input
                  id="dataFabricacao"
                  type="date"
                  value={formData.dataFabricacao}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataFabricacao: e.target.value }))}
                  className="bg-brand-yellow-100 text-brand-brown-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataValidade" className="text-brand-brown-800">Data de Validade *</Label>
                <Input
                  id="dataValidade"
                  type="date"
                  value={formData.dataValidade}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataValidade: e.target.value }))}
                  className="bg-brand-yellow-100 text-brand-brown-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notaFiscal" className="text-brand-brown-800">Nota Fiscal</Label>
                <Input
                  id="notaFiscal"
                  value={formData.notaFiscal}
                  onChange={(e) => setFormData(prev => ({ ...prev, notaFiscal: e.target.value }))}
                  placeholder="Ex: NF-001"
                  className="bg-brand-yellow-100 text-brand-brown-800"
                />
              </div>
            </div>

            {/* Adicionar Produtos */}
            <div className="border-t border-brand-chocolate pt-6">
              <h3 className="text-lg font-semibold text-brand-brown-800 mb-4">Produtos do Lote</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <Label className="text-brand-brown-800">Tipo de Produto *</Label>
                  <Select value={produtoAtual.tipoProduto} onValueChange={(value) => setProdutoAtual(prev => ({ ...prev, tipoProduto: value, sabor: '' }))}>
                    <SelectTrigger className="bg-brand-yellow-100 text-brand-brown-800">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-brand-yellow-100">
                      {tiposDisponiveis.map(tipo => (
                        <SelectItem className="bg-brand-yellow-50" key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-brand-brown-800">Sabor *</Label>
                  <Select 
                    value={produtoAtual.sabor} 
                    onValueChange={(value) => setProdutoAtual(prev => ({ ...prev, sabor: value }))}
                    disabled={!produtoAtual.tipoProduto}
                  >
                    <SelectTrigger className="bg-brand-yellow-100 text-brand-brown-800">
                      <SelectValue placeholder={produtoAtual.tipoProduto ? "Selecione o sabor" : "Primeiro selecione o tipo"} />
                    </SelectTrigger>
                    <SelectContent className="bg-brand-yellow-100">
                      {produtoAtual.tipoProduto && saboresPorTipo[produtoAtual.tipoProduto as keyof typeof saboresPorTipo]?.map(sabor => (
                        <SelectItem className="bg-brand-yellow-50" key={sabor} value={sabor}>{sabor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-brand-brown-800">Quantidade *</Label>
                  <Input
                    type="number"
                    value={produtoAtual.quantidade}
                    onChange={(e) => setProdutoAtual(prev => ({ ...prev, quantidade: e.target.value }))}
                    placeholder="Ex: 100"
                    className="bg-brand-yellow-100 text-brand-brown-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-brand-brown-800">&nbsp;</Label>
                  <Button 
                    type="button" 
                    onClick={adicionarProduto}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={createProductMutation.isPending}
                  >
                    {createProductMutation.isPending ? '⏳' : '➕ Adicionar'}
                  </Button>
                </div>
              </div>

              {/* Lista de Produtos Adicionados */}
              {produtosDoLote.length > 0 && (
                <div className="bg-brand-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-brand-brown-800 mb-3">Produtos adicionados:</h4>
                  <div className="space-y-2">
                    {produtosDoLote.map((produto, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-brand-chocolate">
                        <span className="text-brand-brown-800">
                          {produto.tipoProduto} {produto.sabor} - {produto.quantidade} unidades
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => removerProduto(index)}
                          className="border-red-300 hover:bg-red-100 text-red-600"
                        >
                          🗑️
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="sweet-button flex-1 bg-primaria text-brand-yellow-300 hover:bg-orange-900"
                disabled={createLoteMutation.isPending || createLoteItensMutation.isPending}
              >
                {createLoteMutation.isPending || createLoteItensMutation.isPending ? '⏳ Salvando...' : '💾 Salvar Produção'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm} className="border-sweet-cream-400">
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="sweet-card bg-brand-brown-200 border-brand-brown-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-brown-800">
            📋 Produções Cadastradas
          </CardTitle>
          <CardDescription className="text-brand-brown-700">
            Lista de todas as produções registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-brand-brown-700">Nenhuma produção cadastrada ainda.</p>
              <p className="text-sm text-brand-brown-600">Cadastre sua primeira produção usando o formulário acima.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-brand-chocolate">
                  <TableHead className="text-brand-brown-800">Lote</TableHead>
                  <TableHead className="text-brand-brown-800">Produtos</TableHead>
                  <TableHead className="text-brand-brown-800">Qtd Total</TableHead>
                  <TableHead className="text-brand-brown-800">Data Fab.</TableHead>
                  <TableHead className="text-brand-brown-800">Data Val.</TableHead>
                  <TableHead className="text-brand-brown-800">Responsável</TableHead>
                  <TableHead className="text-brand-brown-800">Status</TableHead>
                  <TableHead className="text-brand-brown-800">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotes.map((lote) => (
                  <TableRow key={lote.id}>
                    <TableCell className="font-medium text-brand-brown-800">{lote.codigo_lote}</TableCell>
                    <TableCell className="text-brand-brown-800 max-w-xs truncate" title={getProdutosString(lote)}>
                      {getProdutosString(lote)}
                    </TableCell>
                    <TableCell className="text-brand-brown-800">{getTotalQuantidade(lote)}</TableCell>
                    <TableCell className="text-brand-brown-800">{new Date(lote.data_producao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-brand-brown-800">{new Date(lote.data_validade).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-brand-brown-800">{lote.responsavel}</TableCell>
                    <TableCell className="text-brand-brown-800">
                      <span className={`px-2 py-1 rounded-full text-xs ${lote.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {lote.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(lote.id)}
                          className="border-red-300 hover:bg-red-100 text-red-600"
                          disabled={deleteLoteMutation.isPending}
                        >
                          {deleteLoteMutation.isPending ? '⏳' : '🗑️'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};