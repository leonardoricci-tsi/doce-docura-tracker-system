
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useProducts, useCreateProduct } from '@/hooks/useProducts';
import { useLotesProducao, useCreateLoteProducao } from '@/hooks/useLotesProducao';
import { useDistribuidores } from '@/hooks/useDistribuidores';

const saboresDisponiveis = [
  'Brigadeiro',
  'Creme de Nozes',
  'Doce de Leite',
  'Leite Condensado',
  'Chocolate',
  'Tradicional'
];

export const GerenciamentoProducao = () => {
  const { data: produtos = [] } = useProducts();
  const { data: lotes = [] } = useLotesProducao();
  const { data: distribuidores = [] } = useDistribuidores();
  const createProductMutation = useCreateProduct();
  const createLoteMutation = useCreateLoteProducao();
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    numeroLote: '',
    produto: '',
    sabor: '',
    quantidadeProduzida: '',
    dataFabricacao: '',
    dataValidade: '',
    notaFiscal: '',
    responsavel: ''
  });

  const resetForm = () => {
    setFormData({
      numeroLote: '',
      produto: '',
      sabor: '',
      quantidadeProduzida: '',
      dataFabricacao: '',
      dataValidade: '',
      notaFiscal: '',
      responsavel: ''
    });
    setEditingId(null);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.numeroLote) errors.push('Número do Lote');
    if (!formData.produto) errors.push('Produto');
    if (!formData.quantidadeProduzida) errors.push('Quantidade Produzida');
    if (!formData.dataFabricacao) errors.push('Data de Fabricação');
    if (!formData.dataValidade) errors.push('Data de Validade');
    if (!formData.responsavel) errors.push('Responsável');
    
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
      // Primeiro, criar ou verificar se o produto existe
      let produtoSelecionado = produtos.find(p => p.id === formData.produto);
      
      if (!produtoSelecionado && formData.produto) {
        // Se não encontrar o produto pelo ID, verificar se é um novo produto
        const novoProduto = {
          nome: formData.produto,
          tipo: 'doce',
          sabor: formData.sabor || null,
          descricao: `Produto criado durante produção do lote ${formData.numeroLote}`,
          preco_unitario: null
        };
        
        produtoSelecionado = await createProductMutation.mutateAsync(novoProduto);
      }

      // Criar o lote de produção
      const novoLote = {
        produto_id: produtoSelecionado?.id || formData.produto,
        codigo_lote: formData.numeroLote,
        quantidade_produzida: parseInt(formData.quantidadeProduzida),
        data_producao: formData.dataFabricacao,
        data_validade: formData.dataValidade,
        nota_fiscal: formData.notaFiscal || null,
        responsavel: formData.responsavel,
        observacoes: formData.sabor ? `Sabor: ${formData.sabor}` : null,
        status: 'ativo'
      };

      await createLoteMutation.mutateAsync(novoLote);

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

  const handleEdit = (lote: any) => {
    setFormData({
      numeroLote: lote.codigo_lote,
      produto: lote.produto_id,
      sabor: lote.observacoes?.includes('Sabor:') ? lote.observacoes.split('Sabor: ')[1] : '',
      quantidadeProduzida: lote.quantidade_produzida.toString(),
      dataFabricacao: lote.data_producao,
      dataValidade: lote.data_validade,
      notaFiscal: lote.nota_fiscal || '',
      responsavel: lote.responsavel
    });
    setEditingId(lote.id);
  };

  const handleDelete = (id: string) => {
    // Por enquanto apenas alerta, implementar delete mutation se necessário
    toast({
      title: "Ação não disponível",
      description: "A exclusão de lotes será implementada posteriormente."
    });
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
            {editingId ? 'Atualize os dados da produção' : 'Registre uma nova produção de doces'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="numeroLote" className="text-brand-brown-800">Número do Lote *</Label>
              <Input
                id="numeroLote"
                value={formData.numeroLote}
                onChange={(e) => setFormData(prev => ({ ...prev, numeroLote: e.target.value }))}
                placeholder="Ex: LOT001"
                className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="produto" className="text-brand-brown-800">Nome do Produto *</Label>
              <Select value={formData.produto} onValueChange={(value) => setFormData(prev => ({ ...prev, produto: value }))}>
                <SelectTrigger className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none">
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
                <SelectContent className="bg-brand-yellow-100">
                  {produtos.map(produto => (
                    <SelectItem className="bg-brand-yellow-50" key={produto.id} value={produto.id}>{produto.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sabor" className="text-brand-brown-800">Sabor</Label>
              <Select value={formData.sabor} onValueChange={(value) => setFormData(prev => ({ ...prev, sabor: value }))}>
                <SelectTrigger className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none">
                  <SelectValue placeholder="Selecione o sabor" />
                </SelectTrigger>
                <SelectContent className="bg-brand-yellow-100">
                  {saboresDisponiveis.map(sabor => (
                    <SelectItem className="bg-brand-yellow-50" key={sabor} value={sabor}>{sabor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade" className="text-brand-brown-800">Quantidade Produzida *</Label>
              <Input
                id="quantidade"
                type="number"
                value={formData.quantidadeProduzida}
                onChange={(e) => setFormData(prev => ({ ...prev, quantidadeProduzida: e.target.value }))}
                placeholder="Ex: 100"
                className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFabricacao" className="text-brand-brown-800">Data de Fabricação *</Label>
              <Input
                id="dataFabricacao"
                type="date"
                value={formData.dataFabricacao}
                onChange={(e) => setFormData(prev => ({ ...prev, dataFabricacao: e.target.value }))}
                className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataValidade" className="text-brand-brown-800">Data de Validade *</Label>
              <Input
                id="dataValidade"
                type="date"
                value={formData.dataValidade}
                onChange={(e) => setFormData(prev => ({ ...prev, dataValidade: e.target.value }))}
                className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notaFiscal" className="text-brand-brown-800">Nota Fiscal</Label>
              <Input
                id="notaFiscal"
                value={formData.notaFiscal}
                onChange={(e) => setFormData(prev => ({ ...prev, notaFiscal: e.target.value }))}
                placeholder="Ex: NF-001"
                className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel" className="text-brand-brown-800">Responsável *</Label>
              <Input
                id="responsavel"
                value={formData.responsavel}
                onChange={(e) => setFormData(prev => ({ ...prev, responsavel: e.target.value }))}
                placeholder="Nome do responsável pela produção"
                className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
              />
            </div>

            <div className="md:col-span-2 flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="sweet-button flex-1 bg-primaria text-brand-yellow-300 hover:bg-orange-900"
                disabled={createLoteMutation.isPending || createProductMutation.isPending}
              >
                {createLoteMutation.isPending || createProductMutation.isPending ? '⏳ Salvando...' : (editingId ? '📝 Atualizar Produção' : '💾 Salvar Produção')}
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
                <TableRow>
                  <TableHead className="text-brand-brown-800">Lote</TableHead>
                  <TableHead className="text-brand-brown-800">Produto</TableHead>
                  <TableHead className="text-brand-brown-800">Quantidade</TableHead>
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
                    <TableCell className="text-brand-brown-800">{lote.produtos?.nome || 'N/A'}</TableCell>
                    <TableCell className="text-brand-brown-800">{lote.quantidade_produzida}</TableCell>
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
                          onClick={() => handleEdit(lote)}
                          className="border-brand-brown-400 hover:bg-brand-brown-100 text-brand-brown-800"
                        >
                          ✏️
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(lote.id)}
                          className="border-red-300 hover:bg-red-100 text-red-600"
                        >
                          🗑️
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
