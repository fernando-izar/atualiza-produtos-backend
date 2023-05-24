import { Request, Response } from "express";
import { IProduct, IProductValidated } from "../interfaces/products";
import listProductsService from "../services/listProductsService";
import validateProductsService from "../services/validateProductsService";
import updateProductsService from "../services/updateProductsService";

export const listProductsController = async (req: Request, res: Response) => {
  const products = await listProductsService();
  products.map((product) => {
    product.new_sales_price = product.sales_price;
  });
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
    const is_validated = productsValidated.every(
      (p) => p.is_validated === true
    );
    return res.json({ is_validated, productsValidated });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateProductsController = async (req: Request, res: Response) => {
  try {
    const productsToUpdate: IProduct[] = req.body;
    const productsUpdated: IProduct[] = await updateProductsService(
      productsToUpdate
    );
    const products = productsUpdated.map((product) => {
      return {
        ...product,
        new_sales_price: product.sales_price,
      };
    });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
