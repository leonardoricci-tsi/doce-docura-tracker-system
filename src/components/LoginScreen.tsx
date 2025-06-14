
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/pages/Index';
import { supabase } from '@/integrations/supabase/client';

interface LoginScreenProps {
  onLogin: (role: UserRole, username: string) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [fabricaEmail, setFabricaEmail] = useState('');
  const [fabricaPassword, setFabricaPassword] = useState('');
  const [distribuidorEmail, setDistribuidorEmail] = useState('');
  const [distribuidorPassword, setDistribuidorPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFabricaLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fabricaEmail || !fabricaPassword) {
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
        email: fabricaEmail,
        password: fabricaPassword,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      onLogin('fabrica', fabricaEmail);
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

  const handleDistribuidorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!distribuidorEmail || !distribuidorPassword) {
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
        email: distribuidorEmail,
        password: distribuidorPassword,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      onLogin('distribuidor', distribuidorEmail);
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !invitationCode) {
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
        .eq('email', signupEmail)
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
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`
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
        description: "Sua conta foi criada com sucesso. Verifique seu e-mail para confirmar a conta.",
      });

      // Limpar formulário
      setSignupEmail('');
      setSignupPassword('');
      setInvitationCode('');
      setIsSigningUp(false);

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

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center p-4 primaria">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="https://docedocura.com/wp-content/uploads/2024/08/Logo-Home-Doce-Docura.svg" alt="" className="w-40 h-20" />
          </div>
          <p className="text-sweet-gold-600 text-lg">Sistema de Gerenciamento</p>
        </div>

        <Card className="brand-card animate-fade-in bg-brand-yellow-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-brand-brown-800">
              {isSigningUp ? 'Criar Conta' : 'Bem-vindo'}
            </CardTitle>
            <CardDescription className="text-brand-brown-900">
              {isSigningUp ? 'Cadastre-se com um código de convite' : 'Selecione seu tipo de acesso'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSigningUp ? (
              <>
                <Tabs defaultValue="fabrica" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-yellow-100 text-orange-950">
                    <TabsTrigger
                      value="fabrica"
                      className="flex items-center gap-2 transform transition duration-200 data-[state=active]:scale-105 data-[state=active]:bg-brand-yellow-300 data-[state=active]:text-brand-brown-800"
                    >
                      🏭 Fábrica
                    </TabsTrigger>
                    <TabsTrigger
                      value="distribuidor"
                      className="flex items-center gap-2 transform transition duration-200 data-[state=active]:scale-105 data-[state=active]:bg-brand-yellow-300 data-[state=active]:text-brand-brown-800"
                    >
                      🚛 Distribuidor
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="fabrica">
                    <form onSubmit={handleFabricaLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fabrica-email" className="text-brand-brown-800">E-mail</Label>
                        <Input
                          id="fabrica-email"
                          type="email"
                          placeholder="Digite seu e-mail"
                          value={fabricaEmail}
                          onChange={(e) => setFabricaEmail(e.target.value)}
                          className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fabrica-password" className="text-brand-brown-800">Senha</Label>
                        <Input
                          id="fabrica-password"
                          type="password"
                          placeholder="Digite sua senha"
                          value={fabricaPassword}
                          onChange={(e) => setFabricaPassword(e.target.value)}
                          className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
                          disabled={isLoading}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full brand-button-primary py-6 text-lg bg-primario text-brand-yellow-300 hover:bg-orange-900"
                        disabled={isLoading}
                      >
                        🏭 Entrar como Fábrica
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="distribuidor">
                    <form onSubmit={handleDistribuidorLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="distribuidor-email" className="text-brand-brown-800">E-mail</Label>
                        <Input
                          id="distribuidor-email"
                          type="email"
                          placeholder="Digite seu e-mail"
                          value={distribuidorEmail}
                          onChange={(e) => setDistribuidorEmail(e.target.value)}
                          className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="distribuidor-password" className="text-brand-brown-800">Senha</Label>
                        <Input
                          id="distribuidor-password"
                          type="password"
                          placeholder="Digite sua senha"
                          value={distribuidorPassword}
                          onChange={(e) => setDistribuidorPassword(e.target.value)}
                          className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
                          disabled={isLoading}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full brand-button-primary py-6 text-lg bg-primario text-brand-yellow-300 hover:bg-orange-900"
                        disabled={isLoading}
                      >
                        🚛 Entrar como Distribuidor
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setIsSigningUp(true)}
                    className="text-brand-brown-800 hover:text-brand-brown-900 hover:bg-brand-yellow-100"
                  >
                    Não tem conta? Cadastre-se
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-brand-brown-800">E-mail</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-brand-brown-800">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Digite uma senha"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invitation-code" className="text-brand-brown-800">Código de Convite</Label>
                  <Input
                    id="invitation-code"
                    type="text"
                    placeholder="Digite o código do convite"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    className="bg-brand-yellow-100 text-brand-brown-800 !placeholder-[#8a7760] !ring-0 !ring-transparent !outline-none !border-none focus:!ring-0 focus:!outline-none focus:!border-none"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full brand-button-primary py-6 text-lg bg-primario text-brand-yellow-300 hover:bg-orange-900"
                  disabled={isLoading}
                >
                  ✨ Criar Conta
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsSigningUp(false)}
                  className="w-full text-brand-brown-800 hover:text-brand-brown-900 hover:bg-brand-yellow-100"
                  disabled={isLoading}
                >
                  ← Voltar ao Login
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
