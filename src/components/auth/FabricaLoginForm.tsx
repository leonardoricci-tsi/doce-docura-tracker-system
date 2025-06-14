
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/pages/Index';

interface FabricaLoginFormProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
  isLoading: boolean;
}

export const FabricaLoginForm = ({ onLogin, isLoading }: FabricaLoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, 'fabrica');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fabrica-email" className="text-brand-brown-700">E-mail</Label>
        <Input
          id="fabrica-email"
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-brand-yellow-100 text-brand-brown-700 !placeholder-brand-brown-400 !ring-0 !ring-transparent !outline-none !border-brand-yellow-200 focus:!ring-0 focus:!outline-none focus:!border-brand-yellow-300"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fabrica-password" className="text-brand-brown-700">Senha</Label>
        <Input
          id="fabrica-password"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-brand-yellow-100 text-brand-brown-700 !placeholder-brand-brown-400 !ring-0 !ring-transparent !outline-none !border-brand-yellow-200 focus:!ring-0 focus:!outline-none focus:!border-brand-yellow-300"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full brand-button-primary py-6 text-lg bg-brand-brown-600 text-white hover:bg-brand-brown-700"
        disabled={isLoading}
      >
        🏭 Entrar como Fábrica
      </Button>
    </form>
  );
};
