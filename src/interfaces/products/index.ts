export interface IProduct {
  code: number;
  cost_price: number;
  sales_price: number;
  name: string;
  new_sales_price?: number;
}

export interface IProductValidated {
  code: number;
  name: string;
  is_validated: boolean;
  broken_rules: string[];
}
