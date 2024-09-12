import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductSet } from './product-set.entity';

export const TableName = 'sets_products';

@Entity(TableName)
export class SetProduct {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  set_id: number;

  @ManyToOne(() => ProductSet, (setId) => setId.id)
  @JoinColumn({ name: 'set_id', referencedColumnName: 'id' })
  setId: Product;

  @Column()
  product_id: string;

  @ManyToOne(() => Product, (productId) => productId.id)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  productId: Product;

  @Column()
  quantity: number;

  @Column()
  total: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  constructor(partial: Partial<SetProduct>) {
    Object.assign(this, partial);
  }
}
