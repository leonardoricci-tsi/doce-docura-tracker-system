
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
      console.log('Tentando fazer login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('Login realizado com sucesso:', data.user?.id);

      // Verificar se o perfil existe no banco de dados
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('tipo_usuario')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Erro ao buscar perfil:', profileError);
          toast({
            title: "Erro de acesso",
            description: "Erro ao verificar permissões do usuário.",
            variant: "destructive"
          });
          await supabase.auth.signOut();
          return;
        }

        // Se o perfil não existir, o usuário não tem acesso autorizado
        if (!profile) {
          console.log('Usuário sem perfil autorizado tentou fazer login');
          toast({
            title: "Acesso negado",
            description: "Usuário não autorizado. Entre em contato com o administrador para obter acesso.",
            variant: "destructive"
          });
          await supabase.auth.signOut();
          return;
        }

        console.log('Perfil encontrado, tipo de usuário:', profile.tipo_usuario);
      }

      onSuccess(role, email);
    } catch (error) {
      console.error('Erro inesperado no login:', error);
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
      console.log('=== INICIO DO SIGNUP ===');
      console.log('Email:', email);
      console.log('Código:', invitationCode);
      
      // Verificar se o código de convite é válido
      console.log('Buscando convite...');
      const { data: invitation, error: invitationError } = await supabase
        .from('sign_up_invitations')
        .select('*')
        .eq('email', email)
        .eq('code', invitationCode)
        .eq('consumed', false)
        .maybeSingle();

      console.log('Resultado da busca do convite:', { invitation, invitationError });

      if (invitationError || !invitation) {
        console.error('Código de convite inválido:', invitationError);
        toast({
          title: "Código inválido",
          description: "Código de convite inválido ou já utilizado.",
          variant: "destructive"
        });
        return;
      }

      console.log('Código de convite válido, tipo de usuário:', invitation.tipo_usuario);

      // Criar o usuário
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            tipo_usuario: invitation.tipo_usuario,
            email: email
          }
        }
      });

      if (signUpError) {
        console.error('Erro no cadastro:', signUpError);
        toast({
          title: "Erro no cadastro",
          description: signUpError.message,
          variant: "destructive"
        });
        return;
      }

      console.log('Usuário criado:', data.user?.id);

      // Criar perfil com o tipo de usuário correto do convite
      if (data.user) {
        console.log('Criando perfil com tipo:', invitation.tipo_usuario);
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            tipo_usuario: invitation.tipo_usuario
          });

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          toast({
            title: "Erro no cadastro",
            description: "Erro ao criar perfil do usuário.",
            variant: "destructive"
          });
          return;
        } else {
          console.log('Perfil criado com sucesso com tipo:', invitation.tipo_usuario);
        }
      }

      // Marcar o convite como consumido
      const { error: updateError } = await supabase
        .from('sign_up_invitations')
        .update({ 
          consumed: true, 
          consumed_at: new Date().toISOString() 
        })
        .eq('id', invitation.id);

      if (updateError) {
        console.error('Erro ao marcar convite como consumido:', updateError);
      } else {
        console.log('Convite marcado como consumido');
      }

      toast({
        title: "Cadastro realizado!",
        description: `Sua conta foi criada como ${invitation.tipo_usuario === 'fabrica' ? 'Fábrica' : 'Distribuidor'}. Verifique seu e-mail para confirmar a conta.`,
      });

      onSuccess();

    } catch (error) {
      console.error('Erro inesperado no cadastro:', error);
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
