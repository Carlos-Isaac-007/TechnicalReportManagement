"use cliente"
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
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

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8">
          {currentPage === 'home' && <Dashboard reports={reports} technicians={technicians} />}
          {currentPage === 'reports' && (
            <ReportManagement 
              reports={reports} 
              technicians={technicians}
              onAddReport={addReport}
              onUpdateReport={updateReport}
              onDeleteReport={deleteReport}
            />
          )}
          {currentPage === 'technicians' && (
            <TechnicianManagement 
              technicians={technicians}
              onAddTechnician={addTechnician}
            />
          )}
          {currentPage === 'statistics' && <Dashboard reports={reports} technicians={technicians} />}
          {currentPage === 'settings' && <SettingsPage />}
        </main>

        <footer className="bg-white border-t border-gray-200 py-4 px-8">
          <p className="text-center text-sm text-[#2B2B2B]">
            © 2025 Carlos Mateus Comércio e Serviços, Lda – Sistema de Gestão de Relatórios Técnicos
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
