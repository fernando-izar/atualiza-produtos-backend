import { IProduct, IProductValidated } from "../interfaces/products";
import AppDataSource from "../data-source";
import { Products } from "../entities/product.entity";
import { Packs } from "../entities/pack.entity";

const updateProductsService = async (
  productsToUpdate: IProduct[]
): Promise<IProduct[]> => {
  const productRepository = AppDataSource.getRepository(Products);
  const products = await productRepository.find();
  const packRepository = AppDataSource.getRepository(Packs);
  const packs = await packRepository.find();

  const productsUpdated = productsToUpdate.map((productToUpdate) => {
    const productFound = products.find(
      (product) => product.code === productToUpdate.code
    );

    if (productFound && productToUpdate.new_sales_price) {
      const packFound = packs.find((pack) => pack.packId === productFound.code);
      if (!packFound) {
        productFound.sales_price = productToUpdate.new_sales_price;
        productRepository.save(productFound);
      } else {
        const ratio =
          productToUpdate.new_sales_price / productFound.sales_price;
        const producstInPack = packs
          .filter((pack) => pack.packId === productFound.code)
          .map((pack) =>
            products.find((product) => product.code === pack.productId)
          );
        producstInPack.forEach((productInPack) => {
          if (productInPack) {
            productInPack.sales_price *= ratio;
            productRepository.save(productInPack);
          }
        });
        productFound.sales_price = productToUpdate.new_sales_price;
        productRepository.save(productFound);
      }
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
