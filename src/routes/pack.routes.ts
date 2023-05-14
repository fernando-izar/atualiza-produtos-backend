import { Router } from "express";
import { listPacksController } from "../controllers/pack.controllers";

const packRoutes = Router();

packRoutes.get("", listPacksController);

export default packRoutes;
