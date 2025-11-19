"use client"
import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ReportManagement from './components/ReportManagement';
import TechnicianManagement from './components/TechnicianManagement';
import SettingsPage from './components/SettingsPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

export interface Report {
  id: string;
  title: string;
  description: string;
  technician: string;
  date: string;
  status: 'Pendente' | 'Em Progresso' | 'Concluído';
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  contact: string;
}

// 🆕 Interface para o usuário logado
export interface User {
  id: number;
  name: string;
  email: string;
  role: string; // 'admin' ou 'technician'
}

function App() {
  const [user, setUser] = useState<User | null>(null); // 🆕 Agora guardamos o user completo
  const [currentPage, setCurrentPage] = useState<'home' | 'reports' | 'technicians' | 'statistics' | 'settings'>('home');
  
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'RPT-001',
      title: 'Manutenção de Ar Condicionado',
      description: 'Manutenção de rotina da unidade de AC no edifício A',
      technician: 'João Silva',
      date: '2025-11-03',
      status: 'Concluído'
    },
    {
      id: 'RPT-002',
      title: 'Inspeção de Instalação Elétrica',
      description: 'Inspeção de segurança dos sistemas elétricos',
      technician: 'Maria Santos',
      date: '2025-11-04',
      status: 'Em Progresso'
    },
    {
      id: 'RPT-003',
      title: 'Reparação de Canalização',
      description: 'Reparar fuga de água na casa de banho',
      technician: 'Pedro Costa',
      date: '2025-11-05',
      status: 'Pendente'
    },
    {
      id: 'RPT-004',
      title: 'Verificação do Sistema AVAC',
      description: 'Verificação mensal do sistema AVAC',
      technician: 'João Silva',
      date: '2025-11-05',
      status: 'Pendente'
    },
    {
      id: 'RPT-005',
      title: 'Teste de Equipamento de Segurança contra Incêndios',
      description: 'Teste de extintores e alarmes de incêndio',
      technician: 'Ana Ferreira',
      date: '2025-11-02',
      status: 'Concluído'
    }
  ]);

  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: 'TECH-001',
      name: 'João Silva',
      role: 'Técnico de AVAC',
      contact: 'joao.silva@carlosmateus.pt'
    },
    {
      id: 'TECH-002',
      name: 'Maria Santos',
      role: 'Técnica Eletricista',
      contact: 'maria.santos@carlosmateus.pt'
    },
    {
      id: 'TECH-003',
      name: 'Pedro Costa',
      role: 'Técnico de Canalizações',
      contact: 'pedro.costa@carlosmateus.pt'
    },
    {
      id: 'TECH-004',
      name: 'Ana Ferreira',
      role: 'Inspetora de Segurança',
      contact: 'ana.ferreira@carlosmateus.pt'
    }
  ]);

  // 🆕 Agora recebemos o user completo do Login
  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    localStorage.removeItem('token'); // 🆕 Limpa o token
  };

  const addReport = (report: Report) => {
    setReports([...reports, report]);
  };

  const updateReport = (updatedReport: Report) => {
    setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r));
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const addTechnician = (technician: Technician) => {
    setTechnicians([...technicians, technician]);
  };

  // 🆕 Verifica se está logado
  const isLoggedIn = !!user;

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // 🆕 Função para determinar se mostra uma página baseado no role
  const shouldShowPage = (page: string): boolean => {
    switch (page) {
      case 'reports':
        // Reports: technicians e admin
        return user.role === 'technician' || user.role === 'admin';
      
      case 'technicians':
        // Technicians: apenas admin
        return user.role === 'admin';
      
      case 'home':
      case 'statistics':
      case 'settings':
        // Todas as outras páginas: todos os roles
        return true;
      
      default:
        return false;
    }
  };

  // 🆕 Renderização condicional baseada no role
  const renderCurrentPage = () => {
    if (!shouldShowPage(currentPage)) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 text-center">
            Não tens permissões para aceder a esta página.<br />
            Contacta o administrador do sistema.
          </p>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <Dashboard reports={reports} technicians={technicians} />;
      
      case 'reports':
        return (
          <ReportManagement 
            reports={reports} 
            technicians={technicians}
            onAddReport={addReport}
            onUpdateReport={updateReport}
            onDeleteReport={deleteReport}
            currentUser={user} // 🆕 Passa info do user atual
          />
        );
      
      case 'technicians':
        return user.role === 'admin' ? ( // 🆕 Dupla verificação
          <TechnicianManagement 
            technicians={technicians}
            onAddTechnician={addTechnician}
          />
        ) : null;
      
      case 'statistics':
        return <Dashboard reports={reports} technicians={technicians} />;
      
      case 'settings':
        return <SettingsPage user={user} />; // 🆕 Podes passar user para settings
      
      default:
        return <Dashboard reports={reports} technicians={technicians} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* 🆕 Passa o user para o Sidebar para controlar visibilidade de items */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onLogout={handleLogout}
        userRole={user.role} // 🆕 Importante!
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 🆕 Passa info do user para o Header */}
        <Header user={user} />
        
        <main className="flex-1 overflow-y-auto p-8">
          {renderCurrentPage()}
        </main>

        <footer className="bg-white border-t border-gray-200 py-4 px-8">
          <p className="text-center text-sm text-[#2B2B2B]">
            © 2025 Carlos Mateus Comércio e Serviços, Lda – Sistema de Gestão de Relatórios Técnicos
          </p>
          {/* 🆕 Mostra role atual */}
          <p className="text-center text-xs text-gray-500 mt-1">
            Logado como: <span className="font-medium">{user.name}</span> ({user.role})
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;