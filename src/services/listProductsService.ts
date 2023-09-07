import { IProduct } from "../interfaces/products";
import AppDataSource from "../data-source";
import { Products } from "../entities/product.entity";

const listProductsService = async (): Promise<IProduct[]> => {
  const productRepository = AppDataSource.getRepository(Products);
  const products = await productRepository.find();
  products.map((product) => {
    product.cost_price = +product.cost_price;
    product.sales_price = +product.sales_price;
  });
  return products;
};

export default listProductsService;
