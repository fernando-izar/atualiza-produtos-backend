import { IProduct, IProductValidated } from "../interfaces/products";
import AppDataSource from "../data-source";
import { Products } from "../entities/product.entity";
import { Packs } from "../entities/pack.entity";
import { IPack } from "../interfaces/packs";

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

    packs.forEach((pack) => {});

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

  const packsList: IPack[] = [];
  packs.forEach((pack) => {
    const packIndex = packsList.findIndex((p) => p.id === pack.packId);
    if (packIndex === -1) {
      const product1 = products?.find((p) => p.code === pack.productId);
      packsList.push({
        id: pack.packId,
        pack_name: products?.find((p) => p.code === pack.packId)?.name,
        products: [
          {
            qty: pack.qty,
            name: product1?.name,
            code: product1?.code,
            sales_price: product1?.sales_price,
            cost_price: product1?.cost_price,
          },
        ],
      });
    } else {
      const product2 = products?.find((p) => p.code === pack.productId);
      packsList[packIndex].products.push({
        qty: pack.qty,
        name: product2?.name,
        code: product2?.code,
        sales_price: product2?.sales_price,
        cost_price: product2?.cost_price,
      });
    }
  });

  packsList.forEach((pack) => {
    const productFound = productsUpdatedToRequest.find(
      (product) => product.code === pack.id
    );
    if (productFound) {
      productFound.sales_price = pack.products.reduce(
        (acc, product) => acc + product.sales_price! * product.qty!,
        0
      );
      productRepositoryUpdated.save(productFound);
    }
  });

  const productsResponse = AppDataSource.getRepository(Products);
  const productsResponseToRequest = await productsResponse.find();

  return productsResponseToRequest;
};

export default updateProductsService;
