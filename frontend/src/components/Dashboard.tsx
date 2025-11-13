import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, Clock, CheckCircle2, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { Report, Technician } from '../App';

interface DashboardProps {
  reports: Report[];
  technicians: Technician[];
}

export default function Dashboard({ reports, technicians }: DashboardProps) {
  // Calculate statistics
  const today = new Date().toISOString().split('T')[0];
  const todayReports = reports.filter(r => r.date === today).length;
  const pendingReports = reports.filter(r => r.status === 'Pendente').length;
  const completedReports = reports.filter(r => r.status === 'Concluído').length;

  // Bar chart data - reports by status
  const barChartData = [
    { name: 'Pendente', count: reports.filter(r => r.status === 'Pendente').length },
    { name: 'Em Progresso', count: reports.filter(r => r.status === 'Em Progresso').length },
    { name: 'Concluído', count: reports.filter(r => r.status === 'Concluído').length },
  ];

  // Pie chart data - reports by technician
  const technicianReportCounts = reports.reduce((acc, report) => {
    acc[report.technician] = (acc[report.technician] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(technicianReportCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#0057D9', '#00A3E0', '#5CB3FF', '#ADD8E6'];

  const stats = [
    {
      title: 'Relatórios de Hoje',
      value: todayReports,
      icon: FileText,
      bgColor: 'bg-blue-50',
      iconColor: 'text-[#0057D9]'
    },
    {
      title: 'Relatórios Pendentes',
      value: pendingReports,
      icon: Clock,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500'
    },
    {
      title: 'Relatórios Concluídos',
      value: completedReports,
      icon: CheckCircle2,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      title: 'Técnicos Ativos',
      value: technicians.length,
      icon: Users,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[#2B2B2B] mb-2">Visão Geral do Dashboard</h2>
        <p className="text-sm text-gray-500">Bem-vindo ao Sistema de Gestão de Relatórios Técnicos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">{stat.title}</p>
                    <p className="text-3xl text-[#2B2B2B]">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.iconColor} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#2B2B2B]">Relatórios por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#0057D9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#2B2B2B]">Relatórios por Técnico</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#2B2B2B]">Relatórios Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-[#2B2B2B] mb-1">{report.title}</h4>
                  <p className="text-sm text-gray-500">{report.technician} • {report.date}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    report.status === 'Concluído' 
                      ? 'bg-green-100 text-green-700'
                      : report.status === 'Em Progresso'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
