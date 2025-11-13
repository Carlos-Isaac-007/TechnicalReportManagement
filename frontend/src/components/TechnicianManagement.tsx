import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Plus, Search, Mail, Briefcase } from 'lucide-react';
import type { Technician } from '../App';

interface TechnicianManagementProps {
  technicians: Technician[];
  onAddTechnician: (technician: Technician) => void;
}

export default function TechnicianManagement({ technicians, onAddTechnician }: TechnicianManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    contact: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      contact: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTechnician: Technician = {
      id: `TECH-${String(technicians.length + 1).padStart(3, '0')}`,
      ...formData
    };
    
    onAddTechnician(newTechnician);
    setIsDialogOpen(false);
    resetForm();
  };

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#2B2B2B] mb-2">Gestão de Técnicos</h2>
          <p className="text-sm text-gray-500">Gerir todos os técnicos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0057D9] hover:bg-[#003A8C] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Técnico
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Técnico</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Insira o nome do técnico"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Insira a função (ex: Técnico de AVAC)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contacto</Label>
                <Input
                  id="contact"
                  type="email"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Insira o endereço de email"
                  required
                />
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
                  Adicionar Técnico
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Pesquisar técnicos por nome, função ou contacto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredTechnicians.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            Nenhum técnico encontrado
          </div>
        ) : (
          filteredTechnicians.map((technician) => (
            <Card key={technician.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-[#E6F0FF] rounded-full flex items-center justify-center">
                    <span className="text-2xl text-[#0057D9]">
                      {technician.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  
                  {/* Info */}
                  <div className="space-y-2 w-full">
                    <h3 className="text-[#2B2B2B]">{technician.name}</h3>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{technician.role}</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{technician.contact}</span>
                    </div>
                  </div>

                  {/* ID Badge */}
                  <div className="w-full pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500">ID: {technician.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
