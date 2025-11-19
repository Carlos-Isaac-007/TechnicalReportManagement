import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido." });
    }

    const session = await prisma.accessToken.findUnique({
      where: { token },
      include: { user: { include: { role: true } } }
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }

    // Anexa user na request
    req.user = session.user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Autorização falhou." });
  }
};
