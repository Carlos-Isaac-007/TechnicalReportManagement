import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Plus, Search, Mail, Briefcase } from "lucide-react";
import type { Technician } from "../App";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";

interface TechnicianManagementProps {
  technicians: Technician[];
  onAddTechnician: (technician: Technician) => void;
}

export default function TechnicianManagement({
  technicians,
  onAddTechnician,
}: TechnicianManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    specialization: "",
    phone_personal: "",
    phone_work: "",
    password: "",
    confirmPassword: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      specialization: "",
      email: "",
      phone_personal: "",
      phone_work: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      specialization: formData.specialization,
      role: formData.role,
      contacts: [
        { phone: formData.phone_personal, type: "Pessoal" },
        { phone: formData.phone_work, type: "Trabalho" },
      ],
    };

    try {
      const response = await fetch("http://localhost:3001/api/technicians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar técnico");
      }

      const saved = await response.json();
      console.log("Resposta completa do backend:", saved);

      // 🆕 TRANSFORMAR a resposta do backend para o formato do frontend
      const frontendTechnician: Technician = {
        id: `TECH-${String(technicians.length + 1).padStart(3, "0")}`, // 🆕 Gerar ID no formato do frontend
        name: saved.user.name,
        role: formData.specialization, // 🆕 Usar a especialização como role
        contact: saved.user.email, // 🆕 Usar email como contacto
      };

      console.log("Técnico convertido para frontend:", frontendTechnician);
      onAddTechnician(frontendTechnician);
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar técnico!");
    }
  };

  const filteredTechnicians = technicians.filter(
    (tech) =>
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Insira o nome do técnico"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Função</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  placeholder="Insira a função (ex: Técnico de AVAC)"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Perfil no Sistema</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="technician">Técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Label htmlFor="contact">Contacto</Label>
              <div id="contact" className="space-y-2 border rounded-sm p-3 ">
                <div className="grid grid-col-2 gap-2">
                  <Label>Email:</Label>
                  <Input
                    id="contact"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Insira o endereço de email"
                    required
                  />
                  <div className="flex gap-2 justify-between w-full">
                    <div className="w-1/2">
                      <Label>Telefone Pessoal:</Label>
                      <Input
                        type="tel"
                        pattern="^(\+?\d{1,3}[- ]?)?\d{3}[- ]?\d{2,3}[- ]?\d{3,4}$"
                        value={formData.phone_personal}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone_personal: e.target.value,
                          })
                        }
                        placeholder="+244 9xx xxx xxx"
                        required
                      />
                    </div>
                    <div className="w-1/2">
                      {" "}
                      <Label>Telefone Trabalho:</Label>
                      <Input
                        type="tel"
                        placeholder="+244 9xx xxx xxx"
                        value={formData.phone_work}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone_work: e.target.value,
                          })
                        }
                        pattern="^(\+?\d{1,3}[- ]?)?\d{3}[- ]?\d{2,3}[- ]?\d{3,4}$"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <div>
                  <Label>Senha</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Confirmar Senha</Label>

                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
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
                <Button
                  type="submit"
                  className="bg-[#0057D9] hover:bg-[#003A8C] text-white"
                >
                  Adicionar Técnico
                </Button>
              </div>

              <div>
                <div></div>
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
            <Card
              key={technician.id}
              className="border-none shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-[#E6F0FF] rounded-full flex items-center justify-center">
                    <span className="text-2xl text-[#0057D9]">
                      {technician.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
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
                    <span className="text-xs text-gray-500">
                      ID: {technician.id}
                    </span>
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
