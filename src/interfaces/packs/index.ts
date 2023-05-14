import { IProduct } from "../products";

export interface IProductPack {
  product?: IProduct;
  qty?: number;
  code?: number;
  name?: string;
  cost_price?: number;
  sales_price?: number;
}

export interface IPack {
  id: number;
  products: IProductPack[];
}
