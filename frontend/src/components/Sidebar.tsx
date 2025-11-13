import { Home, FileText, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  currentPage: 'home' | 'reports' | 'technicians' | 'statistics' | 'settings';
  setCurrentPage: (page: 'home' | 'reports' | 'technicians' | 'statistics' | 'settings') => void;
  onLogout: () => void;
}

export default function Sidebar({ currentPage, setCurrentPage, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'home' as const, label: 'Início', icon: Home },
    { id: 'reports' as const, label: 'Relatórios', icon: FileText },
    { id: 'technicians' as const, label: 'Técnicos', icon: Users },
    { id: 'statistics' as const, label: 'Estatísticas', icon: BarChart3 },
    { id: 'settings' as const, label: 'Definições', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0057D9] rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">CM</span>
          </div>
          <div>
            <h2 className="text-[#2B2B2B]">CM Reports</h2>
            <p className="text-xs text-gray-500">Sistema de Relatórios</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
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
