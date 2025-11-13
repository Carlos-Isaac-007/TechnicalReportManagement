import { Router } from "express";
import { createTechnician } from "../services/technician.service";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const technician = await createTechnician(req.body);
    res.status(201).json(technician);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
