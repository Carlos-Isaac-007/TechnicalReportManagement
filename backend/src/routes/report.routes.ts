import { Router } from "express";
import { getReports, createReport } from "../controllers/report.controller";

const router = Router();

// Rota GET → listar relatórios
router.get("/", getReports);

// Rota POST → criar novo relatório
router.post("/", createReport);

export default router;
