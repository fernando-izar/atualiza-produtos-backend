import { IProduct, IProductValidated } from "../interfaces/products";
import AppDataSource from "../data-source";
import { Products } from "../entities/product.entity";
import { Packs } from "../entities/pack.entity";

const validateProductsService = async (
  productsToValidate: IProduct[]
): Promise<IProductValidated[]> => {
  const productRepository = AppDataSource.getRepository(Products);
  const products = await productRepository.find();
  const packRepository = AppDataSource.getRepository(Packs);
  const packs = await packRepository.find();

  const productsValidated: IProductValidated[] = productsToValidate.map(
    (productToValidate) => {
      const productValidated: IProductValidated = {
        code: productToValidate.code,
        name: productToValidate.name,
        is_validated: true,
        broken_rules: [],
      };

      const productFound = products.find(
        (product) => product.code === productToValidate.code
      );

      if (!productFound) {
        productValidated.is_validated = false;
        productValidated.broken_rules.push("Produto não encontrado");
        return productValidated;
      }

      if (productFound && productFound.name !== productToValidate.name) {
        productValidated.is_validated = false;
        productValidated.broken_rules.push("Nome do produto não confere");
        return productValidated;
      }

      if (!productToValidate.new_sales_price) {
        productValidated.is_validated = false;
        productValidated.broken_rules.push("Preço de venda não informado");
        return productValidated;
      }

      if (productToValidate?.new_sales_price <= productFound?.cost_price) {
        productValidated.is_validated = false;
        productValidated.broken_rules.push(
          "Preço de venda menor ou igual ao preço de custo"
        );
      }

      if (productToValidate.new_sales_price <= 0) {
        productValidated.is_validated = false;
        productValidated.broken_rules.push(
          "Preço de venda menor ou igual a zero"
        );
      }

      if (
        productToValidate.new_sales_price <
          +(productFound.sales_price * 0.9).toFixed(2) ||
        productToValidate.new_sales_price >
          +(productFound.sales_price * 1.1).toFixed(2)
      ) {
        productValidated.is_validated = false;
        productValidated.broken_rules.push(
          `Preço de venda fora da margem de 10%. Mínimo: ${+(
            productFound.sales_price * 0.9
          ).toFixed(2)} Máximo: ${+(productFound.sales_price * 1.1).toFixed(2)}`
        );
      }

      if (packs.find((pack) => pack.packId === productToValidate.code)) {
        const productsInPack = packs
          .filter((pack) => pack.packId === productToValidate.code)
          .map((pack) => {
            return {
              id: pack.productId,
              qty: pack.qty,
            };
          });
        const packTotalPrice: number = productsInPack.reduce(
          (acc, productObj) => {
            const product = productsToValidate.find(
              (product) => product.code === productObj.id
            );
            if (!product || !product.new_sales_price) {
              return acc;
            }
            const newPrice =
              +product.new_sales_price.toFixed(2) * productObj.qty;
            return acc + newPrice;
          },
          0
        );
        const price = +packTotalPrice.toFixed(2);
        if (price !== +productToValidate.new_sales_price) {
          productValidated.is_validated = false;
          productValidated.broken_rules.push(
            `Preço de venda do kit não confere com a soma dos produtos. Valor do kit: ${price}`
          );
        }
      }

      return productValidated;
    }
  );
  return productsValidated;
};

export default validateProductsService;
