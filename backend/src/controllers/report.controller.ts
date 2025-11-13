import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET → Listar relatórios
export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.report.findMany();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar relatórios." });
  }
};

// POST → Criar novo relatório
export const createReport = async (req: Request, res: Response) => {
  try {
    const { title, status } = req.body;

    if (!title || !status) {
      return res.status(400).json({ error: "Título e status são obrigatórios." });
    }

    const report = await prisma.report.create({
      data: { title, status },
    });

    res.status(201).json({
      message: "Relatório criado com sucesso!",
      data: report,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar relatório." });
  }
};
