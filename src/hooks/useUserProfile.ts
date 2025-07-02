
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

        // Buscar o perfil existente
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('tipo_usuario, email, nome')
          .eq('id', user.id)
          .maybeSingle();

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
          // Se não encontrou perfil, algo deu errado no cadastro
          // Não devemos criar perfil automaticamente aqui, pois pode sobrescrever dados importantes
          console.error('Perfil não encontrado para usuário autenticado:', user.id);
          toast({
            title: "Erro",
            description: "Perfil do usuário não encontrado. Entre em contato com o suporte.",
            variant: "destructive"
          });
          
          // Fazer logout do usuário já que não tem perfil válido
          await supabase.auth.signOut();
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
