
import { useState } from 'react';
import { LoginScreen } from '@/components/LoginScreen';
import { FabricaDashboard } from '@/components/FabricaDashboard';
import { DistribuidorDashboard } from '@/components/DistribuidorDashboard';

export type UserRole = 'fabrica' | 'distribuidor' | null;

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<string>('');

  const handleLogin = (role: UserRole, username: string) => {
    setUserRole(role);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser('');
  };

  if (!userRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen sweet-gradient">
      {userRole === 'fabrica' ? (
        <FabricaDashboard currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <DistribuidorDashboard currentUser={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
