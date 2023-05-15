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

    if (productFound && productToUpdate.new_sales_price) {
      productFound.sales_price = productToUpdate.new_sales_price;
      productRepository.save(productFound);
    }

    if (productFound) return productFound;

    return productToUpdate;
  });

  if (!productsUpdated) {
    return [];
  }

  return productsUpdated;
};

export default updateProductsService;
