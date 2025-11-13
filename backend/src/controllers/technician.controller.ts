import { Request, Response } from "express";
import { createTechnician } from "../services/technician.service";

export const addTechnician = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, specialization } = req.body;

    // adapta o dado único em array
    const contacts = phone
      ? [{ phone, type: "Principal" }]
      : [];

    const newTech = await createTechnician({
      name,
      email,
      password,
      contacts,
      specialization,
    });

    return res.status(201).json(newTech);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};
