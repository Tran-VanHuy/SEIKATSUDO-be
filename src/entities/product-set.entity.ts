import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from './product.entity';

export const TableName = 'product_sets';

@Entity(TableName)
export class ProductSet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sub_total: number;

  @Column()
  tax: number;

  @Column()
  discount: number;

  @Column()
  total_set: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToMany(() => Product, (products) => products.productSet)
  @JoinTable({
    name: 'sets_products',
    joinColumn: {
      name: 'set_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products: Product[];

  constructor(partial: Partial<ProductSet>) {
    Object.assign(this, partial);
  }
}
