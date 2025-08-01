import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFinancialAnalytics = () => {
  return useQuery({
    queryKey: ['financial-analytics'],
    queryFn: async () => {
      // Buscar distribuições para calcular métricas financeiras
      const { data: distribuicoes, error: distribError } = await supabase
        .from('distribuicoes')
        .select(`
          *,
          lotes_producao (
            produtos (
              preco_unitario
            )
          )
        `);

      if (distribError) throw distribError;

      // Calcular receita baseada nas distribuições
      const receitaTotal = distribuicoes?.reduce((acc, dist) => {
        const preco = dist.lotes_producao?.produtos?.preco_unitario || 10; // preço padrão
        return acc + (dist.quantidade_distribuida * preco);
      }, 0) || 0;

      // Simular outros dados financeiros baseados na receita
      const custoTotal = receitaTotal * 0.6; // 60% da receita
      const lucroTotal = receitaTotal - custoTotal;
      const margemLucro = receitaTotal > 0 ? (lucroTotal / receitaTotal) * 100 : 0;

      return {
        receita: receitaTotal,
        custos: custoTotal,
        lucro: lucroTotal,
        margem: margemLucro,
        numeroVendas: distribuicoes?.length || 0
      };
    },
  });
};

export const useOperationalAnalytics = () => {
  return useQuery({
    queryKey: ['operational-analytics'],
    queryFn: async () => {
      // Buscar lotes de produção para métricas operacionais
      const { data: lotes, error } = await supabase
        .from('lotes_producao')
        .select(`
          *,
          produtos (
            nome,
            tipo
          )
        `)
        .order('data_producao', { ascending: false });

      if (error) throw error;

      const totalLotes = lotes?.length || 0;
      const lotesAtivos = lotes?.filter(l => l.status === 'ativo').length || 0;
      const producaoTotal = lotes?.reduce((acc, lote) => acc + lote.quantidade_produzida, 0) || 0;
      
      // Calcular eficiência baseada nos últimos 30 dias
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - 30);
      
      const lotesRecentes = lotes?.filter(l => new Date(l.data_producao) >= dataLimite) || [];
      const eficiencia = lotesRecentes.length > 0 ? 
        (lotesRecentes.filter(l => l.status === 'ativo').length / lotesRecentes.length) * 100 : 0;

      return {
        totalLotes,
        lotesAtivos,
        producaoTotal,
        eficiencia: Math.round(eficiencia),
        lotesRecentes: lotesRecentes.length
      };
    },
  });
};

export const useQualityAnalytics = () => {
  return useQuery({
    queryKey: ['quality-analytics'],
    queryFn: async () => {
      // Buscar lotes para análise de qualidade
      const { data: lotes, error } = await supabase
        .from('lotes_producao')
        .select(`
          *,
          produtos (
            nome
          )
        `)
        .order('data_producao', { ascending: false });

      if (error) throw error;

      const totalLotes = lotes?.length || 0;
      const lotesAprovados = lotes?.filter(l => l.status === 'ativo').length || 0;
      const lotesRejeitados = totalLotes - lotesAprovados;
      
      const taxaAprovacao = totalLotes > 0 ? (lotesAprovados / totalLotes) * 100 : 0;

      // Agrupar por produto para análise detalhada
      const produtoStats = lotes?.reduce((acc: any, lote) => {
        const produtoNome = lote.produtos?.nome || 'Desconhecido';
        if (!acc[produtoNome]) {
          acc[produtoNome] = { total: 0, aprovados: 0 };
        }
        acc[produtoNome].total += 1;
        if (lote.status === 'ativo') {
          acc[produtoNome].aprovados += 1;
        }
        return acc;
      }, {});

      const produtoList = Object.entries(produtoStats || {}).map(([nome, stats]: [string, any]) => ({
        produto: nome,
        testes: stats.total,
        aprovados: stats.aprovados,
        taxa: stats.total > 0 ? (stats.aprovados / stats.total) * 100 : 0
      }));

      return {
        totalLotes,
        lotesAprovados,
        lotesRejeitados,
        taxaAprovacao: Math.round(taxaAprovacao * 10) / 10,
        produtoStats: produtoList
      };
    },
  });
};