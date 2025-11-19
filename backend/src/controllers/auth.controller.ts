import { Request, Response } from "express";
import { login, logout } from "../services/authentication.service";

export const loginUser = async (req: Request, res: Response) => {
  try {
    console.log("Body recebido:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e password são obrigatórios." });
    }

    const result = await login(email, password);
    console.log("Login bem-sucedido para:", email);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Erro no login:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token ausente." });

    const result = await logout(token);

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
