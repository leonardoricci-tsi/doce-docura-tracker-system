import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAnalyticsStats = (tipoFiltro?: string) => {
  return useQuery({
    queryKey: ['analytics-stats', tipoFiltro],
    queryFn: async () => {
      // Buscar lotes ativos com seus itens
      let query = supabase
        .from('lotes_producao')
        .select(`
          *,
          lote_itens (
            quantidade_produzida,
            produtos (
              tipo
            )
          )
        `)
        .eq('status', 'ativo');
      
      if (tipoFiltro && tipoFiltro !== 'geral') {
        query = query.eq('lote_itens.produtos.tipo', tipoFiltro);
      }
      
      const { data: lotes, error: lotesError } = await query;
      
      if (lotesError) throw lotesError;

      // Buscar total de produtos produzidos
      const totalProduzidos = lotes?.reduce((acc, lote) => {
        return acc + (lote.lote_itens?.reduce((itemAcc, item) => itemAcc + item.quantidade_produzida, 0) || 0);
      }, 0) || 0;

      // Buscar distribuidores
      const { data: distribuidores, error: distError } = await supabase
        .from('distribuidores')
        .select('id');
      
      if (distError) throw distError;

      // Calcular produtos próximos ao vencimento (30 dias)
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 30);
      
      const produtosProximosVencimento = lotes?.filter(lote => 
        new Date(lote.data_validade) <= dataLimite
      ) || [];

      return {
        lotesAtivos: lotes?.length || 0,
        totalProduzidos,
        distribuidores: distribuidores?.length || 0,
        proximosVencimento: produtosProximosVencimento.length
      };
    },
  });
};

export const useProducaoPorSabor = (tipoFiltro?: string) => {
  return useQuery({
    queryKey: ['producao-por-sabor', tipoFiltro],
    queryFn: async () => {
      let query = supabase
        .from('lote_itens')
        .select(`
          quantidade_produzida,
          produtos (
            sabor,
            tipo
          )
        `);
      
      if (tipoFiltro && tipoFiltro !== 'geral') {
        query = query.eq('produtos.tipo', tipoFiltro);
      }
      
      const { data: itens, error } = await query;
      
      if (error) throw error;

      // Agrupar por sabor
      const saboresMap = new Map();
      itens?.forEach(item => {
        const sabor = item.produtos?.sabor || 'Sem sabor';
        const quantidade = saboresMap.get(sabor) || 0;
        saboresMap.set(sabor, quantidade + item.quantidade_produzida);
      });

      return Array.from(saboresMap.entries()).map(([sabor, quantidade]) => ({
        sabor,
        quantidade
      }));
    },
  });
};

export const useDistribuicaoPorRegiao = (tipoFiltro?: string) => {
  return useQuery({
    queryKey: ['distribuicao-por-regiao', tipoFiltro],
    queryFn: async () => {
      let query = supabase
        .from('distribuicoes')
        .select(`
          quantidade_distribuida,
          distribuidor_id,
          distribuidores (
            nome
          ),
          lotes_producao!inner (
            produtos (
              tipo
            )
          )
        `);
      
      if (tipoFiltro && tipoFiltro !== 'geral') {
        query = query.eq('lotes_producao.produtos.tipo', tipoFiltro);
      }
      
      const { data: distribuicoes, error } = await query;
      
      if (error) throw error;

      // Agrupar por distribuidor (usando como região por enquanto)
      const regiaoMap = new Map();
      distribuicoes?.forEach(dist => {
        const regiao = dist.distribuidores?.nome || 'Sem região';
        const volume = regiaoMap.get(regiao) || 0;
        regiaoMap.set(regiao, volume + dist.quantidade_distribuida);
      });

      return Array.from(regiaoMap.entries()).map(([regiao, volume]) => ({
        regiao,
        volume
      }));
    },
  });
};

export const useProdutosProximosVencimento = (tipoFiltro?: string) => {
  return useQuery({
    queryKey: ['produtos-proximos-vencimento', tipoFiltro],
    queryFn: async () => {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 30);
      
      let query = supabase
        .from('lotes_producao')
        .select(`
          *,
          lote_itens (
            produtos (
              nome,
              tipo,
              sabor
            )
          ),
          distribuicoes (
            distribuidores (
              nome
            )
          )
        `)
        .lte('data_validade', dataLimite.toISOString().split('T')[0])
        .eq('status', 'ativo')
        .order('data_validade', { ascending: true });
      
      if (tipoFiltro && tipoFiltro !== 'geral') {
        query = query.eq('lote_itens.produtos.tipo', tipoFiltro);
      }
      
        const { data: lotes, error } = await query;
      
      if (error) throw error;

      return lotes?.map(lote => {
        const hoje = new Date();
        const dataValidade = new Date(lote.data_validade);
        const diasRestantes = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        
        // Pegar o primeiro distribuidor (pode haver vários)
        const distribuidor = lote.distribuicoes?.[0]?.distribuidores?.nome || 'Sem distribuidor';
        
        // Montar nome do produto baseado nos itens do lote
        const produtoNome = lote.lote_itens && lote.lote_itens.length > 0 
          ? lote.lote_itens.map(item => `${item.produtos?.tipo || ''} ${item.produtos?.sabor || ''}`.trim()).join(', ')
          : 'Produtos diversos';
        
        return {
          numeroLote: lote.codigo_lote,
          produto: produtoNome,
          dataValidade: lote.data_validade,
          distribuidor,
          diasRestantes
        };
      }) || [];
    },
  });
};