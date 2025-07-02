
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<{ tipo_usuario: string; email: string; nome?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('Nenhum usuário autenticado encontrado');
          setIsLoading(false);
          return;
        }

        console.log('Usuário autenticado:', user.id, user.email);

        // Tentar buscar o perfil existente
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('tipo_usuario, email, nome')
          .eq('id', user.id)
          .maybeSingle(); // Usando maybeSingle() em vez de single() para evitar erro quando não há dados

        if (error) {
          console.error('Erro ao buscar perfil:', error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar o perfil do usuário.",
            variant: "destructive"
          });
        } else if (profile) {
          console.log('Perfil encontrado:', profile);
          setUserProfile(profile);
        } else {
          // Se não encontrou perfil, criar um padrão
          console.log('Perfil não encontrado, criando perfil padrão');
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              tipo_usuario: 'distribuidor'
            })
            .select('tipo_usuario, email, nome')
            .maybeSingle();

          if (insertError) {
            console.error('Erro ao criar perfil:', insertError);
            toast({
              title: "Erro",
              description: "Não foi possível criar o perfil do usuário.",
              variant: "destructive"
            });
          } else if (newProfile) {
            console.log('Novo perfil criado:', newProfile);
            setUserProfile(newProfile);
          }
        }
      } catch (error) {
        console.error('Erro inesperado ao buscar perfil:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro inesperado ao carregar o perfil.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  return { userProfile, isLoading };
};
