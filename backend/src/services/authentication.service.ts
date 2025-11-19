import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new Error("Credenciais inválidas.");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Credenciais inválidas.");
    }

    const token = crypto.randomBytes(30).toString("hex");

    const accessToken = await prisma.accessToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      },
    });

    return {
      token: accessToken.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  } catch (error) {
    console.error("Erro no serviço de login:", error);
    throw error;
  }
}
export async function logout(token: string) {
  await prisma.accessToken.deleteMany({
    where: { token },
  });

  return { message: "Sessão terminada com sucesso." };
}
