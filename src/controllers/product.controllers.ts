import { Request, Response } from "express";
import { IProduct, IProductValidated } from "../interfaces/products";
import listProductsService from "../services/listProductsService";
import validateProductsService from "../services/validateProductsService";

export const listProductsController = async (req: Request, res: Response) => {
  const products = await listProductsService();
  return res.json(products);
};

export const validateProductsController = async (
  req: Request,
  res: Response
) => {
  try {
    const productsToValidate: IProduct[] = req.body;
    const productsValidated: IProductValidated[] =
      await validateProductsService(productsToValidate);
    return res.json(productsValidated);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
