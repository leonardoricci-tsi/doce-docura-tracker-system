
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignupFormProps {
  onSignup: (email: string, password: string, invitationCode: string, nome: string, telefone: string) => void;
  onBackToLogin: () => void;
  isLoading: boolean;
}

export const SignupForm = ({ onSignup, onBackToLogin, isLoading }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(email, password, invitationCode, nome, telefone);
  };

  const handleSuccess = () => {
    setEmail('');
    setPassword('');
    setInvitationCode('');
    setNome('');
    setTelefone('');
    onBackToLogin();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-nome" className="text-brand-brown-700">Nome Completo</Label>
        <Input
          id="signup-nome"
          type="text"
          placeholder="Digite seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="bg-brand-yellow-100 text-brand-brown-700 !placeholder-brand-brown-400 !ring-0 !ring-transparent !outline-none !border-brand-yellow-200 focus:!ring-0 focus:!outline-none focus:!border-brand-yellow-300"
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-telefone" className="text-brand-brown-700">Telefone</Label>
        <Input
          id="signup-telefone"
          type="tel"
          placeholder="(XX) XXXXX-XXXX"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="bg-brand-yellow-100 text-brand-brown-700 !placeholder-brand-brown-400 !ring-0 !ring-transparent !outline-none !border-brand-yellow-200 focus:!ring-0 focus:!outline-none focus:!border-brand-yellow-300"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-brand-brown-700">E-mail</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-brand-yellow-100 text-brand-brown-700 !placeholder-brand-brown-400 !ring-0 !ring-transparent !outline-none !border-brand-yellow-200 focus:!ring-0 focus:!outline-none focus:!border-brand-yellow-300"
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-brand-brown-700">Senha</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Digite uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-brand-yellow-100 text-brand-brown-700 !placeholder-brand-brown-400 !ring-0 !ring-transparent !outline-none !border-brand-yellow-200 focus:!ring-0 focus:!outline-none focus:!border-brand-yellow-300"
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="invitation-code" className="text-brand-brown-700">Código de Convite</Label>
        <Input
          id="invitation-code"
          type="text"
          placeholder="Digite o código do convite"
          value={invitationCode}
          onChange={(e) => setInvitationCode(e.target.value)}
          className="bg-brand-yellow-100 text-brand-brown-700 !placeholder-brand-brown-400 !ring-0 !ring-transparent !outline-none !border-brand-yellow-200 focus:!ring-0 focus:!outline-none focus:!border-brand-yellow-300"
          disabled={isLoading}
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full brand-button-primary py-6 text-lg bg-brand-brown-600 text-white hover:bg-brand-brown-700"
        disabled={isLoading}
      >
        ✨ Criar Conta
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onBackToLogin}
        className="w-full text-brand-brown-700 hover:text-brand-brown-800 hover:bg-brand-yellow-100"
        disabled={isLoading}
      >
        ← Voltar ao Login
      </Button>
    </form>
  );
};
