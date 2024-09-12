import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Product } from './product.entity';

export const TableName = 'product_category';

@Entity(TableName)
export class ProductCategory {
  @PrimaryColumn()
  id: string;

  @OneToMany(() => Product, (type1) => type1.product_type1)
  @JoinColumn({ name: 'id', referencedColumnName: 'type1' })
  type1: Product[];

  @OneToMany(() => Product, (type2) => type2.product_type2)
  @JoinColumn({ name: 'id', referencedColumnName: 'type2' })
  type2: Product[];

  @OneToMany(() => Product, (type3) => type3.product_type3)
  @JoinColumn({ name: 'id', referencedColumnName: 'type3' })
  type3: Product[];

  @OneToMany(() => Product, (type4) => type4.product_type4)
  @JoinColumn({ name: 'id', referencedColumnName: 'type4' })
  type4: Product[];

  @OneToMany(() => Product, (type5) => type5.product_type5)
  @JoinColumn({ name: 'id', referencedColumnName: 'type5' })
  type5: Product[];

  @OneToOne(() => Product, (category) => category.category)
  @JoinColumn({ name: 'id', referencedColumnName: 'category' })
  category: Product;

  @Column()
  name: string;

  @Column()
  product_text: string;

  @Column()
  product_type: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  constructor(partial: Partial<ProductCategory>) {
    Object.assign(this, partial);
  }
}
