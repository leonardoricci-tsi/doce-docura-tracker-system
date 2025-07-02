
import { useState, useEffect } from 'react';
import { LoginScreen } from '@/components/LoginScreen';
import { FabricaDashboard } from '@/components/FabricaDashboard';
import { DistribuidorDashboard } from '@/components/DistribuidorDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'fabrica' | 'distribuidor' | null;

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const { userProfile, isLoading } = useUserProfile();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session?.user?.email) {
        setCurrentUser(session.user.email);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setCurrentUser(session?.user?.email || '');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (role: UserRole, username: string) => {
    setCurrentUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser('');
  };

  // Mostra tela de loading enquanto verifica autenticação e perfil
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-yellow-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-brown-800 mx-auto mb-4"></div>
          <p className="text-brand-brown-800 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostra tela de login
  if (!isAuthenticated || !userProfile) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Renderiza dashboard baseado no tipo de usuário do banco
  const userRole = userProfile.tipo_usuario as UserRole;

  return (
    <div className="min-h-screen bg-brand-yellow-400">
      {userRole === 'fabrica' ? (
        <FabricaDashboard currentUser={currentUser} onLogout={handleLogout} />
      ) : userRole === 'distribuidor' ? (
        <DistribuidorDashboard currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <div className="min-h-screen bg-brand-yellow-400 flex items-center justify-center">
          <div className="text-center">
            <p className="text-brand-brown-800 text-lg">Tipo de usuário não reconhecido.</p>
            <button 
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-brand-brown-800 text-white rounded hover:bg-brand-brown-900"
            >
              Fazer Login Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
