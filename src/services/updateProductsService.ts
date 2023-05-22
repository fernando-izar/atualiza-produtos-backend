import { IProduct, IProductValidated } from "../interfaces/products";
import AppDataSource from "../data-source";
import { Products } from "../entities/product.entity";

const updateProductsService = async (
  productsToUpdate: IProduct[]
): Promise<IProduct[]> => {
  const productRepository = AppDataSource.getRepository(Products);
  const products = await productRepository.find();

  const productsUpdated = productsToUpdate.map((productToUpdate) => {
    const productFound = products.find(
      (product) => product.code === productToUpdate.code
    );
    if (
      productFound &&
      productToUpdate.new_sales_price &&
      productToUpdate.new_sales_price !== productToUpdate.sales_price
    ) {
      productFound.sales_price = productToUpdate.new_sales_price;
      productToUpdate.sales_price = productToUpdate.new_sales_price;
    }

    return productToUpdate;
  });

  if (!productsUpdated) {
    return [];
  }

  productRepository.save(productsUpdated);
  return productsUpdated;
};

export default updateProductsService;
