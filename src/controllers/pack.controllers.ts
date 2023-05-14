import { Request, Response } from "express";
import { IPack } from "../interfaces/packs";
import listPacksService from "../services/listPacksService";

export const listPacksController = async (req: Request, res: Response) => {
  try {
    const packs: IPack[] = await listPacksService();
    return res.json(packs);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
