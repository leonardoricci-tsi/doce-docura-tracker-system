
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Invitation {
  id: string;
  email: string;
  code: string;
  consumed: boolean;
  created_at: string;
  consumed_at: string | null;
}

export const InvitationManager = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const { toast } = useToast();

  const generateInvitationCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('sign_up_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar convites:', error);
        return;
      }

      setInvitations(data || []);
    } catch (error) {
      console.error('Erro ao buscar convites:', error);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Campo obrigatório",
        description: "Digite um e-mail para criar o convite.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const code = generateInvitationCode();
      
      const { error } = await supabase
        .from('sign_up_invitations')
        .insert({
          email,
          code
        });

      if (error) {
        toast({
          title: "Erro ao criar convite",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Convite criado!",
        description: `Convite para ${email} criado com código: ${code}`,
      });

      setEmail('');
      await fetchInvitations();
    } catch (error) {
      toast({
        title: "Erro ao criar convite",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gerenciar Convites</CardTitle>
          <CardDescription>
            Crie convites para permitir que novos usuários se cadastrem no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateInvitation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail do Convidado</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite o e-mail da pessoa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Convite'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Convites Enviados</CardTitle>
          <CardDescription>
            Lista de todos os convites criados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invitations.length === 0 ? (
              <p className="text-muted-foreground">Nenhum convite criado ainda.</p>
            ) : (
              invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{invitation.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Código: <span className="font-mono">{invitation.code}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Criado em: {new Date(invitation.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    {invitation.consumed_at && (
                      <p className="text-xs text-muted-foreground">
                        Usado em: {new Date(invitation.consumed_at).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invitation.consumed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {invitation.consumed ? 'Usado' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
