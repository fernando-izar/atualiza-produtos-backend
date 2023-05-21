import { IProduct, IProductValidated } from "../interfaces/products";
import AppDataSource from "../data-source";
import { Products } from "../entities/product.entity";
// import { Packs } from "../entities/pack.entity";
// import { IPack } from "../interfaces/packs";

const updateProductsService = async (
  productsToUpdate: IProduct[]
): Promise<IProduct[]> => {
  const productRepository = AppDataSource.getRepository(Products);
  const products = await productRepository.find();
  // const packRepository = AppDataSource.getRepository(Packs);
  // const packs = await packRepository.find();

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
      console.log("productFound", productFound);
      productToUpdate.sales_price = productToUpdate.new_sales_price;
      console.log("productToUpdate", productToUpdate);
    }

    return productToUpdate;
  });

  if (!productsUpdated) {
    return [];
  }

  productRepository.save(productsUpdated);
  return productsUpdated;

  // const productRepositoryUpdated = AppDataSource.getRepository(Products);
  // const productsUpdatedToRequest = await productRepositoryUpdated.find();
  // const productsRequest = productsUpdatedToRequest.map((product) => {
  //   return {
  //     ...product,
  //     new_sales_price: product.sales_price,
  //   };
  // });

  // const packsList: IPack[] = [];
  // packs.forEach((pack) => {
  //   const packIndex = packsList.findIndex((p) => p.id === pack.packId);
  //   if (packIndex === -1) {
  //     const product1 = products?.find((p) => p.code === pack.productId);
  //     packsList.push({
  //       id: pack.packId,
  //       pack_name: products?.find((p) => p.code === pack.packId)?.name,
  //       products: [
  //         {
  //           qty: pack.qty,
  //           name: product1?.name,
  //           code: product1?.code,
  //           sales_price: product1?.sales_price,
  //           cost_price: product1?.cost_price,
  //         },
  //       ],
  //     });
  //   } else {
  //     const product2 = products?.find((p) => p.code === pack.productId);
  //     packsList[packIndex].products.push({
  //       qty: pack.qty,
  //       name: product2?.name,
  //       code: product2?.code,
  //       sales_price: product2?.sales_price,
  //       cost_price: product2?.cost_price,
  //     });
  //   }
  // });

  // packsList.forEach((pack) => {
  //   const productFound = productsUpdatedToRequest.find(
  //     (product) => product.code === pack.id
  //   );
  //   if (productFound) {
  //     productFound.sales_price = pack.products.reduce(
  //       (acc, product) => acc + product.sales_price! * product.qty!,
  //       0
  //     );
  //     productRepositoryUpdated.save(productFound);
  //   }
  // });
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  // const productsResponse = AppDataSource.getRepository(Products);
  // const productsResponseToRequest = await productsResponse.find();

  // return productsResponseToRequest;
};

export default updateProductsService;
