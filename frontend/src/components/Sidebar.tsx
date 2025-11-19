import { Home, FileText, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import {ImageWithFallback} from './ImageWithFallback';
interface SidebarProps {
  currentPage: 'home' | 'reports' | 'technicians' | 'statistics' | 'settings';
  setCurrentPage: (page: 'home' | 'reports' | 'technicians' | 'statistics' | 'settings') => void;
  onLogout: () => void;
  userRole: string; // 🆕 Nova prop para controlar visibilidade
}

export default function Sidebar({ currentPage, setCurrentPage, onLogout, userRole }: SidebarProps) {
  // 🆕 Menu items baseados no role do usuário
  const menuItems = [
    { 
      id: 'home' as const, 
      label: 'Início', 
      icon: Home,
      visible: true // Todos veem
    },
    { 
      id: 'reports' as const, 
      label: 'Relatórios', 
      icon: FileText,
      visible: true// Apenas technicians e admin
    },
    { 
      id: 'technicians' as const, 
      label: 'Técnicos', 
      icon: Users,
      visible: userRole === 'admin' // Apenas admin
    },
    { 
      id: 'statistics' as const, 
      label: 'Estatísticas', 
      icon: BarChart3,
      visible: true // Todos veem
    },
    // { 
    //   id: 'settings' as const, 
    //   label: 'Definições', 
    //   icon: Settings,
    //   visible: true // Todos veem
    // },
  ];

  // 🆕 Filtra apenas os itens visíveis para este role
  const visibleMenuItems = menuItems.filter(item => item.visible);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            <ImageWithFallback
             src ="/logo.png"
             />
          </div>
          <div>
            <h2 className="text-[#2B2B2B]">CM Reports</h2>
            <p className="text-xs text-gray-500">Sistema de Relatórios</p>
            {/* 🆕 Badge do role */}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#E6F0FF] text-[#0057D9]'
                  : 'text-[#2B2B2B] hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );
}