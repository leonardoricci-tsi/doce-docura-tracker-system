
import { ReactNode } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserRole } from '@/pages/Index';

interface RoleBasedAccessProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleBasedAccess = ({ 
  allowedRoles, 
  children, 
  fallback = null 
}: RoleBasedAccessProps) => {
  const { userProfile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-brown-800"></div>
      </div>
    );
  }

  if (!userProfile) {
    return fallback;
  }

  const userRole = userProfile.tipo_usuario as UserRole;
  
  if (!allowedRoles.includes(userRole)) {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-brand-brown-800 mb-2">
            Acesso Restrito
          </h2>
          <p className="text-brand-brown-600">
            Você não tem permissão para acessar esta funcionalidade.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
