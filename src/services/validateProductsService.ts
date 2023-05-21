import { IProduct, IProductValidated } from "../interfaces/products";
import AppDataSource from "../data-source";
import { Products } from "../entities/product.entity";
import { IPack } from "../interfaces/packs";
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
        productToValidate.new_sales_price < productFound.sales_price * 0.9 ||
        productToValidate.new_sales_price > productFound.sales_price * 1.1
      ) {
        productValidated.is_validated = false;
        productValidated.broken_rules.push(
          "Preço de venda fora da margem de 10%"
        );
      }

      if (
        packs.find((pack) => pack.packId === productFound.code) &&
        productToValidate.new_sales_price !== productToValidate.sales_price
      ) {
        const productsIdInPack = packs
          .filter((pack) => pack.packId === productFound.code)
          .map((item) => item.productId);
        if (productsIdInPack.length) {
          productsIdInPack.forEach((productId) => {
            const index = productsToValidate.findIndex(
              (product) => product.code === productId
            );
            if (index !== -1) {
              if (
                productsToValidate[index].new_sales_price !==
                productsToValidate[index].sales_price
              ) {
                productValidated.is_validated = false;
                productValidated.broken_rules.push(
                  "Produto em pack com preço diferente do preço do pack"
                );
              }
            }
          });
        }
      }

      return productValidated;
    }
  );
  return productsValidated;
};

export default validateProductsService;
