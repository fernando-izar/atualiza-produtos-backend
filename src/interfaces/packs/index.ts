import { IProduct } from "../products";

export interface IProductPack {
  product?: IProduct;
  qty: number;
}

export interface IPack {
  id: number;
  products: IProductPack[];
}
