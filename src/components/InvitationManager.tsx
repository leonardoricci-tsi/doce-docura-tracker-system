
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  tipo_usuario: string;
}

export const InvitationManager = () => {
  const [email, setEmail] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<string>('');
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
    if (!email || !tipoUsuario) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o e-mail e selecione o tipo de usuário.",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Chamando edge function com:', { email, tipo_usuario: tipoUsuario });
      
      // Call edge function to create invitation and send email
      const { data, error } = await supabase.functions.invoke('send-invitation', {
        body: {
          email,
          tipo_usuario: tipoUsuario,
        }
      });

      console.log('Resposta da edge function:', { data, error });

      if (error) {
        console.error('Erro ao criar convite:', error);
        toast({
          title: "Erro ao criar convite",
          description: error.message || "Erro ao criar convite. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      if (data?.error) {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Convite enviado!",
        description: `Convite enviado com sucesso para ${email}! Verifique a caixa de entrada.`,
      });

      setEmail('');
      setTipoUsuario('');
      await fetchInvitations();
    } catch (error) {
      console.error('Erro ao criar convite:', error);
      toast({
        title: "Erro ao criar convite",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvitation = async (invitationId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('sign_up_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) {
        console.error('Erro ao deletar convite:', error);
        toast({
          title: "Erro ao excluir convite",
          description: "Não foi possível excluir o convite. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Convite excluído!",
        description: `O convite para ${email} foi removido com sucesso.`,
      });

      await fetchInvitations();
    } catch (error) {
      console.error('Erro ao deletar convite:', error);
      toast({
        title: "Erro ao excluir convite",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-yellow-400 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-2xl text-brand-brown-800">Gerenciar Convites</CardTitle>
            <CardDescription className="text-brand-brown-600">
              Crie convites para permitir que novos usuários se cadastrem no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateInvitation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-brand-brown-700">E-mail do Convidado</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite o e-mail da pessoa"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-brand-yellow-100 text-brand-brown-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo-usuario" className="text-brand-brown-700">Tipo de Usuário</Label>
                <Select value={tipoUsuario} onValueChange={setTipoUsuario} disabled={isLoading}>
                  <SelectTrigger className="bg-brand-yellow-100 text-brand-brown-700">
                    <SelectValue placeholder="Selecione o tipo de usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fabrica">🏭 Fábrica</SelectItem>
                    <SelectItem value="distribuidor">🚛 Distribuidor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isLoading || !tipoUsuario} className="brand-button-primary">
                {isLoading ? 'Criando...' : 'Criar Convite'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-brand-brown-800">Convites Enviados</CardTitle>
            <CardDescription className="text-brand-brown-600">
              Lista de todos os convites criados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invitations.length === 0 ? (
                <p className="text-brand-brown-600">Nenhum convite criado ainda.</p>
              ) : (
                invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-4 border border-brand-yellow-200 rounded-lg bg-brand-yellow-50"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-brand-brown-800">{invitation.email}</p>
                      <p className="text-sm text-brand-brown-600">
                        Tipo: <span className="font-medium">
                          {invitation.tipo_usuario === 'fabrica' ? '🏭 Fábrica' : '🚛 Distribuidor'}
                        </span>
                      </p>
                      <p className="text-sm text-brand-brown-600">
                        Código: <span className="font-mono">{invitation.code}</span>
                      </p>
                      <p className="text-xs text-brand-brown-500">
                        Criado em: {new Date(invitation.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      {invitation.consumed_at && (
                        <p className="text-xs text-brand-brown-500">
                          Usado em: {new Date(invitation.consumed_at).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invitation.consumed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {invitation.consumed ? 'Usado' : 'Pendente'}
                      </span>
                      {!invitation.consumed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInvitation(invitation.id, invitation.email)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1"
                          title="Excluir convite"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
