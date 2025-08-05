
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '@/pages/Index';
import { useAuth } from '@/hooks/useAuth';
import { LoginTabs } from './auth/LoginTabs';
import { SignupForm } from './auth/SignupForm';

interface LoginScreenProps {
  onLogin: (role: UserRole, username: string) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { isLoading, loginWithEmail, signUpWithInvitation } = useAuth();

  const handleLogin = (email: string, password: string, role: UserRole) => {
    loginWithEmail(email, password, role, onLogin);
  };

  const handleSignup = (email: string, password: string, invitationCode: string, nome: string, telefone: string) => {
    signUpWithInvitation(email, password, invitationCode, nome, telefone, () => setIsSigningUp(false));
  };

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center p-4 primaria">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="https://docedocura.com/wp-content/uploads/2024/08/Logo-Home-Doce-Docura.svg" alt="" className="w-40 h-20" />
          </div>
          <p style={{ color: '#5c3a21' }} className="text-lg">
            Rastreio sem complicação <br />Com eficiência e organização!
          </p>
        </div>

        <Card className="brand-card animate-fade-in bg-brand-yellow-600">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-brand-brown-800 font-bold">
              {isSigningUp ? 'Criar Conta' : 'Bem-vindo'}
            </CardTitle>
            <CardDescription className="text-brand-brown-900 font-semibold">
              {isSigningUp ? 'Cadastre-se com um código de convite' : 'Selecione seu tipo de acesso'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSigningUp ? (
              <>
                <LoginTabs onLogin={handleLogin} isLoading={isLoading} />
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
              <SignupForm
                onSignup={handleSignup}
                onBackToLogin={() => setIsSigningUp(false)}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
