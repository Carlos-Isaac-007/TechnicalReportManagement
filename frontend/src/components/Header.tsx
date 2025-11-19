import { Bell, User } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

// 🆕 Interface para as props do usuário
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface HeaderProps {
  user?: User; // 🆕 Prop opcional para o usuário logado
}

export default function Header({ user }: HeaderProps) {
  // 🆕 Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // 🆕 Função para traduzir o role
  const getRoleLabel = (role: string) => {
    const roles = {
      'admin': 'Administrador',
      'technician': 'Técnico'
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#2B2B2B]">Sistema de Gestão de Relatórios Técnicos</h1>
          <p className="text-sm text-gray-500">Carlos Mateus Comércio e Serviços, Lda</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-[#2B2B2B]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <Avatar>
              <AvatarFallback 
                className={`text-white ${
                  user?.role === 'admin' 
                    ? 'bg-purple-500' 
                    : 'bg-blue-500'
                }`}
              >
                {user ? getInitials(user.name) : <User className="w-5 h-5" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-[#2B2B2B] font-medium">
                {user ? user.name : 'Utilizador'}
              </p>
              <p className="text-xs text-gray-500">
                {user ? getRoleLabel(user.role) : 'A carregar...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🆕 Barra de status do sistema */}
      <div className="flex items-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Sistema Online</span>
        </div>
        {user && (
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
            }`}></div>
            <span className="text-gray-600">
              {user.role === 'admin' ? 'Modo Administrador' : 'Modo Técnico'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}