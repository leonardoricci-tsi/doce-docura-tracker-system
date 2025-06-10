
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

interface DistribuicaoData {
  id: string;
  produto: string;
  numeroLote: string;
  distribuidor: string;
  regioes: string[];
  pdvs: string[];
}

const produtos = [
  'Brigadeiro',
  'Beijinho',
  'Quindim',
  'Bem-casado',
  'Trufa',
  'Brownie'
];

const lotesDisponiveis = [
  { lote: 'LOT001', produto: 'Brigadeiro' },
  { lote: 'LOT002', produto: 'Beijinho' },
  { lote: 'LOT003', produto: 'Quindim' },
  { lote: 'LOT004', produto: 'Bem-casado' }
];

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

export const RegistroDistribuicao = ({ distribuidorName }: RegistroDistribuicaoProps) => {
  const [distribuicoes, setDistribuicoes] = useState<DistribuicaoData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    produto: '',
    numeroLote: '',
    regioes: [] as string[],
    pdvs: ''
  });

  const resetForm = () => {
    setFormData({
      produto: '',
      numeroLote: '',
      regioes: [],
      pdvs: ''
    });
    setEditingId(null);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.produto) errors.push('Produto');
    if (!formData.numeroLote) errors.push('Número do Lote');
    if (formData.regioes.length === 0) errors.push('Regiões de Entrega');
    if (!formData.pdvs.trim()) errors.push('Pontos de Venda');
    
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

    const pdvsArray = formData.pdvs.split(',').map(pdv => pdv.trim()).filter(pdv => pdv);

    const novaDistribuicao: DistribuicaoData = {
      id: editingId || Date.now().toString(),
      produto: formData.produto,
      numeroLote: formData.numeroLote,
      distribuidor: distribuidorName,
      regioes: formData.regioes,
      pdvs: pdvsArray
    };

    if (editingId) {
      setDistribuicoes(prev => prev.map(d => d.id === editingId ? novaDistribuicao : d));
      toast({
        title: "Distribuição atualizada",
        description: "Os dados da distribuição foram atualizados com sucesso."
      });
    } else {
      setDistribuicoes(prev => [...prev, novaDistribuicao]);
      toast({
        title: "Distribuição salva",
        description: "Nova distribuição cadastrada com sucesso."
      });
    }

    resetForm();
  };

  const handleEdit = (distribuicao: DistribuicaoData) => {
    setFormData({
      produto: distribuicao.produto,
      numeroLote: distribuicao.numeroLote,
      regioes: distribuicao.regioes,
      pdvs: distribuicao.pdvs.join(', ')
    });
    setEditingId(distribuicao.id);
  };

  const handleDelete = (id: string) => {
    setDistribuicoes(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Distribuição excluída",
      description: "A distribuição foi removida com sucesso."
    });
  };

  const handleRegiaoChange = (regiao: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, regioes: [...prev.regioes, regiao] }));
    } else {
      setFormData(prev => ({ ...prev, regioes: prev.regioes.filter(r => r !== regiao) }));
    }
  };

  const lotesDosProdutos = lotesDisponiveis.filter(lote => 
    !formData.produto || lote.produto === formData.produto
  );

  return (
    <div className="space-y-8">
      {/* Form */}
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
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
                <Label htmlFor="produto">Nome do Produto *</Label>
                <Select 
                  value={formData.produto} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, produto: value, numeroLote: '' }));
                  }}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-sweet-pink-300">
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map(produto => (
                      <SelectItem key={produto} value={produto}>{produto}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroLote">Número do Lote *</Label>
                <Select 
                  value={formData.numeroLote} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, numeroLote: value }))}
                  disabled={!formData.produto}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-sweet-pink-300">
                    <SelectValue placeholder={formData.produto ? "Selecione o lote" : "Primeiro selecione o produto"} />
                  </SelectTrigger>
                  <SelectContent>
                    {lotesDosProdutos.map(item => (
                      <SelectItem key={item.lote} value={item.lote}>
                        {item.lote} - {item.produto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Distribuidor</Label>
                <Input
                  value={distribuidorName}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdvs">Pontos de Venda (PDVs) *</Label>
                <Input
                  id="pdvs"
                  value={formData.pdvs}
                  onChange={(e) => setFormData(prev => ({ ...prev, pdvs: e.target.value }))}
                  placeholder="Ex: Padaria da Esquina, Supermercado XYZ"
                  className="focus:ring-2 focus:ring-sweet-pink-300"
                />
                <p className="text-xs text-sweet-gold-600">Separe múltiplos PDVs por vírgula</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Regiões de Entrega *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 border border-sweet-cream-300 rounded-lg">
                {regioesDisponiveis.map(regiao => (
                  <div key={regiao} className="flex items-center space-x-2">
                    <Checkbox
                      id={regiao}
                      checked={formData.regioes.includes(regiao)}
                      onCheckedChange={(checked) => handleRegiaoChange(regiao, checked as boolean)}
                    />
                    <Label 
                      htmlFor={regiao} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {regiao}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.regioes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.regioes.map(regiao => (
                    <Badge key={regiao} variant="secondary" className="bg-sweet-pink-100 text-sweet-pink-800">
                      {regiao}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="sweet-button flex-1">
                {editingId ? '📝 Atualizar Distribuição' : '💾 Salvar Distribuição'}
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
      <Card className="sweet-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-gold-800">
            📋 Distribuições Cadastradas
          </CardTitle>
          <CardDescription>
            Lista de todas as distribuições registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {distribuicoes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sweet-gold-600">Nenhuma distribuição cadastrada ainda.</p>
              <p className="text-sm text-sweet-gold-500">Cadastre sua primeira distribuição usando o formulário acima.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Distribuidor</TableHead>
                    <TableHead>Regiões</TableHead>
                    <TableHead>PDVs</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distribuicoes.map((distribuicao) => (
                    <TableRow key={distribuicao.id}>
                      <TableCell className="font-medium">{distribuicao.produto}</TableCell>
                      <TableCell>{distribuicao.numeroLote}</TableCell>
                      <TableCell>{distribuicao.distribuidor}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {distribuicao.regioes.map((regiao, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {regiao}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {distribuicao.pdvs.map((pdv, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {pdv}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(distribuicao)}
                            className="border-sweet-gold-300 hover:bg-sweet-gold-100"
                          >
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(distribuicao.id)}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
