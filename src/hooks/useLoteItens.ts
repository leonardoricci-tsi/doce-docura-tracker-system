import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type LoteItem = Tables<'lote_itens'>;
type LoteItemInsert = TablesInsert<'lote_itens'>;

export const useLoteItens = (loteId?: string) => {
  return useQuery({
    queryKey: ['lote-itens', loteId],
    queryFn: async () => {
      if (!loteId) return [];
      
      const { data, error } = await supabase
        .from('lote_itens')
        .select(`
          *,
          produtos (
            nome,
            tipo,
            sabor
          )
        `)
        .eq('lote_id', loteId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!loteId,
  });
};

export const useCreateLoteItens = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itens: LoteItemInsert[]) => {
      const { data, error } = await supabase
        .from('lote_itens')
        .insert(itens)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lote-itens'] });
    },
  });
};

export const useDeleteLoteItens = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (loteId: string) => {
      const { error } = await supabase
        .from('lote_itens')
        .delete()
        .eq('lote_id', loteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lote-itens'] });
    },
  });
};