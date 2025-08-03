
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type LoteProducao = Tables<'lotes_producao'>;
type LoteProducaoInsert = TablesInsert<'lotes_producao'>;

export const useLotesProducao = () => {
  return useQuery({
    queryKey: ['lotes-producao'],
    queryFn: async () => {
      const { data, error } = await supabase
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
      return data;
    },
  });
};

export const useCreateLoteProducao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lote: LoteProducaoInsert) => {
      const { data, error } = await supabase
        .from('lotes_producao')
        .insert(lote)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes-producao'] });
    },
  });
};

export const useDeleteLoteProducao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (loteId: string) => {
      // Primeiro, excluir todas as distribuições relacionadas
      const { error: distError } = await supabase
        .from('distribuicoes')
        .delete()
        .eq('lote_id', loteId);
      
      if (distError) throw distError;

      // Depois, excluir o lote de produção
      const { error } = await supabase
        .from('lotes_producao')
        .delete()
        .eq('id', loteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes-producao'] });
    },
  });
};
