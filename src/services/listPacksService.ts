import { IPack, IProductPack } from "../interfaces/packs";
import AppDataSource from "../data-source";
import { Packs } from "../entities/pack.entity";
import { Products } from "../entities/product.entity";

const listPacksService = async (): Promise<IPack[]> => {
  const packRepository = AppDataSource.getRepository(Packs);
  const packs = await packRepository.find();
  const productRepository = AppDataSource.getRepository(Products);
  const products = await productRepository.find();

  const packsList: IPack[] = [];
  if (!products.length) return packsList;
  packs.forEach((pack) => {
    const packIndex = packsList.findIndex((p) => p.id === pack.packId);
    if (packIndex === -1) {
      packsList.push({
        id: pack.packId,
        products: [
          {
            product: products?.find((p) => p.code === pack.productId),
            qty: pack.qty,
          },
        ],
      });
    } else {
      packsList[packIndex].products.push({
        product: products?.find((p) => p.code === pack.productId),
        qty: pack.qty,
      });
    }
  });
  return packsList;
};

export default listPacksService;
