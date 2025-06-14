
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
      const { error } = await supabase.auth.signInWithPassword({
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
      const { error: signUpError } = await supabase.auth.signUp({
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
