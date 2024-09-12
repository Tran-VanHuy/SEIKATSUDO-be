import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from './product.entity';

export const TableName = 'sale_products';

@Entity(TableName)
export class SaleProduct {
  @PrimaryColumn()
  sale_id: string;

  @PrimaryColumn()
  sort: number;

  @Column()
  type: number;

  @PrimaryColumn()
  product_id: string;

  @Column()
  amount: number;

  @Column()
  unit: string;

  @Column()
  unit_price: number;

  @Column()
  unit_cost: number;

  @Column()
  subtotal: number;

  @Column()
  subctotal: number;

  @Column()
  subbenef: number;

  @Column()
  subtax: number;

  @Column()
  shipment_amount: number;

  @CreateDateColumn()
  created: number;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Sale, (sale) => sale.saleProducts)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => Product, (product) => product.saleProduct)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  constructor(partial: Partial<SaleProduct>) {
    Object.assign(this, partial);
  }
}
