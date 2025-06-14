
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Distribuidor = Tables<'distribuidores'>;
type DistribuidorInsert = TablesInsert<'distribuidores'>;

export const useDistribuidores = () => {
  return useQuery({
    queryKey: ['distribuidores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('distribuidores')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateDistribuidor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (distribuidor: DistribuidorInsert) => {
      const { data, error } = await supabase
        .from('distribuidores')
        .insert(distribuidor)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distribuidores'] });
    },
  });
};
