import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Products } from "./product.entity";

@Entity("packs")
export class Packs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "pack_id" })
  packId: number;

  @Column({ name: "product_id" })
  productId: number;

  @Column()
  qty: number;

  @ManyToOne(() => Products)
  @JoinColumn({ name: "product_id" })
  product: Products;
}
