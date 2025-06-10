
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/pages/Index';

interface LoginScreenProps {
  onLogin: (role: UserRole, username: string) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [fabricaEmail, setFabricaEmail] = useState('');
  const [fabricaPassword, setFabricaPassword] = useState('');
  const [distribuidorEmail, setDistribuidorEmail] = useState('');
  const [distribuidorPassword, setDistribuidorPassword] = useState('');
  const { toast } = useToast();

  const handleFabricaLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fabricaEmail || !fabricaPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar.",
        variant: "destructive"
      });
      return;
    }
    onLogin('fabrica', fabricaEmail);
  };

  const handleDistribuidorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!distribuidorEmail || !distribuidorPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar.",
        variant: "destructive"
      });
      return;
    }
    onLogin('distribuidor', distribuidorEmail);
  };

  return (
    <div className="min-h-screen sweet-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <span className="text-3xl">🍰</span>
          </div>
          <h1 className="text-4xl font-bold text-sweet-gold-800 mb-2">Doce Doçura</h1>
          <p className="text-sweet-gold-600">Sistema de Gerenciamento</p>
        </div>

        <Card className="sweet-card animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-sweet-gold-800">Bem-vindo</CardTitle>
            <CardDescription>Selecione seu tipo de acesso</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="fabrica" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="fabrica" className="flex items-center gap-2">
                  🏭 Fábrica
                </TabsTrigger>
                <TabsTrigger value="distribuidor" className="flex items-center gap-2">
                  🚛 Distribuidor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="fabrica">
                <form onSubmit={handleFabricaLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fabrica-email">E-mail</Label>
                    <Input
                      id="fabrica-email"
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={fabricaEmail}
                      onChange={(e) => setFabricaEmail(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-sweet-pink-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fabrica-password">Senha</Label>
                    <Input
                      id="fabrica-password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={fabricaPassword}
                      onChange={(e) => setFabricaPassword(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-sweet-pink-300"
                    />
                  </div>
                  <Button type="submit" className="w-full sweet-button py-6 text-lg">
                    🏭 Entrar como Fábrica
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="distribuidor">
                <form onSubmit={handleDistribuidorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="distribuidor-email">E-mail</Label>
                    <Input
                      id="distribuidor-email"
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={distribuidorEmail}
                      onChange={(e) => setDistribuidorEmail(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-sweet-pink-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distribuidor-password">Senha</Label>
                    <Input
                      id="distribuidor-password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={distribuidorPassword}
                      onChange={(e) => setDistribuidorPassword(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-sweet-pink-300"
                    />
                  </div>
                  <Button type="submit" className="w-full sweet-button py-6 text-lg">
                    🚛 Entrar como Distribuidor
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
