import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import type { Report, Technician } from '../App';

interface ReportManagementProps {
  reports: Report[];
  technicians: Technician[];
  onAddReport: (report: Report) => void;
  onUpdateReport: (report: Report) => void;
  onDeleteReport: (id: string) => void;
  currentUser?: { // 🆕 Nova prop para o usuário atual
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export default function ReportManagement({ 
  reports, 
  technicians, 
  onAddReport, 
  onUpdateReport,
  onDeleteReport,
  currentUser 
}: ReportManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technician: '',
    date: '',
    status: 'Pendente' as 'Pendente' | 'Em Progresso' | 'Concluído'
  });

  // 🆕 Se for technician, define automaticamente o técnico como o próprio
  const defaultTechnician = currentUser?.role === 'technician' ? currentUser.name : '';

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technician: defaultTechnician, // 🆕 Usa o valor padrão
      date: '',
      status: 'Pendente'
    });
    setEditingReport(null);
  };

  const handleOpenDialog = (report?: Report) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        title: report.title,
        description: report.description,
        technician: report.technician,
        date: report.date,
        status: report.status
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingReport) {
      onUpdateReport({
        ...editingReport,
        ...formData
      });
    } else {
      const newReport: Report = {
        id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
        ...formData
      };
      onAddReport(newReport);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  // 🆕 Filtra relatórios baseado no role
  const getFilteredReports = () => {
    let filtered = reports.filter(report =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Se for technician, mostra apenas os seus relatórios
    if (currentUser?.role === 'technician') {
      filtered = filtered.filter(report => report.technician === currentUser.name);
    }

    return filtered;
  };

  const filteredReports = getFilteredReports();

  const getStatusBadge = (status: string) => {
    const variants = {
      'Concluído': 'bg-green-100 text-green-700',
      'Em Progresso': 'bg-blue-100 text-blue-700',
      'Pendente': 'bg-orange-100 text-orange-700'
    };
    return variants[status as keyof typeof variants] || variants.Pendente;
  };

  // 🆕 Verifica permissões para ações
  const canEditReport = (report: Report) => {
    if (currentUser?.role === 'admin') return true;
    if (currentUser?.role === 'technician') {
      return report.technician === currentUser.name;
    }
    return false;
  };

  const canDeleteReport = (report: Report) => {
    // Apenas admin pode eliminar relatórios
    return currentUser?.role === 'admin';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#2B2B2B] mb-2">Gestão de Relatórios</h2>
          <p className="text-sm text-gray-500">
            {currentUser?.role === 'admin' 
              ? 'Gerir todos os relatórios técnicos' 
              : 'Os seus relatórios técnicos'
            }
          </p>
          {/* 🆕 Badge informativo */}
          {currentUser?.role === 'technician' && (
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block mt-1">
              👨‍💼 A ver apenas os seus relatórios
            </div>
          )}
        </div>
        
        {/* 🆕 Botão condicional - technicians podem criar relatórios */}
        {(currentUser?.role === 'admin' || currentUser?.role === 'technician') && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => handleOpenDialog()}
                className="bg-[#0057D9] hover:bg-[#003A8C] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Relatório
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingReport ? 'Editar Relatório' : 'Criar Novo Relatório'}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Insira o título do relatório"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Insira a descrição do relatório"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="technician">Técnico</Label>
                    {currentUser?.role === 'technician' ? (
                      // 🆕 Technician não pode mudar o técnico - é sempre ele próprio
                      <Input
                        id="technician"
                        value={currentUser.name}
                        disabled
                        className="bg-gray-100"
                      />
                    ) : (
                      // Admin pode selecionar qualquer técnico
                      <Select
                        value={formData.technician}
                        onValueChange={(value) => setFormData({ ...formData, technician: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o técnico" />
                        </SelectTrigger>
                        <SelectContent>
                          {technicians.map((tech) => (
                            <SelectItem key={tech.id} value={tech.name}>
                              {tech.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Em Progresso">Em Progresso</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#0057D9] hover:bg-[#003A8C] text-white">
                    {editingReport ? 'Atualizar Relatório' : 'Criar Relatório'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder={
            currentUser?.role === 'admin' 
              ? "Pesquisar relatórios por título, técnico ou ID..." 
              : "Pesquisar nos seus relatórios..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              {currentUser?.role === 'admin' && <TableHead>Técnico Responsável</TableHead>}
              <TableHead>Data</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={currentUser?.role === 'admin' ? 6 : 5} className="text-center text-gray-500 py-8">
                  {searchTerm ? 'Nenhum relatório encontrado' : 'Nenhum relatório disponível'}
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-[#2B2B2B]">{report.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{report.description}</p>
                    </div>
                  </TableCell>
                  {currentUser?.role === 'admin' && <TableCell>{report.technician}</TableCell>}
                  <TableCell>{new Date(report.date).toLocaleDateString('pt-PT')}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadge(report.status)}`}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* 🆕 Botões condicionais baseados em permissões */}
                      {canEditReport(report) ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(report)}
                          className="text-[#0057D9] hover:text-[#003A8C] hover:bg-[#E6F0FF]"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 cursor-not-allowed"
                          disabled
                          title="Apenas pode editar os seus relatórios"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {canDeleteReport(report) ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteReport(report.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 cursor-not-allowed"
                          disabled
                          title="Apenas administradores podem eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}