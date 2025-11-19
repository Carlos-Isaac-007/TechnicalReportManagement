import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface ContactInput {
  phone: string;
  type?: string;
}

interface CreateTechnicianInput {
  name: string;
  email: string;
  password: string;
  contacts?: ContactInput[];
  specialization: string;
  role?: string;
}

export async function createTechnician(data: CreateTechnicianInput) {
  const { name, email, password, contacts = [], specialization } = data;

  // 1️⃣ Verifica se já existe usuário com o mesmo email
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Usuário já existe com esse email.");
  }

  // 2️⃣ Cria ou reutiliza a especialização
  const specializationRecord = await prisma.specialization.upsert({
    where: { name: specialization },
    update: {},
    create: { name: specialization },
  });

  // 3️⃣ Cria o usuário base (com role de técnico)
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = await prisma.role.findFirst({ where: { name: data.role || "Technician" } });

  if (!role) throw new Error("Role 'Technician' não encontrada. Insira na tabela Role.");

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      roleId: role.id,
    },
  });

  // 4️⃣ Adiciona contactos (se existirem)
  if (contacts.length > 0) {
    await prisma.contact.createMany({
      data: contacts.map(c => ({
        userId: user.id,
        phone: c.phone,
        type: c.type,
      })),
    });
  }

  // 5️⃣ Cria o técnico associado
  const technician = await prisma.technician.create({
    data: {
      userId: user.id,
      specializationId: specializationRecord.id,
    },
    include: {
      user: true,
      specialization: true,
    },
  });

  return technician;
}
