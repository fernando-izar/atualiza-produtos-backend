import { Router } from "express";
import {
  listProductsController,
  validateProductsController,
} from "../controllers/product.controllers";

const productRoutes = Router();

productRoutes.get("", listProductsController);
productRoutes.post("/validate", validateProductsController);

export default productRoutes;
