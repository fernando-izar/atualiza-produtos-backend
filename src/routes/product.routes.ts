import { Router } from "express";
import {
  listProductsController,
  validateProductsController,
  updateProductsController,
} from "../controllers/product.controllers";

const productRoutes = Router();

productRoutes.get("", listProductsController);
productRoutes.post("/validate", validateProductsController);
productRoutes.put("/update", updateProductsController);

export default productRoutes;
