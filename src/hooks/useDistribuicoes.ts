
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Distribuicao = Tables<'distribuicoes'>;
type DistribuicaoInsert = TablesInsert<'distribuicoes'>;

export const useDistribuicoes = () => {
  return useQuery({
    queryKey: ['distribuicoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('distribuicoes')
        .select(`
          *,
          lotes_producao (
            codigo_lote,
            produtos (
              nome
            )
          ),
          distribuidores (
            nome
          )
        `)
        .order('data_distribuicao', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateDistribuicao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (distribuicao: DistribuicaoInsert) => {
      const { data, error } = await supabase
        .from('distribuicoes')
        .insert(distribuicao)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distribuicoes'] });
      queryClient.invalidateQueries({ queryKey: ['lotes-producao'] });
    },
  });
};
