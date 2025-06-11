
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface ProducaoData {
  id: string;
  numeroLote: string;
  produto: string;
  sabor: string;
  quantidadeProduzida: number;
  dataFabricacao: string;
  dataValidade: string;
  notaFiscal: string;
  distribuidor: string;
}

const produtos = [
  'Pão de Mel',
  'Alfajor'
];
const sabor= [
  'Brigadeiro',
  'Creme de Nozes',
  'Doce de Leite',
];

const distribuidores = [
  'Distribuidora São Paulo',
  'Distribuidora Rio de Janeiro',
  'Distribuidora Minas Gerais',
  'Distribuidora Sul'
];

export const GerenciamentoProducao = () => {
  const [producoes, setProducoes] = useState<ProducaoData[]>([]);
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
    distribuidor: ''
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
      distribuidor: ''
    });
    setEditingId(null);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.numeroLote) errors.push('Número do Lote');
    if (!formData.produto) errors.push('Produto');
    if (!formData.sabor) errors.push('Sabor');
    if (!formData.quantidadeProduzida) errors.push('Quantidade Produzida');
    if (!formData.dataFabricacao) errors.push('Data de Fabricação');
    if (!formData.dataValidade) errors.push('Data de Validade');
    
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    const novaProducao: ProducaoData = {
      id: editingId || Date.now().toString(),
      numeroLote: formData.numeroLote,
      produto: formData.produto,
      sabor: formData.sabor,
      quantidadeProduzida: parseInt(formData.quantidadeProduzida),
      dataFabricacao: formData.dataFabricacao,
      dataValidade: formData.dataValidade,
      notaFiscal: formData.notaFiscal,
      distribuidor: formData.distribuidor
    };

    if (editingId) {
      setProducoes(prev => prev.map(p => p.id === editingId ? novaProducao : p));
      toast({
        title: "Produção atualizada",
        description: "Os dados da produção foram atualizados com sucesso."
      });
    } else {
      setProducoes(prev => [...prev, novaProducao]);
      toast({
        title: "Produção salva",
        description: "Nova produção cadastrada com sucesso."
      });
    }

    resetForm();
  };

  const handleEdit = (producao: ProducaoData) => {
    setFormData({
      numeroLote: producao.numeroLote,
      produto: producao.produto,
      sabor: producao.sabor,
      quantidadeProduzida: producao.quantidadeProduzida.toString(),
      dataFabricacao: producao.dataFabricacao,
      dataValidade: producao.dataValidade,
      notaFiscal: producao.notaFiscal,
      distribuidor: producao.distribuidor
    });
    setEditingId(producao.id);
  };

  const handleDelete = (id: string) => {
    setProducoes(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Produção excluída",
      description: "A produção foi removida com sucesso."
    });
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <Card className="sweet-card bg-brand-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            🏭 {editingId ? 'Editar Produção' : 'Nova Produção'}
          </CardTitle>
          <CardDescription>
            {editingId ? 'Atualize os dados da produção' : 'Registre uma nova produção de doces'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="numeroLote">Número do Lote *</Label>
              <Input
                id="numeroLote"
                value={formData.numeroLote}
                onChange={(e) => setFormData(prev => ({ ...prev, numeroLote: e.target.value }))}
                placeholder="Ex: LOT001"
                className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="produto">Nome do Produto *</Label>
              <Select value={formData.produto} onValueChange={(value) => setFormData(prev => ({ ...prev, produto: value }))}>
                <SelectTrigger className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none">
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
                <SelectContent className="bg-brand-yellow-100">
                  {produtos.map(produto => (
                    <SelectItem className="bg-brand-yellow-50" key={produto} value={produto}>{produto} </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sabor">Sabor</Label>
              <Select value={formData.sabor} onValueChange={(value) => setFormData(prev => ({ ...prev, sabor: value }))}>
                <SelectTrigger className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none">
                  <SelectValue placeholder="Selecione o sabor" />
                </SelectTrigger>
                <SelectContent className="bg-brand-yellow-100">
                  {sabor.map(sabor => (
                    <SelectItem className="bg-brand-yellow-50" key={sabor} value={sabor}>{sabor} </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade Produzida *</Label>
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
              <Label htmlFor="dataFabricacao">Data de Fabricação *</Label>
              <Input
                id="dataFabricacao"
                type="date"
                value={formData.dataFabricacao}
                onChange={(e) => setFormData(prev => ({ ...prev, dataFabricacao: e.target.value }))}
                className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataValidade">Data de Validade *</Label>
              <Input
                id="dataValidade"
                type="date"
                value={formData.dataValidade}
                onChange={(e) => setFormData(prev => ({ ...prev, dataValidade: e.target.value }))}
                className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notaFiscal">Nota Fiscal</Label>
              <Input
                id="notaFiscal"
                value={formData.notaFiscal}
                onChange={(e) => setFormData(prev => ({ ...prev, notaFiscal: e.target.value }))}
                placeholder="Ex: NF-001"
                className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="distribuidor">Distribuidor</Label>
              <Select value={formData.distribuidor} onValueChange={(value) => setFormData(prev => ({ ...prev, distribuidor: value }))}>
                <SelectTrigger className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none">
                  <SelectValue placeholder="Selecione o distribuidor" />
                </SelectTrigger>
                <SelectContent className="bg-brand-yellow-100">
                  {distribuidores.map(distribuidor => (
                    <SelectItem className="bg-brand-yellow-50" key={distribuidor} value={distribuidor}>{distribuidor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 flex gap-4 pt-4">
              <Button type="submit" className="sweet-button flex-1 bg-primaria text-brand-yellow-300 hover:bg-orange-900">
                {editingId ? '📝 Atualizar Produção' : '💾 Salvar Produção'}
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
      <Card className="sweet-card  bg-brand-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            📋 Produções Cadastradas
          </CardTitle>
          <CardDescription>
            Lista de todas as produções registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {producoes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sweet-gold-600">Nenhuma produção cadastrada ainda.</p>
              <p className="text-sm text-sweet-gold-500">Cadastre sua primeira produção usando o formulário acima.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Sabor</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Data Fab.</TableHead>
                  <TableHead>Data Val.</TableHead>
                  <TableHead>Distribuidor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {producoes.map((producao) => (
                  <TableRow key={producao.id}>
                    <TableCell className="font-medium">{producao.numeroLote}</TableCell>
                    <TableCell>{producao.produto}</TableCell>
                    <TableCell>{producao.sabor}</TableCell>
                    <TableCell>{producao.quantidadeProduzida}</TableCell>
                    <TableCell>{new Date(producao.dataFabricacao).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(producao.dataValidade).toLocaleDateString()}</TableCell>
                    <TableCell>{producao.distribuidor}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(producao)}
                          className="border-sweet-gold-300 hover:bg-sweet-gold-100"
                        >
                          ✏️
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(producao.id)}
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
