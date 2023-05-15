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
        // const packsToUpdate = packs.filter(
        //   (pack) => pack.productId === productFound.code
        // );
        // packsToUpdate.forEach((pack) => {
        //   products.map((product) => {
        //     if (product.code === pack.packId) {
        //       product.sales_price -= productFound.sales_price * pack.qty;
        //       product.sales_price +=
        //         productToUpdate.new_sales_price! * pack.qty;
        //       productRepository.save(product);
        //     }
        //   });
        // });
        productFound.sales_price = productToUpdate.new_sales_price;
        productRepository.save(productFound);
        productToUpdate.sales_price = productToUpdate.new_sales_price;
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
            productToUpdate.sales_price *= ratio;
          }
        });
        productFound.sales_price = productToUpdate.new_sales_price;
        productRepository.save(productFound);
        productToUpdate.sales_price = productToUpdate.new_sales_price;
      }
    }

    if (productFound) return productFound;

    return productToUpdate;
  });

  if (!productsUpdated) {
    return [];
  }

  const productRepositoryUpdated = AppDataSource.getRepository(Products);
  const productsUpdatedToRequest = await productRepositoryUpdated.find();
  const productsRequest = productsUpdatedToRequest.map((product) => {
    return {
      ...product,
      new_sales_price: product.sales_price,
    };
  });

  return productsRequest;
};

export default updateProductsService;
