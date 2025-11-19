import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import reportRoutes from "./routes/report.routes";
import technicianRoutes from "./routes/technician.routes";
import authRoutes from "./routes/auth.routes"
import { auth } from "./middleware/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// rota principal
app.get("/", (req: Request, res: Response) => {
  res.send(" Servidor Express com TypeScript está a funcionar!");
});

// rota de relatórios
app.use("/api/reports", reportRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/login", authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
