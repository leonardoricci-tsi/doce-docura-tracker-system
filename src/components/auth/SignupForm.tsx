
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignupFormProps {
  onSignup: (email: string, password: string, invitationCode: string) => void;
  onBackToLogin: () => void;
  isLoading: boolean;
}

export const SignupForm = ({ onSignup, onBackToLogin, isLoading }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(email, password, invitationCode);
  };

  const handleSuccess = () => {
    setEmail('');
    setPassword('');
    setInvitationCode('');
    onBackToLogin();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-brand-brown-800">E-mail</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        onClick={onBackToLogin}
        className="w-full text-brand-brown-800 hover:text-brand-brown-900 hover:bg-brand-yellow-100"
        disabled={isLoading}
      >
        ← Voltar ao Login
      </Button>
    </form>
  );
};
