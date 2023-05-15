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
  return packsList;
};

export default listPacksService;
