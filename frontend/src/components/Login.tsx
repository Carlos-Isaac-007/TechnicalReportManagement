import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for demo purposes
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0057D9] to-[#003A8C]">
      <div className="bg-white rounded-lg shadow-2xl p-10 w-full max-w-md">
        {/* Company Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-[#0057D9] rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-3xl">CM</span>
          </div>
          <h1 className="text-center text-[#2B2B2B] mb-2">
            Sistema de Gestão de Relatórios Técnicos
          </h1>
          <p className="text-sm text-gray-500">CM Reports</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Utilizador</Label>
            <Input
              id="username"
              type="text"
              placeholder="Insira o seu nome de utilizador"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Palavra-passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Insira a sua palavra-passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#0057D9] hover:bg-[#003A8C] text-white transition-colors"
          >
            Entrar
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            Carlos Mateus Comércio e Serviços, Lda – 2025
          </p>
        </div>
      </div>
    </div>
  );
}
