export interface IProduct {
  code: number;
  name: string;
  cost_price: number;
  sales_price: number;
}

export interface IProductValidated {
  code: number;
  name: string;
  is_validated: boolean;
  broken_rules: string[];
}
