import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export class Products {
  @PrimaryGeneratedColumn()
  code: number;

  @Column()
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  cost_price: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  sales_price: number;
}
