import { Router } from "express";
import {
  listProductsController,
  validateProductsController,
} from "../controllers/product.controllers";

const productRoutes = Router();

productRoutes.get("", listProductsController);
productRoutes.get("/validate", validateProductsController);

export default productRoutes;
