import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { name: "Technician" },
    update: {},
    create: {
      name: "Technician",
      description: "Usuário com função técnica",
    },
  });

  await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
      description: "Administrador do sistema",
    },
  });

  console.log("Roles criadas!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
