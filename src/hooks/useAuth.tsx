
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/pages/Index';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loginWithEmail = async (
    email: string,
    password: string,
    role: UserRole,
    onSuccess: (role: UserRole, username: string) => void
  ) => {
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Verificar se o perfil existe, se não, criar
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('tipo_usuario')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Perfil não existe, criar um novo
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email || email,
              tipo_usuario: role || 'distribuidor'
            });

          if (insertError) {
            console.error('Erro ao criar perfil:', insertError);
          }
        }
      }

      onSuccess(role, email);
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithInvitation = async (
    email: string,
    password: string,
    invitationCode: string,
    onSuccess: () => void
  ) => {
    if (!email || !password || !invitationCode) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Verificar se o código de convite é válido
      const { data: invitation, error: invitationError } = await supabase
        .from('sign_up_invitations')
        .select('*')
        .eq('email', email)
        .eq('code', invitationCode)
        .eq('consumed', false)
        .single();

      if (invitationError || !invitation) {
        toast({
          title: "Código inválido",
          description: "Código de convite inválido ou já utilizado.",
          variant: "destructive"
        });
        return;
      }

      // Criar o usuário
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            tipo_usuario: invitation.tipo_usuario
          }
        }
      });

      if (signUpError) {
        toast({
          title: "Erro no cadastro",
          description: signUpError.message,
          variant: "destructive"
        });
        return;
      }

      // Criar perfil do usuário
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            tipo_usuario: invitation.tipo_usuario
          });

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
        }
      }

      // Marcar o convite como consumido
      await supabase
        .from('sign_up_invitations')
        .update({ 
          consumed: true, 
          consumed_at: new Date().toISOString() 
        })
        .eq('id', invitation.id);

      toast({
        title: "Cadastro realizado!",
        description: `Sua conta foi criada como ${invitation.tipo_usuario === 'fabrica' ? 'Fábrica' : 'Distribuidor'}. Verifique seu e-mail para confirmar a conta.`,
      });

      onSuccess();

    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    loginWithEmail,
    signUpWithInvitation
  };
};
